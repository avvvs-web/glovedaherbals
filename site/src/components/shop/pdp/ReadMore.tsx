"use client";

import { useState } from "react";

/** One paragraph, held to a few lines until the reader asks for the rest. Short text is shown whole. */
export function ReadMore({ text, limit = 340 }: { text: string; limit?: number }) {
  const [open, setOpen] = useState(false);
  const long = text.length > limit;
  return (
    <div className="gx-pdp__about">
      <p className="gl-body" data-clamped={long && !open ? "true" : undefined}>
        {text}
      </p>
      {long ? (
        <button type="button" className="gx-pdp__more" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? "Read less" : "Read more"}
        </button>
      ) : null}
    </div>
  );
}
