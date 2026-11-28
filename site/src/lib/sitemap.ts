import type { MetadataRoute } from "next";
import { policies } from "@/content/policies";
import { BLOGS, getArticles } from "@/lib/blog";
import { abs } from "@/lib/seo";
import { activeConcerns } from "@/lib/shop/concerns";
import { getCollections, getProducts } from "@/lib/shop/data";
import { shopUrl } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];
export const entry = (url: string, priority: number, changeFrequency: Entry["changeFrequency"] = "weekly", lastModified?: string): Entry => ({
  url: abs(url),
  priority,
  changeFrequency,
  ...(lastModified ? { lastModified } : {}),
});

/**
 * Every public page of the shop, built from the live catalogue and blog: the shop's own sitemap, at
 * herbals.gloveda.co/sitemap.xml (app/shop/sitemap.ts). Account, search and the design-kit page are left out (they are also
 * marked noindex and disallowed in robots.txt).
 */
export async function shopPages(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, articles] = await Promise.all([getProducts(), getCollections(), getArticles()]);
  return [
    entry(shopUrl("/"), 0.9, "daily"),
    entry(shopUrl("/collections/all"), 0.8, "daily"),
    ...(collections ?? []).filter((c) => c.count > 0).map((c) => entry(shopUrl(`/collections/${c.handle}`), 0.8, "daily")),
    ...(products ?? []).map((p) => entry(shopUrl(`/products/${p.handle}`), 0.8, "daily")),
    entry(shopUrl("/concerns"), 0.7),
    ...activeConcerns(products ?? []).map((c) => entry(shopUrl(`/concerns/${c.slug}`), 0.6)),
    entry(shopUrl("/rituals"), 0.6),
    entry(shopUrl("/blogs"), 0.6),
    ...BLOGS.filter((b) => articles?.some((a) => a.blog === b.handle)).map((b) => entry(shopUrl(`/blogs/${b.handle}`), 0.4)),
    ...(articles ?? []).map((a) => entry(shopUrl(`/blogs/${a.blog}/${a.handle}`), 0.6, "monthly", a.updated || a.published)),
    entry(shopUrl("/help"), 0.5, "monthly"),
    entry(shopUrl("/track"), 0.3, "yearly"),
    ...policies.map((p) => entry(shopUrl(`/policies/${p.handle}`), 0.3, "yearly")),
  ];
}
