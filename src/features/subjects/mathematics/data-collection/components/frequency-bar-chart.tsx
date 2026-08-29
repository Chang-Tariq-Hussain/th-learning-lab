"use client";

import type { FrequencyRow } from "../data-collection-model";

interface FrequencyBarChartProps {
  rows: FrequencyRow[];
}

/** The "graph" half of RAW DATA -> TABLE -> GRAPH — a simple live bar
 *  chart driven by the exact same `rows` the Frequency Table renders,
 *  so a student sees table and graph update together from one
 *  dataset rather than as two disconnected views. */
export function FrequencyBarChart({ rows }: FrequencyBarChartProps) {
  const max = Math.max(1, ...rows.map((r) => r.count));

  return (
    <div className="flex h-48 items-end justify-center gap-4 rounded-2xl border border-ink/10 bg-white px-4 pb-3 pt-6 dark:border-bone/10 dark:bg-white/[0.03]" aria-hidden="true">
      {rows.map((row) => {
        const heightPct = row.count === 0 ? 2 : Math.max(6, Math.round((row.count / max) * 100));
        return (
          <div key={row.category.id} className="flex h-full w-14 flex-col items-center justify-end gap-1.5">
            <span className="font-mono text-xs tabular-nums text-ink-soft dark:text-bone-soft">{row.count}</span>
            <div
              className="w-full rounded-t-md transition-all duration-300"
              style={{ height: `${heightPct}%`, backgroundColor: row.category.color }}
            />
            <span className="text-base leading-none">{row.category.emoji}</span>
          </div>
        );
      })}
    </div>
  );
}
