"use client";

import Image from "next/image";
import { useEffect, useSyncExternalStore } from "react";
import { Price } from "@/components/shop/ui/Price";

export type RecentItem = { handle: string; title: string; href: string; price: string; image?: string };

const KEY = "gloveda-recent-v1";
const read = () => {
  try {
    return window.localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
};
const subscribe = (l: () => void) => {
  window.addEventListener("storage", l);
  return () => window.removeEventListener("storage", l);
};

/**
 * Products this visitor looked at before, kept on this device as a list of handles only. Names, prices
 * and photos always come from the live catalogue passed in, so nothing shown here can be out of date.
 */
export function RecentlyViewed({ current, catalog }: { current: string; catalog: RecentItem[] }) {
  const raw = useSyncExternalStore(subscribe, read, () => "[]");
  let seen: string[] = [];
  try {
    const v = JSON.parse(raw);
    if (Array.isArray(v)) seen = v.filter((x): x is string => typeof x === "string");
  } catch {}
  useEffect(() => {
    try {
      const prev: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
      const list = Array.isArray(prev) ? prev.filter((x): x is string => typeof x === "string") : [];
      window.localStorage.setItem(KEY, JSON.stringify([current, ...list.filter((h) => h !== current)].slice(0, 9)));
    } catch {}
  }, [current]);

  const items = seen
    .filter((h) => h !== current)
    .map((h) => catalog.find((c) => c.handle === h))
    .filter((c): c is RecentItem => !!c)
    .slice(0, 4);
  if (!items.length) return null;
  return (
    <section className="gx-band gx-recent" aria-labelledby="recent-title">
      <div className="gl-container">
        <h2 id="recent-title" className="gx-title">
          You looked at
        </h2>
        <ul className="gx-recent__list" role="list">
          {items.map((p) => (
            <li key={p.handle}>
              <a className="gx-recent__item" href={p.href}>
                <span className="gx-recent__media">{p.image ? <Image src={p.image} alt="" width={320} height={400} sizes="(min-width: 64rem) 18vw, 44vw" /> : null}</span>
                <span className="gx-recent__name">{p.title}</span>
                <span className="gx-recent__price"><Price>{p.price}</Price></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
