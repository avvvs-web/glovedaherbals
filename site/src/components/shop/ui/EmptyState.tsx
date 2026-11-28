import Image from "next/image";
import type { ReactNode } from "react";

/**
 * An empty or "nothing found" state. The drawing is the gold keyline line-up from the end of the film
 * (the approved frame itself, not a redrawing).
 */
export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="gx-empty theme-wine">
      <Image className="gx-empty__art" src="/media/keyline-1920.webp" alt="" width={1920} height={1080} sizes="(min-width: 48rem) 36rem, 100vw" />
      <div className="gx-empty__text">
        <p className="gx-empty__title">{title}</p>
        {children}
      </div>
    </div>
  );
}
