"use client";

import { useMemo, useState } from "react";
import { Accordion } from "./ui/Accordion";
import { Icon } from "./ui/Icon";

export type HelpEntry = { q: string; a: string[]; link?: { label: string; href: string } };
export type HelpGroup = { id: string; title: string; blurb: string; items: HelpEntry[] };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9₹ ]+/g, " ");

/**
 * The help centre: type a question to narrow the answers, or pick a topic. Every answer is in the page's
 * HTML from the start (the accordion only folds it away), so it works without scripts and is readable by
 * search engines.
 */
export function HelpCentre({ groups }: { groups: HelpGroup[] }) {
  const [query, setQuery] = useState("");
  const words = useMemo(() => norm(query).split(" ").filter((w) => w.length > 1), [query]);
  const shown = useMemo(
    () =>
      groups
        .map((g) => ({ ...g, items: words.length ? g.items.filter((it) => words.every((w) => norm(`${it.q} ${it.a.join(" ")} ${g.title}`).includes(w))) : g.items }))
        .filter((g) => g.items.length),
    [groups, words],
  );
  const total = shown.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="gx-help">
      <form className="gx-help__search" role="search" onSubmit={(e) => e.preventDefault()}>
        <Icon name="search" />
        <label className="sr-only" htmlFor="help-q">
          Search help
        </label>
        <input id="help-q" type="text" enterKeyHint="search" autoComplete="off" placeholder="Search: refund, delivery, gift card…" value={query} onChange={(e) => setQuery(e.target.value)} />
        {query ? (
          <button type="button" className="gx-help__clear" aria-label="Clear search" onClick={() => setQuery("")}>
            <Icon name="close" size={18} />
          </button>
        ) : null}
      </form>
      <p className="gl-small gx-help__count" role="status">
        {words.length ? (total ? `${total} ${total === 1 ? "answer" : "answers"}` : "No answer matches that. Try another word, or write to us below.") : null}
      </p>

      {words.length ? null : (
        <ul className="gx-help__topics" role="list">
          {groups.map((g) => (
            <li key={g.id}>
              <a className="gx-help__topic" href={`#${g.id}`}>
                <span className="gx-help__topicTitle">{g.title}</span>
                <span className="gx-help__topicBlurb">{g.blurb}</span>
                <Icon name="arrow" size={18} />
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="gx-help__groups">
        {shown.map((g) => (
          <section key={g.id} id={g.id} className="gx-help__group" aria-labelledby={`${g.id}-title`}>
            <h2 id={`${g.id}-title`} className="gx-title">
              {g.title}
            </h2>
            <Accordion
              key={words.join(" ")}
              defaultOpen={words.length ? 0 : null}
              items={g.items.map((it) => ({
                title: it.q,
                body: (
                  <>
                    {it.a.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                    {it.link ? (
                      <p>
                        <a className="gl-link" href={it.link.href}>
                          {it.link.label}
                        </a>
                      </p>
                    ) : null}
                  </>
                ),
              }))}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
