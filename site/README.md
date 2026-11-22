# Gloveda website

Next.js (App Router) + React + TypeScript (strict), Tailwind CSS v4, React Three Fiber.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npx tsc --noEmit
npm run build && npm run start
```

Copy `.env.example` to `.env.local` and fill it in. Every variable is optional:

- **Without the Shopify variables:** product cards show no price, and every shopping link goes to the live store at `NEXT_PUBLIC_SHOP_ORIGIN`.
- **With the Storefront API set:** price and stock come from Shopify. Use a public storefront token only, never an Admin API token.

## What is where

| Path | What it is |
|---|---|
| `src/app/page.tsx` | The homepage, a server component. It holds the SEO metadata: title, description, canonical, Open Graph and Twitter. |
| `src/app/layout.tsx` | Marcellus from `src/fonts/marcellus.woff2` (self-hosted and preloaded), `lang="en-IN"`, and the base title. |
| `src/app/globals.css` | The page styles. Line 1 is the Hallmark stamp, with its waivers and dismissals. Every value comes from design-system tokens. |
| `src/styles/gloveda-ds.css` | The client's Gloveda Design System, verbatim. Only the documentation-site `.ds-*` rules were removed. Do not edit its values. The source files are in `design/system/`. |
| `src/components/storytelling/ScrollFilm.tsx` | The scroll-driven story. A pinned, full-screen canvas draws film frames 0–592 (keyline and logo included) from scroll position (GSAP ScrollTrigger scrub over Lenis smooth scrolling). Each chapter's text sits in the empty corner of its shot. The paper-cut passages sway gently when scrolling stops. Reduced motion or no JavaScript: a still page with the opening frame and all chapters as text. |
| `src/components/sections/ExperiencePartners.tsx` | Gloveda Experience, for hotels and partners; wording from glovedaexperience.com, results claims left out. |
| `src/components/layout/SiteNav.tsx` | The navbar: Shop and Rituals open full-width panels (click, Escape, outside click); a Menu sheet on phones. |
| `src/lib/frame-sequence.ts` | Coarse-to-fine image-sequence loader (every 32nd frame first), AVIF with a WebP fallback, and the cover/contain frame rectangle. |
| `src/components/commerce/Lineup.tsx` | The seven products from the film, with Shopify price and stock when configured. |
| `src/lib/catalogue.ts` | Product names, handles and images. There are no prices here, by design. |
| `src/lib/shopify.ts` | The server-only Storefront API client. It returns null when it isn't configured. |
| `src/lib/seo.tsx` | Organization and WebSite JSON-LD, using only verified values. |
| `src/lib/site.ts` | Brand form ("Gloveda"), origins, collections and social links. |
| `public/seq/` | The scroll sequences, rebuilt by `scripts/encode-sequence.py`. `film/{lg,sm}` holds frames 0–592 at 1920×1080 and 1280×720, AVIF plus WebP. |
| `public/media/` | The OG image and stills, from `scripts/encode-media.sh`. The earlier hero mp4 encodes there are no longer used by the page. |


## Media

| File | Size | Quality vs the v7 master |
|---|---|---|
| `hero-1080-av1.mp4` | 3.7 MB | VMAF 96.5 |
| `hero-1080.mp4` (H.264) | 12.1 MB | VMAF 97.5 |
| `hero-720.mp4` (H.264, screens under 900px) | 4.6 MB | VMAF 92.2 |

All three are 24.708 s with no audio.

Stills:
- The poster is f592, the gold keyline frame.
- The line-up and OG images are from f510.

## Open items

- **Commerce links:** they point at the live store until this site has its own collection and product routes. That is SEO plan T-4.
- **Copy to confirm:**
  - the hero sentence "Face, hair and body care, from Kumkumadi Thailam to Pure Nature Shampoo." It was shortened from the copy deck to meet Hallmark's twelve-word limit;
  - the section titles "The Gloveda line-up", "See every side", "Shop by collection" and "About the film";
  - launch stock for the products named in the hero and the meta description.
- **Heritage wording:** it is held until approved.
