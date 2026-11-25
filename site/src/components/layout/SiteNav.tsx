"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, LazyMotion, MotionConfig } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/shop/ui/Icon";
import { useFavourites } from "@/lib/shop/favourites";
import { SearchOverlay } from "./SearchOverlay";

/** Motion's features arrive after the page is interactive; see components/motion/lazy-features. */
const loadFeatures = () => import("@/components/motion/lazy-features").then((r) => r.default);

export type NavLink = { name: string; href: string };
export type NavGroup = { title: string; links: NavLink[] };
export type NavTile = NavLink & { image?: string; note?: string };
export type NavPanel = { id: string; label: string; tiles?: NavTile[]; groups: NavGroup[] };
export type SearchItem = { title: string; href: string; price: number; priceText: string; image?: string; range: string; text: string };

type Props = { panel: NavPanel; links: NavLink[]; search: SearchItem[]; searchAction: string; shortcuts: NavLink[]; accountHref: string; wishlistHref: string; help: NavLink; shopAll: NavLink; actions?: ReactNode };

/**
 * The navigation is a floating capsule: plain links on the left, the Gloveda mark in the
 * centre, then Help, search, the wishlist, account and the way into the store (or the bag, inside it). A gold line glides
 * between items as the pointer moves. Shop opens the one menu card under the capsule (click, not hover);
 * Escape or a click outside closes it and returns focus. Search opens over the page with results as you
 * type. On narrow screens the Menu button opens the same card. Past the top of a page the capsule draws in.
 */
export function SiteNav({ panel, links, search, searchAction, shortcuts, accountHref, wishlistHref, help, shopAll, actions }: Props) {
  const wished = useFavourites().list.length;
  const [open, setOpen] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const last = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(null);
      last.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    document.documentElement.dataset.nav = "open"; // keeps the capsule in place while a card is open
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

  const toggle = (id: string, el: HTMLButtonElement) => {
    last.current = el;
    setOpen((o) => (o === id ? null : id));
  };
  const tiles = panel.tiles ?? [];
  const active = hover ?? open;
  const line = (id: string) => (active === id ? <m.span layoutId="nav-line" className="nav__line" transition={{ type: "spring", stiffness: 420, damping: 36 }} /> : null);

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures}>
      <div ref={root} className="nav" onPointerLeave={() => setHover(null)}>
        <div className="nav__capsule glass">
          <ul className="nav__side" role="list">
            {links.map((l) => (
              <li key={l.name}>
                <a className="nav__item" href={l.href} onPointerEnter={() => setHover(l.name)} onFocus={() => setHover(l.name)} onBlur={() => setHover(null)}>
                  {l.name}
                  {line(l.name)}
                </a>
              </li>
            ))}
          </ul>

          <Link href="/" className="nav__logo" aria-label="Gloveda home">
            <Image src="/brand/logo-secondary-on-dark.png" alt="Gloveda" width={435} height={145} priority />
          </Link>

          <div className="nav__end">
            <a className="nav__item nav__help" href={help.href} onPointerEnter={() => setHover(help.name)} onFocus={() => setHover(help.name)} onBlur={() => setHover(null)}>
              {help.name}
              {line(help.name)}
            </a>
            <button
              type="button"
              className="nav__icon"
              aria-label="Search"
              onClick={() => {
                setOpen(null);
                setSearching(true);
              }}
            >
              <Icon name="search" />
            </button>
            <a className="nav__icon nav__wish" href={wishlistHref} aria-label={wished ? `Wishlist: ${wished} ${wished === 1 ? "product" : "products"}` : "Wishlist"}>
              <Icon name="heart" />
              {wished ? <span className="nav__count">{wished}</span> : null}
            </a>
            <a className="nav__icon nav__account" href={accountHref} aria-label="Your account: sign in and orders">
              <Icon name="account" />
            </a>
            {actions ?? (
              <a className="gl-btn gl-btn--sm nav__shop" href={shopAll.href}>
                {shopAll.name}
              </a>
            )}
            <button type="button" className="nav__icon nav__menu" aria-expanded={open === "menu"} aria-controls="nav-panel" aria-label={open === "menu" ? "Close menu" : "Menu"} onClick={(e) => toggle("menu", e.currentTarget)}>
              <Icon name={open === "menu" ? "close" : "menu"} />
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
              <div className="nav__panelInner" data-tiles={tiles.length > 0}>
                {tiles.length ? (
                  <ul className="nav__tiles" role="list">
                    {tiles.map((t, i) => (
                      <m.li key={t.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.04 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}>
                        <a className="nav__tile" href={t.href}>
                          <span className="nav__tileMedia">{t.image ? <Image src={t.image} alt="" width={320} height={400} sizes="(min-width: 68rem) 16rem, 30vw" /> : null}</span>
                          <span className="nav__tileName">{t.name}</span>
                          {t.note ? <span className="nav__tileNote">{t.note}</span> : null}
                        </a>
                      </m.li>
                    ))}
                  </ul>
                ) : null}
                <div className="nav__groups">
                  {panel.groups.map((g, i) => (
                    <m.div
                      key={g.title}
                      className="nav__group"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.08 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <h2 className="nav__groupTitle">{g.title}</h2>
                      <ul role="list">
                        {g.links.map((l) => (
                          <li key={l.name}>
                            <a className="nav__link" href={l.href} onClick={() => setOpen(null)}>
                              {l.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </m.div>
                  ))}
                  {actions ? null : (
                    <a className="gl-btn nav__enter" href={shopAll.href}>
                      Visit the shop
                      <Icon name="arrow" />
                    </a>
                  )}
                </div>
              </div>
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>
      <SearchOverlay open={searching} onClose={() => setSearching(false)} items={search} action={searchAction} shortcuts={shortcuts} />
      </LazyMotion>
    </MotionConfig>
  );
}
