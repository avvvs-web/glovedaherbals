import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { CompleteRitual, type RitualItem } from "@/components/shop/CompleteRitual";
import { BuyBar } from "@/components/shop/pdp/BuyBar";
import { BuyNow, NotifyMe, ViewItem } from "@/components/shop/pdp/BuyNow";
import { ReadMore } from "@/components/shop/pdp/ReadMore";
import { Reviews } from "@/components/shop/pdp/Reviews";
import { RecentlyViewed } from "@/components/shop/pdp/RecentlyViewed";
import { StoreDown } from "@/components/shop/ProductCard";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { AddButton } from "@/components/shop/ui/AddButton";
import { Heart } from "@/components/shop/ui/Heart";
import { Icon } from "@/components/shop/ui/Icon";
import { ProductRow } from "@/components/shop/ui/ProductRow";
import { Stars } from "@/components/shop/ui/Stars";
import { concerns, matchConcern } from "@/lib/shop/concerns";
import { CHECKOUT_BASE, formatMoney, getCollectionProducts, getProduct, getProducts, type ShopProduct } from "@/lib/shop/data";
import { describe } from "@/lib/shop/describe";
import { getRating, LOOX_ID, LOOX_SHOP, REVIEWS_HOST } from "@/lib/shop/reviews";
import { abs, breadcrumbs, JsonLd, ORG_ID } from "@/lib/seo";
import { collections, shopUrl } from "@/lib/site";

/** The approved brand statements, and nothing else: no delivery, returns or results promises are made here. */
const TRUST = [
  { title: "Formulated by doctors", text: "Every formula comes from Ayurvedic doctors." },
  { title: "Made in house", text: "In small batches, under our own roof." },
  { title: "Since 1921", text: "The heritage of Arya Vaidya Vilasini Vaidya Sala." },
  { title: "Traditional formulas", text: "Refined over generations." },
];

/**
 * Where this product sits in the store: its range (Face, Hair or Body Care, or the sets), and other
 * products from the same range in the store's own order. Sets are not offered more products: they
 * already contain several. Nothing is paired by hand.
 */
