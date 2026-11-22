# Gloveda homepage hero: final copy set for film v7

Status: **draft for client approval** (2026-11-22). Nothing here ships until every `[CONFIRM: …]` is signed off (fix-plan T-1). Sources: `content/hero/sources.md` (IDs such as P3 or H5 refer to it). SEO tickets: `content/hero/seo-fix-plan.md`.

Film: `motion/Gloveda/out/film/gloveda_hero_v7.mp4`. ffprobe: 593 frames, 24 fps, 24.708 s, 1920×1080, video only (no audio track). It plays once and rests on its last frame.

## How this set was built

- **Rankings.** The three judges disagreed:
  - Brand voice: botanical, then modern, then heritage.
  - UX: heritage, then modern, then botanical.
  - SEO: heritage, then modern, then botanical.
  
  Heritage ranks first on the combined ranking, so this set uses its structure:
  - the offer comes first in the subheadline;
  - the hero text is never hidden;
  - the film description is accurate;
  - the CTA set is complete;
  - Organization markup is handled carefully.
  
  Heritage's own subject matter (105 years, 1921, the institution) is unapproved and the sources conflict. So the default copy is **heritage-free**, and the heritage version is held as the alternate pair in §8.
- **Lines taken from the other drafts:**
  - From botanical: the brand voice ("Care, not correction.", "From botanicals at first light to your ritual") and silence over the paper dawn, the fan, the line-up and the logo.
  - From modern: the functional eyebrow, the "Gloveda Face Wash" caption, the visible film caption, the plain play/pause button and the f510 share image.
- **Judge problems fixed:**
  - The hero block now sits **under the film** at every width. It never covers the packs, and it has room for all the text.
  - "refined over generations" is used **0 times** by default.
  - The brand name appears once each in the H1, subheadline, primary CTA and story link: 4 times in the block. The anchors need it to be descriptive. The film caption adds more mentions, because it names the packs.
  - Button names match their visible text (no separate aria-label).
  - No placeholder sits inside an accessible name.
  - The film text says "no dialogue, captions or narration", not "no text", because pack labels are readable in the film.
  - The poster alt lists the line-up's real end points.
  - The botanicals are not named and not tied to any product.
  - "Kerala" is not used.
  - The clichés "It begins with the plant.", "First light." and "Your ritual, your way." are cut.
  - Nothing overlays the film after f310.

Type: Marcellus only, in one weight (K3). Hierarchy comes from size, case and letter-spacing. `[CONFIRM: is a secondary sans allowed for small commerce/UI text?]` The kit names only Marcellus, while CLAUDE.md §3 asks for a sans.

Brand form: **"Gloveda"** throughout (approved by client 2026-11-22). The live title, every product title and the kit wordmark use "Gloveda" (H1, P1–P7, K1). "Gloveda Herbals" is not used as the brand form.

---

## 1. Timed overlay lines (desktop ≥ 1024 px only; sparse)

- Overlays are HTML text over the film with `aria-hidden="true"`.
- They only echo meaning that the hero HTML (§2) already carries, so nothing is lost when JavaScript is off, the film fails or reduced motion is on.
- Each line fades with opacity only: 0.4 s in and 0.4 s out, with no movement. Only one line shows at a time.
- They replay with the film.

| Beat (frames) | In → out | Line | Position | Colour / size |
|---|---|---|---|---|
| A, paper dawn (f0–167) | none | *Silence. The collage is the busiest image in the film.* | — | — |
| B, gold oil (f168–217) | none | *Silence. The botanicals are unconfirmed, and any line here would read as an ingredient claim.* | — | — |
| C, drop lands on still water (f228–259) | 9.5 → 10.8 s | **Care, not correction.** | Left third, x 6–30%, y 40–50% | Wine #56172d, at least 28 px (large text; 4.0:1 on the amber pool #bf7d3f, which passes the 3:1 large-text rule) |
| C, Face Wash rises (f262–307) | 10.9 → 12.8 s | **Gloveda Face Wash** | Right third, x 68–92%, y about 60% | Ink #2a1a1f, small caps (4.9:1 on amber). Gone before the spin swap at about f310. |
| C spin, label macro, D fan, line-up (f308–510) | none | *Silence. The shampoo label carries its own type, the fan moves across the centre, and nothing may cover the packs (x 24–76%, y 29–71%).* | — | — |
| E, keyline and logo (f511–592) | none | *Silence. The gold logo is the sign-off. Nothing goes at top centre after f544.* | — | — |

