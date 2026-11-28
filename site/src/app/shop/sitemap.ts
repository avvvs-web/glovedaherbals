import { shopPages } from "@/lib/sitemap";

/** Rebuilt hourly, so new products, collections and articles in Shopify appear without a deploy. */
export const revalidate = 3600;

/** The shop's sitemap: herbals.gloveda.co/sitemap.xml (the proxy serves it from here). */
export default shopPages;
