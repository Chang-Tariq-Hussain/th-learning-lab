"use client";

import type { ComparisonDataset } from "../data-comparison-model";

interface DualBarChartProps {
  a: ComparisonDataset;
  b: ComparisonDataset;
}

/** Draws each dataset's individual values as its own row of bars, on
 *  a shared scale, so the reader can see both a dataset's overall
 *  level and its spread (tall/short bar variation) at a glance,
 *  compared directly against the other dataset. */
export function DualBarChart({ a, b }: DualBarChartProps) {
  const max = Math.max(1, ...a.values, ...b.values);

  const row = (dataset: ComparisonDataset) => (
    <div key={dataset.id} className="flex items-center gap-3">
      <span className="w-20 flex-shrink-0 text-xs font-medium text-ink dark:text-bone">
        <span className="mr-1" aria-hidden="true">
          {dataset.emoji}
        </span>
        {dataset.label}
      </span>
      <div className="flex h-16 flex-1 items-end gap-1">
        {dataset.values.map((v, i) => (
          <div
            key={i}
            className="min-w-[6px] flex-1 rounded-t-sm transition-all duration-300"
            style={{ height: `${Math.max(4, Math.round((v / max) * 100))}%`, backgroundColor: dataset.color }}
            title={`${v} ${dataset.unit}`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ink/10 bg-white p-4 dark:border-bone/10 dark:bg-white/[0.03]" aria-hidden="true">
      {row(a)}
      {row(b)}
    </div>
  );
}
