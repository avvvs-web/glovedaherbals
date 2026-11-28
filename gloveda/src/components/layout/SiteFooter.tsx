import Image from "next/image";
import { CookieSettingsLink } from "@/components/tracking/CookieConsent";
import { COMPANY } from "@/content/policies";
import { collections, EXPERIENCE_URL, reviveUrl, shopUrl, social } from "@/lib/site";

const columns = [
  {
    title: "The Gloveda family",
    links: [
      { name: "Gloveda Herbals", href: shopUrl("/") },
      { name: "Gloveda Experience", href: EXPERIENCE_URL },
      { name: "Gloveda Revive", href: reviveUrl("/") },
      { name: "Our story", href: "/#our-story" },
    ],
  },
  {
    title: "Gloveda Herbals",
    links: [...collections.map((c) => ({ name: c.name, href: shopUrl(c.path) })), { name: "Shop all products", href: shopUrl("/collections/all") }, { name: "Journal", href: shopUrl("/blogs") }],
  },
  {
    title: "Gloveda Revive",
    links: [
      { name: "Find a clinic", href: reviveUrl("/clinics") },
      { name: "Treatments", href: reviveUrl("/treatments") },
      { name: "Partner with Revive", href: reviveUrl("/#partner") },
    ],
  },
  {
    title: "Help",
    links: [
      { name: "Contact us", href: shopUrl("/help#contact") },
      { name: "Privacy policy", href: shopUrl("/policies/privacy-policy") },
      { name: "Terms of service", href: shopUrl("/policies/terms-of-service") },
    ],
  },
];

/**
 * The footer of the parent site: the brand's closing line beside the gold keyline line-up from the end of
 * the film, then the mark, the heritage line and a column for each house; then the social links and the
 * registered address.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="theme-wine site-footer">
      <div className="site-footer__crown">
        <div className="gl-container site-footer__crownInner">
          <div className="site-footer__artBox" aria-hidden="true">
            <Image className="site-footer__art" src="/seq/film/lg/0592.webp" alt="" width={1920} height={1080} sizes="(min-width: 64rem) 60rem, 100vw" loading="lazy" />
          </div>
          <div className="site-footer__words">
            <p className="site-footer__statement">Tradition you can trust.</p>
            <div className="site-footer__crownActions">
              <a className="gl-btn" href={shopUrl("/")}>
                Shop Gloveda Herbals
              </a>
              <a className="site-footer__link" href={reviveUrl("/clinics")}>
                Find a Revive clinic
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="gl-container site-footer__top">
        <div className="site-footer__brand">
          <Image src="/brand/logo-primary-on-dark.png" alt="Gloveda" width={191} height={142} className="site-footer__logo" />
          <p className="site-footer__line">Gloveda. Ayurvedic skincare, treatments and clinics from {COMPANY.name}, established in 1921.</p>
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
