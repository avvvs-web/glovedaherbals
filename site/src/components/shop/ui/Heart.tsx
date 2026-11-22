"use client";

import { MotionConfig, motion } from "motion/react";
import { useFavourites } from "@/lib/shop/favourites";
import { SPRING } from "./motion";

/** Save a product to favourites. A toggle button: the heart fills and gives one small spring. */
export function Heart({ handle, title }: { handle: string; title: string }) {
  const { has, toggle } = useFavourites();
  const on = has(handle);
  return (
    <MotionConfig reducedMotion="user">
      <button type="button" className="gx-heart" aria-pressed={on} aria-label={`Save ${title} to favourites`} onClick={() => toggle(handle)}>
        <motion.svg key={String(on)} width={20} height={20} viewBox="0 0 24 24" initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={SPRING} fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.25} strokeLinejoin="round" aria-hidden="true">
          <path d="M12 19.500s-7-4.300-7-9.300A3.700 3.700 0 0 1 12 8a3.700 3.700 0 0 1 7 2.200c0 5-7 9.300-7 9.300Z" />
        </motion.svg>
      </button>
    </MotionConfig>
  );
}
