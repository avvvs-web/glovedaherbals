import Script from "next/script";
import { EaseIn } from "@/components/motion/EaseIn";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { BRAND, SITE_NAME, SITE_URL } from "@/lib/site";

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
      </body>
    </html>
  );
}
