import type { Metadata } from "next";
import { FavouritesList } from "@/components/shop/FavouritesList";
import { StoreDown } from "@/components/shop/ProductCard";
import { Icon, type IconName } from "@/components/shop/ui/Icon";
import { formatMoney, getProducts } from "@/lib/shop/data";
import { shopUrl } from "@/lib/site";

export const metadata: Metadata = { title: "Your account", robots: { index: false } };

const TABS = [
  { id: "orders", label: "Orders", icon: "orders", title: "Your orders", line: "Every order you have placed, its status, and where it is. Order again in one tap." },
  { id: "saved", label: "Wishlist", icon: "heart", title: "Your wishlist", line: "Products you have saved with the heart." },
  { id: "addresses", label: "Addresses", icon: "arrow", title: "Your addresses", line: "The delivery addresses you use at checkout." },
  { id: "profile", label: "Profile", icon: "account", title: "Your details", line: "Your name, email and phone number." },
] as const satisfies readonly { id: string; label: string; icon: IconName; title: string; line: string }[];
type TabId = (typeof TABS)[number]["id"];

/**
 * The account. Orders, addresses and profile belong to the signed-in customer and come from Shopify's
 * Customer Account API; until the store's credentials are connected those tabs show the signed-out state
 * (never sample orders). Saved works now: it is kept on this device and will join the account on sign-in.
 */
export default async function AccountPage({ searchParams }: PageProps<"/shop/account">) {
  const query = await searchParams;
  const tab: TabId = TABS.some((t) => t.id === query.tab) ? (query.tab as TabId) : "orders";
  const current = TABS.find((t) => t.id === tab) ?? TABS[0];
  const products = tab === "saved" ? await getProducts() : null;

  return (
    <section className="gl-section shop-page" aria-labelledby="account-title">
      <div className="gl-container gx-grid">
        <aside className="gx-col-4 gx-stack gx-sticky">
          <p className="gx-label">Your Gloveda Herbals</p>
          <h1 id="account-title" className="gx-display">
            Account
          </h1>
          <nav aria-label="Account" className="gx-acct__nav">
            {TABS.map((t) => (
              <a key={t.id} className="gx-acct__tab" aria-current={t.id === tab ? "page" : undefined} href={shopUrl(`/account?tab=${t.id}`)}>
                <Icon name={t.icon} />
                {t.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="gx-col-8 gx-stack" style={{ justifyItems: "stretch", gap: "var(--space-6)" }}>
          <header className="gx-stack">
            <h2 className="gx-title">{current.title}</h2>
            <p className="gx-lead">{current.line}</p>
          </header>

          {query.signin ? (
            <p className="gl-notice" role="status">
              Sign-in is not switched on yet. It will open here as soon as the store&rsquo;s Shopify customer accounts are connected to this site.
            </p>
          ) : null}

          {tab === "saved" ? (
            products ? (
              <FavouritesList
                browseHref={shopUrl("/collections/all")}
                items={products.map((p) => {
                  const v = p.variants.find((x) => x.available) ?? p.variants[0];
                  return { handle: p.handle, title: p.title, href: shopUrl(`/products/${p.handle}`), priceText: p.available ? formatMoney(v.price) : "Sold out", variantId: v.id, available: p.available, image: p.images[0]?.src };
                })}
              />
            ) : (
              <StoreDown />
            )
          ) : (
            <div className="gx-acct__gate">
              <p className="gx-acct__gateTitle">Sign in to see {current.label.toLowerCase() === "profile" ? "your details" : `your ${current.label.toLowerCase()}`}</p>
              <p className="gl-small">You sign in with a code sent to your email. No password to remember.</p>
              <a className="gl-btn" href={shopUrl("/account/login")}>
                Sign in
              </a>
              <p className="gl-small">New here? The same button creates your account. You can also check out as a guest.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
