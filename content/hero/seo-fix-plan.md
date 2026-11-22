# Gloveda Herbals: SEO fix plan for the new site

Goal: the new homepage (brand story plus hero film) must read to search engines as the official Gloveda Herbals brand site and lead visitors to Shop All and product pages, without losing what the current site already ranks for. Tickets: Critical 0 confirmed. Quick wins: 0 committed, because capacity is unknown (T-3, T-6, T-8 and T-12 are small, independent candidates). Planned: 16.

Scope and sources:
- These tickets are for the new Next.js App Router build. No site code exists yet. No ticket changes the live Shopify store, its theme or its settings. Live-site findings show which mistakes to avoid and which URLs and signals to keep.
- Source: a read-only audit of the live glovedaherbals.com on 2026-11-22. The home page server HTML was fetched. The product and collection pages returned HTTP 429, so their head tags and JSON-LD were not checked. Google Search Central pages were also read.
- There is no Critical group because the audit found no indexing or server blocker on the live home page: HTTP 200, no noindex, a self-referencing canonical, a sitemap declared in robots.txt, and HTML of about 559 KB. The product and collection heads were not checked, so T-2 must run before that can be said for those templates.
- T-1 (claims approval) and T-4 (URL continuity) are release gates for launch. They are not ranking fixes.
- Effort scale (provisional): S = under one developer- or editor-day, M = 2–4 days, L = a sprint or more. These assume a new Next.js build that reads Shopify through the Storefront API. Claims approval by brand or legal reviewers adds lead time that is not counted in hands-on effort.
- Tickets tagged [COPY] set requirements the hero copy itself must meet. They are summarised in "COPY REQUIREMENTS" at the end.

---

## Planned (ranked; release gates first)

### T-1: Get approval for every brand claim before it goes into titles, headings, meta or structured data

- From: content-integrity flags. These claims appear on the live site without substantiation: "doctor crafted", "clinically tested formulations", "100% Authentic Certified Products", "Organic Ingredients", "100% Natural", "Lab-Tested Formula", "Cruelty-Free", "reduce hair fall", "most customers see improvements within 2–4 weeks", and the "105 years" heritage wording with no stated founding year. Counters such as "10K+ Happy Customers" are also unconfirmed.
- Why it matters: titles, meta descriptions, the H1 and Organization markup are what search engines and shoppers read first. An unsupported claim there is a compliance risk, and it can't be quietly fixed once it is in search snippets and social shares.
- Where: a claims register at `content/claims-register.md` (new), used by all copy in `content/hero/` and by the page metadata.
- Change:
  - List each claim and mark it approved (with its source), reworded, or removed. Do not reuse anything still marked [CONFIRM].
  - Record the approved heritage line and the founding year: [CONFIRM: founding year / approval of "105 years" wording, attributed to Arya Vaidya Vilasini Vaidyasala]. This parent is not Arya Vaidya Sala, Kottakkal.
  - Customer testimonials (for example, outcomes like dark spots fading) must not go into SEO copy, titles or structured data.
- Owner: content, plus brand or legal reviewer
- Effort: S hands-on (assumes the claims list above is complete). Reviewer lead time is unknown.
- Depends on: brand or legal reviewer availability
- Acceptance criteria:
  - Every claim used in T-5, T-6, T-7, T-8, T-10 and T-14 copy appears in the register as approved, with a source.
  - No unapproved claim string appears in the homepage title, meta description, H1, og:* tags or JSON-LD.
- How to verify after release: search the server HTML of `/` for each rejected claim string. The expected result is zero matches.

### T-2: Capture the live product and collection head tags and the sitemap before setting the new templates

- From: findings not checked because of HTTP 429 (product and collection title, meta description, canonical, robots, og and JSON-LD; sitemap.xml contents), and Search Console items marked "needs verification" (indexed status, Google-selected canonical, queries containing "gloveda").
- Why it matters: the new templates must keep whatever the live pages already do well. We can't know that without their heads and the list of indexed URLs.
- Where: the live site, read-only. Notes go to `content/seo/live-baseline.md` (new).
- Change (investigation; answer these questions):
  1. What are the title, meta description, canonical, robots and JSON-LD on `/products/gloveda-kumkumadi-thailam`, `/collections/all`, `/collections/skin-care`, `/collections/hair-care` and `/collections/body-care`? Get them with "view source" in a browser or with URL Inspection.
  2. What is the full URL list in `/sitemap.xml` and its child sitemaps? Include products, collections, pages and blogs.
  3. If Search Console access exists: which pages and queries get clicks (including queries with "gloveda"), and what canonical has Google selected for `/`?
  - Proposed timebox: 2 hours. Output: the baseline note. Stop when the questions are answered or access is confirmed unavailable.
