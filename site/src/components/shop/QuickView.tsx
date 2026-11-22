"use client";

import { MotionConfig, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import type { ShopImage } from "@/lib/shop/data";
import { useCart } from "./Cart";
import { ProductGallery } from "./ProductGallery";

export type QuickViewProduct = {
  title: string;
  href: string;
  priceText: string;
  available: boolean;
  variantId: number;
  images: ShopImage[];
  /** The opening paragraph of the store's own description. */
  summary?: string;
};

/**
 * Quick view: a peek at a product without leaving the grid. A button on the card opens a native dialog
 * with the gallery, price, the opening line of the description and add to cart. Escape, the Close button
 * or a click outside closes it and focus returns to the card. The dialog's contents are only rendered
 * while it is open.
 */
export function QuickView({ product }: { product: QuickViewProduct }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [shown, setShown] = useState(false);
  const { add } = useCart();
  const titleId = useId();
  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        className="quick__open"
        onClick={() => {
          setShown(true);
          dialog.current?.showModal();
        }}
      >
        Quick view<span className="visually-hidden">: {product.title}</span>
      </button>
      <dialog ref={dialog} className="quick theme-light" aria-labelledby={titleId} onClose={() => setShown(false)} onClick={(e) => e.target === e.currentTarget && close()}>
        {shown ? (
          <MotionConfig reducedMotion="user">
            <motion.div className="quick__inner" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
              <ProductGallery images={product.images.slice(0, 5)} title={product.title} />
              <div className="quick__info">
                <h2 id={titleId} className="gl-h3 quick__title">
                  {product.title}
                </h2>
                <p className="pdp__price">{product.priceText}</p>
                <p className="gl-small">{product.available ? "In stock" : "Sold out"}</p>
                {product.summary ? <p className="gl-body quick__summary">{product.summary}</p> : null}
                <div className="quick__actions">
                  <button
                    type="button"
                    className="gl-btn"
                    disabled={!product.available}
                    onClick={() => {
                      close(); // the cart drawer opens in its place
                      add(product.variantId);
                    }}
                  >
                    {product.available ? "Add to cart" : "Sold out"}
                  </button>
                  <a className="gl-link" href={product.href}>
                    View full details
                  </a>
                </div>
              </div>
              <button type="button" className="gl-btn gl-btn--ghost gl-btn--sm quick__close" onClick={close}>
                Close
              </button>
            </motion.div>
          </MotionConfig>
        ) : null}
      </dialog>
    </>
  );
}
