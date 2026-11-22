import "server-only";

/**
 * Minimal Shopify Storefront API client (server only).
 * Shopify is the source of truth for price and availability; when the env vars are missing
 * every call returns null and the UI shows no price (it never falls back to hardcoded values).
 *
 * Env (see .env.example):
 *   SHOPIFY_STORE_DOMAIN               e.g. gloveda.myshopify.com
 *   SHOPIFY_STOREFRONT_ACCESS_TOKEN    public Storefront API token
 *   SHOPIFY_STOREFRONT_API_VERSION     a supported version from Shopify's release calendar
 */
export type ProductCommerce = {
  handle: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
};

const config = () => {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const version = process.env.SHOPIFY_STOREFRONT_API_VERSION;
  return domain && token && version ? { domain, token, version } : null;
};

export async function getCommerce(handles: string[]): Promise<Map<string, ProductCommerce> | null> {
  const c = config();
  if (!c || handles.length === 0) return null;
  const query = `query Lineup($q: String!, $n: Int!) {
    products(first: $n, query: $q) { nodes { handle availableForSale priceRange { minVariantPrice { amount currencyCode } } } }
  }`;
  try {
    const res = await fetch(`https://${c.domain}/api/${c.version}/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": c.token },
      body: JSON.stringify({ query, variables: { q: handles.map((h) => `handle:${h}`).join(" OR "), n: handles.length } }),
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`Storefront API ${res.status}`);
    const json = (await res.json()) as {
      data?: { products: { nodes: { handle: string; availableForSale: boolean; priceRange: { minVariantPrice: { amount: string; currencyCode: string } } }[] } };
      errors?: unknown;
    };
    if (!json.data) throw new Error("Storefront API returned no data");
    return new Map(
      json.data.products.nodes.map((n) => [n.handle, { handle: n.handle, availableForSale: n.availableForSale, price: n.priceRange.minVariantPrice }]),
    );
  } catch (err) {
    console.error("[shopify] commerce lookup failed:", err);
    return null;
  }
}

export const formatPrice = (p: ProductCommerce["price"]) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: p.currencyCode, maximumFractionDigits: 0 }).format(Number(p.amount));
