"use client";

import Image from "next/image";
import { useFavourites } from "@/lib/shop/favourites";
import { AddButton } from "./ui/AddButton";
import { EmptyState } from "./ui/EmptyState";
import { Heart } from "./ui/Heart";

export type FavouriteItem = { handle: string; title: string; href: string; priceText: string; variantId: number; available: boolean; image?: string };

/** The products saved with the heart on this device, as list rows. */
export function FavouritesList({ items, browseHref }: { items: FavouriteItem[]; browseHref: string }) {
  const { list } = useFavourites();
  const saved = items.filter((it) => list.includes(it.handle));
  if (!saved.length)
    return (
      <EmptyState title="Your wishlist is empty">
        <p className="gl-small">Tap the heart on any product and it will wait for you here.</p>
        <a className="gl-btn" href={browseHref}>
          See the range
        </a>
      </EmptyState>
    );
  return (
    <ul className="gx-list" role="list">
      {saved.map((it) => (
        <li key={it.handle} className="gx-row">
          <span className="gx-row__thumb">{it.image ? <Image src={it.image} alt="" width={128} height={160} sizes="64px" /> : null}</span>
          <span className="gx-row__name">
            <a className="gx-row__link" href={it.href}>
              {it.title}
            </a>
          </span>
          <span className="gx-row__price">{it.priceText}</span>
          <Heart handle={it.handle} title={it.title} />
          <AddButton variantId={it.variantId} available={it.available} title={it.title} compact />
        </li>
      ))}
    </ul>
  );
}
