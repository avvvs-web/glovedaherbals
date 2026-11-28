import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Icon } from "@/components/shop/ui/Icon";
import { currentSession, getOrder, type Money } from "@/lib/shop/customer";
import { shopUrl } from "@/lib/site";

export const metadata: Metadata = { title: "Your order", robots: { index: false } };

const words = (s: string | null) => (s ? s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " ") : null);
const day = (iso: string, time = false) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", ...(time ? { hour: "numeric", minute: "2-digit" } : {}), timeZone: "Asia/Kolkata" }).format(new Date(iso));
const money = (m: Money) => new Intl.NumberFormat("en-IN", { style: "currency", currency: m.currencyCode, maximumFractionDigits: Number(m.amount) % 1 === 0 ? 0 : 2 }).format(Number(m.amount));

/**
 * One order and where it is. Everything shown is what Shopify holds for the signed-in customer's own
 * order: the items, the totals, the delivery address, and for each parcel its carrier, tracking number
 * and the steps the carrier has reported. Where the store has no tracking for a parcel yet, that is said
 * plainly; nothing is estimated here.
 */
export default async function OrderPage({ params }: PageProps<"/shop/account/orders/[ref]">) {
  const { ref } = await params;
  const here = `/account/orders/${ref}`;
  const session = await currentSession();
  if (session === "expired") redirect(shopUrl(`/account/refresh?to=${encodeURIComponent(here)}`));
  if (session === "none") redirect(shopUrl(`/account/signin?to=${encodeURIComponent(here)}`));
  const order = await getOrder(session, ref);
  if (order === "missing") notFound();

  return (
    <section className="gl-section shop-page" aria-labelledby="order-title">
      <div className="gl-container gx-stack" style={{ justifyItems: "stretch", gap: "var(--space-6)" }}>
        <a className="gx-more" href={shopUrl("/account?tab=orders")}>
          All orders
        </a>
        {!order ? (
          <p className="gl-notice">We could not load this order from the store just now. Please refresh the page in a moment.</p>
        ) : (
          <>
            <header className="gx-stack">
              <p className="gx-label">Placed {day(order.processedAt)}</p>
              <h1 id="order-title" className="gx-display">
                Order {order.name}
              </h1>
              <p className="gx-lead">{[words(order.fulfilment), words(order.payment)].filter(Boolean).join(" · ")}</p>
            </header>

            <div className="gx-grid">
              <div className="gx-col-7 gx-stack" style={{ justifyItems: "stretch", gap: "var(--space-5)" }}>
                <h2 className="gx-title">Where it is</h2>
                {order.shipments === null ? (
                  <p className="gl-notice">Tracking could not be read just now.</p>
                ) : order.shipments.length === 0 ? (
                  <div className="gx-acct__card">
                    <p className="gx-acct__cardTitle">Not dispatched yet</p>
                    <p className="gl-small">Tracking appears here as soon as your parcel leaves us.</p>
                  </div>
                ) : (
                  order.shipments.map((s, i) => (
                    <div key={i} className="gx-acct__card">
                      <div className="gx-acct__cardHead">
                        <p className="gx-acct__cardTitle">{order.shipments && order.shipments.length > 1 ? `Parcel ${i + 1}` : "Your parcel"}</p>
                        <p className="gx-acct__cardMeta">{words(s.shipment) ?? words(s.status) ?? "Dispatched"}</p>
                      </div>
                      {s.expected ? <p className="gl-small">Expected {day(s.expected)}</p> : null}
                      {s.tracking.length ? (
                        <ul className="gx-acct__lines" role="list">
                          {s.tracking.map((t, k) => (
                            <li key={k}>
                              {[t.company, t.number].filter(Boolean).join(" · ") || "Tracking"}
                              {t.url ? (
                                <>
                                  {" "}
                                  <a className="gl-link" href={t.url} target="_blank" rel="noopener">
                                    Track with the carrier
                                  </a>
                                </>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="gl-small">No tracking number has been added for this parcel yet.</p>
                      )}
                      {s.events.length ? (
                        <ol className="gx-track">
                          {s.events.map((e, k) => (
                            <li key={k}>
                              <span>{words(e.status)}</span>
                              <span className="gl-small">{day(e.at, true)}</span>
                            </li>
                          ))}
                        </ol>
                      ) : null}
                    </div>
                  ))
                )}
                {order.statusUrl ? (
                  <a className="gx-more" href={order.statusUrl}>
                    Open the store&rsquo;s order page <Icon name="arrow" size={18} />
                  </a>
                ) : null}
              </div>

              <div className="gx-col-5 gx-stack" style={{ justifyItems: "stretch", gap: "var(--space-5)" }}>
                <h2 className="gx-title">In this order</h2>
                <div className="gx-acct__card">
                  <ul className="gx-acct__lines" role="list">
                    {order.lines.map((l, i) => (
                      <li key={i}>
                        {l.title} <span className="gl-small">× {l.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <dl className="gx-acct__sums">
                    {order.subtotal ? (
                      <div>
                        <dt>Subtotal</dt>
                        <dd>{money(order.subtotal)}</dd>
                      </div>
                    ) : null}
                    {order.shipping ? (
                      <div>
                        <dt>Delivery</dt>
                        <dd>{money(order.shipping)}</dd>
                      </div>
                    ) : null}
                    {order.tax ? (
                      <div>
                        <dt>Tax</dt>
                        <dd>{money(order.tax)}</dd>
                      </div>
                    ) : null}
                    <div className="gx-acct__sumTotal">
                      <dt>Total</dt>
                      <dd>{money(order.total)}</dd>
                    </div>
                  </dl>
                </div>
                {order.shipTo ? (
                  <div className="gx-acct__card">
                    <p className="gx-label">Delivering to</p>
                    <address className="gx-acct__address">
                      {order.shipTo.map((l, i) => (
                        <span key={i}>{l}</span>
                      ))}
                    </address>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
