"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { DUR, EASE } from "./motion";

/**
 * A price or count whose characters roll to their new value when it changes. Screen readers get the
 * plain text; the rolling characters are decorative.
 */
export function RollingNumber({ text, className }: { text: string; className?: string }) {
  return (
    <MotionConfig reducedMotion="user">
      <span className={`gx-roll${className ? ` ${className}` : ""}`}>
        <span className="visually-hidden">{text}</span>
        <span aria-hidden="true" className="gx-roll__row">
          {text.split("").map((ch, i) => (
            <span key={i} className="gx-roll__cell">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span key={ch} className="gx-roll__char" initial={{ y: "70%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-70%", opacity: 0 }} transition={{ duration: DUR.base, ease: EASE }}>
                  {ch}
                </motion.span>
              </AnimatePresence>
            </span>
          ))}
        </span>
      </span>
    </MotionConfig>
  );
}