async function placeOf(product: ShopProduct): Promise<{ range: { name: string; href: string } | null; others: ShopProduct[] }> {
  const [combos, ...ranges] = await Promise.all([getCollectionProducts("gloveda-combo"), ...collections.map((c) => getCollectionProducts(c.path.split("/").pop() as string))]);
  const comboIds = new Set((combos ?? []).map((p) => p.id));
  if (comboIds.has(product.id)) return { range: { name: "Sets", href: shopUrl("/collections/gloveda-combo") }, others: [] };
  for (let i = 0; i < ranges.length; i++) {
    const list = ranges[i];
    if (!list?.some((p) => p.id === product.id)) continue;
    return { range: { name: collections[i].name, href: shopUrl(collections[i].path) }, others: list.filter((p) => p.id !== product.id && p.available && !comboIds.has(p.id)).slice(0, 3) };
  }
  return { range: null, others: [] };
}
const toItem = (p: ShopProduct): RitualItem => {
  const v = p.variants.find((x) => x.available) ?? p.variants[0];
  return { variantId: v.id, title: p.title, href: shopUrl(`/products/${p.handle}`), price: v.price, image: p.images[0]?.src };
};
/** "Gloveda Clear Face Cream (Night Cream)" in a set's contents -> the product with that handle, if the store has one. */
const slug = (name: string) =>
  name
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/moisturiser/g, "moisturizer")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export async function generateMetadata({ params }: PageProps<"/shop/products/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Page not found", robots: { index: false } };
  const d = describe(product.description);
  return {
    title: product.title,
    description: (d.about || product.description[0] || "").slice(0, 155) || undefined,
    alternates: { canonical: shopUrl(`/products/${handle}`) },
    openGraph: {
      title: product.title,
      description: (d.about || product.description[0] || "").slice(0, 200) || undefined,
      url: shopUrl(`/products/${handle}`),
      images: product.images[0] ? [{ url: product.images[0].src, alt: product.title }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/shop/products/[handle]">) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (product === undefined) notFound();
  if (product === null)
    return (
      <section className="gl-section shop-page">
        <div className="gl-container">
          <StoreDown />
        </div>
      </section>
    );
  const variant = product.variants.find((v) => v.available) ?? product.variants[0];
  const [place, all, rating] = await Promise.all([placeOf(product), getProducts(), getRating(product.id)]);
  const reviewsLabel = rating ? `${rating.count} ${rating.count === 1 ? "review" : "reviews"}` : "";
  const d = describe(product.description);
  const price = formatMoney(variant.price);
  const currency = process.env.SHOPIFY_CURRENCY ?? "INR";
  // Concerns this product's own description speaks to (the same rule as the Shop by concern pages).
  const speaksTo = concerns.filter((c) => matchConcern(c, [product]).length > 0);
  // A set's contents, linked to the products themselves where the store sells them singly.
  const contents = d.included.map((name) => {
    const s = slug(name);
    return { name, product: (all ?? []).find((p) => p.id !== product.id && (p.handle === s || p.handle === `gloveda-${s}` || `gloveda-${p.handle}` === s)) };
  });
  const catalog = (all ?? []).map((p) => ({ handle: p.handle, title: p.title, href: shopUrl(`/products/${p.handle}`), price: p.available ? formatMoney(p.price) : "Sold out", image: p.images[0]?.src }));
  // Product structured data: every value comes from the store's own catalogue.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${abs(shopUrl(`/products/${handle}`))}#product`,
    name: product.title,
    sku: String(variant.id),
    url: abs(shopUrl(`/products/${handle}`)),
    ...(place.range ? { category: place.range.name } : {}),
    image: product.images.map((i) => i.src),
    description: d.about || product.description[0],
    brand: { "@type": "Brand", name: "Gloveda Herbals" },
    // Only when the store has reviews for this product, and with the store's own numbers.
    ...(rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: rating.average.toFixed(1), reviewCount: rating.count } } : {}),
    offers: {
      "@type": "Offer",
      url: abs(shopUrl(`/products/${handle}`)),
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": ORG_ID },
      priceCurrency: process.env.SHOPIFY_CURRENCY ?? "INR",
      price: variant.price.toFixed(2),
      availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <article className="shop-page gx-pdp" aria-labelledby="product-title">
      <div className="gl-container pdp__grid gx-pdp__top">
        <ProductGallery images={product.images} title={product.title} transitionName={`product-${product.handle}`} />
        <div className="pdp__info gx-pdp__info">
          <nav aria-label="Breadcrumb" className="gx-pdp__crumbs">
            <a href={shopUrl("/")}>Shop</a>
            {place.range ? (
              <>
                <span aria-hidden="true">/</span>
                <a href={place.range.href}>{place.range.name}</a>
              </>
            ) : null}
          </nav>
          <h1 id="product-title" className="gx-pdp__title">
            {product.title}
          </h1>
          {rating ? (
            <a className="gx-pdp__rating" href="#reviews" aria-label={`Rated ${rating.average.toFixed(1)} out of 5 from ${reviewsLabel}. Read the reviews.`}>
              <Stars value={rating.average} />
              <span>{rating.average.toFixed(1)}</span>
              <span className="gx-pdp__ratingCount">{reviewsLabel}</span>
            </a>
          ) : null}
          {d.lede ? <p className="gx-pdp__lede">{d.lede}</p> : null}
          <p className="gx-pdp__priceRow">
            <span className="gx-pdp__price" data-price>{price}</span>
            <span className="gx-pdp__stock" data-in={product.available}>
              {product.available ? "In stock" : "Sold out"}
            </span>
          </p>
          {d.about ? <ReadMore text={d.about} /> : null}
          <div className="gx-pdp__buy" id="pdp-buy">
            <AddButton variantId={variant.id} available={product.available} title={product.title} />
            <Heart handle={product.handle} title={product.title} />
          </div>
          <div className="pdp-buy2">
            {product.available ? (
              <BuyNow checkoutBase={CHECKOUT_BASE} variantId={variant.id} title={product.title} price={variant.price} currency={currency} />
            ) : (
              <NotifyMe title={product.title} />
            )}
          </div>
          <ul className="gx-pdp__trust" role="list">
            {TRUST.map((t) => (
              <li key={t.title}>
                <Icon name="check" size={18} />
                <span>
                  <span className="gx-pdp__trustTitle">{t.title}</span>
                  <span className="gx-pdp__trustText">{t.text}</span>
                </span>
              </li>
            ))}
          </ul>
          {product.available && place.others.length ? (
            <CompleteRitual current={toItem(product)} others={place.others.map(toItem)} range={place.range?.name ?? "the range"} currency={process.env.SHOPIFY_CURRENCY ?? "INR"} />
          ) : null}
        </div>
      </div>

      {d.helps.length || d.madeFor.length ? (
        <section className="gx-band gx-band--sand" aria-labelledby="helps-title">
          <div className="gl-container gx-grid">
            <Reveal className="gx-col-5 gx-stack">
              <p className="gx-label">{d.helps.length ? "What it does" : "Who it is for"}</p>
              <h2 id="helps-title" className="gx-display gx-pdp__h">
                {d.helps.length ? "What it helps with" : "Made for"}
              </h2>
              {speaksTo.length ? (
                <div className="gx-pdp__concerns">
                  <p className="gl-small">More for the same concern</p>
                  <ul role="list">
                    {speaksTo.map((c) => (
                      <li key={c.slug}>
                        <a className="gl-chip" href={shopUrl(`/concerns/${c.slug}`)}>
                          {c.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </Reveal>
            <div className="gx-col-7">
              {d.helps.length ? (
                <ol className="gx-pdp__helps" role="list">
                  {d.helps.map((h, i) => (
                    <li key={h}>
                      <Reveal delay={i * 0.05} className="gx-pdp__help">
                        <span className="gx-pdp__num" aria-hidden="true">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{h}</span>
                      </Reveal>
                    </li>
                  ))}
                </ol>
              ) : null}
              {d.madeFor.length ? (
                <Reveal className="gx-pdp__for">
                  {d.helps.length ? <h3 className="gx-label">Made for</h3> : null}
                  <ul role="list">
                    {d.madeFor.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </Reveal>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {contents.length || d.works.length ? (
        <section className="gx-band" aria-labelledby="set-title">
          <div className="gl-container gx-grid">
            {contents.length ? (
              <Reveal className="gx-col-6 gx-stack gx-pdp__set">
                <p className="gx-label">{contents.length} products</p>
                <h2 id="set-title" className="gx-title">
                  In this set
                </h2>
                <ul className="gx-list" role="list">
                  {contents.map((c) => (c.product ? <ProductRow key={c.name} product={c.product} /> : <li key={c.name} className="gx-pdp__plain">{c.name}</li>))}
                </ul>
              </Reveal>
            ) : null}
            {d.works.length ? (
              <Reveal className="gx-col-6 gx-stack gx-pdp__set" delay={0.08}>
                <p className="gx-label">Step by step</p>
                <h2 id={contents.length ? undefined : "set-title"} className="gx-title">
                  How it works together
                </h2>
                <dl className="gx-pdp__works">
                  {d.works.map((w) => (
                    <div key={w.label ?? w.text}>
                      {w.label ? <dt>{w.label}</dt> : null}
                      <dd>{w.text}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ) : null}
          </div>
        </section>
      ) : null}

      {d.steps.length ? (
        <section className="gx-band gx-band--wine theme-wine gx-pdp__use" aria-labelledby="use-title">
          <div className="gl-container">
            <Reveal className="gx-stack">
              <p className="gx-label">The ritual</p>
              <h2 id="use-title" className="gx-display gx-pdp__h">
                How to use
              </h2>
            </Reveal>
            <ol className="gx-pdp__steps" role="list" data-count={Math.min(d.steps.length, 4)}>
              {d.steps.map((s, i) => (
                <li key={s}>
                  <Reveal delay={i * 0.07} className="gx-pdp__step">
                    <span className="gx-pdp__stepNum" aria-hidden="true">
                      {i + 1}
                    </span>
                    <p>{s}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {d.closing ? (
        <section className="gx-band gx-pdp__closing">
          <Reveal className="gl-container gl-container--narrow">
            <hr className="gl-rule gl-rule--ornament" />
            <p className="gx-title">{d.closing}</p>
            <div className="gx-pdp__closingBuy">
              <span className="gx-pdp__price" data-price>{price}</span>
              <AddButton variantId={variant.id} available={product.available} title={product.title} />
            </div>
          </Reveal>
        </section>
      ) : null}

      <section id="reviews" className="gx-band gx-band--sand gx-reviews" aria-labelledby="reviews-title">
        <div className="gl-container">
          <div className="gx-reviews__head">
            <div className="gx-stack">
              <p className="gx-label">From customers</p>
              <h2 id="reviews-title" className="gx-display gx-pdp__h">
                Reviews
              </h2>
            </div>
            {rating ? (
              <p className="gx-reviews__score">
                <span className="gx-reviews__avg">{rating.average.toFixed(1)}</span>
                <span className="gx-reviews__of">
                  <Stars value={rating.average} size={20} />
                  <span>{reviewsLabel}</span>
                </span>
              </p>
            ) : null}
          </div>
          <Reviews productId={product.id} looxId={LOOX_ID} shop={LOOX_SHOP} allowed={REVIEWS_HOST} />
        </div>
      </section>

      <RecentlyViewed current={product.handle} catalog={catalog} />
      <ViewItem variantId={variant.id} title={product.title} price={variant.price} currency={currency} category={place.range?.name} />
      <BuyBar watch="pdp-buy" variantId={variant.id} available={product.available} title={product.title} price={price} />
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbs([["Shop", shopUrl("/")], ...(place.range ? [[place.range.name, place.range.href] as [string, string]] : []), [product.title, shopUrl(`/products/${handle}`)]])} />
    </article>
  );
}
