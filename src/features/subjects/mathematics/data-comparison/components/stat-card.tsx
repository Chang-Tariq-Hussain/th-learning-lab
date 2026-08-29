"use client";

import type { ComparisonDataset, DatasetStats } from "../data-comparison-model";
import { formatNumber } from "../data-comparison-model";

interface StatCardProps {
  dataset: ComparisonDataset;
  stats: DatasetStats;
  highlightConsistent: boolean;
}

const ROWS: { key: keyof DatasetStats; label: string }[] = [
  { key: "mean", label: "Mean" },
  { key: "median", label: "Median" },
  { key: "range", label: "Range" },
  { key: "min", label: "Minimum" },
  { key: "max", label: "Maximum" },
];

/** One dataset's full statistics panel — two of these render side by
 *  side so every number can be compared at a glance rather than
 *  having to flip between two separate views. */
export function StatCard({ dataset, stats, highlightConsistent }: StatCardProps) {
  return (
    <div
      className="flex-1 rounded-2xl border p-4"
      style={{ borderColor: `${dataset.color}55`, backgroundColor: `${dataset.color}0d` }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xl leading-none" aria-hidden="true">
          {dataset.emoji}
        </span>
        <h3 className="font-display text-lg font-medium text-ink dark:text-bone">{dataset.label}</h3>
        {highlightConsistent && (
          <span className="ml-auto rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
            More consistent
          </span>
        )}
      </div>
      <dl className="flex flex-col gap-1.5">
        {ROWS.map((row) => (
          <div key={row.key} className="flex items-center justify-between text-sm">
            <dt className="text-ink-soft dark:text-bone-soft">{row.label}</dt>
            <dd className="font-mono tabular-nums text-ink dark:text-bone">
              {formatNumber(stats[row.key])} {dataset.unit}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
