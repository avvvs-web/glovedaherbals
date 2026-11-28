import { RangeTabs } from "@/components/shop/RangeTabs";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductGrid, StoreDown } from "@/components/shop/ProductCard";
import { Icon } from "@/components/shop/ui/Icon";
import { formatMoney, getCollectionProducts, getCollections, type ShopProduct } from "@/lib/shop/data";
import { breadcrumbs, itemList, JsonLd } from "@/lib/seo";
import { collections, shopUrl } from "@/lib/site";

const SORTS = { featured: "Featured", "price-asc": "Price, low to high", "price-desc": "Price, high to low" } as const;
type Sort = keyof typeof SORTS;

async function infoFor(handle: string) {
  if (handle === "all") return { title: "The range", image: undefined };
  const list = await getCollections();
  const c = list?.find((x) => x.handle === handle);
  return c ? { title: c.title, image: c.image } : null;
}

export async function generateMetadata({ params }: PageProps<"/shop/collections/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const info = await infoFor(handle);
  const name = handle === "all" ? "All products" : (info?.title ?? "Collection");
  const what = handle === "all" ? "face, hair and body care, and sets for gifting" : name.toLowerCase();
  const description = `Shop Gloveda Herbals ${what}: Ayurvedic care formulated by doctors and made in small batches. Prices, stock and delivery across India.`;
  return {
    title: name,
    description,
    alternates: { canonical: shopUrl(`/collections/${handle}`) },
    openGraph: { title: `${name} | Gloveda Herbals`, description, url: shopUrl(`/collections/${handle}`), ...(info?.image ? { images: [{ url: info.image, alt: name }] } : {}) },
  };
}

const sorted = (products: ShopProduct[], sort: Sort) => {
  const list = [...products];
  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  return list;
};

/**
 * "All products" is not one long grid: it is the range laid out by family (Face, Hair, Body, then
 * Sets), each with its own heading, with a row of tabs that docks at the top and marks the range on screen. A product is listed
 * once, under its first family.
 */
async function WholeRange() {
  const groups = [...collections.map((c) => ({ name: c.name, handle: c.path.split("/").pop() as string })), { name: "Sets and gifting", handle: "gloveda-combo" }];
  const [all, ...lists] = await Promise.all([getProducts_(), ...groups.map((g) => getCollectionProducts(g.handle))]);
  if (!all) return <StoreDown />;
  const seen = new Set<number>();
  const sections = groups
    .map((g, i) => ({ ...g, products: (lists[i] ?? []).filter((p) => !seen.has(p.id) && (seen.add(p.id), true)) }))
    .filter((s) => s.products.length);
  const rest = all.filter((p) => !seen.has(p.id));
  if (rest.length) sections.push({ name: "More from Gloveda Herbals", handle: "all", products: rest });

  return (
    <>
      <RangeTabs tabs={sections.map((s) => ({ id: s.handle === "all" ? "more" : s.handle, name: s.name }))} />
      {sections.map((s) => (
        <section key={s.name} id={s.handle === "all" ? "more" : s.handle} className="gx-family" aria-labelledby={`family-${s.handle}`}>
          <header className="gx-family__head">
            <h2 id={`family-${s.handle}`} className="gx-title">
              {s.name}
            </h2>
            <p className="gx-family__count" data-price>From {formatMoney(Math.min(...s.products.map((p) => p.price)))}</p>
            {s.handle !== "all" ? (
              <a className="gx-more" href={shopUrl(`/collections/${s.handle}`)}>
                Only {s.name} <Icon name="arrow" size={18} />
              </a>
            ) : null}
          </header>
          <ProductGrid products={s.products} />
        </section>
      ))}
    </>
  );
}
const getProducts_ = () => getCollectionProducts("all");

export default async function CollectionPage({ params, searchParams }: PageProps<"/shop/collections/[handle]">) {
  const { handle } = await params;
  const query = await searchParams;
  const sort: Sort = typeof query.sort === "string" && query.sort in SORTS ? (query.sort as Sort) : "featured";
  const inStock = query.stock === "in";
  // "Under ₹500" and similar price doors: an upper limit on the live price.
  const max = typeof query.max === "string" && /^\d{2,6}$/.test(query.max) ? Number(query.max) : null;
  const whole = handle === "all" && max === null && !inStock && sort === "featured";
  const [info, products] = await Promise.all([infoFor(handle), whole ? Promise.resolve([] as ShopProduct[]) : getCollectionProducts(handle)]);
  if (products && !info) notFound();
  const shown = products ? sorted(products.filter((p) => (!inStock || p.available) && (max === null || p.price < max)), sort) : null;
  const href = (next: { sort?: Sort; stock?: boolean }) => {
    const s = next.sort ?? sort;
    const st = next.stock ?? inStock;
    const q = new URLSearchParams();
    if (s !== "featured") q.set("sort", s);
    if (st) q.set("stock", "in");
    if (max !== null) q.set("max", String(max));
    const qs = q.toString();
    return shopUrl(`/collections/${handle}${qs ? `?${qs}` : ""}`);
  };
  const title = max !== null ? `Under ${formatMoney(max)}` : (info?.title ?? "Collection");
  // For structured data: the products this page lists (the whole range page lists the "all" collection).
  const listed = whole ? await getCollectionProducts("all") : shown;

  return (
    <section className="gl-section shop-page" aria-labelledby="collection-title">
      <div className="gl-container">
        <header className="gx-coll" data-image={info?.image && max === null ? "true" : "false"}>
          <div className="gx-stack">
            <p className="gx-label">{whole ? "Everything, by family" : handle === "all" ? "The range" : "Range"}</p>
            <h1 id="collection-title" className="gx-display">
              {title}
            </h1>
            {shown && !whole ? (
              <p className="gx-lead" role="status">
                {shown.length} {shown.length === 1 ? "product" : "products"}
                {shown.length ? <span data-price>, from {formatMoney(Math.min(...shown.map((p) => p.price)))}</span> : null}
              </p>
            ) : null}
            {!whole && shown ? (
              <nav aria-label="Sort and filter" className="gx-sorts">
                {(Object.keys(SORTS) as Sort[]).map((s) => (
                  <a key={s} className="gl-chip" aria-current={s === sort ? "true" : undefined} href={href({ sort: s })}>
                    {SORTS[s]}
                  </a>
                ))}
                <a className="gl-chip" aria-current={inStock ? "true" : undefined} href={href({ stock: !inStock })}>
                  In stock only
                </a>
              </nav>
            ) : null}
          </div>
          {info?.image && max === null ? (
            <div className="gx-coll__media">
              <Image src={info.image} alt="" width={900} height={1200} sizes="(min-width: 64rem) 28vw, 100vw" priority />
            </div>
          ) : null}
        </header>

        {whole ? (
          <WholeRange />
        ) : shown ? (
          shown.length ? (
            <ProductGrid products={shown} />
          ) : (
            <p className="gl-body">Nothing here is in stock right now. Clear the filter to see everything in this collection.</p>
          )
        ) : (
          <StoreDown />
        )}
      </div>
      <JsonLd data={breadcrumbs([["Shop", shopUrl("/")], [title, shopUrl(`/collections/${handle}`)]])} />
      {listed?.length ? <JsonLd data={itemList(title, listed.map((p) => ({ name: p.title, url: shopUrl(`/products/${p.handle}`) })))} /> : null}
    </section>
  );
}
