import { EaseIn } from "@/components/motion/EaseIn";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "../styles/extras.css";
import { CookieConsent } from "@/components/tracking/CookieConsent";
import { BRAND, SITE_NAME, SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | Ayurvedic Skincare & Hair Care Products`, template: `%s | ${BRAND}` },
  applicationName: BRAND,
  description: "Gloveda, from Arya Vaidya Vilasini Vaidya Sala (established 1921): Gloveda Herbals skincare and hair care, Gloveda Experience for hospitality, and Gloveda Revive clinics.",
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
        {children}
        <EaseIn />
        <SiteJsonLd />
        <CookieConsent />
      </body>
    </html>
  );
}
