import Image from "next/image";
import { CookieSettingsLink } from "@/components/tracking/CookieConsent";
import { COMPANY, policies } from "@/content/policies";
import { collections, EXPERIENCE_URL, REVIVE_URL, shopUrl, siteUrl, social } from "@/lib/site";

const columns = [
  {
    title: "Shop",
    links: [
      ...collections.map((c) => ({ name: c.name, href: shopUrl(c.path) })),
      { name: "Best sellers", href: shopUrl("/collections/best-sellers") },
      { name: "Shop by concern", href: shopUrl("/concerns") },
      { name: "Shop all products", href: shopUrl("/collections/all") },
    ],
  },
  {
    title: "Rituals",
    links: [
      { name: "Ready-made rituals", href: shopUrl("/rituals") },
      { name: "Build your own ritual", href: shopUrl("/rituals#build") },
      { name: "Sets and gifting", href: shopUrl("/collections/gloveda-combo") },
    ],
  },
  {
    title: "Your account",
    links: [
      { name: "Sign in", href: shopUrl("/account") },
      { name: "Orders", href: shopUrl("/account?tab=orders") },
      { name: "Wishlist", href: shopUrl("/account?tab=saved") },
    ],
  },
  {
    title: "Help",
    links: [{ name: "Track your order", href: shopUrl("/track") }, { name: "Help centre", href: shopUrl("/help") }, ...policies.map((p) => ({ name: p.title, href: shopUrl(`/policies/${p.handle}`) })), { name: "Contact us", href: shopUrl("/help#contact") }],
  },
];

/**
 * The footer. It opens with the brand's closing line and a way into the shop, set beside the gold keyline
 * line-up from the end of the film (the approved frame itself); then the mark, the heritage line and
 * four columns; then the social links and the registered address.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="theme-wine site-footer">
      <div className="site-footer__crown">
        <div className="gl-container site-footer__crownInner">
          <div className="site-footer__artBox" aria-hidden="true">
            <Image className="site-footer__art" src="/media/keyline-1920.webp" alt="" width={1920} height={1080} sizes="(min-width: 64rem) 60rem, 100vw" loading="lazy" />
          </div>
          <div className="site-footer__words">
            <p className="site-footer__statement">Tradition you can trust.</p>
            <div className="site-footer__crownActions">
              <a className="gl-btn" href={shopUrl("/")}>
                Shop Gloveda Herbals
              </a>
              <a className="site-footer__link" href={shopUrl("/concerns")}>
                Shop by concern
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="gl-container site-footer__top">
        <div className="site-footer__brand">
          <Image src="/brand/logo-primary-on-dark.png" alt="Gloveda Herbals" width={191} height={142} className="site-footer__logo" />
          <p className="site-footer__line">Gloveda Herbals. Ayurvedic skincare and hair care from {COMPANY.name}, established in 1921.</p>
          <ul className="site-footer__also" role="list">
            <li>
              <a className="site-footer__link" href={siteUrl("/#our-story")}>
                Our story
              </a>
            </li>
            <li>
              <a className="site-footer__link" href={shopUrl("/blogs")}>
                Journal
              </a>
            </li>
            <li>
              <a className="site-footer__link" href={EXPERIENCE_URL}>
                Gloveda Experience
              </a>
            </li>
            <li>
              <a className="site-footer__link" href={REVIVE_URL}>
                Gloveda Revive
              </a>
            </li>
          </ul>
        </div>
        <div className="site-footer__cols">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="site-footer__col">
              <h2 className="site-footer__head">{col.title}</h2>
              <ul role="list">
                {col.links.map((l) => (
                  <li key={l.name}>
                    <a className="site-footer__link" href={l.href}>
                      {l.name}
                    </a>
                  </li>
                ))}
                {col.title === "Help" ? (
                  <li>
                    <CookieSettingsLink className="site-footer__link" />
                  </li>
                ) : null}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="gl-container site-footer__base">
        <ul className="site-footer__social" role="list">
          {social.map((s) => (
            <li key={s.name}>
              <a className="site-footer__link" href={s.url} rel="me noopener" target="_blank">
                {s.name}
                <span className="visually-hidden"> (Gloveda on {s.name}, opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="gl-small">
          © {year} Gloveda Herbals. {COMPANY.name}, {COMPANY.registeredOffice}. Customer care:{" "}
          <a className="site-footer__cookies" href={`mailto:${COMPANY.email}`}>
            {COMPANY.email}
          </a>
          ,{" "}
          <a className="site-footer__cookies" href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}>
            {COMPANY.phone}
          </a>
          .
        </p>
        <a className="site-footer__link" href="#top">
          Back to top
        </a>
      </div>
    </footer>
  );
}
