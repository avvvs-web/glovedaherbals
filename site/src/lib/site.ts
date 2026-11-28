/**
 * Site-wide constants. The film and the homepage's approved title and H1 say "Gloveda" (client,
 * 2026-11-22). Everywhere else the brand is named in full, "Gloveda Herbals" (client, 2026-11-23); the
 * logo is unchanged.
 */
export const SITE_NAME = "Gloveda";
export const BRAND = "Gloveda Herbals";

/** The parent site, gloveda.co: the film and the brand story (client, 2026-11-28). Its own project. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://gloveda.co").replace(/\/$/, "");

/**
 * Where the shop lives: its own address, herbals.gloveda.co (client, 2026-11-28), which keeps the
 * store's paths (/collections/…, /products/…). For local work set NEXT_PUBLIC_SHOP_ORIGIN to
 * http://localhost:3000/shop, or to "/shop" to serve the shop under the site's own address.
 */
export const SHOP_ORIGIN = (process.env.NEXT_PUBLIC_SHOP_ORIGIN ?? "https://herbals.gloveda.co").replace(/\/$/, "");

/** True when the shop has an address of its own (not a /shop folder of the main site). */
export const SHOP_SEPARATE = /^https?:\/\/[^/]+$/.test(SHOP_ORIGIN);

/** Gloveda Experience, the brand's hospitality offering. */
export const EXPERIENCE_URL = "https://experience.gloveda.co";

/** Gloveda Revive, the brand's skin and hair clinics. */
export const REVIVE_URL = "https://revive.gloveda.co";

export const shopUrl = (path: `/${string}`) => `${SHOP_ORIGIN}${path}`;

/** A page of the parent site (gloveda.co). */
export const siteUrl = (path: `/${string}`) => `${SITE_URL}${path}`;

/** The shop's own origin, for absolute addresses (canonical links, structured data, sharing images). */
export const SHOP_BASE = SHOP_SEPARATE ? SHOP_ORIGIN : new URL(SHOP_ORIGIN, SITE_URL).origin;

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
