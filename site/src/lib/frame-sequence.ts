/**
 * Progressive loader for a pre-rendered image sequence (client only).
 *
 * Frames are fetched coarse-to-fine (every 32nd, then 16th, 8th, 4th, 2nd, then all) and kept as
 * compressed blobs. Nothing is decoded on the main thread: frames are turned into ImageBitmaps from
 * those blobs, which the browser decodes in the background. Two sets of decoded frames exist:
 *  - a window around the current frame at full drawing size, more of it in the direction of travel;
 *  - every 8th frame at a small size, kept for the whole session, so a fast flick always has a nearby
 *    frame to show while the full-size ones catch up.
 */
export type SequenceFormat = "avif" | "webp";

/** Decoded full-size frames kept around the current one (1080p frames are ~8 MB each once decoded). */
const WINDOW = { ahead: 20, behind: 6, slack: 2 };
/** The always-available fallback set: every Nth frame at this width. */
const SPARSE = { every: 8, width: 640 };

export class FrameSequence {
  private blobs: (Blob | null)[];
  private bitmaps = new Map<number, ImageBitmap>();
  private sparse = new Map<number, ImageBitmap>();
  private decoding = new Set<number>();
  private started = false;
  private cancelled = false;
  private width = 0;
  private centre = 0;
  private lo = 0;
  private hi = -1;
  /** A frame finished downloading. */
  onFrame?: (index: number) => void;
  /** A decoded frame became ready to draw. */
  onReady?: (index: number) => void;

  constructor(
    private base: string,
    readonly count: number,
    private format: SequenceFormat,
    private concurrency = 6,
    private win = WINDOW,
  ) {
    this.blobs = new Array(count).fill(null);
  }

  private url(i: number) {
    return `${this.base}/${String(i).padStart(4, "0")}.${this.format}`;
  }

  private order(): number[] {
    const seen = new Set<number>();
    const out: number[] = [];
    for (const step of [32, 16, 8, 4, 2, 1]) {
      const take = (i: number) => {
        if (seen.has(i)) return;
        seen.add(i);
        out.push(i);
      };
      for (let i = 0; i < this.count; i += step) take(i);
      take(this.count - 1);
    }
    return out;
  }

  private queue: number[] = [];
  private active = 0;
  private first = new Set<number>();

  /**
   * Fetch `first` frames immediately (e.g. the frame on screen), then the rest coarse-to-fine. With
   * `only`, just `first` is fetched until `more()` is called.
   */
  start(first: number[] = [0], opts: { only?: boolean } = {}) {
    if (this.started) return;
    this.started = true;
    this.first = new Set(first);
    this.queue = opts.only ? [...first] : [...first, ...this.order().filter((i) => !this.first.has(i))];
    this.next();
  }

  /** Queue every frame not fetched or queued yet, coarse-to-fine, behind what is already waiting. */
  more() {
    if (!this.started || this.cancelled) return;
    const queued = new Set(this.queue);
    for (const i of this.order()) if (!this.blobs[i] && !queued.has(i)) this.queue.push(i);
    this.next();
  }

  private next() {
    while (!this.cancelled && this.active < this.concurrency && this.queue.length) {
      const i = this.queue.shift() as number;
      if (this.blobs[i]) continue;
      this.active++;
      fetch(this.url(i))
        .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(`frame ${i} failed`))))
        .then((blob) => {
          if (this.cancelled) return;
          this.blobs[i] = blob;
          this.onFrame?.(i);
          if (i % SPARSE.every === 0 || i === this.count - 1 || this.first.has(i)) this.keep(i, blob);
          if (i >= this.lo && i <= this.hi) this.pump();
        })
        .catch(() => {})
        .finally(() => {
          this.active--;
          this.next();
        });
    }
  }

  /** Decode a small copy of a frame and keep it for the session. */
  private keep(i: number, blob: Blob) {
    createImageBitmap(blob, { resizeWidth: SPARSE.width, resizeHeight: Math.round((SPARSE.width * 9) / 16), resizeQuality: "medium" })
      .then((bmp) => {
        if (this.cancelled) return bmp.close();
        this.sparse.set(i, bmp);
        this.onReady?.(i);
      })
      .catch(() => {});
  }

  /**
   * Keep the frames around `i` decoded at full drawing size, more of them in the direction of travel.
   * Frames that fall out of the window are released. `width` is the width the film is drawn at, so
   * frames are not held larger than needed.
   */
  focus(i: number, dir: 1 | -1, width: number) {
    if (width !== this.width) {
      this.release(() => true);
      this.width = width;
    }
    this.centre = i;
    this.lo = Math.max(0, i - (dir === 1 ? this.win.behind : this.win.ahead));
    this.hi = Math.min(this.count - 1, i + (dir === 1 ? this.win.ahead : this.win.behind));
    this.release((k) => k < this.lo - this.win.slack || k > this.hi + this.win.slack);
    this.pump();
  }

  /** Frame `i` at full size, decoded and ready to draw, if it is in the window. */
  ready(i: number): ImageBitmap | null {
    return this.bitmaps.get(i) ?? null;
  }

  /** The closest decoded frame to `i`: a full-size one if one is within a few frames, else a small one. */
  near(i: number): ImageBitmap | null {
    for (let d = 0; d <= 3; d++) {
      const hit = this.bitmaps.get(i + d) ?? this.bitmaps.get(i - d);
      if (hit) return hit;
    }
    for (let d = 0; d < this.count; d++) {
      const hit = this.sparse.get(i - d) ?? this.sparse.get(i + d);
      if (hit) return hit;
    }
    return null;
  }

  private release(drop: (i: number) => boolean) {
    for (const [k, bmp] of this.bitmaps) {
      if (!drop(k)) continue;
      bmp.close();
      this.bitmaps.delete(k);
    }
  }

  private pump() {
    while (!this.cancelled && this.decoding.size < 4) {
      // Nearest missing frame to the centre of the window first.
      let pick = -1;
      for (let d = 0; d <= this.win.ahead && pick < 0; d++) {
        for (const k of [this.centre + d, this.centre - d]) {
          if (k < this.lo || k > this.hi || !this.blobs[k] || this.bitmaps.has(k) || this.decoding.has(k)) continue;
          pick = k;
          break;
        }
      }
      if (pick < 0) return;
      const k = pick;
      const width = this.width;
      const small = width > 0 && width < 1920;
      this.decoding.add(k);
      createImageBitmap(this.blobs[k] as Blob, small ? { resizeWidth: width, resizeHeight: Math.round((width * 9) / 16), resizeQuality: "high" } : undefined)
        .then((bmp) => {
          if (this.cancelled || width !== this.width || k < this.lo - this.win.slack || k > this.hi + this.win.slack) return bmp.close();
          this.bitmaps.set(k, bmp);
          this.onReady?.(k);
        })
        .catch(() => {
          this.blobs[k] = null; // undecodable: do not retry it in a loop
        })
        .finally(() => {
          this.decoding.delete(k);
          this.pump();
        });
    }
  }

  dispose() {
    this.cancelled = true;
    this.release(() => true);
    for (const bmp of this.sparse.values()) bmp.close();
    this.sparse.clear();
    this.blobs = [];
  }
}

let avifSupport: Promise<boolean> | null = null;
/** Resolves true when the browser decodes AVIF, tested on the smallest real frame (no hand-made test image). */
export function supportsAvif(probe = "/seq/film/sm/0000.avif"): Promise<boolean> {
  if (!avifSupport) {
    avifSupport = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.naturalWidth > 0);
      img.onerror = () => resolve(false);
      img.src = probe;
    });
  }
  return avifSupport;
}
