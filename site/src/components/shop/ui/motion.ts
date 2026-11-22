/** One easing family and three durations for every shop interaction (seconds, for the Motion library). */
export const EASE = [0.16, 1, 0.3, 1] as const;
export const DUR = { fast: 0.16, base: 0.32, slow: 0.52 } as const;
export const SPRING = { type: "spring", stiffness: 420, damping: 30 } as const;
