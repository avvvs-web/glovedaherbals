import "server-only";

/**
 * Reviews are the store's own: customers leave them through Loox, the reviews app installed on the
 * Shopify store, and the store's team moderates them there. This site shows them; it never writes,
 * edits or invents one.
 *
 * Loox does not allow its reviews frame on herbals.gloveda.co (its frame-ancestors rule lists the store's
 * own domain only), so the reviews are read on the server from Loox's public page for the product and
 * shown in this site's own design. Writing a review still happens on Loox's page.
 *
 * LOOX_ID and the store's myshopify domain are public values (they are in the live store's pages).
 */
export const LOOX_ID = process.env.NEXT_PUBLIC_LOOX_ID ?? "psOUq3PXH6";
export const LOOX_SHOP = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ?? "gmfcwr-v0.myshopify.com";

export type Rating = { average: number; count: number };
export type Review = { id: string; name: string; stars: number; text: string; photo?: string };
export type ProductReviews = { rating: Rating | null; reviews: Review[]; page: string };

/** Loox's own page for a product's reviews: read here, and opened by "Write a review". */
export const reviewsPage = (productId: number) => `https://loox.io/widget/${LOOX_ID}/reviews/${productId}`;

const text = (s: string) =>
  s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&")
    .trim();

/**
 * A product's reviews and its average, exactly as Loox states them. Anything that does not read as
 * expected is left out rather than guessed: a review needs a name and a whole number of stars from 1 to
 * 5, and the average needs both of its numbers. Returns no reviews when Loox cannot be reached.
 * Once the Storefront API exposes the metafields Loox maintains (loox.avg_rating, loox.num_reviews), the
 * average can come from Shopify instead.
 */
export async function getProductReviews(productId: number): Promise<ProductReviews> {
  const page = reviewsPage(productId);
  const none: ProductReviews = { rating: null, reviews: [], page };
  if (!LOOX_ID) return none;
  try {
    const res = await fetch(`${page}?limit=24`, { next: { revalidate: 3600 } });
    if (!res.ok) return none;
    const html = await res.text();

    const avg = /aria-label="Average rating: (\d(?:\.\d)?) \/ 5 star review"/.exec(html);
    const count = /expanded-summary-count"><span>(\d+) Reviews?</.exec(html);
    const average = avg ? Number(avg[1]) : 0;
    const n = count ? Number(count[1]) : 0;
    const rating = average > 0 && average <= 5 && n > 0 ? { average, count: n } : null;

    const reviews: Review[] = [];
    const parts = html.split(/<div[^>]*\bdata-id="/).slice(1);
    for (const part of parts) {
      const id = /^([\w-]+)"/.exec(part)?.[1];
      if (!id || !/class="[^"]*grid-item-wrap/.test(part.slice(0, 200))) continue;
      const name = new RegExp(`data-testid="review-${id}-title"[^>]*>(.*?)</div>`, "s").exec(part);
      const stars = /aria-label="Rating icons:[ ]*([1-5])[ ]*\/[ ]*5 star review"/.exec(part);
      const body = new RegExp(`data-testid="review-${id}-text"[^>]*>(.*?)</div>`, "s").exec(part);
      const photo = new RegExp(`data-testid="review-${id}-media".*?<img src="(//images[.]loox[.]io/[^"]+)"`, "s").exec(part);
      const who = name ? text(name[1]) : "";
      const s = stars ? Number(stars[1]) : 0;
      if (!who || s < 1 || s > 5) continue;
      reviews.push({ id, name: who, stars: s, text: body ? text(body[1]) : "", ...(photo ? { photo: `https:${photo[1]}` } : {}) });
    }
    return { rating, reviews, page };
  } catch {
    return none;
  }
}

/** The average rating and number of reviews for a product (see getProductReviews). */
export async function getRating(productId: number): Promise<Rating | null> {
  return (await getProductReviews(productId)).rating;
}
