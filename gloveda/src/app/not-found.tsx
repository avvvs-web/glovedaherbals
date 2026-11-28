import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { shopUrl } from "@/lib/site";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/** Any address on the site that does not exist, with the site's header and footer and a way back. */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="gl-section not-found" aria-labelledby="nf-title">
        <div className="gl-container gl-container--narrow">
          <p className="gx-label">Page not found</p>
          <h1 id="nf-title" className="gl-h1">
            This page is not here.
          </h1>
          <p className="gl-lead not-found__lead">The link may be old, or the page may have moved.</p>
          <div className="not-found__actions">
            <Link className="gl-btn" href="/">
              Go to the home page
            </Link>
            <a className="gl-btn gl-btn--secondary" href={shopUrl("/")}>
              Visit the shop
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
