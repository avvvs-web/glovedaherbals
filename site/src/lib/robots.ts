import type { MetadataRoute } from "next";
import { abs } from "@/lib/seo";
import { shopUrl } from "@/lib/site";

/**
 * Search engines and AI assistants (answer and generative engines) may read every public page, so the
 * brand can be found and cited. Private or thin pages stay out: the account, search results and the
 * design-kit page. Named explicitly so the choice to welcome AI crawlers is on record (they would also
 * match "*").
 */
const AI_CRAWLERS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot"];

/** The shop's private pages, as paths on whichever address serves the shop (robots rules take paths). */
export const shopDisallow = () => ["/account", "/search", "/ui"].map((p) => new URL(abs(shopUrl(p as `/${string}`))).pathname);

export const robotsRules = (disallow: string[], sitemap: string): MetadataRoute.Robots => ({
  rules: [
    { userAgent: "*", allow: "/", disallow },
    { userAgent: AI_CRAWLERS, allow: "/", disallow },
  ],
  sitemap,
});

/** The same rules as robots.txt text, for the shop's own address (a route handler, not a metadata file). */
export function robotsText({ rules, sitemap }: MetadataRoute.Robots) {
  const list = Array.isArray(rules) ? rules : [rules];
  const block = (r: (typeof list)[number]) =>
    [
      ...[r.userAgent ?? "*"].flat().map((ua) => `User-Agent: ${ua}`),
      ...[r.allow ?? []].flat().map((a) => `Allow: ${a}`),
      ...[r.disallow ?? []].flat().map((d) => `Disallow: ${d}`),
    ].join("\n");
  return `${list.map(block).join("\n\n")}\n\n${[sitemap ?? []].flat().map((s) => `Sitemap: ${s}`).join("\n")}\n`;
}
