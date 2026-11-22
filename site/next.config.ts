import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
