import type { Metadata } from "next";
import Image from "next/image";
import { AddToCart } from "@/components/shop/Cart";
import { StoreDown } from "@/components/shop/ProductCard";
import { RitualBuilder, type BuilderGroup } from "@/components/shop/RitualBuilder";
import { formatMoney, getCollectionProducts } from "@/lib/shop/data";
import { shopUrl } from "@/lib/site";
import { Price } from "@/components/shop/ui/Price";

export const metadata: Metadata = {
  title: "Rituals",
  description: "Ready-made Gloveda Herbals rituals, or build your own from face, hair and body care.",
  alternates: { canonical: shopUrl("/rituals") },
};

const CATEGORIES = [
  { id: "skin-care", title: "Face Care" },
  { id: "hair-care", title: "Hair Care" },
  { id: "body-care", title: "Body Care" },
];

export default async function RitualsPage() {
  const [combos, ...categories] = await Promise.all([getCollectionProducts("gloveda-combo"), ...CATEGORIES.map((c) => getCollectionProducts(c.id))]);
  const groups: BuilderGroup[] = CATEGORIES.map((c, i) => ({
    id: c.id,
    title: c.title,
    options: (categories[i] ?? []).map((p) => {
      const v = p.variants.find((x) => x.available) ?? p.variants[0];
      return { variantId: v.id, title: p.title, price: v.price, priceText: formatMoney(v.price), available: p.available, image: p.images[0]?.src };
    }),
  })).filter((g) => g.options.length);

  return (
    <>
      <section className="gl-section shop-page" aria-labelledby="rituals-title">
        <div className="gl-container">
          <h1 id="rituals-title" className="gl-h1 shop-page__title">
            Rituals
          </h1>
          <p className="gl-lead rituals__lead">Sets put together by Gloveda Herbals, ready to begin.</p>
          {combos ? (
            <ul className="rituals" role="list">
              {combos.map((p, i) => {
                const img = p.images[0];
                const v = p.variants.find((x) => x.available) ?? p.variants[0];
                return (
                  <li key={p.id} className="ritual">
                    <div className="ritual__media">
                      {img ? <Image src={img.src} alt="" width={img.width} height={img.height} sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 45vw, 100vw" priority={i < 3} /> : null}
                    </div>
                    <h2 className="ritual__title">
                      <a href={shopUrl(`/products/${p.handle}`)}>{p.title}</a>
                    </h2>
                    {p.description[0] ? <p className="gl-body ritual__about">{p.description[0]}</p> : null}
                    <p className="ritual__price"><Price>{p.available ? formatMoney(p.price) : `${formatMoney(p.price)}, sold out`}</Price></p>
                    <AddToCart variantId={v.id} available={p.available} label="Add ritual to cart" small />
                  </li>
                );
              })}
            </ul>
          ) : (
            <StoreDown />
          )}
        </div>
      </section>

      {groups.length ? (
        <section id="build" className="gl-section builder-section" aria-labelledby="build-title">
          <div className="gl-container">
            <h2 id="build-title" className="gl-h2 section-title">
              Build your own ritual
            </h2>
            <RitualBuilder groups={groups} currency={process.env.SHOPIFY_CURRENCY ?? "INR"} />
          </div>
        </section>
      ) : null}
    </>
  );
}
