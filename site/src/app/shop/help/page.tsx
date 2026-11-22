import type { Metadata } from "next";
import { ContactForm } from "@/components/shop/ContactForm";
import { HelpCentre } from "@/components/shop/HelpCentre";
import { Icon } from "@/components/shop/ui/Icon";
import { HELP_CONFIRM, helpTopics } from "@/content/help";
import { COMPANY, policies } from "@/content/policies";
import { shopUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Help",
  description: "Answers about orders, payment, delivery, returns and refunds, and how to reach Gloveda Herbals.",
  alternates: { canonical: shopUrl("/help") },
};

export default function HelpPage() {
  const groups = helpTopics.map((t) => ({ ...t, items: t.items.map((it) => ({ ...it, link: it.link ? { label: it.link.label, href: shopUrl(it.link.href) } : undefined })) }));
  const showOpenItems = process.env.NODE_ENV !== "production";
  // The same questions and answers as on the page, for search engines.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: helpTopics.flatMap((t) => t.items.map((it) => ({ "@type": "Question", name: it.q, acceptedAnswer: { "@type": "Answer", text: it.a.join(" ") } }))),
  };
  const tel = `tel:${COMPANY.phone.replace(/[^+\d]/g, "")}`;

  return (
    <>
      <section className="gx-band shop-page gx-helpTop" aria-labelledby="help-title">
        <div className="gl-container gl-container--narrow">
          <p className="gx-label">Help</p>
          <h1 id="help-title" className="gx-display">
            How can we help?
          </h1>
          {showOpenItems ? (
            <aside className="gl-notice policy__open" aria-label="To confirm before launch">
              <div>
                <p className="policy__openTitle">To confirm before launch (not shown to customers):</p>
                <ul>
                  {HELP_CONFIRM.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </aside>
          ) : null}
          <HelpCentre groups={groups} />
        </div>
      </section>

      <section id="contact" className="gx-band gx-band--sand" aria-labelledby="contact-title">
        <div className="gl-container gx-grid">
          <div className="gx-col-5 gx-stack">
            <p className="gx-label">Still need us?</p>
            <h2 id="contact-title" className="gx-display gx-pdp__h">
              Write or call
            </h2>
            <p className="gx-lead">For an order, include your order ID so we can help faster. We aim to reply within 24 to 48 working hours.</p>
            <ul className="gx-help__ways" role="list">
              <li>
                <a href={`mailto:${COMPANY.email}`}>
                  <span className="gx-label">Email</span>
                  <span>{COMPANY.email}</span>
                </a>
              </li>
              <li>
                <a href={tel}>
                  <span className="gx-label">Phone</span>
                  <span>{COMPANY.phone}</span>
                </a>
              </li>
              <li>
                <span className="gx-label">Address</span>
                <span>
                  {COMPANY.name}, {COMPANY.registeredOffice}
                </span>
              </li>
            </ul>
          </div>
          <div className="gx-col-7">
            <ContactForm email={COMPANY.email} />
          </div>
        </div>
      </section>

      <section className="gx-band" aria-labelledby="policies-title">
        <div className="gl-container">
          <h2 id="policies-title" className="gx-title">
            The full policies
          </h2>
          <ul className="gx-help__policies" role="list">
            {policies.map((p) => (
              <li key={p.handle}>
                <a className="gx-help__policy" href={shopUrl(`/policies/${p.handle}`)}>
                  <span className="gx-help__topicTitle">{p.title}</span>
                  <span className="gx-help__topicBlurb">{p.summary}</span>
                  <Icon name="arrow" size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
