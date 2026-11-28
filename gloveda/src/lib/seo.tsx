import { COMPANY } from "@/content/policies";
import { BRAND, EXPERIENCE_URL, REVIVE_URL, SHOP_ORIGIN, SITE_URL, social } from "@/lib/site";

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
        alternateName: "Gloveda Herbals",
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/brand/logo-primary-on-light.png`,
        description: "Ayurvedic skincare and hair care (Gloveda Herbals), treatments for hospitality (Gloveda Experience) and skin and hair clinics (Gloveda Revive), from Arya Vaidya Vilasini Vaidya Sala, established in 1921.",
        brand: [
          { "@type": "Brand", name: "Gloveda Herbals", url: `${SHOP_ORIGIN}/` },
          { "@type": "Brand", name: "Gloveda Experience", url: `${EXPERIENCE_URL}/` },
          { "@type": "Brand", name: "Gloveda Revive", url: `${REVIVE_URL}/` },
        ],
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
      },
    ],
  };
  return <JsonLd data={data} />;
}
