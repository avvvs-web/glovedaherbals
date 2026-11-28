import { COMPANY } from "@/content/policies";
import { BRAND, SITE_URL, shopUrl, social } from "@/lib/site";

/**
 * Structured data (JSON-LD) for search engines and AI answer engines. Only verified values: the brand,
 * its parent institution and founding year (approved claims, 2026-11-22), the published contact details,
 * and live catalogue data passed in by each page. No ratings, prices or claims are invented here.
 */

/** Absolute address: structured data must not use relative URLs. */
export const abs = (url: string) => (/^https?:\/\//.test(url) ? url : `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`);

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export const ORG_ID = `${SITE_URL}/#org`;

/** Organization + WebSite (with site search), on every page from the root layout. */
export function SiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: BRAND,
        alternateName: "Gloveda",
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/brand/logo-primary-on-light.png`,
        description: "Ayurvedic skincare and hair care formulated by Ayurvedic doctors and made in small batches, from Arya Vaidya Vilasini Vaidya Sala, established in 1921.",
        sameAs: social.map((s) => s.url),
        parentOrganization: { "@type": "Organization", name: COMPANY.name, foundingDate: "1921", address: { "@type": "PostalAddress", streetAddress: "Taluk Road, Puthiyara PO", addressLocality: "Kozhikode", addressRegion: "Kerala", postalCode: "673004", addressCountry: "IN" } },
        contactPoint: [{ "@type": "ContactPoint", contactType: "customer service", email: COMPANY.email, telephone: COMPANY.phone.replace(/\s/g, ""), areaServed: "IN", availableLanguage: ["en"] }],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: BRAND,
        url: `${SITE_URL}/`,
        inLanguage: "en-IN",
        publisher: { "@id": ORG_ID },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${abs(shopUrl("/search"))}?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
  return <JsonLd data={data} />;
}

/** A trail of [name, href] pairs, the last being the page itself. */
export const breadcrumbs = (trail: [string, string][]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map(([name, href], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(href) })),
});

/** An ordered list of pages (products in a collection, articles in the Journal). */
export const itemList = (name: string, items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  numberOfItems: items.length,
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: abs(it.url) })),
});
