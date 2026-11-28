import { robotsRules, robotsText, shopDisallow } from "@/lib/robots";
import { abs } from "@/lib/seo";
import { shopUrl } from "@/lib/site";

export const dynamic = "force-static";

/** robots.txt for the shop's own address (herbals.gloveda.co/robots.txt; the proxy serves it from here). */
export function GET() {
  return new Response(robotsText(robotsRules(shopDisallow(), abs(shopUrl("/sitemap.xml")))), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