Before sign-off, check the "Gloveda Face Wash" caption against the palm-leaf shadows across the lower half of f266–300. If it competes with them, move it to y 45%.

---

## 2. Resting hero (server-rendered HTML, visible from first paint)

Placement:
- At every breakpoint, the text block sits **directly under the 16:9 film** on the client's wine website gradient (K-note in sources).
- Every judge found that a bottom-band overlay covered the line-up and the keyline poster, and did not have the height for this copy.
- The block is never faded, hidden or covered, including during playback, with JavaScript off, under reduced motion and before the film loads.
- Contrast (computed with the WCAG formula):
  - Ivory #fcf9f4 on #3a0b1d: 16.1:1.
  - Gold #bd9c61 on #3a0b1d: 6.5:1.
  - Gold on #1d050e: 7.5:1.

| Element | Copy | Treatment |
|---|---|---|
| Eyebrow (`<p>`) | Face Care · Hair Care · Body Care | Gold #bd9c61, caps, letter-spacing 0.18em, about 13 px |
| **H1** (the only H1 on `/`) | **Gloveda: Ayurvedic Skincare & Hair Care** (39 characters) | Ivory. "Gloveda" set as a small tracked caps line above the rest. |
| Subheadline (`<p>`, 22 words) | From botanicals at first light to your ritual: Ayurvedic face, hair and body care, from Gloveda Kumkumadi Thailam to Pure Nature Shampoo. | Ivory at 85% opacity, about 18 px |
| Primary CTA (`<a>` styled as a button) | **Shop all Gloveda products** → `/collections/all` | Ivory text with a gold rule |
| Secondary CTAs (`<a>` text links) | **Shop Face Care** → `/collections/skin-care` · **Shop Hair Care** → `/collections/hair-care` · **Shop Body Care** → `/collections/body-care` | Ivory, caps |
| Story link (`<a>`) | **Read the Gloveda story** → `/pages/about-us` (or the new Our Story route, per T-4) | Text link |
| Optional, only if the watch page is built | **Watch the Gloveda film** → `[CONFIRM: route, e.g. /our-story/film]` | Text link |
| Film caption (visible `<p class="film-caption">` directly under the film, above the eyebrow or after the CTAs) | About the film: about 25 seconds, with no dialogue, captions or narration. A butterfly lands on Gloveda Kumkumadi Thailam in a paper-cut dawn. Real botanicals drift in drops of warm gold oil and merge into one. A drop falls onto still water, and Gloveda Face Wash rises from it and turns into Pure Nature Shampoo. Seven Gloveda products settle into a row at dusk, gold lines trace them, and the Gloveda logo draws on. | Ivory at 70% opacity, about 14 px (74 words) |

Markup, so that the DOM text is exactly the H1:

```html
<h1><span class="h1-brand">Gloveda</span><span class="visually-hidden">: </span> <span class="h1-line">Ayurvedic Skincare &amp; Hair Care</span></h1>
```

Apply any change of case with CSS `text-transform`, not by editing the text.

Copy notes:
- "first light" describes the film's dawn opening. "your ritual" follows the brand's own use of "ritual" (P1, P6). "daily" is left out on purpose, because Kumkumadi is used "3–4 times a week" (P6).
- `[CONFIRM: subheadline opener "From botanicals at first light to your ritual" is new creative copy]`.
- `[CONFIRM: Kumkumadi Thailam and Pure Nature Shampoo are in stock at launch]`. The Kumkumadi page showed "Sold out".
- The subheadline uses one shared "Gloveda" prefix for the product pair instead of repeating the brand.

