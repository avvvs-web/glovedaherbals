// Reports which of the site's connections to Shopify are live. Reads .env.local; changes nothing,
// places no order, and prints no secret. Run: npm run check:shopify
import fs from "node:fs";
import dns from "node:dns/promises";

const env = { ...process.env };
for (const file of [".env.local", ".env"]) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && env[m[1]] === undefined) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const rows = [];
const add = (name, state, note) => rows.push({ name, state, note });
const get = async (url, init) => {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(15000) });
  return res;
};

// 1. Public catalogue
const store = (env.SHOPIFY_PUBLIC_STORE_URL ?? "https://glovedaherbals.com").replace(/\/$/, "");
try {
  const res = await get(`${store}/products.json?limit=250`, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const n = (await res.json()).products.length;
  add("Public catalogue", "LIVE", `${n} products from ${store}`);
} catch (e) {
  add("Public catalogue", "FAILED", String(e.message ?? e));
}

// 2. Storefront API
const { SHOPIFY_STORE_DOMAIN: domain, SHOPIFY_STOREFRONT_ACCESS_TOKEN: token, SHOPIFY_STOREFRONT_API_VERSION: version } = env;
if (!domain || !token || !version) {
  const missing = [["SHOPIFY_STORE_DOMAIN", domain], ["SHOPIFY_STOREFRONT_ACCESS_TOKEN", token], ["SHOPIFY_STOREFRONT_API_VERSION", version]].filter(([, v]) => !v).map(([k]) => k);
  add("Storefront API", "NOT SET", `missing ${missing.join(", ")}`);
} else {
  try {
    const res = await get(`https://${domain}/api/${version}/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
      body: JSON.stringify({ query: "{ shop { name } }" }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.data?.shop) throw new Error(`HTTP ${res.status}${json?.errors ? " " + JSON.stringify(json.errors).slice(0, 160) : ""}`);
    add("Storefront API", "LIVE", `shop "${json.data.shop.name}", version ${version}`);
  } catch (e) {
    add("Storefront API", "FAILED", String(e.message ?? e));
  }
}

// 3. Customer accounts: Shopify publishes the sign-in endpoints on the storefront domain.
const shopOrigin = (env.NEXT_PUBLIC_SHOP_ORIGIN && !/localhost/.test(env.NEXT_PUBLIC_SHOP_ORIGIN) ? env.NEXT_PUBLIC_SHOP_ORIGIN : "https://shop.glovedaherbals.com").replace(/\/$/, "");
if (!env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID) add("Customer accounts", "NOT SET", "missing SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID");
else {
  try {
    const res = await get(`${store}/.well-known/openid-configuration`);
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${store}/.well-known/openid-configuration`);
    const cfg = await res.json();
    add("Customer accounts", cfg.authorization_endpoint ? "READY" : "FAILED", cfg.authorization_endpoint ? "client ID set and the store publishes its sign-in endpoints (the sign-in flow itself is not built yet)" : "no authorization endpoint published");
  } catch (e) {
    add("Customer accounts", "FAILED", String(e.message ?? e));
  }
}

// 4. Reviews
const loox = env.NEXT_PUBLIC_LOOX_ID ?? "psOUq3PXH6";
try {
  const res = await get(`https://loox.io/widget/${loox}/loox.js?shop=${env.NEXT_PUBLIC_SHOPIFY_DOMAIN ?? "gmfcwr-v0.myshopify.com"}`);
  add("Reviews (Loox)", res.ok ? "LIVE" : "FAILED", res.ok ? `widget ${loox} answers; the review list shows on glovedaherbals.com addresses only` : `HTTP ${res.status}`);
} catch (e) {
  add("Reviews (Loox)", "FAILED", String(e.message ?? e));
}

// 5. The shop's address
try {
  const host = new URL(shopOrigin).hostname;
  const a = await dns.lookup(host);
  add("Shop address", "LIVE", `${host} resolves to ${a.address}`);
} catch {
  add("Shop address", "NOT SET", `${new URL(shopOrigin).hostname} does not resolve yet (DNS record needed)`);
}

const w = Math.max(...rows.map((r) => r.name.length));
console.log("\nGloveda Herbals: connections\n");
for (const r of rows) console.log(`  ${r.name.padEnd(w)}  ${r.state.padEnd(8)} ${r.note}`);
console.log("\nSteps for anything not LIVE: docs/shopify-setup.md\n");