- Owner: SEO
- Effort: S (proposed discovery timebox, not a repair estimate)
- Depends on: Search Console access is optional. Mark question 3 "not available" if there is no access.
- Acceptance criteria:
  - The baseline note records the head tags for the five URLs and the full sitemap URL list, each with its capture date.
- How to verify: T-4 and T-13 cite this note.

### T-3: Decide one brand name form and use it everywhere

- From: inconsistent brand naming. The live title carries "Gloveda – Glovedaherbals". og:site_name, the Organization and WebSite names, and the logo alt all say "Glovedaherbals". The footer has the typo "Glovedhaherbals". A web search for "gloveda" returned confusion with "Glovida", "GloDea" and "glove", and no Gloveda result.
- Why it matters: Google builds title links and the site name partly from WebSite structured data and on-page names. Three spellings weaken the signal that this is the official brand site, and the brand already competes with similar-sounding names.
- Where: a brand constants module, for example `src/lib/seo/site.ts` (`SITE_NAME`, `SITE_ALTERNATE_NAMES`). Every metadata, JSON-LD, logo and footer string reads from it.
- Change:
  - Primary form: **"Gloveda"** (approved by client 2026-11-22).
  - Allow alternates only where they are real variants, for example "Gloveda Herbals" and "glovedaherbals".
  - Do not write "Glovedaherbals" as one word in visible copy unless it is approved. Never ship the "Glovedhaherbals" typo.
- Owner: content (decision), developer (constant)
- Effort: S (assumes the decision is made in one review)
- Depends on: brand owner decision
- Acceptance criteria:
  - The homepage server HTML has the same primary brand form in the `<title>`, the H1, og:site_name, the Organization `name`, the WebSite `name` and the logo alt.
  - The strings "Glovedhaherbals" and "Glovedaherbals" (unless approved as an alternateName) appear nowhere in the rendered HTML.
- How to verify after release: grep the server HTML of `/`, one product page and one collection page for each name variant.

### T-4: Keep every live URL working on the new site (same paths, or one-hop 301s)

- From: the business goal ("without losing what the current site already ranks for"), plus the live URL inventory: 14 products under `/products/{handle}`; collections `/collections/skin-care` (labelled "Face Care"), `hair-care`, `body-care`, `best-sellers`, `gloveda-combo`, `moisturizers` and `all`; `/pages/about-us`, `/pages/faqs`, `/pages/news-and-presence` and `/pages/contact`; `/blogs/beauty`; and the policies.
- Why it matters: if the new routes rename these URLs without redirects, their links and indexed signals are stranded and visitors arriving from search hit 404s.
- Where: Next.js routes (`src/app/products/[handle]`, `src/app/collections/[handle]`, `src/app/pages/...`, `src/app/blogs/...`) and `redirects()` in `next.config`.
- Change:
  - Prefer keeping Shopify's paths and handles unchanged, for example `/collections/skin-care` with the visible label "Face Care".
  - Where a path must change, add a permanent redirect that goes straight to the final URL, with no chains.
  - Keep the redirects for at least one year.
  - Generate `sitemap.xml` from Shopify data, listing only canonical 200 URLs.
- Owner: developer, SEO
- Effort: M (assumes 30–60 URLs and mostly unchanged paths; recheck once T-2 has the sitemap list)
- Depends on: T-2 (full URL list)
- Acceptance criteria:
  - Every URL in the T-2 sitemap list returns 200 on the new site, or a single 301/308 to a 200 URL.
  - The new `sitemap.xml` contains no redirected, noindexed or 404 URLs.
  - robots.txt allows the product, collection, page and blog paths and disallows only cart, checkout, account and sort/filter parameter URLs, as the live site does.
- How to verify after release: run a script over the full T-2 list and record the status code and final URL for each. Spot-check 5 URLs in URL Inspection if access exists.

### T-5: [COPY] Put a text H1 that names the brand and category in the homepage server HTML, outside the film

