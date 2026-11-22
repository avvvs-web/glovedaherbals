"use client";

import { useSyncExternalStore } from "react";

/**
 * Favourites, kept on this device (product handles in localStorage). Once accounts exist they will be
 * merged into the signed-in customer's saved list.
 */
const KEY = "gloveda-favourites-v1";
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
  window.addEventListener("storage", l);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", l);
  };
};
const parse = (raw: string): string[] => {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
};

export function useFavourites() {
  const raw = useSyncExternalStore(subscribe, read, () => "[]");
  const list = parse(raw);
  const toggle = (handle: string) => {
    const next = list.includes(handle) ? list.filter((h) => h !== handle) : [...list, handle];
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable: favourites simply do not persist */
    }
    listeners.forEach((l) => l());
  };
  return { list, has: (handle: string) => list.includes(handle), toggle };
}
