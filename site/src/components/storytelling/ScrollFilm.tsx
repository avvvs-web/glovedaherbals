"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { filmLoad } from "@/lib/film-load";
import { FrameSequence, supportsAvif, type SequenceFormat } from "@/lib/frame-sequence";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FRAMES = 593; // the whole approved film: 0-510 story, 511-592 keyline and logo
/**
 * Scroll pacing, in screens of scroll -> film frame. Flat spans are holds: a breath on the finished
 * line-up (6.8-7.3) before the keyline, and the final hold on the logo (8.5-9.1).
 */
const KEYS: [number, number][] = [
  [0, 0],
  [2.2, 167],
  [3.0, 217],
  [4.8, 349],
  [6.8, 510],
  [7.3, 510],
  [8.5, 592],
  [9.1, 592],
];
const TOTAL = KEYS[KEYS.length - 1][0];
const FADE = 0.16;
/** The two paper-cut passages: the dawn landscape and the paper oil. The fast zoom between them is left alone. */
const PAPER: [number, number][] = [
  [0, 104],
  [118, 167],
];
const IDLE = { after: 600, frames: 6, period: 5200 };

/** Film position for a scroll position. Fractional: the stage blends the two neighbouring frames. */
function frameAt(u: number) {
  for (let i = 1; i < KEYS.length; i++) {
    const [u0, f0] = KEYS[i - 1];
    const [u1, f1] = KEYS[i];
    if (u <= u1) return f0 + ((f1 - f0) * (u - u0)) / (u1 - u0 || 1);
  }
  return FRAMES - 1;
}
/** Scroll position (in screens) at which a film frame is on screen. */
function uAt(frame: number) {
  for (let i = 1; i < KEYS.length; i++) {
    const [u0, f0] = KEYS[i - 1];
    const [u1, f1] = KEYS[i];
    if (f1 !== f0 && frame >= f0 && frame <= f1) return u0 + ((u1 - u0) * (frame - f0)) / (f1 - f0);
  }
  return TOTAL;
}

/** A 16:9 frame scaled to cover a box (the film fills the screen; on a 16:9 box this is the box itself). */
function coverRect(w: number, h: number) {
  const scale = Math.max(w / 16, h / 9);
  return { x: (w - 16 * scale) / 2, y: (h - 9 * scale) / 2, w: 16 * scale, h: 9 * scale };
}

/**
 * Upright screens (phones, tablets held upright). The film fills the whole screen here too. It is 16:9,
 * so only a tall slice of each frame fits; the slice follows the subject of each shot, and across the
 * line-up it travels from the first products to the last.
 * [film frame, where the subject is across the frame's width (0 left, 1 right)]
 */
const UPRIGHT: [number, number][] = [
  [0, 0.66],
  [30, 0.66],
  [60, 0.61],
  [104, 0.46],
  [118, 0.5],
  [380, 0.5],
  [400, 0.46],
  [450, 0.5],
  [470, 0.36],
  [506, 0.66],
  [530, 0.5],
  [592, 0.5],
];
function uprightRect(w: number, h: number, frame: number) {
  let at = UPRIGHT[0][1];
  for (let i = 1; i < UPRIGHT.length; i++) {
    const [f0, a0] = UPRIGHT[i - 1];
    const [f1, a1] = UPRIGHT[i];
    if (frame <= f1) {
      const k = (frame - f0) / (f1 - f0 || 1);
      const e = k * k * (3 - 2 * k); // ease in and out of each move
      at = a0 + (a1 - a0) * e;
      break;
    }
    at = a1;
  }
  const r = coverRect(w, h);
  // Centre the subject, without ever showing past the frame's own edges.
  return { ...r, x: Math.min(0, Math.max(w - r.w, w / 2 - at * r.w)) };
}

