"use client";

/**
 * How much of the opening film is ready, shared between the film (which loads the frames) and the
 * loader (which waits for them). `progress` runs 0 to 1 over the frames the opening needs: the frame on
 * screen and every 8th frame of the next 32. The rest of the start set (every 16th frame of the film)
 * follows behind the page, and the remaining frames once the visitor first scrolls, touches or presses
 * a key.
 */
export type FilmLoad = { progress: number; done: boolean };
const START: FilmLoad = { progress: 0, done: false };
let state = START;
const listeners = new Set<() => void>();
export const filmLoad = {
  get: () => state,
  server: () => START,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  set: (progress: number) => {
    const p = Math.max(state.progress, Math.min(1, progress)); // never runs backwards
    if (p === state.progress) return;
    state = { progress: p, done: p >= 1 };
    listeners.forEach((l) => l());
  },
};
