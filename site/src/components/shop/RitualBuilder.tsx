"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/components/shop/Cart";
import { Price } from "@/components/shop/ui/Price";

export type BuilderOption = { variantId: number; title: string; price: number; priceText: string; available: boolean; image?: string };
export type BuilderGroup = { id: string; title: string; options: BuilderOption[] };

/**
 * Build your own ritual: choose at most one product from each collection, see the running total,
 * and add the whole set to the cart in one step. Every option and price comes from the live catalogue.
 */
export function RitualBuilder({ groups, currency }: { groups: BuilderGroup[]; currency: string }) {
  const { addMany } = useCart();
  const [picked, setPicked] = useState<Record<string, number | null>>({});
  const chosen = groups.flatMap((g) => g.options.filter((o) => o.variantId === picked[g.id]));
  const total = chosen.reduce((n, o) => n + o.price, 0);
  const money = new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 });

  return (
    <div className="builder">
      {groups.map((g) => (
        <fieldset key={g.id} className="builder__group">
          <legend className="builder__legend">{g.title}</legend>
          <div className="builder__options">
            {g.options.map((o) => {
              const on = picked[g.id] === o.variantId;
              return (
                <label key={o.variantId} className="builder__option" data-on={on ? "true" : "false"} data-off={o.available ? undefined : "true"}>
                  <input
                    type="checkbox"
                    className="visually-hidden"
                    checked={on}
                    disabled={!o.available}
                    onChange={() => setPicked((p) => ({ ...p, [g.id]: on ? null : o.variantId }))}
                  />
                  <span className="builder__thumb">{o.image ? <Image src={o.image} alt="" width={160} height={160} /> : null}</span>
                  <span className="builder__name">{o.title.replace(/^Gloveda /, "")}</span>
                  <span className="builder__price"><Price>{o.available ? o.priceText : "Sold out"}</Price></span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}
      <div className="builder__bar" role="status">
        <p className="builder__summary">
          {chosen.length ? (
            <>
              {chosen.length} of {groups.length} chosen<span data-price>, {money.format(total)}</span>
            </>
          ) : (
            "Choose one from each, or only the ones you want."
          )}
        </p>
        <button type="button" className="gl-btn" disabled={!chosen.length} onClick={() => addMany(chosen.map((o) => o.variantId))}>
          Add ritual to cart
        </button>
      </div>
    </div>
  );
}