/**
 * Wide screens that are wider than the film (most laptops, once the browser's bars are taken off the
 * height). Filling the width there crops the top and bottom of every shot, and in the closing shot that
 * cut the logo, and it pushed the line-up into its own caption. Over these frames the camera pulls back until the whole height is in view; the plain
 * background at the sides is continued by mirroring the frame's own edge, never by more than SIDE of its width.
 */
const PULL_BACK: [number, number] = [400, 444]; // as the products fly out: the sides are plain background from here on
const SIDE = 0.16;
function wideRect(w: number, h: number, frame: number) {
  const cover = coverRect(w, h);
  if (cover.h <= h + 1) return cover; // 16:9 or taller: nothing is lost at the top
  const k = Math.max(0, Math.min(1, (frame - PULL_BACK[0]) / (PULL_BACK[1] - PULL_BACK[0])));
  const e = k * k * (3 - 2 * k);
  const fit = Math.max(h / 9, w / (16 * (1 + 2 * SIDE)));
  const scale = cover.w / 16 + (fit - cover.w / 16) * e;
  // Past the limit the foot is cropped, not the top: the logo stands at the top of the shot.
  return { x: (w - 16 * scale) / 2, y: ((h - 9 * scale) / 2) * (1 - e), w: 16 * scale, h: 9 * scale };
}

export type Chapter = {
  id: string;
  /** Where the text sits on the full-screen film: the empty corner of that shot. */
  place: "bl" | "tl" | "tr" | "bc";
  /** On upright screens the text rests at the foot. "top" puts it in the sky instead, in ink, where the product stands at the foot of the shot. */
  upright?: "top";
  /** "light" = ivory text for dark shots; "dark" = ink text for the bright gold shots. */
  tone: "light" | "dark";
  /** Film frames between which this chapter's text is on screen. */
  from: number;
  to: number | "end";
  title: string;
  body?: string;
  h1?: boolean;
  cta?: { label: string; href: string };
};

type Props = { chapters: Chapter[] };

/**
 * The approved film as a scroll-driven story. A pinned stage holds the film full screen (a canvas
 * drawing frame N for the scroll position). Each chapter's text sits in the empty corner of its own shot,
 * clear of the sun, the products and the logo, with no panel or scrim over the picture. On narrow screens
 * the film sits on top and the text below it.
 * The film plays through to the gold keyline and logo.
 * Without JavaScript, or with reduced motion, the same content reads as a still page.
 */
