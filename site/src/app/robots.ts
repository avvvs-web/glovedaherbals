import type { MetadataRoute } from "next";
import { robotsRules, shopDisallow } from "@/lib/robots";
import { abs } from "@/lib/seo";
import { SHOP_SEPARATE } from "@/lib/site";

/** robots.txt for the main site. The shop, on its own address, answers with its own (shop/robots.txt). */
export default function robots(): MetadataRoute.Robots {
  return robotsRules(SHOP_SEPARATE ? [] : shopDisallow(), abs("/sitemap.xml"));
}