- From: the live H1 is the logo image (alt="Glovedaherbals"), with no visible text heading. Hero messaging sits in banner images with alt="".
- Why it matters: Google uses the main visual title and heading elements to build title links. Text burned into a video or image is invisible to search and to screen readers.
- Where: the hero Server Component (for example `src/components/storytelling/Hero.tsx`) and `src/app/page.tsx`.
- Change:
  - Render one `<h1>` as real text in the server HTML. Overlay it on the film, or place it directly under the film.
  - The H1 must include the approved brand form (T-3) plus the category in the brand's own words, for example "Ayurvedic skincare & hair care". Draft (from hero-film-copy.md, passes this ticket's own test): "Gloveda: Ayurvedic Skincare & Hair Care" (approved 2026-11-22).
  - The header logo stays an image link with alt text set to the brand name. It is not an `h1`.
  - The film element must not be the only carrier of the headline.
- Owner: content (wording), developer (markup)
- Effort: S (assumes the hero component is being built anyway)
- Depends on: T-1, T-3
- Acceptance criteria:
  - The server HTML of `/` (before JavaScript) contains exactly one `<h1>` with visible text that includes the brand form and "Ayurvedic" plus a category term.
  - The H1 text is not inside `<video>`, `<canvas>` or an image.
  - The H1 is readable with JavaScript disabled, with reduced motion on, and before the film loads.
- How to verify after release: run `curl -s https://<domain>/ | grep -o '<h1[^>]*>.*</h1>'`, and check the Rich Results Test rendered HTML. Optionally do a keyboard and screen-reader pass.

### T-6: [COPY] Write the homepage title and meta description from approved facts, with the brand once

- From: the live title, "Ayurvedic Skincare & Hair Care Products | Gloveda – Glovedaherbals", has the brand twice in two spellings. The live meta description uses "doctor crafted" and "105 years", both unapproved.
- Why it matters: Google advises descriptive, concise titles without repeated or boilerplate text, branded once. A site-level meta description suits the home page.
- Where: `export const metadata` (or `generateMetadata`) in `src/app/page.tsx`, plus a root layout `title.template` that appends the brand only once.
- Change:
  - Title draft: "Gloveda | Ayurvedic Skincare & Hair Care Products" (approved 2026-11-22).
  - Meta description draft: "Shop Gloveda's Ayurvedic face, hair and body care, including Kumkumadi Thailam, Face Pack and Pure Nature Shampoo." Add a heritage line only after T-1 approves it.
  - Make sure the layout title template does not add a second brand suffix to the home title.
- Owner: content, developer
- Effort: S
- Depends on: T-1, T-3
- Acceptance criteria:
  - The home `<title>` contains the brand once, plus "Ayurvedic" and at least one category term.
  - The meta description exists, is unique to `/`, and contains only T-1-approved claims and real product names spelled as the brand writes them.
  - No other route shares this exact title or description.
- How to verify after release: compare the server HTML `<title>` and `<meta name="description">` on `/` against the approved copy, and run a duplicate-title check across all routes in the sitemap.

### T-7: [COPY] Link hero and homepage CTAs to Shop All, collections and products with descriptive text anchors

- From: the live home page has image-only banner links with empty anchor text (to `/collections/best-sellers`, `/collections/hair-care`, `/products/gloveda-kumkumadi-thailam` and others), "shop now" used six times, an anchor of "-->" on `/collections/moisturizers`, and "#" links ("Body Wellness Picks", "Delivery & Returns", "Track My Order").
- Why it matters: anchor text tells search engines what the target page is about. Image links with empty alt text pass no anchor text. "#" links are not crawlable destinations.
- Where: the hero CTA group and the homepage collection and product sections (for example `src/components/storytelling/HeroCtas.tsx` and `CollectionGrid.tsx`).
- Change:
  - Make the primary hero CTA an `<a href="/collections/all">` (or the final Shop All route from T-4) with text that names the destination, such as "Shop all Gloveda products".
  - Give the secondary CTAs and collection tiles text anchors that name the category: "Shop Face Care", "Shop Hair Care", "Shop Body Care".
  - Where an image is a link, give it alt text that describes the destination, or include visible text inside the link.
  - Do not use `href="#"` and do not navigate with JavaScript only.
