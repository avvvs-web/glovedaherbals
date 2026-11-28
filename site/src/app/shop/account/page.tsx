import type { Metadata } from "next";
import { FavouritesList } from "@/components/shop/FavouritesList";
import { StoreDown } from "@/components/shop/ProductCard";
import { redirect } from "next/navigation";
import { Icon, type IconName } from "@/components/shop/ui/Icon";
import { currentSession, getAddresses, getOrders, getProfile, type AddressFields, type Session } from "@/lib/shop/customer";
import { deleteAddressAction, saveAddressAction, saveProfileAction } from "./actions";
import { formatMoney, getProducts } from "@/lib/shop/data";
import { shopUrl } from "@/lib/site";

export const metadata: Metadata = { title: "Your account", robots: { index: false } };

const TABS = [
  { id: "orders", label: "Orders", icon: "orders", title: "Your orders", line: "Every order you have placed and its status." },
  { id: "saved", label: "Wishlist", icon: "heart", title: "Your wishlist", line: "Products you have saved with the heart." },
  { id: "addresses", label: "Addresses", icon: "arrow", title: "Your addresses", line: "The delivery addresses you use at checkout." },
  { id: "profile", label: "Profile", icon: "account", title: "Your details", line: "Your name, email and phone number." },
] as const satisfies readonly { id: string; label: string; icon: IconName; title: string; line: string }[];
type TabId = (typeof TABS)[number]["id"];

/**
 * The account. Orders, addresses and profile belong to the signed-in customer and come from Shopify's
 * Customer Account API (lib/shop/customer.ts); signed out, those tabs ask the customer to sign in (never
 * sample orders). The customer changes their name and their addresses here; each change is sent to
 * Shopify, which holds the account (./actions.ts). The wishlist is kept on this device and needs no sign-in.
 */
const NOTICES: Record<string, string> = {
  unavailable: "Sign-in could not be reached just now. Please try again in a little while.",
  failed: "That sign-in did not complete. Please try again.",
  expired: "You have been signed out. Please sign in again.",
};
const status = (s: string | null) => (s ? s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " ") : null);
const day = (iso: string) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
const money = (m: { amount: string; currencyCode: string }) => new Intl.NumberFormat("en-IN", { style: "currency", currency: m.currencyCode, maximumFractionDigits: Number(m.amount) % 1 === 0 ? 0 : 2 }).format(Number(m.amount));
const Unreachable = () => <p className="gl-notice">We could not load this from the store just now. Please refresh the page in a moment.</p>;

async function Orders({ session }: { session: Session }) {
  const orders = await getOrders(session);
  if (!orders) return <Unreachable />;
  if (!orders.length)
    return (
      <div className="gx-acct__gate">
        <p className="gx-acct__gateTitle">No orders yet</p>
        <a className="gl-btn" href={shopUrl("/collections/all")}>
          See the range
        </a>
      </div>
    );
  return (
    <ul className="gx-acct__list" role="list">
      {orders.map((o) => (
        <li key={o.id} className="gx-acct__card">
          <div className="gx-acct__cardHead">
            <p className="gx-acct__cardTitle">Order {o.name}</p>
            <p className="gx-acct__cardMeta">{money(o.total)}</p>
          </div>
          <p className="gl-small">
            {day(o.processedAt)}
            {[status(o.payment), status(o.fulfilment)].filter(Boolean).map((t) => ` · ${t}`)}
          </p>
          <ul className="gx-acct__lines" role="list">
            {o.lines.map((l, i) => (
              <li key={i}>
                {l.title} <span className="gl-small">× {l.quantity}</span>
              </li>
            ))}
          </ul>
          <a className="gx-more" href={shopUrl(`/account/orders/${o.ref}`)}>
            Track this order <Icon name="arrow" size={18} />
          </a>
        </li>
      ))}
    </ul>
  );
}

