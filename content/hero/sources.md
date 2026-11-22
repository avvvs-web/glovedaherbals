# Gloveda source dossier (verbatim quotes, with locations)

Compiled 2026-11-22 for the homepage hero copy. Later pages can reuse it. Every quote below is copied as the source wrote it, typos included. Being quoted here does NOT mean a line is approved: claims marked **HOLD** must not be reused until the brand signs them off (CLAUDE.md §3 and §9).

How the sources were read:
- Branding kit: `gloveda-branding-kit.pdf` (repo root), 1 page, Canva, created 2026-11-05. Read with pdftotext and a PyMuPDF render.
- Live store: https://glovedaherbals.com, read 2026-11-22. Product copy is the Shopify `products.json` `body_html` (exact). The home and About pages were downloaded as HTML and stripped to text (exact). Some product-page badges, tiles and FAQ lines were read through WebFetch, which summarises, so they are marked *near-verbatim* and need checking by eye.
- Older Shopify export: `C:/Users/arjun/Downloads/gloveda/reference/products.json` (2026-11-12).
- Film: `motion/Gloveda/out/film/gloveda_hero_v7.mp4`, its contact sheet, report JSON and `storyboard-v7.html`.

---

## K. Branding kit (gloveda-branding-kit.pdf, p.1)

| ID | Verbatim | Note |
|---|---|---|
| K1 | Wordmark "GLOVEDA" (logo artwork, all caps) | The only brand-name form in the kit. "Gloveda Herbals" and "Herbals" do not appear. |
| K2 | "#56172d" "#8f4138" "#bd9c61" "#500e29" "#fcf9f4" | Colour swatches, left to right. The kit gives no names. |
| K3 | "Heading font: Marcellus" / "body font:  Marcellus" | One typeface for headings and body. |
| K4 | "Primary logo" / "Secondary Logo"; variants "Vector Light Background Logo", "vector dark Background Logo[to put in dark bg]", "logo with light Background", "logo with dark Background" | No clear-space or misuse rules. |
| K5 | PDF metadata title "Gloveda, revive, expereince KIT"; author "AVVVS clinic " | File metadata only, not on-page copy. Not approved copy. |

The kit has no tagline, story, heritage, product names, ingredients or claims.

Design-system memory note (`gloveda-design-system.md`, not the kit): gold #bd9c61 is "not for text on ivory"; ink #2a1a1f; sand #f3ece1. Client-chosen website background (`build/F_keyline/CLIENT_NOTE_v3_background.md`): radial-gradient(120% 80% at 75% 0%, #7a2238 0%, transparent 55%), radial-gradient(90% 70% at 0% 100%, #6b2a22 0%, transparent 60%), linear-gradient(180deg, #3a0b1d, #1d050e).

## H. Home page (https://glovedaherbals.com/)

