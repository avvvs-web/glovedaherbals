/**
 * Site-wide constants. The film and the homepage's approved title and H1 say "Gloveda" (client,
 * 2026-11-22). Everywhere else the brand is named in full, "Gloveda Herbals" (client, 2026-11-23); the
 * logo is unchanged.
 */
export const SITE_NAME = "Gloveda";
export const BRAND = "Gloveda Herbals";

/** Canonical origin of this site. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://glovedaherbals.com").replace(/\/$/, "");

/**
 * Where the shop lives. The client's decision (2026-11-22) is shop.glovedaherbals.com, which keeps the
 * store's existing paths: set NEXT_PUBLIC_SHOP_ORIGIN to it once that address exists. Until then the
 * shop is reached at /shop on whatever address the site itself is served from, so its links always work.
 */
export const SHOP_ORIGIN = (process.env.NEXT_PUBLIC_SHOP_ORIGIN ?? "/shop").replace(/\/$/, "");

/** Gloveda Experience, the brand's clinic and hospitality offering. */
export const EXPERIENCE_URL = "https://glovedaexperience.com";

export const shopUrl = (path: `/${string}`) => `${SHOP_ORIGIN}${path}`;

export const collections = [
  { name: "Face Care", path: "/collections/skin-care" },
  { name: "Hair Care", path: "/collections/hair-care" },
  { name: "Body Care", path: "/collections/body-care" },
] as const;

export const social = [
  { name: "Instagram", url: "https://www.instagram.com/glovedaofficial/" },
  { name: "Facebook", url: "https://www.facebook.com/glovedaofficial" },
  { name: "YouTube", url: "https://www.youtube.com/@glovedaofficial" },
] as const;
