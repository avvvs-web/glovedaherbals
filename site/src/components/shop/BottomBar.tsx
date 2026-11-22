"use client";

import { useCart } from "./Cart";
import { useFavourites } from "@/lib/shop/favourites";
import { Icon } from "./ui/Icon";

/** Phones only: the five things a shopper reaches for, under the thumb. */
export function BottomBar({ shopHref, searchHref, accountHref }: { shopHref: string; searchHref: string; accountHref: string }) {
  const { count, open } = useCart();
  const wished = useFavourites().list.length;
  return (
    <nav className="bottombar glass theme-wine" aria-label="Shop shortcuts">
      <a href={shopHref}>
        <Icon name="arrow" />
        Range
      </a>
      <a href={searchHref}>
        <Icon name="search" />
        Search
      </a>
      <a href={`${accountHref}?tab=saved`}>
        <Icon name="heart" />
        Wishlist{wished ? ` (${wished})` : ""}
      </a>
      <a href={accountHref}>
        <Icon name="account" />
        Account
      </a>
      <button type="button" onClick={open}>
        <Icon name="bag" />
        Bag{count ? ` (${count})` : ""}
      </button>
    </nav>
  );
}
