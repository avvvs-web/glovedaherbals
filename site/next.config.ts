import type { NextConfig } from "next";

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://glovedaherbals.com";
/** The Shopify store's own address (where products.json, the cart and checkout live). */
const STORE_URL = (process.env.SHOPIFY_PUBLIC_STORE_URL ?? "https://glovedaherbals.com").replace(/\/$/, "");
/** Shopify is reachable at an address of its own, not this site's: only then can links be sent there. */
const STORE_IS_ELSEWHERE = host(STORE_URL) !== "" && host(STORE_URL) !== host(SITE_URL);
/** On the shop host the proxy already serves /products/… and /collections/… from the shop routes. */
const notShopHost = (process.env.SHOP_HOSTS ?? "shop.glovedaherbals.com")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean)
  .map((h) => ({ type: "host" as const, value: h.replace(/\./g, "\\.") }));

const nextConfig: NextConfig = {
  experimental: {
    // Production only: the site's CSS (about 25 KiB compressed) is written into each page as a <style>
    // tag instead of three render-blocking <link> requests, so the first paint and the LCP image are
    // not held up waiting for stylesheets. Trade-off: the CSS is not cached separately between pages.
    inlineCss: true,
  },
  // Development only: lets the local server be opened under the shop's own hostname (mapped to this
  // machine), to test what depends on that name, such as the reviews frame.
  allowedDevOrigins: ["shop.glovedaherbals.com"],
  images: {
    // Product photography comes from the brand's own Shopify CDN.
    // Object form (no `search` key) so Shopify's ?v= cache-busting query is allowed.
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com", pathname: "/s/files/1/0804/4308/0946/**" }],
    qualities: [75],
    formats: ["image/avif", "image/webp"],
  },
  /**
   * glovedaherbals.com used to be the Shopify store itself. Its addresses (in search results, ads, posts
   * and emails) are sent to the same thing on this site, permanently, so they keep working and keep their
   * search ranking. The list comes from the old store's sitemap (2026-11-26).
   */
  async redirects() {
    const to = (source: string, destination: string) => ({ source, destination, permanent: true, missing: notShopHost });
    const internal = [
      to("/products/:handle", "/shop/products/:handle"),
      to("/collections", "/shop/collections/all"),
      to("/collections/:handle", "/shop/collections/:handle"),
      to("/collections/:collection/products/:handle", "/shop/products/:handle"),
      to("/policies/:handle", "/shop/policies/:handle"),
      to("/pages/privacy-policy", "/shop/policies/privacy-policy"),
      to("/pages/terms-of-use", "/shop/policies/terms-of-service"),
      to("/pages/shipping-policy", "/shop/policies/shipping-policy"),
      to("/pages/return-policy", "/shop/policies/refund-policy"),
      to("/pages/faqs", "/shop/help"),
      to("/pages/contact", "/shop/help#contact"),
      to("/pages/about-us", "/#our-story"),
      to("/pages/wishlist", "/shop/account?tab=saved"),
      to("/pages/compare", "/shop/collections/all"),
      to("/search", "/shop/search"),
      to("/account", "/shop/account"),
      to("/account/:path*", "/shop/account"),
      to("/blogs", "/shop/blogs"),
      to("/blogs/:path*", "/shop/blogs/:path*"),
    ];
    // What this site does not have yet stays on Shopify: the press page, and any old cart link. Only once
    // Shopify has an address of its own (SHOPIFY_PUBLIC_STORE_URL), or these would loop.
    const external = STORE_IS_ELSEWHERE
      ? [
          to("/pages/news-and-presence", `${STORE_URL}/pages/news-and-presence`),
          { source: "/cart/:path*", destination: `${STORE_URL}/cart/:path*`, permanent: false, missing: notShopHost },
          { source: "/cart", destination: `${STORE_URL}/cart`, permanent: false, missing: notShopHost },
        ]
      : [];
    return [...internal, ...external];
  },
};

export default nextConfig;
