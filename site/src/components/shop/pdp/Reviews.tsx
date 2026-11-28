import type { ProductReviews } from "@/lib/shop/reviews";
import { Icon } from "../ui/Icon";
import { Stars } from "../ui/Stars";

/**
 * The store's reviews for one product, read from Loox (see lib/shop/reviews.ts) and set in this site's
 * own design: who wrote it, the stars they gave, their words and their photo if they sent one. Nothing
 * is edited. Writing a review opens Loox's own page for the product, where the store collects them.
 */
export function Reviews({ data, title }: { data: ProductReviews; title: string }) {
  const { reviews, rating, page } = data;
  const more = rating && rating.count > reviews.length ? rating.count - reviews.length : 0;
  return (
    <div className="gx-reviews__body">
      {reviews.length ? (
        <ul className="gx-reviews__list" role="list">
          {reviews.map((r) => (
            <li key={r.id} className="gx-review">
              {r.photo ? (
                // A customer's own photo, served by the reviews service; plain img keeps it off the image optimiser.
                // eslint-disable-next-line @next/next/no-img-element
                <img className="gx-review__photo" src={r.photo} alt={`Photo from ${r.name}'s review of ${title}`} loading="lazy" decoding="async" />
              ) : null}
              <div className="gx-review__text">
                <p className="gx-review__stars">
                  <Stars value={r.stars} size={16} />
                  <span className="sr-only">{r.stars} out of 5</span>
                </p>
                {r.text ? <p className="gx-review__words">{r.text}</p> : null}
                <p className="gx-review__name">{r.name}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="gx-lead">No reviews yet. Be the first to write one.</p>
      )}
      <p className="gx-reviews__actions">
        <a className="gl-btn gl-btn--secondary" href={`${page}#write`} target="_blank" rel="noopener">
          Write a review
        </a>
        {more ? (
          <a className="gx-more" href={page} target="_blank" rel="noopener">
            Read {more} more <Icon name="arrow" size={18} />
          </a>
        ) : null}
      </p>
    </div>
  );
}
