"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/shop/ui/Icon";
import { smartSearch } from "@/lib/shop/smart-search";
import type { NavLink, SearchItem } from "./SiteNav";

const KEY = "gloveda-searches-v1";
const listeners = new Set<() => void>();
const read = () => {
  try {
    return window.localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const remember = (q: string) => {
  try {
    const prev = (JSON.parse(read()) as string[]).filter((x) => x.toLowerCase() !== q.toLowerCase());
    window.localStorage.setItem(KEY, JSON.stringify([q, ...prev].slice(0, 4)));
    listeners.forEach((l) => l());
  } catch {
    /* storage unavailable: recent searches are simply not kept */
  }
};

/**
 * Search, opened from the capsule: a sheet over the top of the page with results as you type. It matches
 * product names and the store's descriptions, forgives a mistyped letter and understands a price limit
 * ("hair under 500"). Recent searches are kept on this device. Enter goes to the full results page.
 * Escape, Close or a click outside shuts it.
 */
export function SearchOverlay({ open, onClose, items, action, shortcuts }: { open: boolean; onClose: () => void; items: SearchItem[]; action: string; shortcuts: NavLink[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState("");
  const recentRaw = useSyncExternalStore(subscribe, read, () => "[]");
  const recent = useMemo(() => {
    try {
      const v = JSON.parse(recentRaw);
      return Array.isArray(v) ? (v.filter((x) => typeof x === "string") as string[]) : [];
    } catch {
      return [];
    }
  }, [recentRaw]);
  const money = useMemo(() => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }), []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const typed = q.trim();
  const result = useMemo(() => smartSearch(typed, items, (n) => money.format(n)), [typed, items, money]);
  const matchingShortcuts = typed.length >= 3 ? shortcuts.filter((s) => s.name.toLowerCase().includes(typed.toLowerCase())).slice(0, 3) : [];
  const keep = () => typed.length >= 3 && remember(typed);

  return (
    <dialog
      ref={dialog}
      className="search theme-light"
      aria-label="Search the shop"
      onClose={() => {
        setQ("");
        onClose();
      }}
      onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
    >
      {open ? (
        <motion.div className="search__inner" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
          <form className="search__form" action={action} role="search" onSubmit={keep}>
            <Icon name="search" size={22} />
            <input className="search__input" name="q" type="text" enterKeyHint="search" value={q} onChange={(e) => setQ(e.currentTarget.value)} placeholder="Try “face wash” or “hair under 500”" aria-label="Search products" autoComplete="off" autoFocus />
            <button type="button" className="nav__icon search__close" aria-label="Close search" onClick={() => dialog.current?.close()}>
              <Icon name="close" />
            </button>
          </form>
          <div className="search__body" aria-live="polite">
            {!typed ? (
              <>
                {recent.length ? (
                  <>
                    <p className="gx-label">Recent</p>
                    <ul className="search__quick" role="list">
                      {recent.map((r) => (
                        <li key={r}>
                          <button type="button" className="gl-chip" onClick={() => setQ(r)}>
                            {r}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
                <p className="gx-label">Go straight to</p>
                <ul className="search__quick" role="list">
                  {shortcuts.map((l) => (
                    <li key={l.name}>
                      <a className="gl-chip" href={l.href}>
                        {l.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                {matchingShortcuts.length ? (
                  <ul className="search__quick" role="list">
                    {matchingShortcuts.map((l) => (
                      <li key={l.name}>
                        <a className="gl-chip" href={l.href} onClick={keep}>
                          {l.name} <Icon name="arrow" size={14} />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {result.items.length ? (
                  <>
                    {result.understood || result.loose ? <p className="gl-small search__note">{result.loose ? "No product matches every word, so these match some of them" : "Showing products"}{result.understood ? ` ${result.understood}` : ""}.</p> : null}
                    <ul className="search__results" role="list">
                      {result.items.map((r, i) => (
                        <motion.li key={r.href} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.03 }}>
                          <a className="search__result" href={r.href} onClick={keep}>
                            <span className="gx-row__thumb">{r.image ? <Image src={r.image} alt="" width={128} height={160} sizes="56px" /> : null}</span>
                            <span className="search__name">
                              {r.title}
                              <span className="search__range">{r.range}</span>
                            </span>
                            <span className="gx-row__price">{r.priceText}</span>
                          </a>
                        </motion.li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="gl-body">Nothing in the range matches &ldquo;{typed}&rdquo;. Try a shorter word, such as oil or wash.</p>
                )}
              </>
            )}
          </div>
        </motion.div>
      ) : null}
    </dialog>
  );
}
