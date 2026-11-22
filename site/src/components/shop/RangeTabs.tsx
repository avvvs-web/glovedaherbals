"use client";

import { MotionConfig, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export type RangeTab = { id: string; name: string };

/**
 * The ranges on the all-products page, as one row of tabs that belongs to the page (not a second
 * floating bar). The range on screen is marked in gold, with a gold line that slides to it. Once the row
 * reaches the top it docks there edge to edge; scrolling down tucks the main navigation away so only the
 * row remains, and scrolling up brings the navigation back above it. On a phone the row scrolls sideways
 * and keeps the current range in view. Each tab is a plain link to its section, so it works without scripts.
 */
export function RangeTabs({ tabs }: { tabs: RangeTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const bar = useRef<HTMLElement>(null);
  const mark = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bar.current;
    const top = mark.current;
    if (!el || !top) return;
    const html = document.documentElement;
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const stuck = top.getBoundingClientRect().top < 73;
      el.dataset.stuck = String(stuck);
      // The main navigation steps back on the way down and returns on the way up (or at the top).
      if (!stuck) html.dataset.header = "shown";
      else if (Math.abs(y - last) > 6) html.dataset.header = y > last ? "hidden" : "shown";
      last = y;
      // The current range: the last section whose heading has reached the row's place under the navigation
      // (a fixed line, so it reads the same whether the navigation is tucked away or not).
      const line = 72 + el.offsetHeight + 32;
      let current = tabs[0]?.id ?? "";
      for (const t of tabs) {
        const s = document.getElementById(t.id);
        if (s && s.getBoundingClientRect().top <= line) current = t.id;
      }
      setActive((a) => (a === current ? a : current));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      html.dataset.header = "shown";
    };
  }, [tabs]);

  // Phones: keep the current tab in view inside the sideways-scrolling row.
  useEffect(() => {
    const row = bar.current?.querySelector(".gx-rtabs__row");
    const tab = row?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!row || !tab) return;
    row.scrollTo({ left: tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  return (
    <MotionConfig reducedMotion="user">
      <div ref={mark} aria-hidden="true" />
      <nav ref={bar} className="gx-rtabs" aria-label="Ranges">
        <ul className="gx-rtabs__row" role="list">
          {tabs.map((t) => (
            <li key={t.id}>
              <a className="gx-rtabs__tab" href={`#${t.id}`} aria-current={active === t.id ? "true" : undefined}>
                {t.name}
                {active === t.id ? <motion.span layoutId="rtabs-line" className="gx-rtabs__line" transition={{ type: "spring", stiffness: 420, damping: 38 }} /> : null}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </MotionConfig>
  );
}
