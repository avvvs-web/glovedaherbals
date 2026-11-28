"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";
const watch = (cb: () => void) => {
  const m = window.matchMedia(QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/**
 * The visitor's reduced-motion setting. The server cannot know it, so the first render assumes motion is
 * welcome (matching the server's HTML) and the real answer follows straight after. Using this instead of
 * a hook that answers differently on the server keeps the page from being rebuilt on load.
 */
export const useReducedMotionSafe = () => useSyncExternalStore(watch, () => window.matchMedia(QUERY).matches, () => false);