export function ScrollFilm({ chapters }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const film = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const seq = useRef<FrameSequence | null>(null);
  const state = useRef({ base: 0, frame: 0, drawn: -2, moved: 0, focus: -1 });

  const draw = useCallback(() => {
    const c = canvas.current;
    const box = film.current;
    const s = seq.current;
    if (!c || !box || !s) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(box.clientWidth * dpr);
    const h = Math.round(box.clientHeight * dpr);
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }
    // The film position is fractional. Between two decoded frames the second is laid over the first at
    // the fraction's opacity, so slow scrolling glides instead of stepping from frame to frame.
    const key = Math.max(0, Math.min(FRAMES - 1, state.current.frame));
    const near = Math.round(key);
    const wide = box.clientWidth >= 768 && w / h >= 1.2; // matches the CSS: wide screens get the film edge to edge
    const r = wide ? wideRect(w, h, key) : uprightRect(w, h, key);
    if (near !== state.current.focus) {
      // Keep the frames around this one decoded, at the width they are drawn (in steps, so a slow zoom does not restart it).
      s.focus(near, key >= state.current.drawn ? 1 : -1, Math.ceil((wide ? coverRect(w, h).w : r.w) / 128) * 128);
      state.current.focus = near;
    }
    const lo = Math.floor(key);
    const mix = key - lo;
    const a = s.ready(lo);
    const b = mix > 0.02 ? s.ready(lo + 1) : null;
    // Between frames that are not decoded yet (a fast flick, or still loading) the closest decoded frame
    // is shown instead; drawing never waits on a decode.
    const img: ImageBitmap | null = a && (b || mix <= 0.02) ? a : s.near(near);
    if (!img) return;
    const blend = img === a && b ? b : null;
    ctx.imageSmoothingQuality = "high";
    const side = Math.ceil(r.x); // the strip left bare at each side when the camera has pulled back
    const paint = (bmp: ImageBitmap) => {
      ctx.drawImage(bmp, r.x, r.y, r.w, r.h);
      if (side <= 0) return;
      const sw = (side / r.w) * bmp.width;
      // The frame's own edge, mirrored outward from each side.
      ctx.setTransform(-1, 0, 0, 1, r.x + 1, 0);
      ctx.drawImage(bmp, 0, 0, sw, bmp.height, 0, r.y, side + 1, r.h);
      ctx.setTransform(-1, 0, 0, 1, 2 * (r.x + r.w) - 1, 0);
      ctx.drawImage(bmp, bmp.width - sw, 0, sw, bmp.height, r.x + r.w - side - 1, r.y, side + 1, r.h);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };
    paint(img);
    if (blend) {
      ctx.globalAlpha = mix;
      paint(blend);
      ctx.globalAlpha = 1;
    }
    box.dataset.drawn = "true"; // the canvas now owns the picture; the fallback frame can hide
    state.current.drawn = key;
  }, []);

  useEffect(() => {
    const box = film.current;
    if (!box) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      filmLoad.set(1); // the still frame is enough, and there is nothing for the loader to wait for
      return;
    }
    let cancelled = false;
    // Native 1080p frames wherever the film is drawn wider than 1280 device pixels; 720p below that.
    // (On upright screens the film is as tall as the screen, so far wider than it.)
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const upright = !(box.clientWidth >= 768 && box.clientWidth / box.clientHeight >= 1.2);
    const size = coverRect(box.clientWidth * dpr, box.clientHeight * dpr).w > 1280 ? "lg" : "sm";
    supportsAvif().then((avif) => {
      if (cancelled) return;
      const fmt: SequenceFormat = avif ? "avif" : "webp";
      // Upright screens are phones and tablets: keep fewer full-size frames decoded there.
      const s = new FrameSequence(`/seq/film/${size}`, FRAMES, fmt, 6, upright ? { ahead: 12, behind: 4, slack: 2 } : undefined);
      s.onReady = (i) => {
        // A frame near the one on screen was decoded: draw it (first paint, or sharpening after a flick).
        if (Math.abs(i - state.current.frame) <= 8) requestAnimationFrame(draw);
      };
      seq.current = s;
      // What the film needs before it can play smoothly from where the page opens: the frame on screen,
      // every 16th frame of the whole film (so any scroll position has a picture), and every 4th frame of
      // the passage ahead. These are fetched first and the loader counts them; the rest follow behind.
      const here = Math.round(state.current.frame);
      const need = new Set<number>([here]);
      for (let i = 0; i < FRAMES; i += 16) need.add(i);
      for (let i = here; i <= Math.min(FRAMES - 1, here + 64); i += 4) need.add(i);
      let got = 0;
      s.onFrame = (i) => {
        if (need.delete(i)) filmLoad.set(++got / (got + need.size));
      };
      s.start([here, ...[...need].filter((i) => i !== here)]);
    });
    const ro = new ResizeObserver(() => requestAnimationFrame(draw));
    ro.observe(box);
    return () => {
      cancelled = true;
      ro.disconnect();
      seq.current?.dispose();
    };
  }, [draw]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        if (!el) return;
        el.dataset.mode = "scrub"; // the tall scroll track and the pinned stage exist only now
        const html = document.documentElement;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.7,
            onUpdate: (self) => {
              // The header steps back while the story plays and returns on the way up.
              html.dataset.header = self.direction === 1 && self.progress > 0.004 && self.progress < 1 ? "hidden" : "shown";
            },
            onLeave: () => (html.dataset.header = "shown"),
          },
        });
        // The film follows the eased timeline, not the raw scroll position, so a notched mouse wheel or a
        // flick still plays as one continuous move. It is drawn on the same tick the timeline advances.
        tl.eventCallback("onUpdate", () => {
          const base = frameAt(tl.progress() * TOTAL);
          if (Math.abs(base - state.current.base) < 0.004) return;
          state.current.moved = performance.now();
          state.current.base = base;
          state.current.frame = base;
          draw();
        });
        // Idle motion: in the paper-cut dawn, once scrolling has stopped, sway gently around the current frame.
        let amp = 0;
        let idleStart = 0;
        const idle = () => {
          const s = state.current;
          const now = performance.now();
          const span = PAPER.find(([a, b]) => s.base >= a && s.base <= b);
          const resting = !!span && now - s.moved > IDLE.after && !document.hidden;
          if (resting && amp === 0) idleStart = now;
          amp = resting ? Math.min(1, amp + 0.01) : 0;
          if (!resting || !span) return;
          const sway = Math.sin(((now - idleStart) / IDLE.period) * Math.PI * 2) * IDLE.frames * amp;
          const frame = Math.max(span[0], Math.min(span[1], s.base + sway));
          if (Math.abs(frame - s.frame) > 0.004) {
            s.frame = frame;
            draw();
          }
        };
        gsap.ticker.add(idle);
        // Upright screens: the shadow at the foot arrives with the first chapter that rests there.
        tl.fromTo(film.current, { "--foot": 0 }, { "--foot": 1, duration: 0.25 }, uAt(110));
        tl.fromTo(".sfilm__progress", { scaleX: 0 }, { scaleX: 1, duration: TOTAL }, 0);
        chapters.forEach((ch, i) => {
          const sel = `[data-chapter="${ch.id}"]`;
          const start = uAt(ch.from);
          const end = ch.to === "end" ? null : uAt(ch.to);
          if (i > 0) tl.fromTo(sel, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: FADE, ease: "power1.out" }, start);
          if (end !== null) tl.to(sel, { autoAlpha: 0, y: -18, duration: FADE, ease: "power1.in" }, end - FADE);
        });
        tl.set({}, {}, TOTAL);
        ScrollTrigger.refresh();
        return () => {
          gsap.ticker.remove(idle);
          delete el.dataset.mode;
          html.dataset.header = "shown";
        };
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [draw] },
  );

  return (
    <div ref={root} id="story" className="sfilm">
      <div className="sfilm__stage theme-wine">
        <div className="sfilm__grid">
          <div className="sfilm__text">
            {chapters.map((ch) => (
              <section key={ch.id} className="sfilm__chapter" aria-labelledby={`ch-${ch.id}`} data-chapter={ch.id} data-place={ch.place} data-tone={ch.tone} data-upright={ch.upright}>
                {ch.h1 ? (
                  <h1 id={`ch-${ch.id}`} className="sfilm__title">
                    {ch.title}
                  </h1>
                ) : (
                  <h2 id={`ch-${ch.id}`} className="sfilm__title">
                    {ch.title}
                  </h2>
                )}
                {ch.body ? <p className="sfilm__body">{ch.body}</p> : null}
                {ch.cta ? (
                  <a className="gl-btn sfilm__cta" href={ch.cta.href}>
                    {ch.cta.label}
                  </a>
                ) : null}
              </section>
            ))}
          </div>

          <div ref={film} className="sfilm__film">
            <picture className="sfilm__poster">
              <source type="image/avif" srcSet="/seq/film/sm/0000.avif 1280w, /seq/film/lg/0000.avif 1920w" sizes="100vw" />
              <img src="/seq/film/lg/0000.webp" alt="" width={1920} height={1080} fetchPriority="high" />
            </picture>
            <canvas ref={canvas} className="sfilm__canvas" aria-hidden="true" />
          </div>
        </div>
        <div className="sfilm__progress" aria-hidden="true" />
      </div>
    </div>
  );
}
