"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useCart } from "./Cart";

export type RitualItem = { variantId: number; title: string; href: string; price: number; image?: string };

/**
 * "Complete the ritual": the product on this page plus others from the same range, added to the cart
 * together in one step. Every name, price and image is passed in from the live catalogue.
 */
export function CompleteRitual({ current, others, range, currency }: { current: RitualItem; others: RitualItem[]; range: string; currency: string }) {
  const { addMany } = useCart();
  const [picked, setPicked] = useState<Set<number>>(() => new Set(others.map((o) => o.variantId)));
  const money = useMemo(() => new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }), [currency]);
  const chosen = others.filter((o) => picked.has(o.variantId));
  const total = current.price + chosen.reduce((n, o) => n + o.price, 0);
  const count = chosen.length + 1;
  const toggle = (id: number) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section className="ritual-add" aria-labelledby="ritual-add-title">
      <h2 id="ritual-add-title" className="pdp__head">
        Complete the ritual
      </h2>
      <p className="gl-small">More from {range}. Untick anything you do not need.</p>
      <ul className="ritual-add__list" role="list">
        <li className="ritual-add__item" data-fixed="true">
          <span className="ritual-add__thumb">{current.image ? <Image src={current.image} alt="" width={112} height={112} sizes="56px" /> : null}</span>
          <span className="ritual-add__name">
            {current.title}
            <span className="gl-small"> This product</span>
          </span>
          <span className="ritual-add__price" data-price>{money.format(current.price)}</span>
        </li>
        {others.map((o) => (
          <li key={o.variantId} className="ritual-add__item">
            <label className="ritual-add__label">
              <input type="checkbox" checked={picked.has(o.variantId)} onChange={() => toggle(o.variantId)} />
              <span className="ritual-add__thumb">{o.image ? <Image src={o.image} alt="" width={112} height={112} sizes="56px" /> : null}</span>
              <span className="ritual-add__name">{o.title}</span>
            </label>
            <span className="ritual-add__price" data-price>{money.format(o.price)}</span>
          </li>
        ))}
      </ul>
      <div className="ritual-add__foot">
        <p className="ritual-add__total">
          <span>
            {count} {count === 1 ? "product" : "products"}
          </span>
          <span data-price>{money.format(total)}</span>
        </p>
        <button type="button" className="gl-btn gl-btn--secondary gl-btn--block" onClick={() => addMany([current.variantId, ...chosen.map((o) => o.variantId)])}>
          {count === 1 ? "Add to cart" : `Add all ${count} to cart`}
        </button>
      </div>
    </section>
  );
}
