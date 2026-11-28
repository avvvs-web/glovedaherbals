import type { MetadataRoute } from "next";
import { abs } from "@/lib/seo";
import { shopUrl } from "@/lib/site";

/**
 * Search engines and AI assistants (answer and generative engines) may read every public page, so the
 * brand can be found and cited. Private or thin pages stay out: the account, search results and the
 * design-kit page.
 */
export default function robots(): MetadataRoute.Robots {
  // Robots rules take paths, not full addresses (the shop's address can be a full URL; see lib/site.ts).
  const path = (url: string) => new URL(abs(url)).pathname;
  const disallow = [path(shopUrl("/account")), path(shopUrl("/search")), path(shopUrl("/ui"))];
  // Named explicitly so the choice to welcome them is on record (they would also match "*").
  const aiCrawlers = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: aiCrawlers, allow: "/", disallow },
    ],
    sitemap: abs("/sitemap.xml"),
  };
}
