"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../Cart";
import { Icon } from "./Icon";
import { DUR, EASE } from "./motion";

/**
 * Add to bag. On press the label slides away and "Added" with a drawn tick takes its place; a moment
 * later the bag opens with the new line. `compact` is the round plus used in list rows.
 */
export function AddButton({ variantId, available, title, compact = false, label = "Add to bag" }: { variantId: number; available: boolean; title: string; compact?: boolean; label?: string }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const press = () => {
    if (added) return;
    setAdded(true);
    timers.current.push(setTimeout(() => add(variantId), 460), setTimeout(() => setAdded(false), 1800));
  };
  const text = !available ? "Sold out" : added ? "Added" : label;

  return (
    <MotionConfig reducedMotion="user">
      <motion.button
        type="button"
        className={compact ? "gx-add gx-add--compact" : "gl-btn gx-add"}
        data-added={added}
        disabled={!available}
        onClick={press}
        whileTap={available ? { scale: 0.96 } : undefined}
        aria-label={compact ? `${text}: ${title}` : undefined}
      >
        {/* A small bag lifts off the button as the product goes in. */}
        <AnimatePresence>
          {added ? (
            <motion.span className="gx-add__pop" initial={{ y: 0, opacity: 0, scale: 0.5 }} animate={{ y: -38, opacity: [0, 1, 1, 0], scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: EASE, times: [0, 0.2, 0.7, 1] }} aria-hidden="true">
              <Icon name="bag" size={18} />
            </motion.span>
          ) : null}
        </AnimatePresence>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span key={added ? "added" : "idle"} className="gx-add__label" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: DUR.base, ease: EASE }}>
            {added ? (
              <svg width={compact ? 18 : 16} height={compact ? 18 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <motion.path d="M5.500 12.500l4.200 4.200L18.500 7.500" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: DUR.slow, ease: EASE }} />
              </svg>
            ) : compact ? (
              <Icon name="plus" size={18} />
            ) : null}
            {compact ? null : text}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </MotionConfig>
  );
}
