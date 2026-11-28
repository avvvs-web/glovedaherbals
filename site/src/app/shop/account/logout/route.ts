import { NextResponse, type NextRequest } from "next/server";
import { COOKIES, signOutUrl } from "@/lib/shop/customer";

/** Sign out: forget the customer here, then end their session at Shopify, which returns them to the shop. */
export async function GET(request: NextRequest) {
  const res = NextResponse.redirect(await signOutUrl(request.cookies.get(COOKIES.id)?.value));
  res.cookies.delete(COOKIES.session);
  res.cookies.delete(COOKIES.id);
  return res;
}