/** India's states and union territories, by the codes Shopify uses for them. */
const STATES: [string, string][] = [
  ["AN", "Andaman and Nicobar Islands"], ["AP", "Andhra Pradesh"], ["AR", "Arunachal Pradesh"], ["AS", "Assam"], ["BR", "Bihar"], ["CH", "Chandigarh"], ["CG", "Chhattisgarh"],
  ["DN", "Dadra and Nagar Haveli"], ["DD", "Daman and Diu"], ["DL", "Delhi"], ["GA", "Goa"], ["GJ", "Gujarat"], ["HR", "Haryana"], ["HP", "Himachal Pradesh"], ["JK", "Jammu and Kashmir"],
  ["JH", "Jharkhand"], ["KA", "Karnataka"], ["KL", "Kerala"], ["LA", "Ladakh"], ["LD", "Lakshadweep"], ["MP", "Madhya Pradesh"], ["MH", "Maharashtra"], ["MN", "Manipur"], ["ML", "Meghalaya"],
  ["MZ", "Mizoram"], ["NL", "Nagaland"], ["OR", "Odisha"], ["PY", "Puducherry"], ["PB", "Punjab"], ["RJ", "Rajasthan"], ["SK", "Sikkim"], ["TN", "Tamil Nadu"], ["TS", "Telangana"], ["TR", "Tripura"],
  ["UP", "Uttar Pradesh"], ["UK", "Uttarakhand"], ["WB", "West Bengal"],
];
const BLANK: AddressFields = { firstName: "", lastName: "", address1: "", address2: "", city: "", zoneCode: "", zip: "", phoneNumber: "" };

