"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { filmLoad } from "@/lib/film-load";

/** The longest the loader will hold the page, however slow the connection. The film then sharpens as it plays. */
const MAX_WAIT = 9000;
/** Long enough to read as a moment rather than a flicker. */
const MIN_SHOW = 1400;
const LINES: [number, string][] = [
  [0, "Folding the paper"],
  [0.4, "Lighting the dawn"],
  [0.8, "Raising the sun"],
];

// The sun is drawn in a 400 x 400 box, centred on (200, 200), after the film's own paper-cut sun:
// a cream disc in a gold band, long gold rays and short ivory ones turn about, a scalloped paper collar,
// and two wide pale discs behind.
const C = 200;
const RAYS = 24;
const pt = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return `${(C + r * Math.cos(a)).toFixed(2)},${(C + r * Math.sin(a)).toFixed(2)}`;
};
/** A triangle pointing outwards from the sun, drawn at the top; each one is then turned into place. */
const ray = (base: number, tip: number, half: number) => `${pt(base, -half)} ${pt(tip, 0)} ${pt(base, half)}`;
const LONG = ray(84, 178, 10.5);
const SHORT = ray(86, 128, 7.5);
/** The scalloped collar: a ring of small half-round bites, like paper cut with pinking shears. */
const SCALLOP = (() => {
  const n = 40;
  let d = `M${pt(112, 0)}`;
  for (let i = 0; i < n; i++) d += ` Q${pt(119, ((i + 0.5) * 360) / n)} ${pt(112, ((i + 1) * 360) / n)}`;
  return `${d}Z`;
})();
const MOTES = Array.from({ length: 16 }, (_, i) => ({ left: 8 + ((i * 53) % 84), delay: (i * 0.7) % 6, size: 2 + (i % 3), drift: (i % 2 ? 1 : -1) * (6 + (i % 5) * 3), time: 6 + (i % 4) }));

/**
 * The opening loader: the film's own paper-cut sun, rising behind paper hills on the wine ground.
 * It is built as the film arrives: the sun climbs clear of the hills, and its rays are set in one by one,
 * with the real share of the film that has loaded (never a timer). Gold dust drifts up around it, and
 * the rays turn slowly. When the film is ready the sun opens out and the page is underneath.
 *
 * It is in the server's HTML so the film is never seen half-loaded. Without JavaScript, and under
 * prefers-reduced-motion (where the film is a still picture), it is hidden by CSS and never holds the page.
 */
