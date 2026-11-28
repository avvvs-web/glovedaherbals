/**
 * gloveda.co is the parent site of the Gloveda family (client, 2026-11-28): the film and the brand
 * story, with a way into each of its three houses. The film and this site's title and H1 say "Gloveda"
 * (client, 2026-11-22); Gloveda Herbals is the skincare brand and its shop.
 */
export const SITE_NAME = "Gloveda";
export const BRAND = "Gloveda";

/** Canonical origin of this site. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://gloveda.co").replace(/\/$/, "");

/** The shop, Gloveda Herbals: its own site and codebase (site/ in this repository). */
export const SHOP_ORIGIN = (process.env.NEXT_PUBLIC_SHOP_ORIGIN ?? "https://herbals.gloveda.co").replace(/\/$/, "");
export const shopUrl = (path: `/${string}`) => `${SHOP_ORIGIN}${path}`;

/** Gloveda Experience: Ayurvedic treatments for hotels, resorts and wellness properties. */
export const EXPERIENCE_URL = "https://experience.gloveda.co";

/** Gloveda Revive: Ayurvedic skin and hair clinics, and partnerships to open one. */
export const REVIVE_URL = "https://revive.gloveda.co";
export const reviveUrl = (path: `/${string}`) => `${REVIVE_URL}${path}`;

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
