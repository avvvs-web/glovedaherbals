"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * A quiet entrance for every page: each block of a page eases in (fades up a few pixels) the first time
 * it comes into view, and cards in a grid follow one another. What is on screen when the page opens
 * eases in at once.
 *
 * It is applied here, in one place, to the blocks pages are already made of, so no page has to opt in.
 * Blocks are only ever hidden by this script, so without JavaScript everything is simply visible; under
 * prefers-reduced-motion nothing is hidden or moved. The scroll film, the navigation, dialogs and blocks
 * that already animate themselves are left alone.
 */
const BLOCKS = "main .gl-container > *, .site-footer .gl-container > *";
const SKIP = ".sfilm, .sfilm *, [data-reveal], [data-reveal] *, dialog, dialog *, .gx-rtabs, .gx-buybar, script, style";
const GRIDS = ".gx-tiles, .gx-list, .gx-recent__list, .gx-help__topics, .gx-help__policies, .gx-pdp__steps, .gx-pdp__helps";

export function EaseIn() {
  const path = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items: HTMLElement[] = [];
    const add = (el: Element) => {
      if (!(el instanceof HTMLElement) || el.matches(SKIP) || el.querySelector("[data-reveal]") || el.dataset.ease) return;
      if (getComputedStyle(el).position === "sticky" || getComputedStyle(el).position === "fixed") return;
      el.dataset.ease = "wait";
      items.push(el);
    };
    for (const el of document.querySelectorAll(BLOCKS)) {
      // A grid of cards eases in card by card; anything else eases in as one block.
      const grids = el.matches(GRIDS) ? [el] : [...el.querySelectorAll(GRIDS)];
      if (grids.length) grids.forEach((g) => [...g.children].forEach(add));
      else add(el);
    }
    let batch = 0;
    let timer = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          // Blocks that arrive together follow one another, 70ms apart.
          el.style.transitionDelay = `${Math.min(batch, 6) * 70}ms`;
          el.dataset.ease = "in";
          batch++;
        }
        window.clearTimeout(timer);
        timer = window.setTimeout(() => (batch = 0), 120);
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.01 },
    );
    items.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      items.forEach((el) => {
        delete el.dataset.ease;
        el.style.transitionDelay = "";
      });
    };
  }, [path]);
  return null;
}
