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
    <html lang="en-IN" className={marcellus.variable}>
      <body className="gl-root">
        {children}
        <EaseIn />
      </body>
    </html>
  );
}
