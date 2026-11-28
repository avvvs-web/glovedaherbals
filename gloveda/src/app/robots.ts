import type { MetadataRoute } from "next";
import { abs } from "@/lib/seo";

/**
 * Search engines and AI assistants (answer and generative engines) may read every page, so the brand can
 * be found and cited. The AI crawlers are named so the choice to welcome them is on record.
 */
const AI_CRAWLERS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: abs("/sitemap.xml"),
  };
}