| ID | Verbatim | Location | Status |
|---|---|---|---|
| H1 | "Ayurvedic Skincare & Hair Care Products \| Gloveda" | `<title>` (the theme appends " – Glovedaherbals") | OK to reuse |
| H2 | "Discover Gloveda's doctor crafted Ayurvedic skincare and hair care products. Rooted in 105 years of Ayurvedic heritage, explore thoughtfully formulated herbal beauty rituals." | meta description | HOLD ("doctor crafted", "105 years") |
| H3 | "Rooted in 105 Years of Ayurvedic Wisdom" | marquee / H2 | HOLD (heritage wording) |
| H4 | "Doctor Crafted Herbal Formulations" | marquee / H2 | HOLD |
| H5 | "Herbal Skincare & Hair Care Inspired by Ayurveda" | marquee / H2 | OK |
| H6 | "Gentle Care. Thoughtful Ingredients. Conscious Beauty." | marquee / H2 and footer | OK |
| H7 | "Discover thoughtfully crafted Ayurvedic solutions designed to nourish, protect, and rejuvenate your skin naturally, supporting long-lasting health and radiant glow." | Shop by Collection intro | HOLD (outcome language) |
| H8 | Face Care: "Targeted face care solutions that brighten, hydrate, and repair—crafted to enhance radiance while maintaining skin balance" | collection blurb | Check with T-1 before reuse |
| H9 | Hair Care: "Ayurvedic hair care crafted to strengthen roots, reduce hair fall, and restore natural shine using time-tested herbal formulations." | collection blurb | HOLD ("reduce hair fall") |
| H10 | Body Care: "Holistic Ayurvedic skincare made with pure herbs and botanical extracts to cleanse, hydrate, and restore your skin's natural glow." | collection blurb | Check with T-1 |
| H11 | "Gloveda creates authentic Ayurvedic skincare and haircare rooted in nature and perfected through generations of healing wisdom. Our formulations are doctor-crafted using pure herbs, botanicals, and essential oils to gently nourish, protect, and restore natural balance. …" | "Nature Loving Ayurvedic Care" section | HOLD ("doctor-crafted", "healing") |
| H12 | "Gloveda blends Ayurveda's time-tested wisdom with modern skincare needs. Born from Arya Vaidya Vilasini Vaidyasala's 105 years legacy, our clinically tested formulations use pure herbs, botanicals, and essential oils to nourish, heal, and rejuvenate." | footer "Inspired by Generations of Ayurvedic Care" | HOLD ("105 years", "clinically tested", "heal") |
| H13 | "ARYA VAIDYA VILASINI VAIDYA SALA / NV Road, Kakkodi / Kozhikode – 673611"; phone +91 80892 02092 | footer address | The address belongs to the parent institution. Gloveda's own address is unconfirmed. |
| H14 | Counters "105+ Years Expertise" / "15+ Ayurvedic Products" / "10K+ Happy Customers" (filled by JavaScript; the server HTML has "+ Years Expertise" etc.) | stats row | HOLD (About page says 50+) |
| H15 | "Free Shipping / On Order Above 499." "Easy Returns / 30 - Days Return Policy" "Support / 24/7 Free Support" "100% Authentic / Certified Products" | trust row | HOLD ("Certified": no body named) |
| H16 | Testimonials (Navya, Mubeena, Rena Fathima, "Kerala, India"); "*Individual results may vary. Ayurveda rewards consistency." | testimonials | Do not reuse outcomes |
| H17 | Menu: "Face Care", "Hair Care", "Body Care", "Best Sellers", "Combos & Gifting", "Ayurvedic Hair Rituals", "Daily Glow Regimen", "Body Wellness Picks" | navigation | OK |
| H18 | "© 2026 Glovedhaherbals All Right Reserved"; og:site_name / Organization name "Glovedaherbals"; logo alt "Glovedaherbals" | footer, head | Typo and inconsistent brand forms |

Collection handles (sitemap): Face Care = /collections/skin-care; /collections/hair-care; /collections/body-care; /collections/best-sellers; /collections/gloveda-combo; /collections/all (Shop All). Social: facebook.com/glovedaofficial, instagram.com/glovedaofficial/, youtube.com/@glovedaofficial.

## A. About / Our Story (https://glovedaherbals.com/pages/about-us)

| ID | Verbatim | Status |
|---|---|---|
| A1 | "Tradition You Can Trust" / "With decades of Ayurvedic expertise, Gloveda blends rich heritage, purity, and mindful care into every formulation. …" | OK as brand copy; check with T-1 |
| A2 | "The Gloveda Journey": "Watch how Gloveda blends time-honored Ayurvedic wisdom with modern expertise to deliver purity you can trust. …" | OK; check with T-1 |
| A3 | "The Vaidyars Who Built a Century" / "A lineage of healers, scholars and visionaries  rooted in the ancient science of Ayurveda." | HOLD (heritage wording) |
| A4 | Generation 1, "Est. 1921", "Sri. K. Neelakandan Vaidyar": "Arya Vaidya Vilasini Vaidya Sala was established in 1921 with the blessings of revered Sree Narayana Guru by Kaloor Neelakantan Vaidyar as a pharmacy preparing and dispensing Ayurveda medicines." | 1921 is the institution's date, not Gloveda's. Spelling varies (Neelakandan / Neelakantan). |
| A5 | Generation 2, "Est. 1960", "Sri. K.N Ramadas Vaidyar" … "succeeded by his son Ramdas Vaidyar" | Spelling varies (Ramadas / Ramdas). |
| A6 | Specialist quote: "A Century of Ayurvedic Care: Designed to support skin gently, consistently, and safely"; mentions Kumkumadi Thailam with "pure Kashmiri saffron, goat milk, and manjistha"; "backed by AVVVS's 105 years of Ayurvedic expertise" | HOLD (speaker not named). The only source for Kumkumadi ingredients. |
| A7 | Tiles: "Natural Oils", "Plant Actives", "Lab-Tested Formula" ("Scientifically developed formulations ensure safety, quality, and consistent results."), "Cruelty-Free" ("Responsibly made products that are never tested on animals."), "Ayurvedic Ingredients" | HOLD (Lab-Tested, Cruelty-Free) |
| A8 | "Inside Our Facility" / "Made in house with attention to quality and purity." Slides say both "Small batch" and "crafted at scale" | Internal conflict |
| A9 | "Recognized & Featured"; press page: The Hindu (Feb 2026), "Centenary Celebrations of Arya Vaidya Vilasini Vaidya Sala Begins" | Conflicts with "105 years" |

