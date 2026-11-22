import "server-only";

/**
 * Reviews are the store's own: customers leave them through Loox, the reviews app installed on the
 * Shopify store, and the store's team moderates them there. This site shows them; it never writes,
 * edits or invents one.
 *
 * LOOX_ID and the store's myshopify domain are public values (they are in the live store's pages).
 */
export const LOOX_ID = process.env.NEXT_PUBLIC_LOOX_ID ?? "psOUq3PXH6";
export const LOOX_SHOP = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ?? "gmfcwr-v0.myshopify.com";

/** Loox lets its reviews frame load on this domain and its subdomains only (its frame-ancestors rule). */
export const REVIEWS_HOST = "glovedaherbals.com";

export type Rating = { average: number; count: number };

/**
 * The average rating and number of reviews for a product, read from Loox's own reviews page for it.
 * Returns null when there are no reviews, when Loox cannot be reached, or when the page does not state
 * the two numbers exactly as expected: nothing is shown rather than something guessed.
 * Once the Storefront API token is connected this should read the product metafields Loox maintains
 * (loox.avg_rating, loox.num_reviews) instead.
 */
export async function getRating(productId: number): Promise<Rating | null> {
  if (!LOOX_ID) return null;
  try {
    const res = await fetch(`https://loox.io/widget/${LOOX_ID}/reviews/${productId}?limit=1`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const html = await res.text();
    const avg = /aria-label="Average rating: (\d(?:\.\d)?) \/ 5 star review"/.exec(html);
    const count = /expanded-summary-count"><span>(\d+) Reviews?</.exec(html);
    if (!avg || !count) return null;
    const average = Number(avg[1]);
    const n = Number(count[1]);
    return average > 0 && average <= 5 && n > 0 ? { average, count: n } : null;
  } catch {
    return null;
  }
}
