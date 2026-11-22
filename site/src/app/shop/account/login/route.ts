import { NextResponse } from "next/server";
import { shopUrl } from "@/lib/site";

/**
 * Sign-in. Gloveda's accounts are Shopify's customer accounts: the customer signs in on Shopify's own
 * page with a code sent by email, and comes back here signed in (no password is ever handled by this
 * site). That needs the store's Customer Account API client id; until it is set, this route says so
 * plainly instead of pretending to sign anyone in.
 */
export function GET() {
  const ready = Boolean(process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID);
  return NextResponse.redirect(shopUrl(`/account?signin=${ready ? "pending" : "unavailable"}`));
}
