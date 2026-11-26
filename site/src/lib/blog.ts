import "server-only";
import type { ShopProduct } from "@/lib/shop/data";

/**
 * The Journal: the articles Gloveda Herbals publishes in Shopify (Online Store › Blog posts), read from
 * each blog's public Atom feed. Shopify stays the only place articles are written; nothing here is
 * invented or rewritten. The HTML is cleaned to a short list of tags before it is shown, and the store's
 * habit of writing lists as "•" lines is turned into real lists.
 */
const STORE = (process.env.SHOPIFY_PUBLIC_STORE_URL ?? "https://glovedaherbals.com").replace(/\/$/, "");

/** The store's blogs, from its sitemap (2026-11-26). Empty ones simply have no articles. */
export const BLOGS = [
  { handle: "beauty", title: "Beauty" },
  { handle: "skin-hair", title: "Skin & Hair" },
  { handle: "news", title: "News" },
] as const;
export type BlogHandle = (typeof BLOGS)[number]["handle"];
export const blogByHandle = (handle: string) => BLOGS.find((b) => b.handle === handle);

export type Article = {
  blog: BlogHandle;
  blogTitle: string;
  handle: string;
  title: string;
  author: string;
  published: string;
  updated: string;
  /** Cleaned HTML, safe to render. */
  html: string;
  /** Plain text, for the excerpt, reading time and product mentions. */
  text: string;
  excerpt: string;
  minutes: number;
};

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = (s: string) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") return String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : Number(e.slice(1)));
    return ENTITIES[e.toLowerCase()] ?? m;
  });
/** Plain text, with each heading, paragraph and list item ending as a sentence of its own. */
const plain = (html: string) =>
  html
    .split(/<\/(?:p|li|h2|h3|h4|blockquote)>/)
    .map((block) => decode(block.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .map((t) => (/[.!?:;…]$/.test(t) ? t : `${t}.`))
    .join(" ");

/** Tags kept (after renaming), everything else is unwrapped. Attributes are dropped except a link's address. */
const RENAME: Record<string, string> = { div: "p", b: "strong", i: "em", h1: "h2", h5: "h4", h6: "h4" };
const KEEP = new Set(["p", "br", "strong", "em", "ul", "ol", "li", "h2", "h3", "h4", "a", "blockquote"]);

function clean(raw: string): string {
  let h = raw.replace(/<(script|style|iframe|object|embed|form|svg)\b[\s\S]*?<\/\1>/gi, "").replace(/<!--[\s\S]*?-->/g, "");
  h = h.replace(/<(\/?)([a-z0-9]+)([^>]*)>/gi, (_m, close: string, name: string, attrs: string) => {
    const tag = RENAME[name.toLowerCase()] ?? name.toLowerCase();
    if (!KEEP.has(tag)) return "";
    if (close) return `</${tag}>`;
    if (tag !== "a") return `<${tag}>`;
    const href = /href\s*=\s*"([^"]*)"/i.exec(attrs)?.[1] ?? "";
    // The store's own links become links on this site (old store paths redirect to the shop).
    const local = href.replace(/^https?:\/\/(www\.)?glovedaherbals\.com/i, "");
    if (/^\//.test(local)) return `<a href="${local}">`;
    if (/^(https?:|mailto:)/i.test(href)) return `<a href="${href}" rel="noopener" target="_blank">`;
    return "<a>";
  });
  // Paragraphs that are empty, or hold only a line break, are spacing in the editor: drop them.
  h = h.replace(/<p>(\s|<br>|&nbsp;)*<\/p>/gi, "");
  // "• item" lines in a row become a list.
  h = h.replace(/(?:<p>\s*•\s*[\s\S]*?<\/p>\s*)+/g, (run) => {
    const items = [...run.matchAll(/<p>\s*•\s*([\s\S]*?)<\/p>/g)].map((m) => `<li>${m[1].trim()}</li>`);
    return `<ul>${items.join("")}</ul>`;
  });
  // A short line on its own, without closing punctuation, followed by a list or a paragraph in bold: a heading.
  h = h.replace(/<p>\s*([^<.!?]{2,48}?):?\s*<\/p>(\s*<ul>)/g, "<h2>$1</h2>$2");
  h = h.replace(/<p>\s*<strong>([^<]{2,80})<\/strong>\s*<\/p>/g, "<h2>$1</h2>");
  return h.replace(/\n\s*/g, "\n").trim();
}

async function feed(blog: (typeof BLOGS)[number]): Promise<Article[] | null> {
  try {
    const res = await fetch(`${STORE}/blogs/${blog.handle}.atom`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`${res.status} for ${blog.handle}`);
    const xml = await res.text();
    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].flatMap(([, e]) => {
      const id = /<id>([^<]+)<\/id>/.exec(e)?.[1] ?? "";
      const handle = id.split("/").pop() ?? "";
      const raw = /<content[^>]*>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/content>/.exec(e)?.[1] ?? "";
      if (!handle || !raw) return [];
      const html = clean(raw);
      const text = plain(html);
      const cut = text.length > 170 ? `${text.slice(0, 170).replace(/\s+\S*$/, "")}…` : text;
      return [
        {
          blog: blog.handle,
          blogTitle: blog.title,
          handle,
          title: decode(/<title>([^<]*)<\/title>/.exec(e)?.[1] ?? "").replace(/\s+/g, " ").trim(),
          author: decode(/<author>\s*<name>([^<]*)<\/name>/.exec(e)?.[1] ?? "Gloveda Herbals"),
          published: /<published>([^<]+)<\/published>/.exec(e)?.[1] ?? "",
          updated: /<updated>([^<]+)<\/updated>/.exec(e)?.[1] ?? "",
          html,
          text,
          excerpt: cut,
          minutes: Math.max(1, Math.round(text.split(" ").length / 200)),
        },
      ];
    });
  } catch (err) {
    console.error("[blog] feed request failed:", err);
    return null;
  }
}

