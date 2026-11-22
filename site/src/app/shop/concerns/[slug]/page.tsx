import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreDown } from "@/components/shop/ProductCard";
import { Icon } from "@/components/shop/ui/Icon";
import { ProductRow } from "@/components/shop/ui/ProductRow";
import { concernBySlug, concerns, matchConcern } from "@/lib/shop/concerns";
import { getCollectionProducts, getProducts } from "@/lib/shop/data";
import { shopUrl } from "@/lib/site";

export function generateStaticParams() {
  return concerns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/concerns/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const concern = concernBySlug(slug);
  return { title: concern ? `${concern.name}: shop by concern` : "Shop by concern", alternates: { canonical: shopUrl(`/concerns/${slug}`) } };
}

export default async function ConcernPage({ params }: PageProps<"/shop/concerns/[slug]">) {
  const { slug } = await params;
  const concern = concernBySlug(slug);
  if (!concern) notFound();
  const [products, combos] = await Promise.all([getProducts(), getCollectionProducts("gloveda-combo")]);
  if (!products)
    return (
      <section className="gl-section shop-page">
        <div className="gl-container">
          <StoreDown />
        </div>
      </section>
    );
  const comboIds = new Set((combos ?? []).map((p) => p.id));
  const matches = matchConcern(concern, products);
  const singles = matches.filter((m) => !comboIds.has(m.product.id));
  const sets = matches.filter((m) => comboIds.has(m.product.id));

  return (
    <section className="gl-section shop-page" aria-labelledby="concern-title">
      <div className="gl-container gx-grid">
        <header className="gx-col-4 gx-stack gx-sticky">
          <a className="gx-more" href={shopUrl("/concerns")}>
            All concerns
          </a>
          <p className="gx-label">{concern.area}</p>
          <h1 id="concern-title" className="gx-display">
            {concern.name}
          </h1>
          <p className="gx-lead">
            {matches.length} {matches.length === 1 ? "product speaks" : "products speak"} to this in Gloveda Herbals&rsquo; own description. The line under each is quoted from it.
          </p>
        </header>
        <div className="gx-col-8 gx-stack" style={{ justifyItems: "stretch", gap: "var(--space-8)" }}>
          {singles.length ? (
            <ul className="gx-list" role="list">
              {singles.map((m) => (
                <ProductRow key={m.product.id} product={m.product} note={`“${m.quote}”`} />
              ))}
            </ul>
          ) : null}
          {sets.length ? (
            <div className="gx-stack" style={{ justifyItems: "stretch" }}>
              <h2 className="gx-label">Sets that include it</h2>
              <ul className="gx-list" role="list">
                {sets.map((m) => (
                  <ProductRow key={m.product.id} product={m.product} note={`“${m.quote}”`} />
                ))}
              </ul>
            </div>
          ) : null}
          {!matches.length ? <p className="gl-body">No product description mentions this right now.</p> : null}
          <a className="gx-more" href={shopUrl("/collections/all")}>
            See the whole range <Icon name="arrow" size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
