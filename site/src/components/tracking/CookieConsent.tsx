"use client";

import Script from "next/script";
import { useEffect, useState, useSyncExternalStore } from "react";
import { CONSENT_KEY, readConsent, type Consent } from "@/lib/analytics";
import { shopUrl } from "@/lib/site";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
function save(c: Consent) {
  try {
    window.localStorage.setItem(CONSENT_KEY, c);
  } catch {
    /* storage blocked: the banner will ask again next visit */
  }
  listeners.forEach((l) => l());
}

/**
 * The cookie banner, and the only place tags are loaded. Google Tag Manager (and through it GA4, the
 * Meta Pixel and Microsoft Clarity) loads only after the visitor chooses "Accept"; "Necessary only"
 * keeps the site to the cart and checkout. The choice can be changed at any time from the footer's
 * "Cookie settings" link, which dispatches `gl:cookie-settings`.
 */
export function CookieConsent() {
  const consent = useSyncExternalStore(subscribe, readConsent, () => "granted" as Consent);
  const [reopened, setReopened] = useState(false);
  useEffect(() => {
    const show = () => setReopened(true);
    window.addEventListener("gl:cookie-settings", show);
    return () => window.removeEventListener("gl:cookie-settings", show);
  }, []);
  const choose = (c: Consent) => {
    save(c);
    setReopened(false);
    // Tags already on the page cannot be unloaded; a reload applies a withdrawal straight away.
    if (c === "denied" && consent === "granted") window.location.reload();
  };
  const open = consent === null || reopened;

  return (
    <>
      {GTM_ID && consent === "granted" ? (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(GTM_ID)});`}
        </Script>
      ) : null}
      {open ? (
        <section className="consent theme-wine" role="region" aria-labelledby="consent-title">
          <h2 id="consent-title" className="consent__title">
            Cookies on Gloveda Herbals
          </h2>
          <p className="consent__text">
            We use necessary cookies to keep your bag and checkout working. With your permission we also use analytics and advertising cookies to understand
            how the site is used and to measure our ads. <a className="gl-link" href={shopUrl("/policies/privacy-policy")}>Read the privacy policy</a>.
          </p>
          <div className="consent__actions">
            <button type="button" className="gl-btn gl-btn--sm" onClick={() => choose("granted")}>
              Accept
            </button>
            <button type="button" className="gl-btn gl-btn--sm gl-btn--secondary" onClick={() => choose("denied")}>
              Necessary only
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}

/** A footer link that opens the banner again. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("gl:cookie-settings"))}>
      Cookie settings
    </button>
  );
}
