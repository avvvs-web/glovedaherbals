# Connecting the new site to Shopify

What the Gloveda Herbals team needs to do in Shopify, what value each step produces, and where that value goes. Check progress at any time with:

```
npm run check:shopify
```

State on 2026-11-28: the Headless channel is installed again, with one storefront ("Glovedaherbals Headless") for `herbals.gloveda.co`. All 21 products are published to it, the public Storefront API token answers (version `2026-10`), and the Customer Account API has its client ID and the three `herbals.gloveda.co` addresses of step 3. The keys are in `.env.local`; they are not in the Vercel project yet. Sign-in and the account pages use the Customer Account API. The shop's pages still read the public catalogue and use the cart link (see "Checkout" below).

## 1. Public catalogue: done

The shop already reads products, prices, stock, photos and collections from the store's public catalogue (`SHOPIFY_PUBLIC_STORE_URL`). No token is needed. Checkout hands over to Shopify's own cart.

## 2. Storefront API

Unlocks: a real Shopify cart (in place of the cart link), banners managed in Shopify, review scores read from Shopify, and the newsletter sign-up.

In the Shopify admin (steps from shopify.dev, "Getting started with the Storefront API"):

1. Install the **Headless** channel from the Shopify App Store.
2. On installation, choose **Create storefront**. This generates a public and a private access token.
3. Open the storefront, and beside **Storefront API permissions** choose **Edit**. Allow reading products, collections, metaobjects and product metafields, and creating carts.
4. Publish the products to the Headless channel so they are available to it.

Send back, for `.env.local`:

| Value | Variable |
|---|---|
| The store's permanent domain (`….myshopify.com`) | `SHOPIFY_STORE_DOMAIN` |
| The **public** Storefront API access token | `SHOPIFY_STOREFRONT_ACCESS_TOKEN` |
| A supported API version (`YYYY-MM`, from Shopify's release calendar) | `SHOPIFY_STOREFRONT_API_VERSION` |

Never send an Admin API token; the site does not need one.

## 3. Customer accounts (sign-in, orders, addresses)

Unlocks: sign-in, order history, reorder, saved addresses. Sign-in happens on Shopify's own page; this site never sees a password.

In the same Headless storefront, open **Customer Account API**:

1. Make sure the store uses the new customer accounts (Settings > Customer accounts).
2. Create the client and copy its **client ID** (and the secret, if a confidential client is chosen).
3. Register these addresses:
   - Callback: `https://herbals.gloveda.co/account/callback`
   - JavaScript origin: `https://herbals.gloveda.co`
   - Logout: `https://herbals.gloveda.co`

Send back: the client ID (`SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID`) and, if used, the secret (`SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET`).

Built (2026-11-28), in `src/lib/shop/customer.ts` and the routes under `src/app/shop/account/`:

- `/account/login` sends the customer to Shopify's sign-in page (public client, PKCE); `/account/callback` exchanges the code for their tokens; `/account/refresh` renews the hourly access token; `/account/logout` signs out here and at Shopify.
- The tokens are kept in cookies that scripts cannot read (`gl_session`, `gl_idt`), for 30 days.
- `/account/signin` is the shop's own sign-in page: the customer types their email there and it is handed to Shopify (`login_hint`), whose page sends and checks the six-digit code. Shopify does not let a storefront check the code itself, and the older email-and-password accounts that allowed a fully custom form were withdrawn in February 2026.
- The account page shows the customer's orders, addresses and details, and lets them change their name and add, edit, remove and set a default address (`src/app/shop/account/actions.ts`). Email cannot be changed through the API.
- `/account/orders/<number>` is the order's own page: items, totals, delivery address, and for each parcel the carrier, tracking number, tracking link and the steps reported. Each part is asked for separately, so one missing field does not blank the page.
- Not yet tested with a real signed-in customer: the first sign-in on the live site should be followed by a look at each account tab and one order page.
- The callback is registered for `https://herbals.gloveda.co` only, so sign-in can be completed on the live address, not on localhost or a preview. Set `SHOPIFY_CUSTOMER_ACCOUNT_ORIGIN` if the shop's address ever changes, and register the new address in Shopify.

## 4. Reviews (Loox): done

The store's reviews app is Loox. Loox does not allow its reviews frame on `herbals.gloveda.co` (it lists the store's own domain only), so the shop reads each product's reviews from Loox's public page on the server (`src/lib/shop/reviews.ts`) and shows them in its own design: name, stars, words and the customer's photo. Nothing is edited; the list refreshes hourly.

