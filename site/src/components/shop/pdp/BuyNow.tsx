"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/whatsapp";

type Props = { checkoutBase: string; variantId: number; title: string; price: number; currency: string };

/** Buy now: straight to the store's checkout with one of this product, leaving the bag as it is. */
export function BuyNow({ checkoutBase, variantId, title, price, currency }: Props) {
  return (
    <a
      className="gl-btn gl-btn--secondary buy-now"
      href={`${checkoutBase}?items=${variantId}:1`}
      data-buy
      onClick={() => track("begin_checkout", [{ item_id: String(variantId), item_name: title, price, quantity: 1 }], currency)}
    >
      Buy now
    </a>
  );
}

/** For a sold-out product: ask to be told on WhatsApp when it is back. */
export function NotifyMe({ title }: { title: string }) {
  return (
    <a className="gl-btn gl-btn--secondary notify-me" href={whatsappUrl(`Hello, please tell me when ${title} is back in stock.`)} target="_blank" rel="noopener">
      Notify me
      <span className="visually-hidden"> when {title} is back (opens WhatsApp in a new tab)</span>
    </a>
  );
}

/** Sends view_item once when a product page is shown (only with analytics consent). */
export function ViewItem({ variantId, title, price, currency, category }: { variantId: number; title: string; price: number; currency: string; category?: string }) {
  useEffect(() => {
    // Deferred a tick and cancelled on unmount, so a remount (React's development double run) sends it once.
    const t = setTimeout(() => track("view_item", [{ item_id: String(variantId), item_name: title, price, quantity: 1, item_category: category }], currency), 0);
    return () => clearTimeout(t);
  }, [variantId, title, price, currency, category]);
  return null;
}
