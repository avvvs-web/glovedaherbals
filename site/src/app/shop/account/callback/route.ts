import { NextResponse, type NextRequest } from "next/server";
import { cookieOptions, COOKIES, finishSignIn, readPending } from "@/lib/shop/customer";
import { shopUrl } from "@/lib/site";

/**
 * Where Shopify sends the customer back after they sign in. The code in the address is only accepted
 * if it answers the attempt this browser started (the state matches), and is then exchanged for the
 * customer's tokens. Anything else returns to the account page with a plain "that did not work".
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;
  const pending = readPending(request.cookies.get(COOKIES.auth)?.value);
  const code = q.get("code");
  const fail = () => {
    const res = NextResponse.redirect(shopUrl("/account?signin=failed"));
    res.cookies.delete(COOKIES.auth);
    return res;
  };
  if (!pending || !code || q.get("state") !== pending.state) return fail();
  const done = await finishSignIn(code, pending.verifier);
  if (!done) return fail();
  const res = NextResponse.redirect(shopUrl(pending.to as `/${string}`));
  res.cookies.delete(COOKIES.auth);
  res.cookies.set(COOKIES.session, done.session, cookieOptions.session);
  if (done.id) res.cookies.set(COOKIES.id, done.id, cookieOptions.session);
  return res;
}