Not used anywhere: "Shop now", image-only links, `href="#"`.

---

## 3. Poster / reduced-motion version

- **Poster:** frame f592, the final keyline frame: gold outlines and the gold logo on wine. It is the same image the film rests on, so the end of playback and the poster look the same.
- The copy in §2 stays word for word and in the same place, under the film. Because it never sits on the poster, it does not compete with the logo.
- Under `prefers-reduced-motion: reduce` the film does not autoplay and shows the poster. A visible **Play film** button is available. No overlays are shown.
- When motion is allowed, JavaScript starts playback; there is no `autoplay` attribute. With JavaScript off, the poster shows with the same HTML copy and no controls.
- Fallback `<img>`: use it only where the poster is a real image element (no-JS, load failure). Alt text (131 characters): "Gold line drawings of seven Gloveda products, from Face Mask to Face Pack, beneath the gold Gloveda logo on a deep wine background."

---

## 4. Mobile variant (320–390 px)

The DOM is the same and only the sizes change, so there is still exactly one H1. The film is a full-width 16:9 band (about 180–220 px tall) with the text block below it and a 16 px side gutter. There are no overlays.

| Element | Mobile rendering |
|---|---|
| Eyebrow | Face · Hair · Body. The mobile-only short form is the same element, with the long form visually hidden. |
| H1 | "GLOVEDA" small caps line, then "Ayurvedic Skincare & Hair Care" at 28–30 px (wraps to 2 lines at 320 px) |
| Subheadline | The same 22 words at 16 px (about 5 lines) |
| Primary CTA | **Shop all Gloveda products**, full width, at least 48 px tall |
| Collection links | Inside `<nav aria-label="Shop by collection">`: "Face Care · Hair Care · Body Care", with a visually hidden "Shop " prefix so each accessible name contains the visible text. Tap targets at least 44 px. |
| Story link | **Read the Gloveda story** |
| Film caption | The same text, collapsed after the first sentence behind a "More about the film" text button. The full text stays in the server HTML. |
| Control | **Pause film** / **Play film** button with a text label, bottom right of the film band |

Fold check: at 320×568, with a header of about 56 px and a film of about 180 px, the H1 starts at about 250 px and the primary CTA should sit above the fold. Verify this in the browser.

---

## 5. Accessible text

- **Video:** `<video muted playsinline preload="metadata" poster="[f592 still]" aria-hidden="true">`. It has no `loop`, because the film is meant to play once and rest (storyboard shot 12; F6). It has no audio track (F1).
- **Text alternative:** the visible film caption in §2 is the text alternative. Give the film figure `aria-describedby="film-caption"`.
- **Visually hidden description:** ship this only if design removes the visible caption, so that screen-reader users do not hear the same thing twice:
  > Film, about 25 seconds, no sound. A paper-cut dawn with Gloveda Kumkumadi Thailam; botanicals in warm gold oil; Face Wash rising from still water and turning into Pure Nature Shampoo; seven Gloveda products in a row; the Gloveda logo drawn in gold.

  Place it after the CTAs in the DOM.
- **Control:** one plain `<button>` whose accessible name is its visible text. It has no aria-label and no aria-pressed. It is focusable and has a visible focus ring.

  | State | Visible text = accessible name |
  |---|---|
  | Playing | Pause film |
  | Paused, or reduced motion before starting | Play film |
  | Ended | Replay film |

  Optional polite live region after a toggle: "Film paused" / "Film playing".

---

## 6. SEO

