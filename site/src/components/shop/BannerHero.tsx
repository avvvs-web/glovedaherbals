"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";
import { Icon } from "./ui/Icon";

export type Banner = { id: string; alt: string; href: string; desktop: string; mobile: string };

const HOLD = 6000;
const sized = (src: string, w: number) => `${src}?width=${w}`;

/**
 * The shop's hero: the store's own banners, one at a time, edge to edge from the top of the screen.
 * The whole banner is always shown (its artwork carries text and products out to the edges), so its
 * height follows the screen's width. It moves on every few
 * seconds; hovering, focusing or choosing a banner holds it, there is a Pause button, and under reduced
 * motion it never moves by itself. Swipe or use the arrows to step through. The banners are supplied by
 * the store (see getBanners), with a wide picture for wide screens and an upright one for phones and
 * tablets held upright, where it fills most of the first screen.
 */
export function BannerHero({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const reduced = useReducedMotionSafe();
  const many = banners.length > 1;
  const running = playing && !held && !reduced && many;
  const go = (i: number) => setIndex((i + banners.length) % banners.length);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % banners.length), HOLD);
    return () => clearTimeout(t);
  }, [running, index, banners.length]);

  const current = banners[index];
  if (!current) return null;

  return (
    <MotionConfig reducedMotion="user">
      <section className="gx-banner" aria-roledescription="carousel" aria-label="Featured in the shop" onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)} onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}>
        <motion.div
          className="gx-banner__frame"
          drag={many ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.14}
          dragSnapToOrigin
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(index + 1);
            else if (info.offset.x > 60) go(index - 1);
          }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.a key={current.id} className="gx-banner__slide" href={current.href} draggable={false} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <picture>
                <source media="(min-aspect-ratio: 6/5) and (min-width: 48rem)" srcSet={`${sized(current.desktop, 1100)} 1100w, ${sized(current.desktop, 1600)} 1600w, ${sized(current.desktop, 2400)} 2400w`} sizes="100vw" />
                <img src={sized(current.mobile, 900)} srcSet={`${sized(current.mobile, 600)} 600w, ${sized(current.mobile, 900)} 900w, ${sized(current.mobile, 1080)} 1080w`} sizes="100vw" alt={current.alt} draggable={false} fetchPriority={index === 0 ? "high" : "auto"} />
              </picture>
            </motion.a>
          </AnimatePresence>
          {many ? (
            <>
              <button type="button" className="gx-banner__arrow gx-banner__arrow--prev glass" aria-label="Previous banner" onClick={() => go(index - 1)}>
                <Icon name="arrow" />
              </button>
              <button type="button" className="gx-banner__arrow glass" aria-label="Next banner" onClick={() => go(index + 1)}>
                <Icon name="arrow" />
              </button>
            </>
          ) : null}
        </motion.div>
        {many ? (
          <div className="gx-banner__controls">
            <ol className="gx-banner__dots" role="list">
              {banners.map((b, i) => (
                <li key={b.id}>
                  <button type="button" className="gx-banner__dot" aria-current={i === index} aria-label={`Banner ${i + 1} of ${banners.length}`} onClick={() => setIndex(i)}>
                    {i === index ? <span key={`${index}-${running}`} className="gx-banner__fill" data-running={running} style={{ animationDuration: `${HOLD}ms` }} /> : null}
                  </button>
                </li>
              ))}
            </ol>
            {!reduced ? (
              <button type="button" className="gx-bs__pause" onClick={() => setPlaying((p) => !p)}>
                {playing ? "Pause" : "Play"}
              </button>
            ) : null}
          </div>
        ) : null}
      </section>
    </MotionConfig>
  );
}
