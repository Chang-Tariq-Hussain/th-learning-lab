"use client";

import type { ReactionConfig } from "../reaction-model";
import { countElement, usedElements } from "../reaction-model";

interface AtomCounterProps {
  reaction: ReactionConfig;
}

/** Simple "Before / After" counter — the counts never change, which is the point: atoms are rearranged, not created or destroyed. Only shows elements this reaction actually uses. */
export function AtomCounter({ reaction }: AtomCounterProps) {
  const counts = usedElements(reaction).map((element) => ({
    element,
    count: countElement(reaction, element),
  }));

  const countsLabel = counts
    .map(({ element, count }) => `${element}: ${count}`)
    .join("   ");

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
      <div className="flex items-center gap-2 rounded-card border border-line px-3 py-2 dark:border-line-dark">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft">
          Before Reaction
        </span>
        <span className="font-mono font-semibold text-ink dark:text-bone">
          {countsLabel}
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-card border border-line px-3 py-2 dark:border-line-dark">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft">
          After Reaction
        </span>
        <span className="font-mono font-semibold text-ink dark:text-bone">
          {countsLabel}
        </span>
      </div>
    </div>
  );
}
