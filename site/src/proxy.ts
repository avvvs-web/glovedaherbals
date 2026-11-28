import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SHOP_SEPARATE } from "@/lib/site";

/**
 * This codebase is the shop, Gloveda Herbals, at herbals.gloveda.co (client, 2026-11-28); the parent site
 * gloveda.co is its own project. The pages live under /shop, and on its own address every request is
 * served from there, so shop URLs keep the store's own paths (/collections/…, /products/…). The same holds
 * on any other address the project answers on (a Vercel preview). For local work the shop can instead be
 * opened at /shop (NEXT_PUBLIC_SHOP_ORIGIN=http://localhost:3000/shop), and then nothing is rewritten.
 */
const OWN_FILES = ["/robots.txt", "/sitemap.xml"];

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

const inShop = (path: string) => path === "/shop" || path.startsWith("/shop/");

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!SHOP_SEPARATE) return OWN_FILES.includes(pathname) ? NextResponse.next() : withMarket(request, NextResponse.next());
  const url = request.nextUrl.clone();
  // herbals.gloveda.co/shop/x is the same page as herbals.gloveda.co/x: keep one address for it.
  if (inShop(pathname)) {
    url.pathname = pathname.slice(5) || "/";
    return NextResponse.redirect(url, 308);
  }
  if (OWN_FILES.includes(pathname)) {
    url.pathname = `/shop${pathname}`;
    return NextResponse.rewrite(url);
  }
  url.pathname = `/shop${pathname === "/" ? "" : pathname}`;
  return withMarket(request, NextResponse.rewrite(url));
}

export const config = {
  // Pages only: static files, images and Next internals are shared by both hosts.
  // (The dot is escaped twice: once for this string, once for the pattern. Unescaped, it matched any path.)
  matcher: ["/((?!_next/|brand/|media/|seq/|favicon|icon|apple-icon|.*\\.[a-z0-9]+$).*)", "/robots.txt", "/sitemap.xml"],
};
