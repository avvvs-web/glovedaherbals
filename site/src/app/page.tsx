import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FilmLoader } from "@/components/storytelling/FilmLoader";
import { ScrollFilm, type Chapter } from "@/components/storytelling/ScrollFilm";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { RangeDoors } from "@/components/shop/RangeDoors";
import { ExperiencePartners } from "@/components/sections/ExperiencePartners";
import { OurStory } from "@/components/sections/OurStory";
import { WhatsAppButton } from "@/components/shop/WhatsAppButton";
import { SiteJsonLd } from "@/lib/seo";
import { shopUrl } from "@/lib/site";

const title = "Gloveda | Ayurvedic Skincare & Hair Care Products";
const description =
  "Gloveda's doctor-formulated Ayurvedic face, hair and body care, rooted in 105 years of Ayurvedic heritage. Explore Kumkumadi Thailam, Pure Nature Shampoo and more.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Gloveda Herbals",
    title,
    description,
    locale: "en_IN",
    images: [
      {
        url: "/media/og-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Seven Gloveda products in a row at dusk: Face Mask, Face Wash, Kumkumadi Thailam, Pure Nature Shampoo, Massage Oil, Conditioner and Face Pack.",
      },
    ],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/media/og-1200x630.jpg"] },
};

/**
 * The story, one chapter per film beat. Claims are limited to those the client approved on 2026-11-22
 * (doctor-formulated; the 105-year heritage of Arya Vaidya Vilasini Vaidya Sala, est. 1921; made in house
 * in small batches; traditional formulas) plus wording from content/hero/sources.md.
 */
const chapters: Chapter[] = [
  {
    id: "intro", place: "bl", tone: "light", upright: "top",
    from: 0,
    to: 44,
    h1: true,
    title: "A century of care, perfected for you.",
    body: "Gloveda Ayurvedic skincare and hair care, 105 years in the making.",
    cta: { label: "Shop the collection", href: shopUrl("/collections/all") },
  },
  {
    id: "heritage", place: "tr", tone: "dark", upright: "top", // in the empty sky right of the bottle, clear of the sun and the butterfly
    from: 54,
    to: 103,
    title: "It began in 1921.",
    body: "With the physicians of Arya Vaidya Vilasini Vaidya Sala, and a way of caring for skin that has been handed down ever since.",
  },
  {
    id: "botanicals", place: "bl", tone: "dark",
    from: 132,
    to: 212,
    title: "First, the botanicals.",
    body: "Pure herbs and essential oils, blended to traditional formulas refined over generations.",
  },
  {
    id: "care", place: "tl", tone: "dark",
    from: 224,
    to: 258,
    title: "Care, not correction.",
    body: "Gentle enough for every day. Made to work with your skin, never against it.",
  },
  {
    id: "doctors", place: "bl", tone: "dark",
    from: 268,
    to: 306, // the label close-up that follows speaks for itself
    title: "Formulated by doctors. Made in house.",
    body: "Every formula comes from Ayurvedic doctors. Every batch is small, and made under our own roof.",
  },
  {
    id: "range", place: "bl", tone: "light",
    from: 362,
    to: 470, // gone before the line-up settles into this corner
    title: "Your ritual, bottled.",
    body: "Seven essentials for face, hair and body. Start with one, and build from there.",
  },
  {
    id: "close", place: "bc", tone: "light", // along the bottom, under the outlined packs and clear of the logo
    from: 566, // once the logo has drawn on
    to: "end",
    title: "Tradition you can trust.",
    body: "Gentle care. Thoughtful ingredients. Conscious beauty.",
    cta: { label: "Shop the collection", href: shopUrl("/collections/all") },
  },
];

export default function Home() {
  return (
    <>
      <a className="gl-btn gl-btn--sm skip-link" href="#main">
        Skip to content
      </a>
      <FilmLoader />
      {/* Without scripts nothing would ever clear the loader, so it is not shown at all. */}
      <noscript>
        <style>{".floader{display:none}"}</style>
      </noscript>
      <SmoothScroll />
      <SiteHeader />
      <main id="main">
        <ScrollFilm chapters={chapters} />

        <OurStory />

        <ExperiencePartners />

        <section id="revive" className="gx-band gx-band--sand revive" aria-labelledby="revive-title">
          <div className="gl-container gx-stack revive__inner">
            <p className="gx-label">Gloveda Revive</p>
            <h2 id="revive-title" className="gx-display">
              Coming soon.
            </h2>
            <p className="gx-lead">A new chapter from Gloveda Herbals. Details will follow here.</p>
          </div>
        </section>

        <section className="gx-band" aria-labelledby="ranges-title">
          <div className="gl-container">
            <div className="gx-head gx-head--split">
              <div className="gx-stack">
                <p className="gx-label">The shop</p>
                <h2 id="ranges-title" className="gx-display">
                  Three ways to begin.
                </h2>
              </div>
              <a className="gl-btn" href={shopUrl("/")}>
                Enter the shop
              </a>
            </div>
            <RangeDoors />
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppButton />
      <SiteJsonLd />
    </>
  );
}
