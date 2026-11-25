"use client";

import { useEffect, useRef, type ReactNode } from "react";

// One observer for every reveal on the page. A block is shown once, when it is 12% into the viewport.
let io: IntersectionObserver | null = null;
const watch = (el: HTMLElement) => {
  io ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        (e.target as HTMLElement).dataset.shown = "true";
        io?.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -12% 0px" },
  );
  io.observe(el);
  return () => io?.unobserve(el);
};

/**
 * A single, quiet entrance for a block as it scrolls into view: it fades up 16px once and then stays.
 * Plain CSS (see [data-reveal] in styles/extras.css), so it adds no animation library to the page.
 * Under prefers-reduced-motion the block simply appears; without JavaScript it is visible from the start.
 */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? watch(ref.current) : undefined), []);
  return (
    <div ref={ref} data-reveal className={className} style={delay ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties) : undefined}>
      {children}
    </div>
  );
}