| Field | Value | Length |
|---|---|---|
| `<title>` | Gloveda \| Ayurvedic Skincare & Hair Care Products | 49 characters |
| Meta description | Shop Gloveda's Ayurvedic face, hair and body care, including Kumkumadi Thailam, Face Pack and Pure Nature Shampoo. | 114 characters |
| Meta description, in-stock fallback | Shop Gloveda's Ayurvedic face, hair and body care, including Kumkumadi Thailam, Massage Oil and Pure Nature Shampoo. | 116 characters |
| H1 | Gloveda: Ayurvedic Skincare & Hair Care | 39 characters |
| Subheadline | as in §2 | 22 words |
| CTA anchors | "Shop all Gloveda products", "Shop Face Care", "Shop Hair Care", "Shop Body Care", "Read the Gloveda story", optional "Watch the Gloveda film" | All are real `<a href>` links |
| og:title / twitter:title | Gloveda \| Ayurvedic Skincare & Hair Care Products | = title |
| og:description / twitter:description | = the meta description that ships | |
| og:site_name | Gloveda. Never "Glovedaherbals" or "Glovedhaherbals". | |
| og:type / og:url | website / https://glovedaherbals.com/ (or the new canonical origin) | |
| og:image (+ og:image:secure_url) | Absolute `https://` URL of the f510 line-up still, cropped to 1200×630 `[FILL: URL]`. `[CONFIRM: labels legible at 1200×630]`, otherwise use f592. | |
| og:image:alt | Seven Gloveda products in a row at dusk: Face Mask, Face Wash, Kumkumadi Thailam, Pure Nature Shampoo, Massage Oil, Conditioner and Face Pack. | |
| twitter:card | summary_large_image | |
| Fallback poster img alt | as in §3 | 131 characters |

Meta description notes:
- `[CONFIRM: Face Pack is in stock at launch]`. The feed showed it sold out (P2). If it is still sold out, use the in-stock fallback, after `[CONFIRM: Massage Oil and Kumkumadi Thailam in stock]`.
- Add a heritage line only after T-1 approves one (see §8).

Search terms used naturally, each once in the title: the brand ("Gloveda") plus the category in the brand's own words ("Ayurvedic Skincare & Hair Care Products", the live meta title H1), and the exact product names people search ("Kumkumadi Thailam", "Pure Nature Shampoo"). No term is repeated within a field.

**Organization and WebSite JSON-LD** (root layout):

```json
{"@context":"https://schema.org","@graph":[
 {"@type":"Organization","@id":"https://glovedaherbals.com/#org","name":"Gloveda","url":"https://glovedaherbals.com/","logo":"[FILL: absolute https URL of the approved logo file]",
  "sameAs":["https://www.facebook.com/glovedaofficial","https://www.instagram.com/glovedaofficial/","https://www.youtube.com/@glovedaofficial"]},
 {"@type":"WebSite","@id":"https://glovedaherbals.com/#website","name":"Gloveda","url":"https://glovedaherbals.com/","publisher":{"@id":"https://glovedaherbals.com/#org"}}
]}
```

- `name` is "Gloveda" (approved brand form).
- Add `alternateName` only if a variant such as "Gloveda Herbals" is approved `[CONFIRM]`.
- Address and telephone are **omitted** until the business confirms they are Gloveda's. The footer address is Arya Vaidya Vilasini Vaidya Sala's (H13). `[CONFIRM]`
- There are no heritage, rating, review or claim fields.
- There is no VideoObject on the homepage.

**VideoObject**: use it only on the optional watch page (T-15), never on `/`.

```json
{"@context":"https://schema.org","@type":"VideoObject",
 "name":"[CONFIRM: film title, e.g. \"The Gloveda Film\"]",
 "description":"A film of about 25 seconds with no dialogue, captions or narration. A butterfly lands on Gloveda Kumkumadi Thailam in a paper-cut dawn; real botanicals drift in drops of warm gold oil; Gloveda Face Wash rises from still water and turns into Pure Nature Shampoo; seven Gloveda products settle into a row at dusk and the Gloveda logo draws on in gold.",
 "thumbnailUrl":"[FILL: absolute https URL of the approved still, at least 60x30]",
 "uploadDate":"[FILL: real first-publish date-time with time zone, e.g. 2026-12-01T10:00:00+05:30]",
 "duration":"[FILL from ffprobe on the published encode; the v7 master measures 24.708 s = PT24.708S]",
 "contentUrl":"[FILL: absolute https URL of the .mp4 file itself]",
 "creator":{"@type":"Organization","name":"Gloveda","url":"https://glovedaherbals.com/"}}
```

