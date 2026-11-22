import "server-only";
import type { ShopProduct } from "./data";

/**
 * Shop by concern. Nothing here is assigned by hand: a product appears under a concern only when the
 * store's own description of it uses one of that concern's words, and the sentence shown with it is
 * quoted from that description. So the wording, and any claim in it, is the brand's own. The brand's
 * doctors should still confirm the list before launch.
 */
export type Concern = { slug: string; name: string; area: "Face and body" | "Hair"; words: RegExp };
export const concerns: Concern[] = [
  { slug: "dryness", name: "Dryness", area: "Face and body", words: /\b(dry|dryness|dehydrat\w*)\b/i },
  { slug: "oily-skin", name: "Oily skin", area: "Face and body", words: /\b(oily|excess oil)\b/i },
  { slug: "acne", name: "Acne and breakouts", area: "Face and body", words: /\b(acne|pimples?|breakouts?)\b/i },
  { slug: "marks", name: "Marks and scars", area: "Face and body", words: /\b(scars?|dark spots?|pigmentation|blemish\w*)\b/i },
  { slug: "dullness", name: "Dullness", area: "Face and body", words: /\b(dull\w*|radiance|radiant)\b/i },
  { slug: "tan", name: "Tan", area: "Face and body", words: /\b(tan|tanning|de-tan)\b/i },
  { slug: "hair-fall", name: "Hair fall", area: "Hair", words: /\b(hair ?fall|breakage)\b/i },
  { slug: "dandruff", name: "Dandruff and scalp", area: "Hair", words: /\b(dandruff|scalp)\b/i },
  { slug: "frizz", name: "Frizz", area: "Hair", words: /\b(frizz\w*)\b/i },
];
export const concernBySlug = (slug: string) => concerns.find((c) => c.slug === slug);

export type ConcernMatch = { product: ShopProduct; quote: string };

/** Products whose own description speaks to the concern, each with the sentence that does. */
export function matchConcern(concern: Concern, products: ShopProduct[]): ConcernMatch[] {
  const out: ConcernMatch[] = [];
  for (const product of products) {
    const sentences = product.description.flatMap((p) => p.split(/(?<=[.!?])\s+/));
    const quote = sentences.find((s) => concern.words.test(s) && s.length <= 220) ?? sentences.find((s) => concern.words.test(s));
    if (quote) out.push({ product, quote: quote.length > 220 ? `${quote.slice(0, 217).trimEnd()}…` : quote });
  }
  return out;
}

/** Concerns that have at least one product, with the count, for menus. */
export function activeConcerns(products: ShopProduct[]) {
  return concerns.map((c) => ({ ...c, count: matchConcern(c, products).length })).filter((c) => c.count > 0);
}