- "Write a review" opens Loox's own page for the product, where the store collects reviews.
- Up to 24 reviews are shown per product; a link to Loox's page offers the rest.
- If Loox changes its page, the reader shows no reviews instead of guessing. Check a product page after any Loox update.
- The live store also has an empty Judge.me widget left over. It can be removed in the theme.
- Optional: expose the product metafields `loox.avg_rating` and `loox.num_reviews` to the Storefront API so the scores come from Shopify.

## 5. The two projects (client, 2026-11-28)

- `gloveda.co` is the parent site: the film, the brand story and a way into Gloveda Herbals, Gloveda Experience and Gloveda Revive. It is its own codebase, `gloveda/` in this repository, and its own Vercel project.
- `herbals.gloveda.co` is the shop: this codebase (`site/`), its own Vercel project. The pages live under `src/app/shop`; `src/proxy.ts` serves every request from there, so the shop keeps the store's paths (`/collections/…`, `/products/…`), and `herbals.gloveda.co/shop/…` moves to the address without `/shop`.
- The addresses are the defaults in `src/lib/site.ts`, so production needs no environment values for them. If `NEXT_PUBLIC_SITE_URL` or `NEXT_PUBLIC_SHOP_ORIGIN` is set in Vercel with an older address, change or delete it.
- Each project has its own `robots.txt` and `sitemap.xml`; submit both in Google Search Console.
- Vercel: the shop project has Root Directory `site` and the domain `herbals.gloveda.co`; the parent project has Root Directory `gloveda` and the domains `gloveda.co` and `www.gloveda.co` (redirecting to `gloveda.co`). The DNS for gloveda.co is Vercel's.
- Checkout is still Shopify's, on `glovedaherbals.com/cart`, reached by the cart link. It was left that way on purpose: the store's checkout runs through the GoKwik app, and a Storefront API cart opens Shopify's plain checkout instead, which may skip it. Confirm with whoever manages GoKwik before changing it.
- For local work, `.env.local` sets `NEXT_PUBLIC_SHOP_ORIGIN=http://localhost:3000/shop`, so the shop opens at `/shop` on the local server.

## 6. Content the store team controls

| What | Where it comes from today | To make Shopify the only source |
|---|---|---|
| Shop hero banners | Five files on the store's CDN, listed in `src/lib/shop/data.ts` | Create a metaobject for banners (desktop image, mobile image, link, alt text); the site reads it after step 2 |
| Face, Hair and Body Care photos | Three chosen photos, listed in `src/lib/shop/data.ts` | Set them as the collection images in Shopify |
| Ritual steps, product types | Not available (product type is empty on all 21 products) | Fill product type; add step tags |
| Ingredients | Not available | Add the ingredient list to each product (a metafield) |

## 7. Still to confirm with the brand

- Support email: the live FAQ says `support@gloveda.com`; the policies say `mail@glovedaherbals.com`.
- Returns window and conditions (three different statements on the live site; see the help page in development).
- How customers track an order.
- WhatsApp Business number, if any.
- Free-from tags (Paraben free, Vegan, and so on), one by one.
- Whether cash on delivery is offered.

## The Claude Shopify connector

Separate from the website: the Shopify connector in Claude (used to look things up in the store's admin from a chat) needs to be signed in again. Run `/mcp` and re-authenticate "shopify". It is not needed for the site to work.
