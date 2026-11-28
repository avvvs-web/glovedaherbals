import Script from "next/script";
import { EaseIn } from "@/components/motion/EaseIn";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "../styles/extras.css";
import { CookieConsent } from "@/components/tracking/CookieConsent";
import { BRAND, SHOP_BASE, SITE_NAME } from "@/lib/site";
import { SiteJsonLd } from "@/lib/seo";

const marcellus = localFont({
  src: "../fonts/marcellus.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-marcellus",
  adjustFontFallback: "Times New Roman",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SHOP_BASE),
  title: { default: `${SITE_NAME} | Ayurvedic Skincare & Hair Care Products`, template: `%s | ${BRAND}` },
  applicationName: BRAND,
  description: "Gloveda Herbals: doctor-formulated Ayurvedic face, hair and body care, made in small batches, from Arya Vaidya Vilasini Vaidya Sala, established in 1921.",
  // Defaults for pages that do not set their own sharing details.
  openGraph: {
    type: "website",
    siteName: BRAND,
    locale: "en_IN",
    images: [{ url: "/media/og-1200x630.jpg", width: 1200, height: 630, alt: "Gloveda Herbals products in a row at dusk." }],
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#56172d",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={marcellus.variable} suppressHydrationWarning>
      <body className="gl-root">
        {/* Before the page is interactive: the proxy's cookie says whether this visitor's market has prices yet. */}
        <Script id="market-prices" strategy="beforeInteractive">
          {`if(/(^|; )gl_prices=hidden/.test(document.cookie))document.documentElement.dataset.prices="hidden"`}
        </Script>
        {children}
        <EaseIn />
        <SiteJsonLd />
        <CookieConsent />
      </body>
    </html>
  );
}
