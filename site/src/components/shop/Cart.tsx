"use client";

import { MotionConfig, motion } from "motion/react";
import Image from "next/image";
import { Icon } from "./ui/Icon";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Price } from "@/components/shop/ui/Price";
import { ProgressLine } from "@/components/shop/ui/ProgressLine";
import { FREE_SHIPPING_FROM } from "@/content/policies";
import { track, type TrackItem } from "@/lib/analytics";

/** What the cart needs to know about a variant; always taken from the live catalogue, never stored. */
export type CartVariant = {
  id: number;
  title: string;
  handle: string;
  price: number;
  priceText: string;
  available: boolean;
  image?: string;
};
type Lines = Record<string, number>;
type Ctx = {
  lines: Lines;
  count: number;
  add: (variantId: number, qty?: number) => void;
  /** Add one of each variant in a single step (a whole ritual). */
  addMany: (variantIds: number[]) => void;
  set: (variantId: number, qty: number) => void;
  open: () => void;
};

const KEY = "gloveda-cart-v1";
const CartContext = createContext<Ctx | null>(null);
export const useCart = () => {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
};

// The cart lives in localStorage (variant id -> quantity) and is read through useSyncExternalStore.
const listeners = new Set<() => void>();
const EMPTY = "{}";
const read = () => {
  try {
    return window.localStorage.getItem(KEY) ?? EMPTY;
  } catch {
    return EMPTY;
  }
};
const write = (lines: Lines) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* storage unavailable: the cart simply does not persist */
  }
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  window.addEventListener("storage", l);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", l);
  };
};

const item = (v: CartVariant, quantity: number): TrackItem => ({ item_id: String(v.id), item_name: v.title, price: v.price, quantity });

type Props = {
  variants: CartVariant[];
  checkoutBase: string;
  shopOrigin: string;
  currency: string;
  children: ReactNode;
};

