import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Production only: the site's CSS (about 25 KiB compressed) is written into each page as a <style>
    // tag instead of three render-blocking <link> requests, so the first paint and the LCP image are
    // not held up waiting for stylesheets. Trade-off: the CSS is not cached separately between pages.
    inlineCss: true,
  },
  // The shop used to live at gloveda.co/shop; it is now its own site, herbals.gloveda.co.
  async redirects() {
    return [
      { source: "/shop", destination: "https://herbals.gloveda.co/", permanent: true },
      { source: "/shop/:path*", destination: "https://herbals.gloveda.co/:path*", permanent: true },
    ];
  },
  images: {
    qualities: [75],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