export function FilmLoader() {
  const load = useSyncExternalStore(filmLoad.subscribe, filmLoad.get, filmLoad.server);
  const [phase, setPhase] = useState<"loading" | "leaving" | "gone">("loading");
  const [waited, setWaited] = useState(false);
  const [late, setLate] = useState(false);

  // Hold the page still underneath, and release it however this ends.
  useEffect(() => {
    if (phase === "gone") return;
    document.documentElement.dataset.loading = "true";
    return () => {
      delete document.documentElement.dataset.loading;
    };
  }, [phase]);

  useEffect(() => {
    const a = window.setTimeout(() => setWaited(true), MIN_SHOW);
    const b = window.setTimeout(() => setLate(true), MAX_WAIT);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, []);

  // Ready (or out of patience): fade out, then leave the page entirely.
  const ready = (load.done && waited) || late;
  useEffect(() => {
    if (!ready) return;
    const a = window.setTimeout(() => setPhase((p) => (p === "loading" ? "leaving" : p)), 0);
    return () => window.clearTimeout(a);
  }, [ready]);
  useEffect(() => {
    if (phase !== "leaving") return;
    const b = window.setTimeout(() => setPhase("gone"), 1100);
    return () => window.clearTimeout(b);
  }, [phase]);

  if (phase === "gone") return null;
  const p = load.progress;
  const percent = Math.round(p * 100);
  const line = [...LINES].reverse().find(([at]) => p >= at)?.[1] ?? LINES[0][1];
  const lit = Math.round(p * RAYS);

  return (
    <div className="floader theme-wine" data-phase={phase} data-lenis-prevent role="status" aria-live="polite" aria-label={`Loading the film: ${percent} percent`} style={{ "--rise": p } as React.CSSProperties}>
      <div className="floader__sky" aria-hidden="true">
        {MOTES.map((m, i) => (
          <span key={i} className="floader__mote" style={{ left: `${m.left}%`, width: m.size, height: m.size, animationDelay: `${m.delay}s`, animationDuration: `${m.time}s`, "--drift": `${m.drift}px` } as React.CSSProperties} />
        ))}
      </div>

      <div className="floader__stage" aria-hidden="true">
        <div className="floader__sun">
          <span className="floader__glow" />
          <svg viewBox="0 0 400 400">
            <defs>
              <filter id="fl-paper" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2.5" stdDeviation="3" floodColor="#2a1a1f" floodOpacity="0.35" />
              </filter>
              <pattern id="fl-dots" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
                <circle cx="2" cy="2" r="0.9" fill="var(--gl-gold-deep)" opacity="0.35" />
              </pattern>
              <radialGradient id="fl-core" cx="42%" cy="36%" r="75%">
                <stop offset="0" stopColor="var(--gl-white)" />
                <stop offset="0.7" stopColor="var(--gl-ivory)" />
                <stop offset="1" stopColor="var(--gl-gold-20)" />
              </radialGradient>
            </defs>
            <g filter="url(#fl-paper)">
              <circle cx={C} cy={C} r="192" fill="color-mix(in srgb, var(--gl-gold) 42%, var(--gl-gold-20))" />
              <circle cx={C} cy={C} r="192" fill="url(#fl-dots)" />
            </g>
            <circle cx={C} cy={C} r="160" fill="color-mix(in srgb, var(--gl-gold) 14%, var(--gl-gold-20))" filter="url(#fl-paper)" />
            <g className="floader__rays">
              {Array.from({ length: RAYS }, (_, i) => (
                <g key={i} transform={`rotate(${(i * 360) / RAYS} ${C} ${C})`}>
                  <g className="floader__ray" data-on={i < lit} filter="url(#fl-paper)">
                    <polygon points={i % 2 ? SHORT : LONG} fill={i % 2 ? "var(--gl-ivory)" : "var(--gl-gold)"} stroke={i % 2 ? "var(--gl-gold)" : "var(--gl-gold-deep)"} strokeWidth={i % 2 ? 1.4 : 0.9} strokeLinejoin="round" />
                    {/* the small cut-out on each ray, as on the film's sun */}
                    <polygon points={`${pt(i % 2 ? 99 : 108, 0)} ${pt(i % 2 ? 104 : 118, i % 2 ? 1.7 : 2.2)} ${pt(i % 2 ? 109 : 128, 0)} ${pt(i % 2 ? 104 : 118, i % 2 ? -1.7 : -2.2)}`} fill={i % 2 ? "var(--gl-gold)" : "var(--gl-ivory)"} />
                  </g>
                </g>
              ))}
            </g>
            <path d={SCALLOP} fill="var(--gl-gold-20)" filter="url(#fl-paper)" />
            <circle cx={C} cy={C} r="86" fill="none" stroke="var(--gl-gold)" strokeWidth="7" filter="url(#fl-paper)" />
            <circle cx={C} cy={C} r="76" fill="url(#fl-core)" filter="url(#fl-paper)" />
          </svg>
        </div>
        {/* Paper hills: three torn layers in front of the sun, from the film's own palette. */}
        <svg className="floader__hills" viewBox="0 0 1200 300" preserveAspectRatio="none">
          <defs>
            <filter id="fl-hill" x="-5%" y="-30%" width="110%" height="160%">
              <feDropShadow dx="0" dy="-4" stdDeviation="6" floodColor="#1d050e" floodOpacity="0.45" />
            </filter>
          </defs>
          <path filter="url(#fl-hill)" fill="var(--gl-terracotta)" d="M0,96 C150,52 300,120 470,82 C640,44 760,112 930,76 C1050,50 1130,84 1200,66 L1200,300 L0,300Z" />
          <path filter="url(#fl-hill)" fill="var(--gl-wine-80)" d="M0,150 C180,104 330,170 520,132 C700,96 860,166 1030,128 C1110,110 1160,128 1200,120 L1200,300 L0,300Z" />
          <path filter="url(#fl-hill)" fill="var(--gl-plum)" d="M0,208 C210,168 390,226 600,190 C800,156 980,214 1200,178 L1200,300 L0,300Z" />
        </svg>
      </div>

      <div className="floader__words" aria-hidden="true">
        <p className="floader__line">{line}</p>
        <p className="floader__num">{percent}</p>
      </div>
    </div>
  );
}
