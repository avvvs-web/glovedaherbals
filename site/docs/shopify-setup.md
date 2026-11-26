# Connecting the new site to Shopify

What the Gloveda Herbals team needs to do in Shopify, what value each step produces, and where that value goes. Check progress at any time with:

```
npm run check:shopify
```

State on 2026-11-23: the public catalogue and reviews are live; the Storefront API, customer accounts and the shop's address are not set up yet.

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
   - Callback: `https://shop.glovedaherbals.com/account/callback`
   - JavaScript origin: `https://shop.glovedaherbals.com`
   - Logout: `https://shop.glovedaherbals.com`

Send back: the client ID (`SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID`) and, if used, the secret (`SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET`).

Not built yet: the sign-in flow itself (the callback route, the session cookie, the orders and addresses pages' data). It needs the client ID and a public HTTPS address to test against, so it follows this step.

## 4. Reviews (Loox): done, with one condition

The store's reviews app is Loox. Product pages show the average score and count, and Loox's own list with "Write a review".

- Loox only allows its review list on `glovedaherbals.com` and its subdomains. It will appear on `shop.glovedaherbals.com`; it is blank on localhost and on preview addresses.
- The live store also has an empty Judge.me widget left over. It can be removed in the theme.
- Once step 2 is done, expose the product metafields `loox.avg_rating` and `loox.num_reviews` to the Storefront API so the scores come from Shopify rather than from Loox's page.

## 0. Moving glovedaherbals.com from Shopify to this site (do this first)

Until now `glovedaherbals.com` *was* the Shopify store. This site reads the catalogue from it (`/products.json`) and sends shoppers to its cart and checkout. So Shopify needs an address of its own **before** `glovedaherbals.com` is pointed at Vercel, or the shop shows no products and checkout breaks.

In this order:

1. **Give Shopify its own subdomain.** Shopify admin › Settings › Domains › Connect existing domain: add a subdomain such as `store.glovedaherbals.com`. In the DNS, point it at Shopify: a CNAME to `shops.myshopify.com`. Wait until Shopify shows it as connected (SSL issued).
2. **Make that subdomain Shopify's primary domain.** Checkout, order emails and the order status page then use it. Shopify redirects its other addresses (including `….myshopify.com`) to the primary domain, so the primary must not be `glovedaherbals.com` any more.
3. **Set the store address in Vercel** (Project › Settings › Environment Variables, Production), then redeploy:
   - `SHOPIFY_PUBLIC_STORE_URL=https://store.glovedaherbals.com` (the subdomain from step 1)
   - `NEXT_PUBLIC_SITE_URL=https://glovedaherbals.com`
4. **Check on the Vercel address** before touching the apex DNS: products and prices show, Buy now opens checkout on `store.glovedaherbals.com`.
5. **Point `glovedaherbals.com` (and `www`) at Vercel**: add both to the Vercel project's domains, then change the DNS records Vercel asks for. Remove `glovedaherbals.com` from Shopify's domains.
6. **Check after the switch:**
   - Old store links redirect: `/products/…`, `/collections/…`, `/pages/faqs`, `/policies/…`, `/search` go to the same thing under `/shop` (permanent redirects in `next.config.ts`).
   - `/blogs/…` go to this site's Journal (`/shop/blogs/…`), which reads the articles from Shopify's blog feeds. `/pages/news-and-presence` goes to Shopify. Old `/cart` links go to Shopify's cart.
   - Reviews appear on product pages (Loox allows `glovedaherbals.com` and its subdomains).
   - Google Search Console: add the new sitemap once one exists, and watch for crawl errors.

Email (`mail@glovedaherbals.com`) uses the domain's MX records. Leave those untouched when changing the web records.

## 5. The shop's address

1. Add the DNS record for `shop.glovedaherbals.com`, pointing at the site's host.
2. Add the same hostname to the hosting project's domains.
3. Keep `SHOP_HOSTS=shop.glovedaherbals.com` in the environment: requests to that host are served the shop pages.
4. Only then set `NEXT_PUBLIC_SHOP_ORIGIN=https://shop.glovedaherbals.com` in the hosting project and redeploy. Until it is set, every shop link goes to `/shop` on the site's own address, so the shop works before the DNS record exists.

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
