import { NextResponse, type NextRequest } from "next/server";
import { CHECKOUT_ORIGIN } from "@/lib/shop/data";
import { shopUrl } from "@/lib/site";

/**
 * Check out. The bag links here, on the shop's own address, with what is in it (`items=variant:qty,…`),
 * and the customer is sent on to the store's checkout. No order is placed here.
 *
 * The store's checkout is GoKwik's, which lives on the Shopify store itself: it is the only way the store
 * takes payment (Shopify's own checkout has no payment provider). GoKwik's script opens its checkout for
 * the variants named in `pid` (one entry per unit, separated by spaces) and treats `custom_source` as a
 * sale from a custom storefront.
 */
export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;
  const lines = (q.get("items") ?? "")
    .split(",")
    .map((s) => /^(\d{6,20}):(\d{1,2})$/.exec(s.trim()))
    .filter((m): m is RegExpExecArray => m !== null)
    .map((m) => ({ id: m[1], qty: Math.max(1, Math.min(20, Number(m[2]))) }))
    .slice(0, 30);
  if (!lines.length) return NextResponse.redirect(shopUrl("/collections/all"));

  const url = new URL(`${CHECKOUT_ORIGIN}/`);
  url.searchParams.set("pid", lines.flatMap((l) => Array<string>(l.qty).fill(l.id)).join(" "));
  url.searchParams.set("custom_source", "1");
  return NextResponse.redirect(url);
}