Spelling of the institution: "Vaidya Sala" (address H13, About A4, The Hindu A9) vs "Vaidyasala" (footer H12 only). Do not confuse it with Arya Vaidya Sala, Kottakkal (a different institution).

## P. The seven film products (Shopify `products.json`, `body_html`, exact)

| ID | Product (exact title) | Handle / price (INR, 2026-11-22) | Verbatim lines |
|---|---|---|---|
| P1 | Gloveda Conditioner | /products/gloveda-conditioner, Rs. 489, **sold out** | "Gloveda Conditioner is the final step in your hair care ritual—crafted to protect, nourish, and seal moisture without weighing your hair down. Thoughtfully formulated to smooth frizz, soften strands, and leave your hair with a naturally silky finish." Label image (conditioner_site_5.jpg): "Conditioner / For Soft, Frizz - Free Hair / Luxury Blend of Bringhraj, Aloe, Fenugreek / 200 ml" (small; spelling [CONFIRM]). Ritual card: "STEP 3-PROTECT". |
| P2 | Gloveda Face Pack | /products/gloveda-face-pack, Rs. 419, **sold out** | "Infused with powerful herbs like Manjistha, Yashtimadhu, Laksha, and Lodhra, …"; "inspired by the timeless wisdom of Ayurveda." HOLD: "100% natural", "detoxifies", blemish and pigmentation claims. |
| P3 | Gloveda Face Wash | /products/gloveda-face-wash, Rs. 299 | "Gentle Daily Cleanse. Deep, Mindful Care." / "Rooted in Ayurvedic wisdom, it supports clear, balanced, and healthy-looking skin with every wash." / "Designed for care, not correction" / "How to use: Pump a small amount onto wet skin. … Use morning and evening for best results." / "Intentional care, refined over generations—made for lifelong skin wellness." |
| P4 | Gloveda Pure Nature Shampoo | /products/gloveda-shampoo, Rs. 586 | "Gloveda Pure Nature Shampoo is a mindful blend inspired by time-honored care rituals." / "Formulated for care, not correction" / "Follow with Gloveda Conditioner for best results." / "Intentional care, refined over generations—made for lifelong hair wellness." On-pack line seen in the film at f350: "Delicately cleanses and repairs to unveil a frizz-free, naturally radiant hair" ([CONFIRM] against the label artwork). |
| P5 | Gloveda Massage Oil | /products/gloveda-massage-oil, Rs. 419, "Our Bestseller", 4.5/5 from 22 reviews | "Rooted in Ayurvedic wisdom. Designed for long-term skin transformation." HOLD: scar, burn, "support natural healing", "Scar Removal", "erases scars", herb count 35 (page) vs 16 (image). Closure is a dropper. |
| P6 | Gloveda Kumkumadi Thailam | /products/gloveda-kumkumadi-thailam, Rs. 1,150 (product page also showed "Sold out": [CONFIRM]) | "Revive your skin with the timeless power of Ayurveda." / "a classic Ayurvedic beauty elixir" / "has been trusted for generations" / "How to use: Take a few drops … Use 3–4 times a week or as part of your skincare ritual." / "Ayurvedic care, refined over generations — for glowing, healthy skin." On-pack in film f60: "GLOVEDA / Kumkumadi Thailam / 10 ml". No ingredient list on the product page. |
| P7 | Gloveda Face Mask | /products/gloveda-face-mask, Rs. 499, **sold out** | Directions for use (cleanse, thin layer, 10–15 minutes, rinse, moisturise, SPF 50). HOLD: "improves complexion & fades scars and acne marks". |

