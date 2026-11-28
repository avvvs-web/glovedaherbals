import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentSession, safePath, signInReady } from "@/lib/shop/customer";
import { shopUrl } from "@/lib/site";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

/**
 * Gloveda Herbals' own sign-in page. The customer gives their email here; the next step, the six-digit
 * code that proves the email is theirs, is sent and checked by Shopify, which holds the accounts (there
 * is no password, and this site never sees the code). The same form creates an account for a new email.
 */
export default async function SignInPage({ searchParams }: PageProps<"/shop/account/signin">) {
  const q = await searchParams;
  const to = safePath(typeof q.to === "string" ? q.to : null);
  if ((await currentSession()) !== "none") redirect(shopUrl(to as `/${string}`));

  return (
    <section className="gl-section shop-page" aria-labelledby="signin-title">
      <div className="gl-container gx-signin">
        <div className="gx-stack">
          <p className="gx-label">Your Gloveda Herbals</p>
          <h1 id="signin-title" className="gx-display">
            Sign in
          </h1>
          <p className="gx-lead">Enter your email and we will send you a six-digit code. No password to remember.</p>
        </div>

        {signInReady ? (
          <form className="gx-form" action={shopUrl("/account/login")} method="get">
            <input type="hidden" name="to" value={to} />
            <label className="gl-field">
              <span className="gl-label">Email</span>
              <input className="gl-input" type="email" name="email" autoComplete="email" inputMode="email" required autoFocus />
            </label>
            <button className="gl-btn gl-btn--block" type="submit">
              Continue
            </button>
            <p className="gl-small">New here? The same step creates your account. You can also check out as a guest.</p>
          </form>
        ) : (
          <p className="gl-notice">Sign-in could not be reached just now. Please try again in a little while.</p>
        )}

        <ul className="gx-signin__why" role="list">
          <li>See every order and follow its delivery</li>
          <li>Keep your delivery addresses ready for checkout</li>
          <li>Your wishlist, on this device, stays as it is</li>
        </ul>
      </div>
    </section>
  );
}
