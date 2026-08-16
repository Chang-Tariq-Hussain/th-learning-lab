"use client";

import { MEASURE_GUIDES } from "../central-tendency-model";

/** Level 8 — When Should I Use Which? A short reference card for each of the four measures. */
export function MeasureGuidePanel() {
  return (
    <div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
      {MEASURE_GUIDES.map((g) => (
        <div
          key={g.id}
          className="flex flex-col gap-1.5 rounded-card border border-line bg-white/60 px-4 py-4 dark:border-line-dark dark:bg-white/[0.03]"
        >
          <p className="font-display text-base font-semibold" style={{ color: g.color }}>
            {g.name}
          </p>
          <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{g.summary}</p>
        </div>
      ))}
    </div>
  );
}
