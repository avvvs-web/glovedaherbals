import { BRAND, SITE_URL, social } from "@/lib/site";

/**
 * Organization + WebSite JSON-LD (SEO plan T-10). Only verified values: no address or telephone
 * (the footer address belongs to the parent institution, [CONFIRM]), no ratings, no claims.
 */
export function SiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: BRAND,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/brand/logo-primary-on-light.png`,
        sameAs: social.map((s) => s.url),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: BRAND,
        url: `${SITE_URL}/`,
        publisher: { "@id": `${SITE_URL}/#org` },
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
