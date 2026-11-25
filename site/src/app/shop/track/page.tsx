import type { Metadata } from "next";
import { COMPANY } from "@/content/policies";
import { shopUrl } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Where to find your Gloveda Herbals order's status and tracking link, and how to reach us about a delivery.",
  alternates: { canonical: shopUrl("/track") },
};

/**
 * Order tracking. Every way listed here exists today: the shipping confirmation (promised in the terms),
 * the account's Orders tab, WhatsApp and email. It makes no delivery-time promise of its own.
 * Linked from the header menu, the footer and (once set up in Shopify) the order emails.
 */
export default function TrackPage() {
  const ways = [
    {
      title: "From your shipping email",
      text: "When your order ships we send a shipping confirmation by email. Where the courier provides one, it includes a link to track your parcel.",
    },
    {
      title: "In your account",
      text: "Sign in with the email you ordered with. The Orders tab lists every order and its status.",
      action: { label: "Go to my orders", href: shopUrl("/account?tab=orders") },
    },
    {
      title: "Ask us on WhatsApp",
      text: "Send us your order number and we will tell you where it is.",
      action: { label: "Chat on WhatsApp", href: whatsappUrl("Hello, I would like to track my order. My order number is: "), external: true },
    },
    {
      title: "Write to us",
      text: `Email ${COMPANY.email} with your order number as the subject line, or call ${COMPANY.phone}.`,
      action: { label: "Email us", href: `mailto:${COMPANY.email}?subject=${encodeURIComponent("Order tracking")}` },
    },
  ];
  return (
    <section className="gl-section shop-page track" aria-labelledby="track-title">
      <div className="gl-container gl-container--narrow">
        <p className="gx-label">Orders</p>
        <h1 id="track-title" className="gl-h1">
          Track your order
        </h1>
        <p className="gl-lead track__lead">Four ways to see where your order is.</p>
        <ol className="track__ways" role="list">
          {ways.map((w, i) => (
            <li key={w.title} className="track__way">
              <span className="track__num" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h2 className="track__title">{w.title}</h2>
                <p className="gl-body">{w.text}</p>
                {w.action ? (
                  <a
                    className="gl-btn gl-btn--sm gl-btn--secondary track__action"
                    href={w.action.href}
                    {...("external" in w.action ? { target: "_blank", rel: "noopener" } : {})}
                  >
                    {w.action.label}
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
        <p className="gl-small">
          Delivery times and charges are in our <a className="gl-link" href={shopUrl("/policies/shipping-policy")}>shipping policy</a>.
        </p>
      </div>
    </section>
  );
}