- Owner: content (labels), developer
- Effort: S
- Depends on: T-4 (final route paths)
- Acceptance criteria:
  - The server HTML of `/` has a crawlable `<a href>` to Shop All and to each real collection, each with non-empty, descriptive anchor text.
  - There are no `href="#"` links in the homepage.
  - Every link that wraps only an image has non-empty alt text.
  - No anchor text is a stray artifact like "-->".
- How to verify after release: extract all `<a>` elements from the server HTML of `/` and list href plus accessible name. Flag empty names and "#" hrefs.

### T-8: [COPY] Make the hero film decorative and give it a text alternative

- From: the live videos are background or testimonial-card videos (muted, looping, some `aria-hidden`), with no watch page and no VideoObject. Google's video docs say video features need a watch page whose main purpose is the video, and that the video can't be hidden behind other elements.
- Why it matters: a homepage hero film is complementary to the page, so it won't be indexed as a video from the homepage. Its story must reach search engines and assistive tech as text. Note that this conclusion is an inference from Google's watch-page rules; Google has no sentence about hero videos specifically.
- Where: the hero film component (for example `src/components/storytelling/HeroFilm.tsx`).
- Change:
  - Use `<video muted playsinline loop preload="metadata" poster="...">` with `aria-hidden="true"` (or `aria-label` if it conveys meaning), and add a pause control.
  - Under reduced motion, show the poster only.
  - Put the story the film tells into a short visible text summary under the film, or into the H1 and subheading. The summary must use only approved facts from T-1.
  - Do not bake headline or offer text into the film as the only copy.
  - The poster image needs descriptive alt text if it carries meaning, or alt="" if it is decorative.
- Owner: developer, content
- Effort: S (assumes the film asset and poster already exist)
- Depends on: T-1, T-5
- Acceptance criteria:
  - The film has a poster and a visible pause control.
  - Under `prefers-reduced-motion: reduce` the film does not autoplay.
  - The text summary is in the server HTML.
  - The H1 and CTAs are never covered by the video for keyboard or screen-reader users.
- How to verify after release: check `/` with reduced motion on, with JavaScript off, and with a keyboard-only pass. Confirm the text summary appears in the server HTML.

### T-9: Keep template boilerplate and placeholder content out of the homepage server HTML

- From: the live server HTML contains five "Example product title ... Rs. 19.99" blocks, the cart drawer ("Your cart is empty", "Subtotal" as H2s), a sign-in modal, and a search overlay with "popular searches" links to `/search?q=trendy`.
- Why it matters: crawlable placeholder titles and prices dilute the page. Modal headings compete with the real headings.
- Where: the cart drawer, account and search components (client components that mount on open), plus a build-time content check.
- Change:
  - Render the cart, sign-in and search UIs only when they are opened, or inside `<template>`. Their headings must not be H2s in the page outline.
  - Never ship placeholder product data. A failed Shopify fetch shows a real empty or error state, not sample products.
- Owner: developer
- Effort: S
- Depends on: none known (confirm before pickup)
- Acceptance criteria:
  - The server HTML of `/` contains none of these strings: "Example product title", "Rs. 19.99", "Your cart is empty", "What are you looking for".
  - Headings in the server HTML belong to page content only.
- How to verify after release: grep the server HTML of `/`, one collection page and one product page for those strings.

### T-10: [COPY] Publish Organization and WebSite structured data with the approved name and only real values

