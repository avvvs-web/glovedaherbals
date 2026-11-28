import { shopUrl } from "@/lib/site";

/** A shop address that does not exist (an old link, a removed product). Inside the shop's header and footer. */
export default function ShopNotFound() {
  return (
    <section className="gl-section shop-page not-found" aria-labelledby="nf-title">
      <div className="gl-container gl-container--narrow">
        <p className="gx-label">Page not found</p>
        <h1 id="nf-title" className="gl-h1">
          This page is not here.
        </h1>
        <p className="gl-lead not-found__lead">The link may be old, or the product may no longer be in the shop.</p>
        <div className="not-found__actions">
          <a className="gl-btn" href={shopUrl("/collections/all")}>
            See all products
          </a>
          <a className="gl-btn gl-btn--secondary" href={shopUrl("/search")}>
            Search the shop
          </a>
          <a className="gl-btn gl-btn--ghost" href={shopUrl("/help")}>
            Help centre
          </a>
        </div>
      </div>
    </section>
  );
}
