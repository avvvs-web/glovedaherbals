import type { MetadataRoute } from "next";
import { policies } from "@/content/policies";
import { BLOGS, getArticles } from "@/lib/blog";
import { abs } from "@/lib/seo";
import { activeConcerns } from "@/lib/shop/concerns";
import { getCollections, getProducts } from "@/lib/shop/data";
import { shopUrl } from "@/lib/site";

/** Rebuilt hourly, so new products, collections and articles in Shopify appear without a deploy. */
export const revalidate = 3600;

/**
 * Every public page, built from the live catalogue and blog. Account, search and the design-kit page are
 * left out (they are also marked noindex and disallowed in robots.txt).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, articles] = await Promise.all([getProducts(), getCollections(), getArticles()]);
  const page = (url: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly", lastModified?: string) => ({
    url: abs(url),
    priority,
    changeFrequency,
    ...(lastModified ? { lastModified } : {}),
  });

  return [
    page("/", 1, "monthly"),
    page(shopUrl("/"), 0.9, "daily"),
    page(shopUrl("/collections/all"), 0.8, "daily"),
    ...(collections ?? []).filter((c) => c.count > 0).map((c) => page(shopUrl(`/collections/${c.handle}`), 0.8, "daily")),
    ...(products ?? []).map((p) => page(shopUrl(`/products/${p.handle}`), 0.8, "daily")),
    page(shopUrl("/concerns"), 0.7),
    ...activeConcerns(products ?? []).map((c) => page(shopUrl(`/concerns/${c.slug}`), 0.6)),
    page(shopUrl("/rituals"), 0.6),
    page(shopUrl("/blogs"), 0.6),
    ...BLOGS.filter((b) => articles?.some((a) => a.blog === b.handle)).map((b) => page(shopUrl(`/blogs/${b.handle}`), 0.4)),
    ...(articles ?? []).map((a) => page(shopUrl(`/blogs/${a.blog}/${a.handle}`), 0.6, "monthly", a.updated || a.published)),
    page(shopUrl("/help"), 0.5, "monthly"),
    page(shopUrl("/track"), 0.3, "yearly"),
    ...policies.map((p) => page(shopUrl(`/policies/${p.handle}`), 0.3, "yearly")),
  ];
}
