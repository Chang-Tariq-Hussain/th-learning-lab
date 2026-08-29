"use client";

import type { DataPoint } from "../graph-builder-model";

interface BarChartViewProps {
  points: DataPoint[];
}

export function BarChartView({ points }: BarChartViewProps) {
  const max = Math.max(1, ...points.map((p) => p.value));

  return (
    <div className="flex h-52 items-end justify-center gap-5 rounded-2xl border border-ink/10 bg-white px-4 pb-3 pt-6 dark:border-bone/10 dark:bg-white/[0.03]">
      {points.map((point) => {
        const heightPct = point.value === 0 ? 2 : Math.max(6, Math.round((point.value / max) * 100));
        return (
          <div key={point.id} className="flex h-full w-16 flex-col items-center justify-end gap-1.5">
            <span className="font-mono text-xs tabular-nums text-ink-soft dark:text-bone-soft">{point.value}</span>
            <div
              className="w-full rounded-t-md transition-all duration-300"
              style={{ height: `${heightPct}%`, backgroundColor: point.color }}
            />
            <span className="text-xs font-medium text-ink dark:text-bone">{point.label}</span>
          </div>
        );
      })}
    </div>
  );
}
