import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * One codebase, two domains: requests to the shop host (shop.glovedaherbals.com) are served from the
 * /shop routes, so shop URLs keep the store's own paths (/collections/…, /products/…).
 */
const SHOP_HOSTS = (process.env.SHOP_HOSTS ?? "shop.glovedaherbals.com").split(",").map((h) => h.trim().toLowerCase());

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  if (!SHOP_HOSTS.includes(host)) return NextResponse.next();
  const url = request.nextUrl.clone();
  if (url.pathname.startsWith("/shop")) return NextResponse.next();
  url.pathname = `/shop${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Pages only: static files, images and Next internals are shared by both hosts.
  matcher: ["/((?!_next/|brand/|media/|seq/|favicon|icon|apple-icon|.*\.[a-z0-9]+$).*)"],
};