- From: the live Organization name is "Glovedaherbals". Its `sameAs` contains six empty strings plus the Facebook, Instagram and YouTube "glovedaofficial" profiles. There is no address or contactPoint, although the footer shows an address. WebSite has an inert SearchAction.
- Why it matters: Google uses WebSite structured data as a site-name and title-link source. Empty or wrong values undercut the "official brand site" signal.
- Where: a JSON-LD Server Component in the root layout or home page (for example `src/lib/seo/jsonld.ts`).
- Change:
  - Organization: `name` from T-3, `alternateName` only for approved variants, `url` set to the canonical origin, and `logo`.
  - `sameAs`: only the three verified profile URLs, with no empty strings.
  - `address` and `telephone` only after the business confirms they are Gloveda's own. The live footer shows "NV Road, Kakkodi Kozhikode – 673611", which is the parent institution's (Arya Vaidya Vilasini Vaidya Sala) address [CONFIRM: Gloveda's own business address]. Until confirmed, omit both fields.
  - WebSite: `name` and `url`. The SearchAction is optional and inert.
  - Do not use heritage, rating or claim fields unless T-1 approves them.
- Owner: developer
- Effort: S
- Depends on: T-1, T-3
- Acceptance criteria:
  - The Rich Results Test or Schema Markup Validator parses both types without errors.
  - `sameAs` has no empty values.
  - The `name` matches the H1 and title brand form.
  - If an address is published, it is the confirmed Gloveda address and matches the visible footer exactly; otherwise no address or telephone field is present.
- How to verify after release: run the Schema Markup Validator on `/`, and diff the JSON-LD values against the footer text.

### T-11: [COPY] Set homepage Open Graph and Twitter tags from the approved title, description and an HTTPS image

- From: the live og:image is served over `http://` (og:image:secure_url is https), og:site_name is "Glovedaherbals", and the description carries unapproved claims.
- Why it matters: when the brand site is shared, the preview should show the approved name and claims and a secure image.
- Where: `metadata.openGraph` and `metadata.twitter` in `src/app/page.tsx`, with defaults in the root layout.
- Change:
  - og:title and og:description match T-6 (or a shorter approved variant).
  - og:site_name uses the T-3 brand form.
  - og:image is an absolute `https://` URL to an approved still from the film or a brand image (about 1200×630; the live one is 1734×907), with og:image:alt.
  - twitter:card is `summary_large_image`.
- Owner: developer, content
- Effort: S
- Depends on: T-3, T-6
- Acceptance criteria:
  - All og:* and twitter:* URLs in the server HTML are absolute https.
  - og:site_name matches the brand form.
  - The image returns 200 and is a supported image type.
- How to verify after release: check the server HTML, and use a social preview debugger (Facebook Sharing Debugger or equivalent) on `/`.

### T-12: Fix sitewide navigation links: primary domain only, no "#" destinations, descriptive anchors

- From: the "Help" link (×3) points to `glovedaherbals.myshopify.com/pages/contact`. "Body Wellness Picks", "Delivery & Returns", "Log in" and "Track My Order" link to "#". `/collections/moisturizers` is linked with no anchor text.
- Why it matters: off-host links send visitors and link signals to the myshopify domain, and "#" items are not crawlable destinations.
- Where: header, mega-menu and footer navigation components, and the Shopify menu data mapping.
- Change:
  - Make all internal links relative, or point them at the primary domain.
  - Give each nav item a real route, or leave it out: Help goes to `/pages/contact`, "Delivery & Returns" goes to the shipping and returns policy.
  - "Track My Order" and "Log in" can be buttons if they open UI rather than navigate.
  - Give the Moisturizers link a text label if the collection is kept [CONFIRM: is /collections/moisturizers a live category].
- Owner: developer
- Effort: S
- Depends on: T-4 (route list)
- Acceptance criteria:
  - No `href` in the header or footer contains "myshopify.com" or is exactly "#".
  - Every navigation `<a>` has non-empty text.
- How to verify after release: crawl `/` plus one product and one collection page, and list nav hrefs and anchor text.

### T-13: Give each collection page a unique title, a visible H1 and an approved intro

- From: `/collections/all` has the title "Products – Glovedaherbals" (as reported by WebFetch) and no visible heading or description. The live category pages have homepage blurbs that may not appear on the collection pages themselves (not checked; HTTP 429).
- Why it matters: collection pages carry the commercial category intent ("ayurvedic face care / hair care / body care products"). A generic title and no heading give search engines and shoppers little to go on.
- Where: `src/app/collections/[handle]/page.tsx` (`generateMetadata` plus the page header), reading the collection title and description from Shopify.
- Change:
  - Titles: "Shop All Ayurvedic Skincare & Hair Care | Gloveda" for `/collections/all`, and "{Collection label} | Ayurvedic {category} | Gloveda" for the others [CONFIRM wording].
  - Add a visible `<h1>` using the brand label ("Face Care" for the handle `skin-care`).
  - Add a short intro using only the approved Shop by Collection blurbs. Remove "reduce hair fall" unless T-1 approves it.
  - Use self-canonicals on paginated pages, with crawlable page links.
  - Keep the sort and filter parameter URLs disallowed.
- Owner: content, developer
- Effort: M (assumes 6 collections and copy review)
- Depends on: T-1, T-2, T-3
- Acceptance criteria:
  - Each collection URL has a unique `<title>`, one visible H1 and intro text in the server HTML.
  - `?page=2` has a self-canonical and is linked from page 1 with an `<a href>`.
- How to verify after release: fetch the server HTML of each collection and of page 2 of `/collections/all`.

### T-14: Build the product template's facts and Product JSON-LD from Shopify data, and add the missing label facts

- From: the Kumkumadi page shows no ingredient list, no pack size and no licence details, which competing listings show. Its feature icons have no alt text. "Sold out" appears on the page while Add To Cart appears on the home page. The Product JSON-LD was not checked.
- Why it matters: exact-product queries ("kumkumadi thailam") are answered by pages that state the product's facts. Structured data must match the visible price, availability and rating.
- Where: `src/app/products/[handle]/page.tsx` and its product components. Ingredient, size and licence values come from Shopify metafields.
- Change:
  - Render the ingredients, pack size and licence fields from Shopify metafields: [CONFIRM: ingredient list, pack size and Ayush licence, all taken from the packaging]. Hide a field if it is empty. Never use placeholder text.
  - Render price and availability from one Shopify variant source, so "Sold out" and Add to Cart can't disagree.
  - Output Product JSON-LD with `name`, `image`, `brand`, and `offers` (price, priceCurrency INR, availability) built from the same data.
  - Add `aggregateRating` only if the reviews source is genuine and the rating is visible on the page.
  - Give meaningful feature icons alt text, and decorative ones alt="".
  - Title pattern: "{Product name} – Ayurvedic {type} | Gloveda". For example, "Gloveda Kumkumadi Thailam – Ayurvedic Face Oil" [CONFIRM size].
- Owner: developer, content (label data)
- Effort: M (assumes metafields can be added in Shopify by the store admin; label data entry for 14 products is not counted)
- Depends on: T-1, T-2, and packaging source data
- Acceptance criteria:
  - For every product, the JSON-LD price, currency and availability equal the visible values.
  - The Rich Results Test shows a valid Product with no errors.
  - Ingredient, size and licence blocks show only approved metafield values.
- How to verify after release: run the Rich Results Test on 3 products (one in stock, one sold out, one combo). Then run a script comparing the JSON-LD to the visible price and availability for all product URLs in the sitemap.

### T-15: [COPY] (Optional) Give the brand film a dedicated watch page with an accurate VideoObject

- From: Google's video docs. Video features need an indexed watch page where the video is the main content. VideoObject requires `name`, `thumbnailUrl` and `uploadDate`; `contentUrl`, `description` and `duration` are recommended.
- Why it matters: this is the only route to the film appearing in video features. The homepage hero use will not qualify.
- Where: a new route, for example `/our-story/film` [CONFIRM route], linked from the hero with a text anchor such as "Watch the Gloveda film".
- Change:
  - Build a page whose main content is the film, with visible controls, a title, and a description of what the film shows.
  - Add VideoObject with:
    - `name`: unique, approved
    - `description`: approved, and matching the visible text
    - `thumbnailUrl`: a crawlable image, at least 60×30
    - `uploadDate`: ISO 8601 with time zone, the real first-publish date
    - `contentUrl`: the video file itself, not the page
    - `duration`: ISO 8601, the real length
  - Do not add VideoObject to the homepage hero.
- Owner: developer, content
- Effort: S (assumes the film file, poster and an approved description already exist)
- Depends on: T-1, T-8
- Acceptance criteria:
  - The watch page returns 200, is in the sitemap and is not noindexed.
  - The Rich Results Test validates the VideoObject with no errors.
  - Every VideoObject value matches the real file (duration, upload date) and the visible text.
- How to verify after release: run the Rich Results Test on the watch page, and fetch `contentUrl` and `thumbnailUrl` to confirm 200 responses. Video indexing is not guaranteed even when this is valid.

### T-16: Allow pinch-zoom and set the page language to en-IN

- From: the live viewport is `maximum-scale=1`. The page has `<html lang="en">` while the response header is `content-language: en-IN`.
- Why it matters: blocking zoom is an accessibility failure, not a ranking issue. `en-IN` is optional but matches the single-market site.
- Where: the root layout (`viewport` export, `<html lang>`).
- Change: set the viewport to `width=device-width, initial-scale=1` with no maximum-scale, and use `<html lang="en-IN">`. Do not add hreflang: there is one market.
- Owner: developer
- Effort: S
- Depends on: none known
- Acceptance criteria: the server HTML viewport has no `maximum-scale` or `user-scalable=no`, and `lang="en-IN"` is set.
- How to verify after release: check the server HTML of `/`.

---

## What not to do now

- Don't add FAQPage markup for rich results. FAQ rich results stopped appearing on 2026-05-07.
- Don't build hreflang or locale variants. The site serves one market (India, INR).
- Don't pad the homepage with keyword copy for word count, and don't repeat the brand or keywords in the title, H1 or alt text. Google treats alt keyword stuffing as spam.
- Don't reuse testimonial outcomes, counters ("10K+ Happy Customers") or any T-1 claim still marked [CONFIRM] in metadata or JSON-LD.
- Don't copy the live robots.txt comment block. It contains Shopify boilerplate text addressed to AI agents. That text is data, it was not acted on, and it doesn't affect Googlebot. The new robots.txt needs only the allow and disallow rules and the sitemap line.
- Don't spend effort on meta keywords, an llms.txt file, or sitemap priority and changefreq values.

---

## COPY REQUIREMENTS

What the hero copy must contain to satisfy T-5, T-6, T-7, T-8, T-10, T-11 and T-15. Any length below marked "heuristic" is our own screening limit, not a Google rule: Google sets no length limit and truncates to fit the device.

**Where the text lives**
- Put every word of hero copy in the server-rendered HTML: the H1, subheading, CTAs and film summary. None of it may exist only inside the film, a canvas or an image.
- Overlay the copy on the film, or place it directly under it. It must stay readable with JavaScript off, with reduced motion, and before the film loads.
- Write exactly one H1 on the homepage, as text. The header logo is an image link, not the H1.

**Brand name**
- Use one brand form everywhere: "Gloveda" (approved 2026-11-22). Use it once in the title, once in the H1, and as og:site_name and the Organization and WebSite `name`.
- Never write "Glovedaherbals" in visible copy unless it is approved. Never write "Glovedhaherbals".

**H1**
- Use the brand plus "Ayurvedic" plus a category. Draft: "Gloveda: Ayurvedic Skincare & Hair Care" (approved 2026-11-22).
- Heuristic: 70 characters or fewer, on one or two lines.

**Subheading or film summary**
- Write one or two sentences, 40 words or fewer (heuristic), describing what the film shows and what the brand offers. Use only approved facts.
- Name real product lines as the brand spells them: "Gloveda Kumkumadi Thailam", "Gloveda Face Pack", "Gloveda Pure Nature Shampoo", and so on.

**Title tag**
- Draft: "Gloveda | Ayurvedic Skincare & Hair Care Products".
- Use the brand once, add "Ayurvedic" and a category, and don't repeat words.
- Heuristic: about 60 characters or fewer.

**Meta description**
- Draft: "Shop Gloveda's Ayurvedic face, hair and body care, including Kumkumadi Thailam, Face Pack and Pure Nature Shampoo."
- Add a heritage line only once it is approved.
- Heuristic: about 155 characters or fewer.

**CTAs**
- Make the primary CTA a text link to Shop All, with text that names the destination: "Shop all Gloveda products".
- Make the secondary CTAs text links naming each collection: "Shop Face Care", "Shop Hair Care", "Shop Body Care".
- Don't use a bare "Shop now". Don't make image-only links. Don't use "#".

**Film**
- Mark the film decorative (`aria-hidden`), with a poster, a pause control, and no autoplay under reduced motion. Never burn the headline or an offer into the video as the only copy.
- If the optional watch page is built:
  - Use a text link "Watch the Gloveda film".
  - Give the VideoObject a unique `name`, a `description` matching the visible text, the real `uploadDate` with time zone, the real `duration`, a `thumbnailUrl` and a `contentUrl` pointing at the video file.
  - Don't add VideoObject to the homepage.

**Open Graph**
- og:title and og:description equal the approved title and meta description, or shorter approved variants.
- og:image is an absolute `https://` approved still with og:image:alt.

**Claims**
- Leave out, or mark [CONFIRM], each of these until it is approved and has a source: "doctor crafted", "clinically tested", "100% Natural", "Organic", "Certified", "Lab-Tested", "Cruelty-Free", "reduce hair fall", "results in 2–4 weeks", the customer counts, and "105 years".
- If "105 years" is approved, attribute it to Arya Vaidya Vilasini Vaidyasala, not Kottakkal.
- Don't put customer testimonial outcomes in the hero, the metadata or the JSON-LD.
