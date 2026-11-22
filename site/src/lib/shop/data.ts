import "server-only";

/**
 * Shop data, read from the Shopify store's public catalogue endpoints (products.json, collections.json).
 * Shopify stays the source of truth: prices, stock, titles, images and descriptions are never hardcoded.
 * This adapter needs no token. When a Storefront API token is supplied it can be swapped for GraphQL
 * queries behind the same functions (see lib/shopify.ts).
 */
const STORE = (process.env.SHOPIFY_PUBLIC_STORE_URL ?? "https://glovedaherbals.com").replace(/\/$/, "");
/** The store sells in Indian rupees (prices on the live storefront are shown as "Rs."). */
const CURRENCY = process.env.SHOPIFY_CURRENCY ?? "INR";

export type ShopImage = { src: string; width: number; height: number };
export type ShopVariant = { id: number; title: string; price: number; compareAtPrice: number | null; available: boolean };
export type ShopProduct = {
  id: number;
  handle: string;
  title: string;
  /** Plain-text paragraphs from the store's product description. */
  description: string[];
  tags: string[];
  images: ShopImage[];
  variants: ShopVariant[];
  available: boolean;
  price: number;
};
export type ShopCollection = { handle: string; title: string; count: number; image?: string };

type RawProduct = {
  id: number;
  title: string;
  handle: string;
  body_html: string | null;
  tags: string[];
  variants: { id: number; title: string; price: string; compare_at_price: string | null; available: boolean }[];
  images: { src: string; width: number; height: number }[];
};

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&amp;/g, "&"); // the store double-encodes some ampersands ("Glow &amp;amp; Repair")

