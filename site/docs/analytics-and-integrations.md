# Store backlog: status, and the set-up that happens outside this code

Status of the developer backlog (25 November 2026). "Done" means built in this repository and checked in the browser on the local dev server. Items marked **Outside the code** are set up in Shopify, Google, Meta or WhatsApp, and need the account owner.

## Absolutely critical

| Item | Status |
|---|---|
| Pre-loading page | Done earlier: `FilmLoader` (homepage). Load time still to be measured on a phone. |
| Google Tag Manager + ecommerce events | **Done in code.** `view_item`, `add_to_cart` and `begin_checkout` are pushed to `dataLayer` (`src/lib/analytics.ts`). `purchase` comes from Shopify (below). Needs `NEXT_PUBLIC_GTM_ID`. |
| Meta Pixel, Conversions API, GA4, Clarity | **Outside the code**: set them up as tags in GTM (below). Meta CAPI: install Shopify's "Facebook & Instagram" app and turn on maximum data sharing. Verifying them (test purchase, Meta Test events, GA4 DebugView) needs those accounts. |
| WhatsApp + email order confirmation and tracking | **Outside the code.** Email: Shopify admin › Settings › Notifications (order confirmation, shipping confirmation; add a link to `/shop/track`). WhatsApp needs a WhatsApp Business API app in Shopify (for example Interakt, Wati or Gupshup) and an approved message template. |
| Order tracking page and link | **Done.** `/shop/track`, linked in the footer (Help) and the header menu. |
| Floating WhatsApp icon | **Done.** Opens a chat with +91 80892 02092 (the support line). |
| Sold out labels + Notify me | **Done.** Sold-out labels already showed. A sold-out product page now offers "Notify me", which opens WhatsApp with the request typed in. For automatic back-in-stock emails, add a Shopify back-in-stock app later. |
| Sticky mobile CTA + Buy Now | **Done.** The sticky bar already existed; "Buy now" sits under Add to bag and goes straight to checkout with that product. |
| User profile (orders, addresses, tracking) | Account page exists. Sign-in needs `SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID` (see `docs/shopify-setup.md`). |
| Terms of Use link | This site's footer already links to `/shop/policies/terms-of-service`. The "Press" mix-up is on the old live theme; fix it there or retire that theme. |
| Hero heading + subline | **Done.** H1 "A century of care, perfected for you."; subline "Gloveda Ayurvedic skincare and hair care, 105 years in the making." (keeps the search keywords out of the H1 but on the page). |
| "105 years" replaces "100" | **Done.** "A century" in Our Story and Gloveda Experience now reads "105 years". The hero keeps "A century" because that is the approved heading. |
| Category images → AI model photos | **Waiting on images.** Needs approved model photos; packaging in them must match the real products. |
| Cookie consent banner + privacy policy | **Done.** Banner on every page; tags load only after "Accept"; "Cookie settings" in the footer reopens it. The privacy policy's Cookies section names the tags. Legal review still needed. |
| Mobile page speed | Not started: needs a Lighthouse / PageSpeed run on the deployed site first. |

## Essential

| Item | Status |
|---|---|
| Checkout step indicator | **Done** in the bag (Bag, Delivery details, Payment). Steps after that are Shopify's own checkout. |
| Search with synonyms | **Done.** Added pimple/acne, hairfall, dandruff, glow, tan, ageing and other everyday words to `smart-search.ts`. |
| Product page: value proposition, ingredients, weight/volume, "Who this works best for", trust signals | Lede, "Made for" and trust signals exist. Ingredients and net weight/volume are not in the Shopify data: add them as product metafields and they can be shown. |
| Ingredients mapped to benefits | Needs approved ingredient data (as above). |
| Review dates, replies, testimonials linked to products | Reviews come from Loox; dates and replies are Loox settings. |
| Alt text | Product images use Shopify's alt text; fill in alt text in Shopify admin for every product image. |
| Free shipping progress slider | **Done** in the bag, using the ₹499 threshold from the shipping policy (`FREE_SHIPPING_FROM` in `content/policies.ts`). The policy still lists that figure as one to confirm. |
| Shop by concern | Done earlier (`/shop/concerns`). |
| Abandoned cart (WhatsApp + email) | **Outside the code**: Shopify › Marketing › Automations (email); the WhatsApp app above for WhatsApp. |
| COD with OTP | **Outside the code**: a Shopify COD app with OTP (for example GoKwik or Shiprocket Checkout). |
| Pincode delivery checker | Needs the courier's serviceability API (for example Shiprocket) and its key. |
| Mobile-first ad landing pages | Not started: needs the ad campaigns and offers. |
| Schema markup | Product (with rating) and FAQ already exist. |
| Product feeds (Meta, Google Merchant Center) | **Outside the code**: Shopify's Google & YouTube and Facebook & Instagram apps create the feeds. |

The "Good to have" list has not been started.

## Setting up Google Tag Manager

1. Create a GTM web container and put its id in `NEXT_PUBLIC_GTM_ID` (Vercel environment variables and `.env.local`).
2. In GTM add:
   - **GA4**: a Google tag with the GA4 measurement id, plus a GA4 Event tag triggered by the custom events `view_item`, `add_to_cart` and `begin_checkout`, with "Send ecommerce data" on.
   - **Meta Pixel**: the Meta Pixel base code (Custom HTML) on All Pages, plus `ViewContent`, `AddToCart` and `InitiateCheckout` on the same three events.
   - **Microsoft Clarity**: the Clarity tag (template from the Community Template Gallery) on All Pages.
3. Publish, then use GTM Preview, GA4 DebugView and Meta Test events to check each event fires once.

The site never loads GTM until the visitor clicks Accept, so test with cookies accepted.

## Purchase events (Shopify custom pixel)

The purchase happens on Shopify's checkout, so it is sent from there. In Shopify admin › Settings › Customer events › Add custom pixel, paste the following, replacing `GTM-XXXXXXX`:

```js
// Loads the same GTM container inside Shopify's checkout sandbox and sends GA4's purchase event.
window.dataLayer = window.dataLayer || [];
(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  var f = d.getElementsByTagName(s)[0], j = d.createElement(s);
  j.async = true;
  j.src = "https://www.googletagmanager.com/gtm.js?id=" + i;
  f.parentNode.insertBefore(j, f);
})(window, document, "script", "dataLayer", "GTM-XXXXXXX");

analytics.subscribe("checkout_completed", (event) => {
  const c = event.data.checkout;
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "purchase",
    ecommerce: {
      transaction_id: c.order?.id,
      currency: c.currencyCode,
      value: c.totalPrice?.amount,
      tax: c.totalTax?.amount,
      shipping: c.shippingLine?.price?.amount,
      items: c.lineItems.map((li) => ({
        item_id: li.variant?.id,
        item_name: li.title,
        price: li.variant?.price?.amount,
        quantity: li.quantity,
      })),
    },
  });
});
```

`checkout.totalPrice` and `checkout.lineItems` are confirmed in Shopify's `checkout_completed` docs (shopify.dev/docs/api/web-pixels-api/standard-events/checkout_completed). Check the other field names there before going live. Set the pixel's customer-privacy permission to "Analytics/Marketing", so Shopify applies the shopper's consent on checkout. If Shopify's Facebook & Instagram app also sends Purchase to Meta, do not add a Meta Purchase tag in GTM as well, or purchases are counted twice.
