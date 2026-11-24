"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { ShopImage } from "@/lib/shop/data";
import { AddButton } from "./ui/AddButton";
import { Icon } from "./ui/Icon";
import { DUR, EASE } from "./ui/motion";
import { Price } from "@/components/shop/ui/Price";

export type HeroProduct = { handle: string; title: string; href: string; priceText: string; variantId: number; available: boolean; image?: ShopImage };

const HOLD = 5200;

/**
 * The shop's hero showcase: the store's best sellers, one at a time, large. It moves on by itself every
 * few seconds; hovering, focusing or choosing a product holds it, and there is a Pause button. Under
 * reduced motion it never moves on its own. Names, prices and photos come from the live catalogue.
 */
export function BestSellerHero({ products }: { products: HeroProduct[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const reduced = useReducedMotionSafe();
  const running = playing && !held && !reduced && products.length > 1;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % products.length), HOLD);
    return () => clearTimeout(t);
  }, [running, index, products.length]);

  const current = products[index];
  if (!current) return null;

  return (
    <MotionConfig reducedMotion="user">
      <div className="gx-bs" onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)} onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}>
        <div className="gx-bs__stage">
          <a className="gx-bs__plate" href={current.href} style={{ viewTransitionName: `product-${current.handle}` }} aria-label={current.title}>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span key={current.handle} className="gx-bs__frame" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: EASE }}>
                {current.image ? <Image src={current.image.src} alt="" width={current.image.width} height={current.image.height} sizes="(min-width: 64rem) 34vw, 100vw" priority={index === 0} /> : null}
              </motion.span>
            </AnimatePresence>
          </a>
          <div className="gx-bs__caption" aria-live="polite">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div key={current.handle} className="gx-bs__text" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: DUR.base, ease: EASE }}>
                <p className="gx-bs__name">{current.title}</p>
                <p className="gx-bs__price"><Price>{current.priceText}</Price></p>
              </motion.div>
            </AnimatePresence>
            <div className="gx-bs__actions">
              <AddButton key={current.handle} variantId={current.variantId} available={current.available} title={current.title} />
              <a className="gx-more" href={current.href}>
                View <Icon name="arrow" size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="gx-bs__side">
          <p className="gx-bs__label">Best sellers</p>
          <ol className="gx-bs__list" role="list">
            {products.map((p, i) => (
              <li key={p.handle}>
                <button type="button" className="gx-bs__pick" aria-current={i === index} onClick={() => setIndex(i)}>
                  <span className="gx-bs__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="gx-bs__pickName">{p.title}</span>
                  <span className="gx-bs__pickPrice"><Price>{p.priceText}</Price></span>
                  {i === index ? <span key={`${index}-${running}`} className="gx-bs__timer" data-running={running} style={{ animationDuration: `${HOLD}ms` }} /> : null}
                </button>
              </li>
            ))}
          </ol>
          {products.length > 1 && !reduced ? (
            <button type="button" className="gx-bs__pause" onClick={() => setPlaying((p) => !p)}>
              {playing ? "Pause" : "Play"}
            </button>
          ) : null}
        </div>
      </div>
    </MotionConfig>
  );
}