/** Product descriptions arrive as HTML; only their text is used, split into paragraphs. */
function paragraphs(html: string | null): string[] {
  if (!html) return [];
  return decode(
    html
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
      .replace(/<\/(p|div|h[1-6]|li|ul|ol|tr)>|<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .split("\n")
    // The store's HTML sometimes runs two sentences together ("Ayurveda.Gloveda"); restore the space.
    .map((l) => l.replace(/\s+/g, " ").replace(/([a-z])\.([A-Z])/g, "$1. $2").trim())
    .filter(Boolean);
}

const toProduct = (p: RawProduct): ShopProduct => {
  const variants = p.variants.map((v) => ({
    id: v.id,
    title: v.title,
    price: Number(v.price),
    compareAtPrice: v.compare_at_price ? Number(v.compare_at_price) : null,
    available: v.available,
  }));
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    description: paragraphs(p.body_html),
    tags: p.tags.map(decode),
    images: p.images.map((i) => ({ src: i.src, width: i.width, height: i.height })),
    variants,
    available: variants.some((v) => v.available),
    price: Math.min(...variants.map((v) => v.price)),
  };
};

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${STORE}${path}`, { headers: { Accept: "application/json" }, next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`${res.status} for ${path}`);
    return (await res.json()) as T;
  } catch (err) {
    console.error("[shop] catalogue request failed:", err);
    return null;
  }
}

/** Every product, or null when the store cannot be reached (pages show an explicit error state). */
export async function getProducts(): Promise<ShopProduct[] | null> {
  const data = await get<{ products: RawProduct[] }>("/products.json?limit=250");
  return data ? data.products.map(toProduct) : null;
}

export async function getProduct(handle: string): Promise<ShopProduct | null | undefined> {
  const all = await getProducts();
  if (!all) return null; // store unreachable
  return all.find((p) => p.handle === handle); // undefined = no such product
}

export async function getCollections(): Promise<ShopCollection[] | null> {
  const data = await get<{ collections: { handle: string; title: string; products_count: number; image?: { src?: string } | null }[] }>("/collections.json?limit=250");
  return data ? data.collections.map((c) => ({ handle: c.handle, title: decode(c.title), count: c.products_count, image: RANGE_PHOTOS[c.handle] ?? c.image?.src ?? undefined })) : null;
}

/**
 * The photo for each range, chosen by the client on 2026-11-23: the three portraits from the live
 * store's home page (files on the store's own CDN). They take the place of the collection images.
 * If the team sets these as the collection images in Shopify, this list can go and the store alone
 * decides the photos again.
 */
const STORE_FILES = "https://cdn.shopify.com/s/files/1/0804/4308/0946/files";
const RANGE_PHOTOS: Record<string, string> = {
  "skin-care": `${STORE_FILES}/Warm_Portrait_with_Gentle_Smile.png?v=1793694352`,
  "hair-care": `${STORE_FILES}/Luminous_Wavy-Haired_Portrait.png?v=1793694684`,
  "body-care": `${STORE_FILES}/Dewy_Skincare_Glow_in_Soft_Ligh_cropped.png?v=1793694714`,
};

/** Products in a collection, in the store's own order. "all" is the whole catalogue. */
export async function getCollectionProducts(handle: string): Promise<ShopProduct[] | null> {
  if (handle === "all") return getProducts();
  const data = await get<{ products: RawProduct[] }>(`/collections/${encodeURIComponent(handle)}/products.json?limit=250`);
  return data ? data.products.map(toProduct) : null;
}

export const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: CURRENCY, maximumFractionDigits: amount % 1 === 0 ? 0 : 2 }).format(amount);

/** Shopify cart permalink: opens the store's own cart/checkout with these variants. No order is placed here. */
export const CHECKOUT_BASE = `${STORE}/cart`;

/**
 * The shop's hero banners. They belong to the store, not to this site: once the Storefront API token is
 * connected this function reads the banner entries the team manages in Shopify, so a change there shows
 * here without a deploy. Until then it returns the banners that are live on the store today (files on
 * the store's own CDN). All five are shown: the client approved the two with results wording
 * ("Visible result in 2 weeks", the before-and-after) on 2026-11-23. `hold` remains available for any
 * future banner that should wait for sign-off; held banners show only in development.
 */
export type ShopBanner = { id: string; alt: string; href: string; desktop: string; mobile: string; hold?: boolean };
const FILES = "https://cdn.shopify.com/s/files/1/0804/4308/0946/files";
const LIVE_BANNERS: ShopBanner[] = [
  { id: "hair", alt: "The best combo for your hair: Gloveda Hair Oil, Pure Nature Shampoo and Conditioner.", href: "/products/hair-care-combo", desktop: `${FILES}/Banner_02_copy_1_1.webp`, mobile: `${FILES}/Mobile_banner_1_copy_5.webp` },
  { id: "morning", alt: "Your complete morning reset: Gloveda Massage Oil, Face Wash and Moisturizer.", href: "/products/budget-combo", desktop: `${FILES}/Banner_03_copy.webp`, mobile: `${FILES}/Mobile_banner_3_copy_1.webp` },
  { id: "body", alt: "A three-step body ritual: Gloveda Shower Gel, Body Mask and Moisturizer.", href: "/collections/body-care", desktop: `${FILES}/Banner_04_copy.webp`, mobile: `${FILES}/Mobile_banner_4_copy_2_1.webp` },
  { id: "kumkumadi", alt: "Gloveda Kumkumadi Thailam.", href: "/products/gloveda-kumkumadi-thailam", desktop: `${FILES}/Banner_01_a_copy_1_1.webp`, mobile: `${FILES}/Mobile_banner_2_copy_4.webp` },
  { id: "massage-oil", alt: "Gloveda Massage Oil.", href: "/products/gloveda-massage-oil", desktop: `${FILES}/Banner_05_a_copy.webp`, mobile: `${FILES}/Mobile_banner_5_copy_1.webp` },
];
export async function getBanners(): Promise<ShopBanner[]> {
  return LIVE_BANNERS.filter((b) => !b.hold || process.env.NODE_ENV === "development");
}