function AddressForm({ id, fields, isDefault }: { id?: string; fields: AddressFields; isDefault?: boolean }) {
  const key = id ?? "new";
  const field = (name: keyof AddressFields, label: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="gl-field">
      <span className="gl-label">{label}</span>
      <input className="gl-input" name={name} defaultValue={fields[name]} {...extra} />
    </label>
  );
  return (
    <form className="gx-form gx-form--two" action={saveAddressAction}>
      {id ? <input type="hidden" name="id" value={id} /> : null}
      {field("firstName", "First name", { required: true, autoComplete: "given-name" })}
      {field("lastName", "Last name", { autoComplete: "family-name" })}
      <div className="gx-form__wide">{field("address1", "House, street", { required: true, autoComplete: "address-line1" })}</div>
      <div className="gx-form__wide">{field("address2", "Area, landmark (optional)", { autoComplete: "address-line2" })}</div>
      {field("city", "City", { required: true, autoComplete: "address-level2" })}
      <label className="gl-field">
        <span className="gl-label">State</span>
        <select className="gl-select" name="zoneCode" defaultValue={fields.zoneCode} required autoComplete="address-level1">
          <option value="">Choose</option>
          {STATES.map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </label>
      {field("zip", "PIN code", { required: true, inputMode: "numeric", pattern: "[0-9]{6}", maxLength: 6, autoComplete: "postal-code" })}
      {field("phoneNumber", "Mobile number (optional)", { inputMode: "tel", autoComplete: "tel" })}
      {isDefault ? null : (
        <label className="gx-form__check gx-form__wide" htmlFor={`default-${key}`}>
          <input id={`default-${key}`} type="checkbox" name="makeDefault" /> Use as my default address
        </label>
      )}
      <div className="gx-form__wide">
        <button className="gl-btn" type="submit">
          {id ? "Save address" : "Add address"}
        </button>
      </div>
    </form>
  );
}

async function Addresses({ session }: { session: Session }) {
  const addresses = await getAddresses(session);
  if (!addresses) return <Unreachable />;
  return (
    <>
      {addresses.length ? (
        <ul className="gx-acct__list" role="list">
          {addresses.map((a) => (
            <li key={a.id} className="gx-acct__card">
              {a.isDefault ? <p className="gx-label">Default address</p> : null}
              <address className="gx-acct__address">
                {a.lines.map((l, i) => (
                  <span key={i}>{l}</span>
                ))}
              </address>
              <details className="gx-acct__edit">
                <summary>Edit</summary>
                <AddressForm id={a.id} fields={a.fields} isDefault={a.isDefault} />
              </details>
              <form action={deleteAddressAction}>
                <input type="hidden" name="id" value={a.id} />
                <button className="gl-link gx-acct__remove" type="submit">
                  Remove this address
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="gx-lead">No saved addresses yet.</p>
      )}
      <details className="gx-acct__card gx-acct__edit" open={!addresses.length}>
        <summary>Add an address</summary>
        <AddressForm fields={BLANK} />
      </details>
    </>
  );
}

async function ProfileDetails({ session }: { session: Session }) {
  const profile = await getProfile(session);
  if (!profile) return <Unreachable />;
  return (
    <>
      <form className="gx-form gx-form--two gx-acct__card" action={saveProfileAction}>
        <label className="gl-field">
          <span className="gl-label">First name</span>
          <input className="gl-input" name="firstName" defaultValue={profile.firstName ?? ""} required autoComplete="given-name" />
        </label>
        <label className="gl-field">
          <span className="gl-label">Last name</span>
          <input className="gl-input" name="lastName" defaultValue={profile.lastName ?? ""} autoComplete="family-name" />
        </label>
        <div className="gx-form__wide">
          <button className="gl-btn" type="submit">
            Save name
          </button>
        </div>
      </form>
      <dl className="gx-acct__details">
        <div>
          <dt>Email</dt>
          <dd>{profile.email || "Not given"}</dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>{profile.phone || "Not given"}</dd>
        </div>
      </dl>
      <p className="gl-small">Your email is how you sign in, so it cannot be changed here. To move your account to another email, write to us from the help page.</p>
    </>
  );
}

export default async function AccountPage({ searchParams }: PageProps<"/shop/account">) {
  const query = await searchParams;
  const tab: TabId = TABS.some((t) => t.id === query.tab) ? (query.tab as TabId) : "orders";
  const current = TABS.find((t) => t.id === tab) ?? TABS[0];
  const products = tab === "saved" ? await getProducts() : null;
  const found = await currentSession();
  // The access token has run out: fetch a new one and come straight back to this tab.
  if (found === "expired") redirect(shopUrl(`/account/refresh?to=${encodeURIComponent(`/account?tab=${tab}`)}`));
  const session = found === "none" ? null : found;
  const notice = typeof query.signin === "string" ? NOTICES[query.signin] : undefined;
  const problem = typeof query.problem === "string" ? query.problem.slice(0, 240) : undefined;

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
            {session ? (
              <a className="gx-acct__tab" href={shopUrl("/account/logout")}>
                <Icon name="close" />
                Sign out
              </a>
            ) : null}
          </nav>
        </aside>

        <div className="gx-col-8 gx-stack" style={{ justifyItems: "stretch", gap: "var(--space-6)" }}>
          <header className="gx-stack">
            <h2 className="gx-title">{current.title}</h2>
            <p className="gx-lead">{current.line}</p>
          </header>

          {notice && !session ? (
            <p className="gl-notice" role="status">
              {notice}
            </p>
          ) : null}
          {session && query.saved ? (
            <p className="gl-notice gl-notice--success" role="status">
              Saved.
            </p>
          ) : null}
          {session && problem ? (
            <p className="gl-notice gl-notice--error" role="alert">
              {problem}
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
          ) : session ? (
            tab === "orders" ? (
              <Orders session={session} />
            ) : tab === "addresses" ? (
              <Addresses session={session} />
            ) : (
              <ProfileDetails session={session} />
            )
          ) : (
            <div className="gx-acct__gate">
              <p className="gx-acct__gateTitle">Sign in to see {current.label.toLowerCase() === "profile" ? "your details" : `your ${current.label.toLowerCase()}`}</p>
              <p className="gl-small">You sign in with a six-digit code sent to your email. No password to remember.</p>
              <a className="gl-btn" href={shopUrl(`/account/signin?to=${encodeURIComponent(`/account?tab=${tab}`)}`)}>
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
