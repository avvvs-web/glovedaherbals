"use client";

import { MotionConfig, motion } from "motion/react";
import { useId } from "react";
import { SPRING } from "./motion";

export type TabItem = { id: string; label: string };

/**
 * A row of choices where one is current. The wine pill slides to the chosen item. Rendered as a group of
 * toggle buttons, so it works for both "jump to" and "narrow the list" uses.
 */
export function Tabs({ items, value, onChange, label }: { items: TabItem[]; value: string; onChange: (id: string) => void; label: string }) {
  const group = useId();
  return (
    <MotionConfig reducedMotion="user">
      <div className="gx-tabs" role="group" aria-label={label}>
        {items.map((it) => (
          <button key={it.id} type="button" className="gx-tab" aria-pressed={it.id === value} onClick={() => onChange(it.id)}>
            {it.id === value ? <motion.span layoutId={`tab-${group}`} className="gx-tab__pill" transition={SPRING} /> : null}
            <span className="gx-tab__label">{it.label}</span>
          </button>
        ))}
      </div>
    </MotionConfig>
  );
}
