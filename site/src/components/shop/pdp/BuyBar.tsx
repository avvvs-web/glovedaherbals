"use client";

import { useEffect, useState } from "react";
import { AddButton } from "../ui/AddButton";

/**
 * Phones: once the main Add to bag button has scrolled away, a slim bar keeps the name, the price and
 * the button within reach. `watch` is the id of the element that holds the main button.
 */
export function BuyBar({ watch, variantId, available, title, price }: { watch: string; variantId: number; available: boolean; title: string; price: string }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = document.getElementById(watch);
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShown(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [watch]);
  return (
    <div className="gx-buybar glass theme-wine" data-buy data-shown={shown} aria-hidden={!shown} inert={!shown}>
      <p className="gx-buybar__text">
        <span className="gx-buybar__name">{title}</span>
        <span className="gx-buybar__price" data-price>{price}</span>
      </p>
      <AddButton variantId={variantId} available={available} title={title} />
    </div>
  );
}
