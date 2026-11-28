import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { BestSellerHero } from "@/components/shop/BestSellerHero";
import { ConcernLinks } from "@/components/shop/ConcernLinks";
import { RangeDoors } from "@/components/shop/RangeDoors";
import { StoreDown } from "@/components/shop/ProductCard";
import { Icon } from "@/components/shop/ui/Icon";
import { ProductRow } from "@/components/shop/ui/ProductRow";
import { formatMoney, getCollectionProducts, getProducts } from "@/lib/shop/data";
import { shopUrl, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Shop Gloveda Herbals | Ayurvedic Skincare & Hair Care" },
  description: "Shop Gloveda Herbals' doctor-formulated Ayurvedic face, hair and body care, best sellers, and combos for gifting.",
  alternates: { canonical: shopUrl("/") },
};

/** The brand's approved statements (client, 2026-11-22). */
const PROMISES = [
  { title: "Formulated by doctors", body: "Every formula comes from Ayurvedic doctors." },
  { title: "Made in house", body: "Small batches, made under our own roof." },
  { title: "105 years of heritage", body: "From Arya Vaidya Vilasini Vaidya Sala, established in 1921." },
];
const UNDER = 500;

export default async function ShopHome() {
  const [all, best, combos] = await Promise.all([getProducts(), getCollectionProducts("best-sellers"), getCollectionProducts("gloveda-combo")]);
  if (!all)
    return (
      <section className="gl-section shop-page">
        <div className="gl-container">
          <StoreDown />
        </div>
      </section>
    );
  const comboIds = new Set((combos ?? []).map((p) => p.id));
  const heroProducts = (best?.length ? best : all).filter((p) => p.available).slice(0, 4);
  const affordable = all.filter((p) => p.available && p.price < UNDER && !comboIds.has(p.id)).sort((a, b) => a.price - b.price);
  const ritualImage = combos?.[0]?.images[0];

  return (
    <>
      <section className="gx-hero theme-wine" aria-labelledby="shop-title">
        {/* The banner carousel was taken off this page (client, 2026-11-24). BannerHero and getBanners remain, unused. */}
        <div className="gl-container gx-hero__grid">
          <div className="gx-hero__text">
            <p className="gx-label">The Gloveda Herbals shop</p>
            <h1 id="shop-title" className="gx-display">
              Everyday rituals for face, hair and body.
            </h1>
            <p className="gx-lead">Formulated by Ayurvedic doctors. Made in small batches, under our own roof.</p>
            <div className="gx-hero__actions">
              <a className="gl-btn" href={shopUrl("/collections/all")}>
                See the range
              </a>
              <a className="gx-more" href={shopUrl("/concerns")}>
                Shop by concern <Icon name="arrow" size={18} />
              </a>
            </div>
          </div>
          <BestSellerHero
            products={heroProducts.map((p) => {
              const v = p.variants.find((x) => x.available) ?? p.variants[0];
              return { handle: p.handle, title: p.title, href: shopUrl(`/products/${p.handle}`), priceText: formatMoney(v.price), variantId: v.id, available: p.available, image: p.images[0] };
            })}
          />
        </div>
      </section>

      <section className="gx-promises" aria-label="What Gloveda Herbals stands for">
        <ul className="gl-container gx-promises__list" role="list">
          {PROMISES.map((p) => (
            <li key={p.title}>
              <h2 className="gx-promises__title">{p.title}</h2>
              <p className="gl-small">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="gx-band" aria-labelledby="ranges-title">
        <div className="gl-container">
          <Reveal className="gx-head">
            <p className="gx-label">The range</p>
            <h2 id="ranges-title" className="gx-display">
              Three ways to begin.
            </h2>
          </Reveal>
          <RangeDoors />
        </div>
      </section>

      <section className="gx-band gx-band--sand" aria-labelledby="concern-title">
        <div className="gl-container gx-grid">
          <Reveal className="gx-col-4 gx-stack">
            <p className="gx-label">Shop by concern</p>
            <h2 id="concern-title" className="gx-display">
              Know what you want to care for?
            </h2>
            <p className="gx-lead">Start there. Each list shows the products that speak to it, in Gloveda Herbals&rsquo; own words.</p>
          </Reveal>
          <Reveal className="gx-col-8" delay={0.08}>
            <ConcernLinks products={all} />
          </Reveal>
        </div>
      </section>

      {affordable.length ? (
        <section className="gx-band" aria-labelledby="under-title" data-price>
          <div className="gl-container gx-grid">
            <Reveal className="gx-col-4 gx-stack">
              <p className="gx-label">Easy to begin</p>
              <h2 id="under-title" className="gx-display">
                Under {formatMoney(UNDER)}.
              </h2>
              <p className="gx-lead">Start with one. Add it straight from the list.</p>
              <a className="gx-more" href={shopUrl(`/collections/all?max=${UNDER}`)}>
                Everything under {formatMoney(UNDER)} <Icon name="arrow" size={18} />
              </a>
            </Reveal>
            <Reveal className="gx-col-8" delay={0.08}>
              <ul className="gx-list" role="list">
                {affordable.slice(0, 5).map((p) => (
                  <ProductRow key={p.id} product={p} />
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      ) : null}

      <section className="gx-band gx-band--wine theme-wine" aria-labelledby="shop-rituals-title">
        <div className="gl-container gx-grid gx-rituals">
          <div className="gx-col-6 gx-rituals__media">{ritualImage ? <Image src={ritualImage.src} alt="" width={ritualImage.width} height={ritualImage.height} sizes="(min-width: 64rem) 45vw, 100vw" /> : null}</div>
          <Reveal className="gx-col-6 gx-stack gx-rituals__text">
            <p className="gx-label">Rituals</p>
            <h2 id="shop-rituals-title" className="gx-display">
              Ready‑made, or your own.
            </h2>
            <p className="gx-lead">Start with a set put together by Gloveda Herbals, or choose one each for face, hair and body.</p>
            <div className="gx-hero__actions">
              <a className="gl-btn" href={shopUrl("/rituals")}>
                See the rituals
              </a>
              <a className="gx-more" href={shopUrl("/rituals#build")}>
                Build your own <Icon name="arrow" size={18} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="gx-band gx-band--sand" aria-labelledby="shop-story-title">
        <div className="gl-container gx-grid gx-storyteaser">
          <Reveal className="gx-col-5 gx-stack">
            <p className="gx-label">Our story</p>
            <h2 id="shop-story-title" className="gx-display">
              It began in 1921.
            </h2>
            <p className="gx-lead">With the physicians of Arya Vaidya Vilasini Vaidya Sala, and a way of caring for skin that has been handed down ever since.</p>
            <a className="gx-more" href={siteUrl("/#our-story")}>
              Read our story <Icon name="arrow" size={18} />
            </a>
          </Reveal>
          <Reveal className="gx-col-7" delay={0.08}>
            <picture className="gx-storyteaser__media">
              <source type="image/avif" srcSet="/media/lineup-960.avif 960w, /media/lineup-1920.avif 1920w" sizes="(min-width: 64rem) 55vw, 100vw" />
              <source type="image/webp" srcSet="/media/lineup-960.webp 960w, /media/lineup-1920.webp 1920w" sizes="(min-width: 64rem) 55vw, 100vw" />
              <img src="/media/lineup-1920.jpg" width={1920} height={1080} loading="lazy" alt="Seven Gloveda products in a row at dusk: Face Mask, Face Wash, Kumkumadi Thailam, Pure Nature Shampoo, Massage Oil, Conditioner and Face Pack." />
            </picture>
          </Reveal>
        </div>
      </section>
    </>
  );
}