/** Every article, newest first, or null when none of the feeds can be reached. */
export async function getArticles(): Promise<Article[] | null> {
  const all = await Promise.all(BLOGS.map(feed));
  if (all.every((a) => a === null)) return null;
  return all.flatMap((a) => a ?? []).sort((a, b) => b.published.localeCompare(a.published));
}

export async function getArticle(blog: string, handle: string): Promise<Article | null | undefined> {
  const all = await getArticles();
  if (!all) return null;
  return all.find((a) => a.blog === blog && a.handle === handle);
}

/** "18 February 2026" */
export const formatDate = (iso: string) => (iso ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso)) : "");

/**
 * Products the article names, in the order it first names them: "Gloveda Face Wash", or the name
 * without "Gloveda", or the part in brackets ("Night Cream"). Only products the store sells today.
 */
export function mentionedProducts(article: Article, products: ShopProduct[]): ShopProduct[] {
  // The articles mix spellings ("Tailam", "Moisturiser"); the products are named "Thailam" and "Moisturizer".
  const text = article.text.toLowerCase().replace(/tailam/g, "thailam").replace(/moisturis/g, "moisturiz");
  const hits = products.flatMap((p) => {
    const names = [p.title, p.title.replace(/^gloveda\s+/i, ""), /\(([^)]+)\)/.exec(p.title)?.[1] ?? ""]
      .map((n) => n.replace(/\s*\(.*?\)\s*/g, " ").trim().toLowerCase())
      .filter((n) => n.length > 4 && n !== "gloveda");
    const at = Math.min(...names.map((n) => text.indexOf(n)).filter((i) => i >= 0));
    return Number.isFinite(at) ? [{ p, at }] : [];
  });
  return hits.sort((a, b) => a.at - b.at).map((h) => h.p);
}
