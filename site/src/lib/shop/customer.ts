import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Sign-in and the customer's own data, through Shopify's Customer Account API.
 *
 * The customer signs in on Shopify's own page (a code sent by email; this site never sees a password)
 * and comes back with a short-lived code, which is exchanged here for their access token. The store's
 * client is a public one, so the exchange is protected by PKCE rather than a secret. The tokens are the
 * customer's own and are kept in cookies only their browser sends and scripts cannot read.
 *
 * Endpoints are discovered from the store, never hardcoded (shopify.dev, Customer Account API reference).
 */
const CLIENT_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;
const STORE = process.env.SHOPIFY_STORE_DOMAIN;
/** The shop's public address: the origin and callback registered on the store's Customer Account API page. */
const ORIGIN = (process.env.SHOPIFY_CUSTOMER_ACCOUNT_ORIGIN ?? "https://herbals.gloveda.co").replace(/\/$/, "");
export const CALLBACK = `${ORIGIN}/account/callback`;
export const SIGNED_OUT = `${ORIGIN}/account`;

export const signInReady = Boolean(CLIENT_ID && STORE);

const AUTH_COOKIE = "gl_auth"; // the sign-in in progress: state, PKCE verifier, where to return
const SESSION_COOKIE = "gl_session"; // access and refresh tokens
const ID_COOKIE = "gl_idt"; // the ID token, needed only to sign out at Shopify
const base = { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" };
export const cookieOptions = { auth: { ...base, maxAge: 600 }, session: { ...base, maxAge: 60 * 60 * 24 * 30 } };
export const COOKIES = { auth: AUTH_COOKIE, session: SESSION_COOKIE, id: ID_COOKIE };

type OpenId = { authorization_endpoint: string; token_endpoint: string; end_session_endpoint: string };
type Api = { graphql_api: string };

async function discover<T>(path: string): Promise<T | null> {
  if (!STORE) return null;
  try {
    const res = await fetch(`https://${STORE}/.well-known/${path}`, { next: { revalidate: 3600 } });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}
const openid = () => discover<OpenId>("openid-configuration");
const api = () => discover<Api>("customer-account-api");

const b64url = (b: Buffer) => b.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const pack = (v: unknown) => b64url(Buffer.from(JSON.stringify(v)));
function unpack<T>(s: string | undefined): T | null {
  if (!s) return null;
  try {
    return JSON.parse(Buffer.from(s, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

export type Pending = { state: string; verifier: string; to: string };
export type Session = { access: string; refresh?: string; expires: number };

/** Only paths on this site are accepted as a place to return to. */
export const safePath = (to: string | null | undefined) => (to && /^\/(?!\/)[\w\-./?=&%]*$/.test(to) ? to : "/account");

/** Where to send the customer to sign in, and the cookie that remembers this attempt. */
export async function beginSignIn(to: string, email?: string): Promise<{ url: string; cookie: string } | null> {
  const conf = await openid();
  if (!conf || !CLIENT_ID) return null;
  const pending: Pending = { state: b64url(randomBytes(24)), verifier: b64url(randomBytes(48)), to: safePath(to) };
  const url = new URL(conf.authorization_endpoint);
  url.searchParams.set("scope", "openid email customer-account-api:full");
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", CALLBACK);
  url.searchParams.set("state", pending.state);
  url.searchParams.set("code_challenge", b64url(createHash("sha256").update(pending.verifier).digest()));
  url.searchParams.set("code_challenge_method", "S256");
  // The email typed on this site's sign-in page is handed on, so Shopify's page can start from it.
  if (email) url.searchParams.set("login_hint", email);
  return { url: url.toString(), cookie: pack(pending) };
}

export const readPending = (cookie: string | undefined) => unpack<Pending>(cookie);

type Tokens = { access_token: string; expires_in: number; id_token?: string; refresh_token?: string };

/** Shopify asks server-side callers of a public client for an Origin it knows and a User-Agent. */
const HEADERS = { Origin: ORIGIN, "User-Agent": "GlovedaHerbalsShop/1.0" };

async function token(params: Record<string, string>): Promise<Tokens | null> {
  const conf = await openid();
  if (!conf || !CLIENT_ID) return null;
  try {
    const res = await fetch(conf.token_endpoint, {
      method: "POST",
      headers: { ...HEADERS, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: CLIENT_ID, ...params }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[account] token request failed:", res.status, (await res.text()).slice(0, 200));
      return null;
    }
    return (await res.json()) as Tokens;
  } catch (err) {
    console.error("[account] token request failed:", err);
    return null;
  }
}

const toSession = (t: Tokens, keep?: string): Session => ({ access: t.access_token, refresh: t.refresh_token ?? keep, expires: Date.now() + Math.max(60, t.expires_in - 60) * 1000 });

/** Exchange the code Shopify sent back for the customer's tokens. */
export async function finishSignIn(code: string, verifier: string): Promise<{ session: string; id?: string } | null> {
  const t = await token({ grant_type: "authorization_code", redirect_uri: CALLBACK, code, code_verifier: verifier });
  return t ? { session: pack(toSession(t)), id: t.id_token } : null;
}

/** A fresh access token from the refresh token, or null when the customer has to sign in again. */
export async function refreshSession(cookie: string | undefined): Promise<string | null> {
  const s = unpack<Session>(cookie);
  if (!s?.refresh) return null;
  const t = await token({ grant_type: "refresh_token", refresh_token: s.refresh });
  return t ? pack(toSession(t, s.refresh)) : null;
}

/** Shopify's sign-out address, which ends the session there and returns to this site. */
export async function signOutUrl(idToken: string | undefined): Promise<string> {
  const conf = await openid();
  if (!conf || !idToken) return SIGNED_OUT;
  const url = new URL(conf.end_session_endpoint);
  url.searchParams.set("id_token_hint", idToken);
  url.searchParams.set("post_logout_redirect_uri", ORIGIN);
  return url.toString();
}

/** The signed-in customer's session: "none", "expired" (a refresh is needed) or the session itself. */
export async function currentSession(): Promise<Session | "none" | "expired"> {
  const s = unpack<Session>((await cookies()).get(SESSION_COOKIE)?.value);
  if (!s?.access) return "none";
  return s.expires > Date.now() ? s : s.refresh ? "expired" : "none";
}

async function query<T>(session: Session, body: string, variables?: Record<string, unknown>): Promise<T | null> {
  const conf = await api();
  if (!conf) return null;
  try {
    const res = await fetch(conf.graphql_api, {
      method: "POST",
      headers: { ...HEADERS, "Content-Type": "application/json", Authorization: session.access },
      body: JSON.stringify({ query: body, variables }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Customer Account API ${res.status}`);
    const json = (await res.json()) as { data?: T; errors?: unknown };
    if (!json.data) throw new Error(`Customer Account API returned no data: ${JSON.stringify(json.errors).slice(0, 300)}`);
    return json.data;
  } catch (err) {
    console.error("[account] request failed:", err);
    return null;
  }
}

export type Profile = { firstName: string | null; lastName: string | null; email: string | null; phone: string | null };
export type OrderLine = { title: string; quantity: number };
export type Order = { id: string; /** The number in Shopify's id, used in this site's order addresses. */ ref: string; name: string; processedAt: string; payment: string | null; fulfilment: string | null; total: { amount: string; currencyCode: string }; statusUrl: string | null; lines: OrderLine[] };

/** Each returns null when Shopify could not be reached or refused the request (the page says so plainly). */
export async function getProfile(session: Session): Promise<Profile | null> {
  const d = await query<{ customer: { firstName: string | null; lastName: string | null; emailAddress: { emailAddress: string | null } | null; phoneNumber: { phoneNumber: string | null } | null } }>(
    session,
    `{ customer { firstName lastName emailAddress { emailAddress } phoneNumber { phoneNumber } } }`,
  );
  return d ? { firstName: d.customer.firstName, lastName: d.customer.lastName, email: d.customer.emailAddress?.emailAddress ?? null, phone: d.customer.phoneNumber?.phoneNumber ?? null } : null;
}

type RawOrder = { id: string; name: string; processedAt: string; financialStatus: string | null; fulfillmentStatus: string | null; totalPrice: { amount: string; currencyCode: string }; statusPageUrl?: string | null; lineItems: { nodes: OrderLine[] } };
export async function getOrders(session: Session): Promise<Order[] | null> {
  const fields = (withStatusPage: boolean) =>
    `{ customer { orders(first: 20, sortKey: PROCESSED_AT, reverse: true) { nodes { id name processedAt financialStatus fulfillmentStatus totalPrice { amount currencyCode } ${withStatusPage ? "statusPageUrl" : ""} lineItems(first: 10) { nodes { title quantity } } } } } }`;
  // The link to Shopify's own order page is asked for first; if the store's API version does not offer it, the orders still load without it.
  const d = (await query<{ customer: { orders: { nodes: RawOrder[] } } }>(session, fields(true))) ?? (await query<{ customer: { orders: { nodes: RawOrder[] } } }>(session, fields(false)));
  return d
    ? d.customer.orders.nodes.map((o) => ({ id: o.id, ref: o.id.split("/").pop() ?? "", name: o.name, processedAt: o.processedAt, payment: o.financialStatus, fulfilment: o.fulfillmentStatus, total: o.totalPrice, statusUrl: o.statusPageUrl ?? null, lines: o.lineItems.nodes }))
    : null;
}

export type AddressFields = { firstName: string; lastName: string; address1: string; address2: string; city: string; zoneCode: string; zip: string; phoneNumber: string };
export type Address = { id: string; lines: string[]; isDefault: boolean; fields: AddressFields };

export async function getAddresses(session: Session): Promise<Address[] | null> {
  type Raw = { id: string; formatted: string[] } & { [K in keyof AddressFields]: string | null };
  const d = await query<{ customer: { defaultAddress: { id: string } | null; addresses: { nodes: Raw[] } } }>(
    session,
    `{ customer { defaultAddress { id } addresses(first: 20) { nodes { id formatted(withName: true) firstName lastName address1 address2 city zoneCode zip phoneNumber } } } }`,
  );
  return d
    ? d.customer.addresses.nodes.map((a) => ({
        id: a.id,
        lines: a.formatted,
        isDefault: a.id === d.customer.defaultAddress?.id,
        fields: { firstName: a.firstName ?? "", lastName: a.lastName ?? "", address1: a.address1 ?? "", address2: a.address2 ?? "", city: a.city ?? "", zoneCode: a.zoneCode ?? "", zip: a.zip ?? "", phoneNumber: a.phoneNumber ?? "" },
      }))
    : null;
}

/** The outcome of a change: done, or the store's own message about why not. */
export type Saved = { ok: true } | { ok: false; message: string };
type UserErrors = { userErrors: { message: string }[] };
const outcome = (r: UserErrors | undefined | null): Saved =>
  !r ? { ok: false, message: "The store could not be reached. Nothing was changed." } : r.userErrors.length ? { ok: false, message: r.userErrors.map((e) => e.message).join(" ") } : { ok: true };

export async function updateName(session: Session, firstName: string, lastName: string): Promise<Saved> {
  const d = await query<{ customerUpdate: UserErrors }>(session, `mutation ($input: CustomerUpdateInput!) { customerUpdate(input: $input) { userErrors { message } } }`, { input: { firstName, lastName } });
  return outcome(d?.customerUpdate);
}

/** Create an address, or update the one with `id`. The shop delivers in India, so the country is India. */
export async function saveAddress(session: Session, fields: AddressFields, makeDefault: boolean, id?: string): Promise<Saved> {
  const address = { ...fields, phoneNumber: fields.phoneNumber || null, address2: fields.address2 || null, countryCode: "IN" };
  if (id) {
    const d = await query<{ customerAddressUpdate: UserErrors }>(
      session,
      `mutation ($id: ID!, $address: CustomerAddressInput!, $def: Boolean) { customerAddressUpdate(addressId: $id, address: $address, defaultAddress: $def) { userErrors { message } } }`,
      { id, address, def: makeDefault || null },
    );
    return outcome(d?.customerAddressUpdate);
  }
  const d = await query<{ customerAddressCreate: UserErrors }>(
    session,
    `mutation ($address: CustomerAddressInput!, $def: Boolean) { customerAddressCreate(address: $address, defaultAddress: $def) { userErrors { message } } }`,
    { address, def: makeDefault },
  );
  return outcome(d?.customerAddressCreate);
}

export async function deleteAddress(session: Session, id: string): Promise<Saved> {
  const d = await query<{ customerAddressDelete: UserErrors }>(session, `mutation ($id: ID!) { customerAddressDelete(addressId: $id) { userErrors { message } } }`, { id });
  return outcome(d?.customerAddressDelete);
}

export type Money = { amount: string; currencyCode: string };
export type Shipment = { status: string | null; shipment: string | null; expected: string | null; tracking: { number: string | null; url: string | null; company: string | null }[]; events: { status: string; at: string }[] };
export type OrderDetail = Order & { subtotal: Money | null; shipping: Money | null; tax: Money | null; shipTo: string[] | null; shipments: Shipment[] | null };

/**
 * One order with its tracking. The order itself is asked for first; the money breakdown, the delivery
 * address and each part of the tracking are asked for separately, so that if the store's API does not
 * offer one of them the rest of the page still shows. `shipments` is null when tracking could not be read.
 */
export async function getOrder(session: Session, ref: string): Promise<OrderDetail | null | "missing"> {
  if (!/^\d+$/.test(ref)) return "missing";
  const id = `gid://shopify/Order/${ref}`;
  const ask = <T,>(fields: string) => query<{ order: T | null }>(session, `query ($id: ID!) { order(id: $id) { ${fields} } }`, { id });
  const core = await ask<RawOrder>(`id name processedAt financialStatus fulfillmentStatus totalPrice { amount currencyCode } lineItems(first: 50) { nodes { title quantity } }`);
  if (!core) return null;
  if (!core.order) return "missing";
  const o = core.order;
  const [sums, to, page, track, events] = await Promise.all([
    ask<{ subtotal: Money | null; totalShipping: Money | null; totalTax: Money | null }>(`subtotal { amount currencyCode } totalShipping { amount currencyCode } totalTax { amount currencyCode }`),
    ask<{ shippingAddress: { formatted: string[] } | null }>(`shippingAddress { formatted(withName: true) }`),
    ask<{ statusPageUrl: string | null }>(`statusPageUrl`),
    ask<{ fulfillments: { nodes: { status: string | null; latestShipmentStatus: string | null; estimatedDeliveryAt: string | null; trackingInformation: { number: string | null; url: string | null; company: string | null }[] }[] } }>(
      `fulfillments(first: 10) { nodes { status latestShipmentStatus estimatedDeliveryAt trackingInformation { number url company } } }`,
    ),
    ask<{ fulfillments: { nodes: { events: { nodes: { status: string; happenedAt: string }[] } }[] } }>(`fulfillments(first: 10) { nodes { events(first: 20) { nodes { status happenedAt } } } }`),
  ]);
  return {
    id: o.id,
    ref,
    name: o.name,
    processedAt: o.processedAt,
    payment: o.financialStatus,
    fulfilment: o.fulfillmentStatus,
    total: o.totalPrice,
    statusUrl: page?.order?.statusPageUrl ?? null,
    lines: o.lineItems.nodes,
    subtotal: sums?.order?.subtotal ?? null,
    shipping: sums?.order?.totalShipping ?? null,
    tax: sums?.order?.totalTax ?? null,
    shipTo: to?.order?.shippingAddress?.formatted ?? null,
    shipments: track?.order
      ? track.order.fulfillments.nodes.map((f, i) => ({
          status: f.status,
          shipment: f.latestShipmentStatus,
          expected: f.estimatedDeliveryAt,
          tracking: f.trackingInformation ?? [],
          events: (events?.order?.fulfillments.nodes[i]?.events.nodes ?? []).map((e) => ({ status: e.status, at: e.happenedAt })),
        }))
      : null,
  };
}

/** Shopify's own account pages for this store, where the customer edits their details and addresses. */
export async function manageUrl(): Promise<string | null> {
  const conf = await api();
  const m = conf ? /^(https:\/\/shopify\.com\/\d+\/account)\b/.exec(conf.graphql_api) : null;
  return m ? m[1] : null;
}
