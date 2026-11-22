"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const none = () => () => {};

/**
 * The store's reviews for one product, shown by Loox's own widget (it also carries "Write a review").
 * Loox's script is only requested once the section is about to scroll into view, so it costs nothing
 * for visitors who never reach it. It finds the element by its id and fills it.
 * Loox only allows its frame on the store's own addresses (glovedaherbals.com and its subdomains), so
 * anywhere else, such as a local or preview build, a plain note is shown in its place.
 */
export function Reviews({ productId, looxId, shop, allowed }: { productId: number; looxId: string; shop: string; allowed: string }) {
  const box = useRef<HTMLDivElement>(null);
  const host = useSyncExternalStore(none, () => window.location.hostname, () => "");
  const blocked = host !== "" && host !== allowed && !host.endsWith(`.${allowed}`);
  useEffect(() => {
    const el = box.current;
    if (!el || blocked) return;
    let script: HTMLScriptElement | null = null;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        script = document.createElement("script");
        script.async = true;
        script.src = `https://loox.io/widget/${looxId}/loox.js?shop=${shop}`;
        document.body.appendChild(script);
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      script?.remove();
    };
  }, [looxId, shop, blocked]);
  if (blocked)
    return (
      <p className="gl-notice gx-reviews__note">
        The reviews themselves appear on {allowed} addresses only: the reviews service does not allow them to be shown on {host}.
      </p>
    );
  return <div ref={box} id="looxReviews" className="gx-reviews__widget" data-product-id={productId} data-limit={12} />;
}
