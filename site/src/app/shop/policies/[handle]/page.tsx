import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { policies, policyByHandle } from "@/content/policies";
import { shopUrl } from "@/lib/site";

export const generateStaticParams = () => policies.map((p) => ({ handle: p.handle }));

export async function generateMetadata({ params }: PageProps<"/shop/policies/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const policy = policyByHandle(handle);
  if (!policy) return { title: "Policy" };
  return { title: policy.title, description: policy.summary, alternates: { canonical: shopUrl(`/policies/${handle}`) } };
}

export default async function PolicyPage({ params }: PageProps<"/shop/policies/[handle]">) {
  const { handle } = await params;
  const policy = policyByHandle(handle);
  if (!policy) notFound();
  // Open questions for the brand are shown while building the site, never to customers.
  const showOpenItems = process.env.NODE_ENV !== "production";

  return (
    <article className="gl-section shop-page policy" aria-labelledby="policy-title">
      <div className="gl-container policy__grid">
        <nav aria-label="Policies" className="policy__nav">
          <ul role="list">
            {policies.map((p) => (
              <li key={p.handle}>
                <a className="policy__navLink" aria-current={p.handle === handle ? "page" : undefined} href={shopUrl(`/policies/${p.handle}`)}>
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="policy__body">
          <h1 id="policy-title" className="gl-h1">
            {policy.title}
          </h1>
          <p className="gl-small policy__date">Last updated {policy.updated}</p>
          <p className="gl-lead policy__summary">{policy.summary}</p>
          {showOpenItems && policy.confirm.length ? (
            <aside className="gl-notice policy__open" aria-label="To confirm before launch">
              <div>
                <p className="policy__openTitle">Draft. To confirm before launch (not shown to customers):</p>
                <ul>
                  {policy.confirm.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </aside>
          ) : null}
          {policy.sections.map((s) => (
            <section key={s.heading} className="policy__section">
              <h2 className="policy__head">{s.heading}</h2>
              {s.body?.map((b) => (
                <p key={b} className="gl-body">
                  {b}
                </p>
              ))}
              {s.list ? (
                <ul className="policy__list">
                  {s.list.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
