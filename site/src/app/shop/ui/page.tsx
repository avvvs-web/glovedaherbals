import type { Metadata } from "next";
import { StoreDown } from "@/components/shop/ProductCard";
import { Accordion } from "@/components/shop/ui/Accordion";
import { AddButton } from "@/components/shop/ui/AddButton";
import { EmptyState } from "@/components/shop/ui/EmptyState";
import { Heart } from "@/components/shop/ui/Heart";
import { Icon, type IconName } from "@/components/shop/ui/Icon";
import { KitDemo } from "@/components/shop/ui/KitDemo";
import { Plate } from "@/components/shop/ui/Plate";
import { ProductRow } from "@/components/shop/ui/ProductRow";
import { formatMoney, getCollectionProducts, getProducts } from "@/lib/shop/data";
import { collections, shopUrl } from "@/lib/site";

export const metadata: Metadata = { title: "Shop style sheet", robots: { index: false, follow: false } };

const icons: IconName[] = ["search", "account", "bag", "heart", "arrow", "plus", "minus", "check", "chevron", "close"];
const swatches = [
  ["Ivory", "var(--gl-ivory)", "var(--gl-ink)"],
  ["Sand", "var(--gl-sand)", "var(--gl-ink)"],
  ["Wine", "var(--gl-wine)", "var(--gl-ivory)"],
  ["Plum", "var(--gl-plum)", "var(--gl-ivory)"],
  ["Gold", "var(--gl-gold)", "var(--gl-ink)"],
  ["Terracotta", "var(--gl-terracotta)", "var(--gl-ivory)"],
];

/**
 * The shop's style sheet: every building block of the redesigned store on one page, on live catalogue
 * data, for sign-off before the pages are rebuilt. Not linked from the site and not indexed.
 */
export default async function ShopStyleSheet() {
  const [all, best] = await Promise.all([getProducts(), getCollectionProducts("best-sellers")]);
  if (!all)
    return (
      <section className="gl-section">
        <div className="gl-container">
          <StoreDown />
        </div>
      </section>
    );
  const cards = (best?.length ? best : all).slice(0, 4);
  const rows = all.filter((p) => !cards.includes(p)).slice(0, 5);
  const sample = cards[0];
  const sampleVariant = sample.variants.find((v) => v.available) ?? sample.variants[0];

  return (
    <div className="gl-container" style={{ paddingBlock: "var(--space-9)" }}>
      <header className="gx-stack" style={{ paddingBottom: "var(--space-8)" }}>
        <p className="gx-label">Shop style sheet</p>
        <h1 className="gx-display">Luxe, elegant, minimal, affordable.</h1>
        <p className="gx-lead">Every building block of the new store, on live products. Hover, tap and type: each piece answers back.</p>
      </header>

      <section className="gx-kit__section" aria-labelledby="kit-type">
        <h2 id="kit-type" className="gx-label">
          Type and colour
        </h2>
        <div className="gx-grid">
          <div className="gx-col-7 gx-stack">
            <p className="gx-display">Your ritual, bottled.</p>
            <p className="gx-title">Seven essentials for face, hair and body</p>
            <p className="gx-lead">One typeface and one weight. Size and space do the work that bold usually does.</p>
            <a className="gx-more" href={shopUrl("/collections/all")}>
              See the range <Icon name="arrow" size={18} />
            </a>
          </div>
          <div className="gx-col-5">
            <div className="gx-kit__swatches">
              {swatches.map(([name, bg, fg]) => (
                <div key={name} className="gx-kit__swatch" style={{ background: bg, color: fg }}>
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="gx-kit__section" aria-labelledby="kit-plates">
        <h2 id="kit-plates" className="gx-label">
          Product plates: one crop for every photo, price beside the name
        </h2>
        <ul className="gx-kit__cards" role="list">
          {cards.map((p, i) => (
            <li key={p.id} className="gx-card">
              <Plate images={p.images} priority={i < 4} />
              <div className="gx-card__actions">
                <Heart handle={p.handle} title={p.title} />
              </div>
              <div className="gx-card__meta">
                <h3 className="gx-card__name">
                  <a className="gx-card__link" href={shopUrl(`/products/${p.handle}`)}>
                    {p.title}
                  </a>
                </h3>
                <p className="gx-card__price">{p.available ? formatMoney(p.price) : "Sold out"}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="gx-kit__section" aria-labelledby="kit-rows">
        <h2 id="kit-rows" className="gx-label">
          List rows: the range as an index, add without leaving the list
        </h2>
        <ul className="gx-list" role="list">
          {rows.map((p) => (
            <ProductRow key={p.id} product={p} />
          ))}
        </ul>
      </section>

      <section className="gx-kit__section" aria-labelledby="kit-actions">
        <h2 id="kit-actions" className="gx-label">
          Buttons and the add-to-bag response
        </h2>
        <div className="gx-kit__row">
          <AddButton variantId={sampleVariant.id} available={sample.available} title={sample.title} />
          <a className="gl-btn gl-btn--secondary" href={shopUrl("/rituals")}>
            Explore rituals
          </a>
          <a className="gx-more" href={shopUrl("/collections/all")}>
            See the range <Icon name="arrow" size={18} />
          </a>
        </div>
      </section>

      <section className="gx-kit__section" aria-labelledby="kit-react">
        <h2 id="kit-react" className="gx-label">
          Components that react
        </h2>
        <KitDemo name={sample.title} price={sampleVariant.price} currency={process.env.SHOPIFY_CURRENCY ?? "INR"} ranges={collections.map((c) => c.name)} />
      </section>

      <section className="gx-kit__section" aria-labelledby="kit-acc">
        <h2 id="kit-acc" className="gx-label">
          Accordion: product details fold away
        </h2>
        <div className="gx-grid">
          <div className="gx-col-7">
            <Accordion
              items={[
                { title: "About this product", body: <p>The product&rsquo;s own description from the store appears here, in full.</p> },
                { title: "Delivery and returns", body: <p>Taken from the shop&rsquo;s shipping and returns policies on the real page.</p> },
                { title: "Ingredients", body: <p>Shown once Gloveda supplies the ingredient list for each product.</p> },
              ]}
            />
          </div>
          <div className="gx-col-5">
            <p className="gx-label" style={{ marginBottom: "var(--space-4)" }}>
              Icons
            </p>
            <div className="gx-kit__icons">
              {icons.map((n) => (
                <Icon key={n} name={n} size={24} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="gx-kit__section" aria-labelledby="kit-empty">
        <h2 id="kit-empty" className="gx-label">
          Empty state: the film&rsquo;s gold keyline
        </h2>
        <EmptyState title="Your bag is empty">
          <a className="gl-btn" href={shopUrl("/collections/all")}>
            See the range
          </a>
        </EmptyState>
      </section>
    </div>
  );
}