export function CartProvider({
  variants,
  checkoutBase,
  shopOrigin,
  currency,
  children,
}: Props) {
  const raw = useSyncExternalStore(subscribe, read, () => EMPTY);
  const byId = useMemo(
    () => new Map(variants.map((v) => [String(v.id), v])),
    [variants],
  );
  // Only lines whose variant still exists in the live catalogue are kept.
  const lines = useMemo<Lines>(() => {
    try {
      const parsed = JSON.parse(raw) as Lines;
      return Object.fromEntries(
        Object.entries(parsed).filter(
          ([id, q]) => byId.has(id) && Number.isInteger(q) && q > 0,
        ),
      );
    } catch {
      return {};
    }
  }, [raw, byId]);
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState("");
  const [shown, setShown] = useState(false);

  const set = useCallback(
    (id: number, qty: number) => {
      const next = { ...lines };
      if (qty <= 0) delete next[String(id)];
      else next[String(id)] = Math.min(qty, 20);
      write(next);
    },
    [lines],
  );
  const open = useCallback(() => {
    dialog.current?.showModal();
    setShown(true);
  }, []);
  const add = useCallback(
    (id: number, qty = 1) => {
      const v = byId.get(String(id));
      if (!v || !v.available) return;
      set(id, (lines[String(id)] ?? 0) + qty);
      track("add_to_cart", [item(v, qty)], currency);
      setStatus(`${v.title} added to your cart`);
      open();
    },
    [byId, lines, set, open, currency],
  );

  const addMany = useCallback(
    (ids: number[]) => {
      const next = { ...lines };
      const items: TrackItem[] = [];
      for (const id of ids) {
        const v = byId.get(String(id));
        if (!v?.available) continue;
        next[String(id)] = Math.min((next[String(id)] ?? 0) + 1, 20);
        items.push(item(v, 1));
      }
      const added = items.length;
      if (!added) return;
      write(next);
      track("add_to_cart", items, currency);
      setStatus(
        `${added} ${added === 1 ? "product" : "products"} added to your cart`,
      );
      open();
    },
    [byId, lines, open, currency],
  );

  const entries = Object.entries(lines).map(([id, qty]) => ({
    v: byId.get(id) as CartVariant,
    qty,
  }));
  const count = entries.reduce((n, e) => n + e.qty, 0);
  const subtotal = entries.reduce((n, e) => n + e.v.price * e.qty, 0);
  const money = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }),
    [currency],
  );
  const buyable = entries.filter((e) => e.v.available);
  const checkout = `${checkoutBase}/${buyable.map((e) => `${e.v.id}:${e.qty}`).join(",")}`;
  const ctx: Ctx = { lines, count, add, addMany, set, open };

  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(""), 4000);
    return () => clearTimeout(t);
  }, [status]);

  return (
    <CartContext.Provider value={ctx}>
      {children}
      <p className="visually-hidden" role="status">
        {status}
      </p>
      <dialog
        ref={dialog}
        className="cart theme-light"
        aria-labelledby="cart-title"
        onClose={() => setShown(false)}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
      >
        <MotionConfig reducedMotion="user">
          {/* The drawer slides in from the right each time it opens. */}
          <motion.div
            className="cart__inner"
            initial={false}
            animate={shown ? { x: 0, opacity: 1 } : { x: 48, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="cart__head">
              <h2 id="cart-title" className="gl-h3">
                Your bag
              </h2>
              <button
                type="button"
                className="gl-btn gl-btn--ghost gl-btn--sm"
                onClick={() => dialog.current?.close()}
              >
                Close
              </button>
            </header>
            <ol className="cart-steps" aria-label="Checkout steps">
              <li aria-current="step">Bag</li>
              <li>Delivery details</li>
              <li>Payment</li>
            </ol>
            {entries.length === 0 ? (
              <p className="gl-body cart__empty">
                Your bag is empty. Add a product and it will appear here.
              </p>
            ) : (
              <>
                <ul className="cart__lines" role="list">
                  {entries.map(({ v, qty }) => (
                    <li key={v.id} className="cart__line">
                      {v.image ? (
                        <Image
                          className="cart__thumb"
                          src={v.image}
                          alt=""
                          width={96}
                          height={96}
                        />
                      ) : (
                        <span className="cart__thumb" />
                      )}
                      <div className="cart__lineBody">
                        <a
                          className="cart__name"
                          href={`${shopOrigin}/products/${v.handle}`}
                        >
                          {v.title}
                        </a>
                        <p className="gl-small">
                          <Price>{v.available ? v.priceText : `${v.priceText}, sold out`}</Price>
                        </p>
                        <div
                          className="gl-qty"
                          role="group"
                          aria-label={`Quantity of ${v.title}`}
                        >
                          <button
                            type="button"
                            onClick={() => set(v.id, qty - 1)}
                            aria-label={`Remove one ${v.title}`}
                          >
                            −
                          </button>
                          <output>{qty}</output>
                          <button
                            type="button"
                            onClick={() => set(v.id, qty + 1)}
                            disabled={qty >= 20}
                            aria-label={`Add one ${v.title}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="gl-link cart__remove"
                        onClick={() => set(v.id, 0)}
                      >
                        Remove
                        <span className="visually-hidden"> {v.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <footer className="cart__foot">
                  {/* The free-shipping threshold is in rupees, so the line is shown only for INR prices. */}
                  {currency === "INR" ? (
                    <div data-price>
                      <ProgressLine value={subtotal / FREE_SHIPPING_FROM}>
                        {subtotal > FREE_SHIPPING_FROM
                          ? "Your order ships free."
                          : `Add ${money.format(FREE_SHIPPING_FROM - subtotal + 1)} more for free shipping.`}
                      </ProgressLine>
                    </div>
                  ) : null}
                  <p className="cart__subtotal" data-price>
                    <span>Subtotal</span>
                    <span>{money.format(subtotal)}</span>
                  </p>
                  <p className="gl-small">
                    Shipping and taxes are worked out at checkout.
                  </p>
                  {buyable.length ? (
                    <a
                      className="gl-btn gl-btn--block"
                      href={checkout}
                      data-buy
                      onClick={() => track("begin_checkout", buyable.map((e) => item(e.v, e.qty)), currency)}
                    >
                      Check out
                    </a>
                  ) : (
                    <p className="gl-small">
                      Everything in your cart is sold out right now.
                    </p>
                  )}
                </footer>
              </>
            )}
          </motion.div>
        </MotionConfig>
      </dialog>
    </CartContext.Provider>
  );
}

export function CartButton() {
  const { count, open } = useCart();
  return (
    <button type="button" className="nav__icon cart-button" data-buy onClick={open} aria-label={count ? `Bag, ${count} ${count === 1 ? "item" : "items"}` : "Bag, empty"}>
      <Icon name="bag" />
      {count ? (
        <motion.span key={count} className="nav__count" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 500, damping: 24 }} aria-hidden="true">
          {count}
        </motion.span>
      ) : null}
    </button>
  );
}

export function AddToCart({
  variantId,
  available,
  label = "Add to cart",
  small = false,
}: {
  variantId: number;
  available: boolean;
  label?: string;
  small?: boolean;
}) {
  const { add } = useCart();
  return (
    <motion.button
      type="button"
      className={`gl-btn${small ? " gl-btn--sm gl-btn--secondary" : ""}`}
      data-buy
      disabled={!available}
      onClick={() => add(variantId)}
      whileTap={available ? { scale: 0.97 } : undefined}
    >
      {available ? label : "Sold out"}
    </motion.button>
  );
}
