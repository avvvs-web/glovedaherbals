import { NextResponse, type NextRequest } from "next/server";
import { beginSignIn, cookieOptions, COOKIES, signInReady } from "@/lib/shop/customer";
import { shopUrl } from "@/lib/site";

/**
 * The step after this site's own sign-in page. Gloveda's accounts are Shopify's customer accounts, and
 * Shopify alone may confirm who a customer is: it emails them a code and checks it on its own page (no
 * password is ever handled by this site). The email typed here is handed on so that page starts from it.
 * If the store's sign-in cannot be reached, the account page says so plainly.
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;
  const email = (q.get("email") ?? "").trim();
  const start = signInReady ? await beginSignIn(q.get("to") ?? "/account", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined) : null;
  if (!start) return NextResponse.redirect(shopUrl("/account?signin=unavailable"));
  const res = NextResponse.redirect(start.url);
  res.cookies.set(COOKIES.auth, start.cookie, cookieOptions.auth);
  return res;
}