The `description` must match the visible text on the watch page. Leave out `expires`.

Claims kept out of the title, meta, H1, OG and JSON-LD:
- "doctor crafted", "clinically tested", "100% Natural", "Organic", "Certified", "Lab-Tested", "Cruelty-Free";
- "reduce hair fall", "results in 2–4 weeks";
- customer counts and testimonial outcomes;
- all scar, heal and pigmentation language;
- "105 years", "a century" and "1921", which appear only in the held alternate in §8.

---

## 7. SEO checklist: how each [COPY] ticket in seo-fix-plan.md is met

| Ticket | Requirement | How this copy meets it | Status |
|---|---|---|---|
| **T-5** H1 | Exactly one text `<h1>` in the server HTML with the brand form plus "Ayurvedic" and a category. Not inside the video, canvas or an image. Readable with JS off, reduced motion and before the film loads. | "Gloveda: Ayurvedic Skincare & Hair Care" (39 characters) is real text in the block under the film, never faded. The header logo stays an image link with alt "Gloveda". | Met. Uses "Ayurvedic", so it passes T-5 literally. The plan's own draft ("…Inspired by Ayurveda") would not. H1 and brand form approved 2026-11-22. |
| **T-6** title + meta | Brand once, "Ayurvedic" plus a category, no repeated words. Unique meta with approved claims and real product names. | Title: 49 characters, "Gloveda" once, no theme suffix. Meta: the plan draft word for word (114 characters), or the in-stock fallback. No heritage line. | Met. Pending stock `[CONFIRM]`. The dev must stop the layout `title.template` from appending the brand a second time. |
| **T-7** CTAs | Crawlable `<a href>` to Shop All and each collection with descriptive anchors. No "#", no image-only links, no bare "Shop now". | "Shop all Gloveda products" → /collections/all; "Shop Face Care / Hair Care / Body Care" → the three real handles; "Read the Gloveda story". The mobile "Shop " prefix is visually hidden but stays in the accessible name. | Met. Final routes come from T-4. |
| **T-8** film | Decorative film with a poster, a pause control and no reduced-motion autoplay. Story as visible text in the server HTML. Nothing burned in as the only copy. H1 and CTAs never covered. | `aria-hidden` video, f592 poster, Pause/Play/Replay button, JS-started playback, a visible "About the film" caption in the server HTML, the text block under the film. Overlays are decorative echoes only. | Met, with one deliberate deviation: no `loop` (the plan's sample markup has it), because the approved film plays once and rests on the poster frame. |
| **T-10** JSON-LD | Organization and WebSite `name` from T-3, `url`, `logo`, `sameAs` with only the 3 real profiles, no empty strings, address as in the footer, no claim fields. | See §6: the empty `sameAs` strings are removed; name "Gloveda" matches the H1 and title. | Met except the address. It is held because the footer address belongs to the parent institution. **Amend T-10** so the address is `[CONFIRM: Gloveda's own business address]` before it is used. |
| **T-11** OG/Twitter | og:title and og:description = title and meta (or approved shorter versions). og:site_name = brand form. Absolute https og:image with alt. summary_large_image. | og = title and meta exactly, so no extra copy needs approval. og:image is the f510 https still with full alt text. | Met. Pending the og:image URL `[FILL]` and the legibility `[CONFIRM]`. |
| **T-15** watch page (optional) | Text link "Watch the Gloveda film". VideoObject with a unique name, a description matching the visible text, real uploadDate with time zone, real duration, thumbnailUrl, contentUrl. Not on the homepage. | The link is in §2 (optional). The VideoObject draft in §6 reuses the visible caption as its description and has the measured duration. | Ready to build. Name, route, thumbnail, upload date and content URL are `[CONFIRM]`/`[FILL]`. |
| Claims (COPY requirements) | Leave out the listed claims; "105 years" only if approved and attributed to the institution. | None of the listed claims is used by default. Heritage appears only in §8, attributed to Arya Vaidya Vilasini Vaidya Sala, never Kottakkal. | Met |

Two fixes to make in seo-fix-plan.md:
1. T-5's sample H1 fails T-5's own acceptance test ("Ayurveda" vs "Ayurvedic"). Replace the sample with this H1.
2. T-10's instruction to copy the footer address needs the `[CONFIRM]` described above.

---

## 8. Alternate pair for the client to compare (heritage-led; approved-only)

Use this only after the heritage wording, the institution spelling and brand-level use of "refined over generations" are approved.

- **H1** (65 characters): Gloveda: Ayurvedic skincare & hair care, refined over generations
- **Subheadline** (24 words, not counting the placeholder): From the Ayurvedic tradition of Arya Vaidya Vilasini Vaidya Sala, Kozhikode `[CONFIRM: heritage wording, spelling "Vaidya Sala"/"Vaidyasala", approval to name it]`: face, hair and body care, from Gloveda Kumkumadi Thailam to Pure Nature Shampoo.
- **Eyebrow:** `[CONFIRM: "105 years" / "a century" / "since 1921"]`, always attached to the institution name and never shown as Gloveda's own age.
  - Example: "ARYA VAIDYA VILASINI VAIDYA SALA · EST. 1921" (A4).
- If chosen, do **not** also run any overlay containing "refined over generations".
- Matching meta (approved-only): "Gloveda's Ayurvedic face, hair and body care, born from Arya Vaidya Vilasini Vaidya Sala's `[CONFIRM: 105-year / centenary]` legacy. Shop Kumkumadi Thailam and more." Recount it to 155 characters or fewer once the wording is final.

Why it is not the default:
- The sources conflict:
  - About page: "established in 1921".
  - Home page: "105 years".
  - The brand's own press page: The Hindu, February 2026, "Centenary Celebrations".
- "refined over generations" is product copy (P3, P4, P6). In an H1 it implies Gloveda's own longevity, and Gloveda's launch year is unknown.

---

## 9. Source table (every factual line → verbatim source)

| Line in this copy | Source (ID in sources.md) | Verbatim |
|---|---|---|
| Brand form "Gloveda" | K1, H1, P1–P7 | Wordmark "GLOVEDA"; title "… \| Gloveda"; product titles "Gloveda …" |
| H1 "Ayurvedic Skincare & Hair Care"; title "Ayurvedic Skincare & Hair Care Products" | H1 | "Ayurvedic Skincare & Hair Care Products \| Gloveda" |
| Eyebrow and links "Face Care / Hair Care / Body Care" | H17 + handles | Menu "Face Care", "Hair Care", "Body Care"; /collections/skin-care, /hair-care, /body-care |
| "Ayurvedic face, hair and body care" | H17, H1 | Collection labels plus the "Ayurvedic" category term |
| "botanicals" | H11/H12 (brand-level wording only; the claims in those lines are held) | "pure herbs, botanicals, and essential oils" |
| "your ritual" | P1, P6 | "the final step in your hair care ritual"; "as part of your skincare ritual" |
| "first light" | F2 | The film opens on a paper-cut sunrise (visual description, not a claim) |
| "Care, not correction." | P3, P4 (tile *near-verbatim*) | "Designed for care, not correction"; "Formulated for care, not correction" |
| Product names | P1–P7 | "Gloveda Kumkumadi Thailam", "Gloveda Pure Nature Shampoo", "Gloveda Face Wash", "Gloveda Face Pack", "Gloveda Face Mask", "Gloveda Massage Oil", "Gloveda Conditioner" |
| Film caption, VideoObject description, sr-only text | F1–F6, F8 | Measured duration 24.708 s and no audio; butterfly on Kumkumadi; drops of gold oil merging; Face Wash rises and turns into the Shampoo; row of seven; keyline and logo |
| Line-up order (og:image:alt, poster alt) | F5 | Face Mask, Face Wash, Kumkumadi Thailam, Pure Nature Shampoo, Massage Oil, Conditioner, Face Pack |
| "no dialogue, captions or narration" | F1, F8 | No audio stream; on-pack type is visible, no captions are burned in |
| sameAs URLs | H (social) | facebook.com/glovedaofficial, instagram.com/glovedaofficial/, youtube.com/@glovedaofficial |
| Colours and type | K2, K3, design-system note | "#56172d … #fcf9f4"; "Heading font: Marcellus"; gold "not for text on ivory" |
| Alternate: "Arya Vaidya Vilasini Vaidya Sala", "Kozhikode", "Est. 1921" | A4, H13 | "established in 1921"; "Kozhikode – 673611" |
| Alternate: "refined over generations" | P3, P4, P6 | "Intentional care, refined over generations"; "Ayurvedic care, refined over generations" |

---

## 10. Needs your confirmation

1. ~~**Brand form**~~: **"Gloveda"** (approved by client 2026-11-22).
2. ~~**H1**~~: "Gloveda: Ayurvedic Skincare & Hair Care" and the title "Gloveda | Ayurvedic Skincare & Hair Care Products" (approved by client 2026-11-22).
3. **Subheadline opener** "From botanicals at first light to your ritual" (new creative copy).
4. **Overlay "Care, not correction."** used at brand level. The product-page tile form was read through a summariser, so check it by eye.
5. **Stock at launch** for every product named in the subheadline, meta and OG: Kumkumadi Thailam (the page showed "Sold out"), Pure Nature Shampoo, Face Pack (sold out in the feed), and Massage Oil for the fallback.
6. **Heritage wording** for the alternate: "105 years", "a century" or "since 1921". It must be attached to the institution only.
7. **Institution spelling:** "Vaidya Sala" or "Vaidyasala", and approval to name it.
8. **Gloveda's own launch year.** Needed before any dated line.
9. **"refined over generations" at brand level** (alternate H1 only).
10. **Botanical names** in beat B (saffron, liquorice/Yashtimadhu, madder/Manjistha) and which product each belongs to. Needed before any copy or alt text names them.
11. **Organization address and telephone.** Are they Gloveda's, or only the parent institution's?
12. **og:image:** the f510 still, with labels legible at 1200×630 (otherwise f592), and its https URL `[FILL]`.
13. **Watch page:** whether to build it, its route, and the film title.
14. **VideoObject values** `[FILL]`: thumbnailUrl, uploadDate with time zone, duration from the published encode, contentUrl.
15. **Logo file URL** for the Organization `logo` `[FILL]`.
16. **Secondary UI font:** is a sans allowed for small commerce text, or is it Marcellus only?
17. **Shampoo label line** shown in the film ("Delicately cleanses and repairs to unveil a frizz-free, naturally radiant hair"). Does it match the approved label artwork?

## Re-audit log (final pass against sources.md)

- **Lengths, measured with `wc`:** title 49, H1 39, meta 114 and 116, alternate H1 65, poster alt 131 characters; subheadline 22 words.
- **Duration:** re-measured with ffprobe at 24.708 s, 24 fps, no audio track, which removes the earlier "no sound?" question. The "about 25 seconds" wording stands.
- **Fixes made in this pass:**
  - "no on-screen text" is not used anywhere.
  - No line implies the botanicals are Kumkumadi ingredients: the caption separates the butterfly beat from the oil beat.
  - "Kerala" is removed.
  - "daily" is removed.
  - The aria-labels are removed so that button names match their visible text.
  - Address and telephone are held out of the JSON-LD.
- **Checked:** no efficacy, medical, certification, testimonial, count or heritage claim appears in the default copy.
- **Still unverified:**
  - The overlay contrast against the actual frames. The figures above use a sampled amber value (191,125,63), not every frame.
  - The mobile fold position.
  - Label legibility at OG size.