Shared product-page tiles (*near-verbatim*, WebFetch): "Care, not correction" / "Intentional, not instant" / "Generational refinement." / "Built for lifelong use". Badges on every product page (*near-verbatim*): "Traditional Formula", "Organic Ingredients", "100% Natural" (HOLD, no certification named).

Festive Trio (older export, 2026-11-12): "Rooted in a century of Ayurvedic heritage" / "Your ritual, your way." / "Three essentials. Countless moments of care. A century of care, perfected for you."

FAQ (*near-verbatim*): "most customers see improvements within 2–4 weeks" (HOLD); "we recommend a patch test before first use".

## F. Film v7 facts (measured or observed)

| ID | Fact | Source |
|---|---|---|
| F1 | 593 frames, 24 fps (r_frame_rate 24/1), duration 24.708333 s, 1920×1080, **video stream only (no audio track)** | ffprobe on gloveda_hero_v7.mp4, 2026-11-22 |
| F2 | Beat A f0–167: layered paper-collage backwater at sunrise in a terracotta mural border; a paper butterfly lands on the pump of the real Kumkumadi Thailam cut-out; a gold drop forms at the nozzle; inside the drop, three vellum bubbles hold botanicals | frames, storyboard-v7.html |
| F3 | Beat B f168–217: real warm gold oil; three drops each hold a real botanical (storyboard: "real saffron, liquorice and madder each in a drop, merging into one") | storyboard, frames |
| F4 | Beat C f218–349: a gold drop falls onto still water; the real Face Wash rises out of the pool (~f250–266); it spins once and comes round as the Pure Nature Shampoo (~f310); push-in on its label | frames, storyboard act III |
| F5 | Beat D f350–510: the seven packs fan out at dusk, then glide one by one into a row. Row at f510, left to right: Face Mask, Face Wash, Kumkumadi Thailam, Pure Nature Shampoo, Massage Oil, Conditioner, Face Pack | frame f510, film-pack-lineup memory note |
| F6 | Beat E f511–592: gold keylines trace each pack on the wine website gradient; the gold Gloveda logo draws on at top centre from ~f544 (monogram roughly y 5–18%); 1 s hold | frames, storyboard shot 12 ("The film plays once and rests here.") |
| F7 | Pack area during line-up and keyline: about x 24–76%, y 29–71% (reflections lower) | frame measurements |
| F8 | The film shows on-pack type (Kumkumadi label, Face Wash label, full-frame Pure Nature Shampoo label macro f340–376). No headline, caption or offer is burned in. | frames |
| F9 | Saffron Gel is not shown; the Conditioner replaces it; the Massage Oil has a dropper. No birds, mammals, deities, temples or captions. | film-pack-lineup and no-added-animals memory notes, storyboard |

## G. Google Search Central (fetched 2026-11-22)

- Title links (developers.google.com/search/docs/appearance/title-link): "Avoid repeated or boilerplate text in <title> elements." / "Brand your titles concisely."
- Snippets: "Use site-level descriptions on the main home page or other aggregation pages, and use page-level descriptions everywhere else."
- Video: "The video must be embedded on a watch page." A hero/background video being ineligible is an inference from the watch-page rules, not a quoted Google sentence.
- VideoObject required: `name`, `thumbnailUrl`, `uploadDate`; recommended include `contentUrl`, `description`, `duration`.
- Images: "alt text in images is useful as anchor text if you decide to use an image as a link."

## Not found in any brand source

Gloveda's own launch year; an official tagline; full ingredient lists; net sizes (except Conditioner 200 ml and Kumkumadi 10 ml on pack); the basis for "doctor crafted", "clinically tested", "certified", "organic", "cruelty-free"; Gloveda's own business address.
