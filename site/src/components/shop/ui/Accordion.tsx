"use client";

import { MotionConfig, motion } from "motion/react";
import { useId, useState, type ReactNode } from "react";
import { Icon } from "./Icon";
import { DUR, EASE } from "./motion";

export type AccordionItem = { title: string; body: ReactNode };

/**
 * Collapsible sections (About, How to use, Delivery and returns). The content stays in the page's HTML
 * when closed, so it is still readable by search engines; it is only folded away and made inert.
 */
export function Accordion({ items, defaultOpen = 0 }: { items: AccordionItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const id = useId();
  return (
    <MotionConfig reducedMotion="user">
      <div className="gx-acc">
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <div key={it.title} className="gx-acc__item">
              <h3 className="gx-acc__head">
                <button type="button" className="gx-acc__button" aria-expanded={isOpen} aria-controls={`${id}-${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                  <span>{it.title}</span>
                  <motion.span className="gx-acc__icon" animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: DUR.base, ease: EASE }}>
                    <Icon name="chevron" size={18} />
                  </motion.span>
                </button>
              </h3>
              <motion.div id={`${id}-${i}`} className="gx-acc__panel" initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} transition={{ duration: DUR.slow, ease: EASE }} inert={!isOpen}>
                <div className="gx-acc__body">{it.body}</div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </MotionConfig>
  );
}
