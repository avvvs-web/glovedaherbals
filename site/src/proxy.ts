import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * One codebase, two domains: requests to the shop host (shop.glovedaherbals.com) are served from the
 * /shop routes, so shop URLs keep the store's own paths (/collections/…, /products/…).
 */
const SHOP_HOSTS = (process.env.SHOP_HOSTS ?? "shop.glovedaherbals.com").split(",").map((h) => h.trim().toLowerCase());

/**
 * Where the shop sells today. Visitors from any other country can read the whole site, but every price
 * and every way to buy is hidden: the prices in Shopify are India's, and other markets are not set up
 * yet (see the international launch plan). The country comes from the host's own header (Vercel sets it
 * at the edge); a cookie carries the answer to the page, which hides those parts before it is
 * interactive. With no country known (local development) nothing is hidden. `?market=ae` (or any
 * country code) overrides it, for checking.
 */
const SELLING_IN = (process.env.SELLING_IN ?? "IN").split(",").map((c) => c.trim().toUpperCase()).filter(Boolean);

function withMarket(request: NextRequest, response: NextResponse) {
  const asked = request.nextUrl.searchParams.get("market");
  const country = (asked ?? request.headers.get("x-vercel-ip-country") ?? "").toUpperCase();
  // No country known (local development, or a later page after ?market=): keep what was decided before.
  if (!country) return response;
  const value = SELLING_IN.includes(country) ? "shown" : "hidden";
  if (asked) response.cookies.set("gl_market_test", "1", { path: "/", sameSite: "lax" });
  else if (request.cookies.get("gl_market_test")) return response; // a check in progress keeps its choice
  response.cookies.set("gl_prices", value, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 });
  return response;
}

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  if (!SHOP_HOSTS.includes(host)) return withMarket(request, NextResponse.next());
  const url = request.nextUrl.clone();
  if (url.pathname.startsWith("/shop")) return withMarket(request, NextResponse.next());
  url.pathname = `/shop${url.pathname === "/" ? "" : url.pathname}`;
  return withMarket(request, NextResponse.rewrite(url));
}

export const config = {
  // Pages only: static files, images and Next internals are shared by both hosts.
  // (The dot is escaped twice: once for this string, once for the pattern. Unescaped, it matched any path.)
  matcher: ["/((?!_next/|brand/|media/|seq/|favicon|icon|apple-icon|.*\\.[a-z0-9]+$).*)"],
};
