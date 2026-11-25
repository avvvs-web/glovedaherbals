/**
 * Smart search over the catalogue, run in the browser (the range is small). It understands a price
 * limit ("under 500", "below ₹400", "over 1000"), forgives a mistyped letter, treats a few everyday
 * words as the store's own (moisturiser, gift, kit), looks in product names first and then in the
 * store's descriptions, and ranks name matches above description matches.
 */
export type Searchable = { title: string; href: string; price: number; priceText: string; image?: string; range: string; text: string };
export type SearchResult = { items: Searchable[]; understood: string | null; loose: boolean };

const SAME: Record<string, string> = { moisturiser: "moisturizer", moisturisers: "moisturizer", facewash: "face wash", gift: "combo", gifts: "combo", gifting: "combo", set: "combo", sets: "combo", kit: "combo", kits: "combo", skin: "face", skincare: "face", haircare: "hair", oils: "oil", pimple: "acne", pimples: "acne", breakout: "acne", breakouts: "acne", hairfall: "hair fall", dandruf: "dandruff", glowing: "glow", radiance: "glow", tanning: "tan", wrinkle: "wrinkles", ageing: "aging", antiaging: "aging", cleanser: "wash", shampo: "shampoo", tailam: "thailam", thylam: "thailam" };
const SKIP = new Set(["for", "the", "a", "an", "and", "my", "me", "with", "of", "to", "in", "rs", "inr", "products", "product", "something", "best"]);

/** Edit distance, stopping early once it passes 1. */
function near(a: string, b: string) {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1 || a.length < 4) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  const ra = a.slice(i);
  const rb = b.slice(i);
  return ra.slice(1) === rb.slice(1) || ra.slice(1) === rb || ra === rb.slice(1) || (ra.length > 1 && rb.length > 1 && ra[0] === rb[1] && ra[1] === rb[0] && ra.slice(2) === rb.slice(2));
}

export function smartSearch(query: string, items: Searchable[], format: (n: number) => string): SearchResult {
  let q = query.toLowerCase().replace(/[₹,]/g, " ");
  let max: number | null = null;
  let min: number | null = null;
  q = q.replace(/\b(?:under|below|less than|within|upto|up to)\s*(\d{2,6})\b/, (_, n) => ((max = Number(n)), " "));
  q = q.replace(/\b(?:over|above|more than)\s*(\d{2,6})\b/, (_, n) => ((min = Number(n)), " "));
  const words = q
    .split(/[^a-z0-9]+/)
    .filter((w) => w && !SKIP.has(w))
    .flatMap((w) => (SAME[w] ?? w).split(" "));
  if (!words.length && max === null && min === null) return { items: [], understood: null, loose: false };

  const priced = items.filter((it) => (max === null || it.price < max) && (min === null || it.price > min));
  const score = (it: Searchable, w: string): number => {
    const titleWords = it.title.toLowerCase().split(/[^a-z0-9]+/);
    if (titleWords.some((t) => t === w)) return 10;
    if (titleWords.some((t) => t.startsWith(w))) return 8;
    if (it.range.toLowerCase().split(" ").includes(w)) return 6;
    if (titleWords.some((t) => near(t, w))) return 4;
    if (it.text.includes(w)) return 2;
    return 0;
  };
  const rank = (all: boolean) =>
    priced
      .map((it) => {
        const s = words.map((w) => score(it, w));
        const ok = all ? s.every((x) => x > 0) : s.some((x) => x > 0);
        return { it, total: ok || !words.length ? s.reduce((a, b) => a + b, 0) : -1 };
      })
      .filter((r) => r.total >= 0)
      .sort((a, b) => b.total - a.total || a.it.price - b.it.price)
      .map((r) => r.it);
  let found = rank(true);
  const loose = !found.length && words.length > 1;
  if (loose) found = rank(false);

  const parts: string[] = [];
  if (max !== null) parts.push(`under ${format(max)}`);
  if (min !== null) parts.push(`over ${format(min)}`);
  return { items: found.slice(0, 8), understood: parts.length ? parts.join(", ") : null, loose };
}
