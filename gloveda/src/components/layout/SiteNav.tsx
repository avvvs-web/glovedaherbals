"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, LazyMotion, MotionConfig } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

/** Motion's features arrive after the page is interactive; see components/motion/lazy-features. */
const loadFeatures = () => import("@/components/motion/lazy-features").then((r) => r.default);

export type NavLink = { name: string; href: string };
export type NavGroup = { title: string; links: NavLink[] };

type Props = { links: NavLink[]; groups: NavGroup[]; story: NavLink; shop: NavLink };

/**
 * The navigation is a floating capsule: the three Gloveda houses on the left, the mark in the centre,
 * then the story and the way into the shop. A gold line glides between items as the pointer moves. Menu
 * opens one card under the capsule with every link (click, not hover); Escape or a click outside closes
 * it and returns focus. Past the top of the page the capsule draws in.
 */
export function SiteNav({ links, groups, story, shop }: Props) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    document.documentElement.dataset.nav = "open"; // keeps the capsule in place while the card is open
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      delete document.documentElement.dataset.nav;
    };
  }, [open]);

  // The capsule draws in once the page has moved off its top. Only the attribute changes, not React state.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const onScroll = () => {
      const next = window.scrollY > 48 ? "true" : "false";
      if (el.dataset.condensed !== next) el.dataset.condensed = next;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const line = (id: string) => (hover === id ? <m.span layoutId="nav-line" className="nav__line" transition={{ type: "spring", stiffness: 420, damping: 36 }} /> : null);
  const item = (l: NavLink, className = "nav__item") => (
    <a className={className} href={l.href} onPointerEnter={() => setHover(l.name)} onFocus={() => setHover(l.name)} onBlur={() => setHover(null)}>
      {l.name}
      {line(l.name)}
    </a>
  );

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures}>
        <div ref={root} className="nav" onPointerLeave={() => setHover(null)}>
          <div className="nav__capsule glass">
            <ul className="nav__side" role="list">
              {links.map((l) => (
                <li key={l.name}>{item(l)}</li>
              ))}
            </ul>

            <Link href="/" className="nav__logo" aria-label="Gloveda home">
              <Image src="/brand/logo-secondary-on-dark.png" alt="Gloveda" width={435} height={145} priority />
            </Link>

            <div className="nav__end">
              {item(story, "nav__item nav__help")}
              <a className="gl-btn gl-btn--sm nav__shop" href={shop.href}>
                {shop.name}
              </a>
              <button ref={button} type="button" className="nav__icon nav__menu" aria-expanded={open} aria-controls="nav-panel" aria-label={open ? "Close menu" : "Menu"} onClick={() => setOpen((o) => !o)}>
                <Icon name={open ? "close" : "menu"} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {open ? (
              <m.div
                id="nav-panel"
                key="panel"
                className="nav__panel glass theme-plum"
                initial={{ opacity: 0, y: -10, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, transition: { duration: 0.16 } }}
                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="nav__panelInner" data-tiles={false}>
                  <div className="nav__groups">
                    {groups.map((g, i) => (
                      <m.div key={g.title} className="nav__group" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}>
                        <h2 className="nav__groupTitle">{g.title}</h2>
                        <ul role="list">
                          {g.links.map((l) => (
                            <li key={l.name}>
                              <a className="nav__link" href={l.href} onClick={() => setOpen(false)}>
                                {l.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </m.div>
                    ))}
                    <a className="gl-btn nav__enter" href={shop.href}>
                      Visit the shop
                      <Icon name="arrow" />
                    </a>
                  </div>
                </div>
              </m.div>
            ) : null}
          </AnimatePresence>
        </div>
      </LazyMotion>
    </MotionConfig>
  );
}
