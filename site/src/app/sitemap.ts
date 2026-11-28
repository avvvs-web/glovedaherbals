import type { MetadataRoute } from "next";
import { entry, shopPages } from "@/lib/sitemap";
import { SHOP_SEPARATE } from "@/lib/site";

export const revalidate = 3600;

/**
 * The main site's pages. A sitemap may only list addresses on its own host, so when the shop has its
 * own address (herbals.gloveda.co) its pages are in its own sitemap there; when it is served under /shop
 * here, they are listed here too.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [entry("/", 1, "monthly"), ...(SHOP_SEPARATE ? [] : await shopPages())];
}
