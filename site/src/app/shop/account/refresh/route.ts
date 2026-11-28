import { NextResponse, type NextRequest } from "next/server";
import { cookieOptions, COOKIES, refreshSession, safePath } from "@/lib/shop/customer";
import { shopUrl } from "@/lib/site";

/**
 * The access token lasts about an hour. When it has run out the account page sends the customer through
 * here: a new one is fetched with their refresh token and they land back where they were. If Shopify no
 * longer accepts the refresh token they are signed out here and asked to sign in again.
 */
export async function GET(request: NextRequest) {
  const to = safePath(request.nextUrl.searchParams.get("to"));
  const session = await refreshSession(request.cookies.get(COOKIES.session)?.value);
  if (!session) {
    const res = NextResponse.redirect(shopUrl("/account?signin=expired"));
    res.cookies.delete(COOKIES.session);
    res.cookies.delete(COOKIES.id);
    return res;
  }
  const res = NextResponse.redirect(shopUrl(to as `/${string}`));
  res.cookies.set(COOKIES.session, session, cookieOptions.session);
  return res;
}
