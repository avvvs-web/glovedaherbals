/**
 * Ecommerce events for Google Tag Manager, in GA4's recommended shape (view_item, add_to_cart,
 * begin_checkout). GTM fans them out to GA4, the Meta Pixel and anything else configured there, so the
 * site sends each event once and never talks to a tag vendor directly.
 *
 * Events are only pushed once the visitor has accepted analytics cookies; before that, nothing is
 * queued. `purchase` cannot be sent from here: it happens on Shopify's checkout, and is sent by the
 * Shopify custom pixel described in docs/analytics-and-integrations.md.
 */
export type TrackItem = { item_id: string; item_name: string; price: number; quantity: number; item_variant?: string; item_category?: string };

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export const CONSENT_KEY = "gl_consent";
export type Consent = "granted" | "denied";

export function readConsent(): Consent | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function track(event: "view_item" | "add_to_cart" | "begin_checkout", items: TrackItem[], currency: string) {
  if (typeof window === "undefined" || readConsent() !== "granted" || !items.length) return;
  const value = Math.round(items.reduce((n, i) => n + i.price * i.quantity, 0) * 100) / 100;
  window.dataLayer = window.dataLayer ?? [];
  // GA4 asks for the previous ecommerce object to be cleared before each new one.
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({ event, ecommerce: { currency, value, items } });
}
