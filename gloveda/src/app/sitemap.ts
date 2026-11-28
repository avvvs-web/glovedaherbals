import type { MetadataRoute } from "next";
import { abs } from "@/lib/seo";

/** The parent site is one page. Each Gloveda house has its own sitemap on its own address. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: abs("/"), changeFrequency: "monthly", priority: 1 }];
}
