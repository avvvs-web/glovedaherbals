import "server-only";

/**
 * Reads a product's own description (as the store wrote it) into the parts a product page shows
 * separately: one About paragraph, what it helps with, who it is for, how to use it, what a set
 * contains and how the set works together. Nothing is added or reworded: every line shown is a line of
 * the store's description, only sorted. A description that does not follow the store's usual headings
 * simply stays whole, in About.
 */
export type Described = {
  /** A short opening line, when the description starts with one. */
  lede?: string;
  /** Everything that is not one of the parts below, as a single paragraph. */
  about: string;
  helps: string[];
  madeFor: string[];
  steps: string[];
  included: string[];
  works: { label?: string; text: string }[];
  /** A short closing line, when the description ends with one. */
  closing?: string;
};

type Part = "helps" | "madeFor" | "steps" | "included" | "works";
const HEADS: [Part, RegExp][] = [
  ["helps", /^(with (regular|consistent) (use|application),? it helps|key benefits|why you.ll love (it|this combo)|key features|features)\s*:?\s*/i],
  ["madeFor", /^(ideal for|recommended for|for whom we recommend\s*\??)\s*:?\s*/i],
  ["steps", /^(how to use|directions? for use|how it works)\s*:?\s*/i],
  ["included", /^what.s included\s*:?\s*/i],
  ["works", /^why it works\s*:?\s*/i],
];
/** Words that mark a line as an instruction, so a closing line after the directions is not read as a step. */
const INSTRUCTION = /\b(apply|use|wash|rinse|massage|take|leave|follow|pump|squeeze|rub|repeat|add|relax|cleanse|exfoliate|warm|moisturi[sz]e)\b|→|:/i;
const sentences = (s: string) => s.split(/(?<=[.!?])\s+(?=[A-Z{(])/).map((x) => x.trim()).filter(Boolean);
const isShort = (s: string, max: number) => s.length <= max && sentences(s).length === 1;
const stop = (s: string) => (/[.!?:…]$/.test(s) ? s : `${s}.`);

export function describe(description: string[]): Described {
  // The store's HTML sometimes runs a heading into its text ("How to Use:Day: …MoisturiserNight: …") and
  // lists several points on one line with ticks; give each its own line.
  const lines = description
    .flatMap((l) =>
      l
        .replace(/([a-z)])([A-Z][a-z]{2,})/g, "$1\n$2")
        .replace(/✔/g, "\n")
        .split("\n"),
    )
    .map((l) => l.replace(/[{}]/g, "").replace(/\s+/g, " ").replace(/\s*\.(?=[A-Z])/g, ". ").replace(/\s+\./g, ".").trim())
    .filter(Boolean);

  const out: Described = { about: "", helps: [], madeFor: [], steps: [], included: [], works: [] };
  const about: string[] = [];
  let part: Part | null = null;
  let headed = false;

  const prose = (line: string) => {
    part = null;
    if (headed && line.length <= 110 && /[.!]$/.test(line)) out.closing = line;
    else about.push(line);
  };

  for (const raw of lines) {
    let line = raw;
    const head = HEADS.find(([, re]) => re.test(line));
    if (head) {
      part = head[0];
      headed = true;
      line = line.replace(head[1], "").trim();
      if (!line) continue;
    }
    if (part === "helps") {
      if (isShort(line, 100)) out.helps.push(line.replace(/\.$/, ""));
      else prose(line);
    } else if (part === "madeFor") {
      // "Dry skin, Pale skin, Pigmentation" is a list; "Dull, uneven texture" is one entry.
      const pieces = line.replace(/\.$/, "").split(/,\s*/).filter(Boolean);
      if (pieces.length >= 3 && pieces.every((x) => x.length <= 40)) out.madeFor.push(...pieces);
      else if (line.length <= 72) out.madeFor.push(line.replace(/\.$/, ""));
      else prose(line);
    } else if (part === "included") {
      if (isShort(line, 70)) out.included.push(line);
      else prose(line);
    } else if (part === "steps") {
      if (INSTRUCTION.test(line) || line.length > 110) out.steps.push(...sentences(line));
      else prose(line);
    } else if (part === "works") {
      const m = /^([^:]{3,44}):\s*(.*)$/.exec(line);
      const last = out.works[out.works.length - 1];
      if (m && /^step \d+$/i.test(m[1])) out.works.push({ label: m[2], text: "" });
      else if (m) out.works.push({ label: m[1], text: m[2] });
      else if (last && last.label && !last.text) last.text = line;
      else if (last && last.label && last.text && !/[.!?]$/.test(last.text)) last.text = `${last.text} ${line}`;
      else out.works.push({ text: line });
    } else about.push(line);
  }

  // A short opening line stands on its own above the paragraph.
  if (about.length > 1 && about[0].length <= 90) out.lede = about.shift();
  // An unheaded run of short points (three or more) is a list of what the product does.
  if (!out.helps.length) {
    let start = -1;
    for (let i = 0; i <= about.length; i++) {
      const short = i < about.length && about[i].length <= 46;
      if (short && start < 0) start = i;
      if (!short && start >= 0) {
        if (i - start >= 3) {
          out.helps = about.splice(start, i - start).map((s) => s.replace(/\.$/, ""));
          break;
        }
        start = -1;
      }
    }
  }
  // Steps with labels and no text are incomplete; leave them out rather than show a bare label.
  out.works = out.works.filter((w) => w.text);
  out.about = about.map(stop).join(" ");
  return out;
}
