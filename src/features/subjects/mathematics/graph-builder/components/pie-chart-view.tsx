"use client";

import type { DataPoint } from "../graph-builder-model";

interface PieChartViewProps {
  points: DataPoint[];
}

/** A simple CSS conic-gradient pie chart — no charting library
 *  needed for a handful of static-colored slices. Percentages are
 *  computed straight from the same `points` the bar/line views use,
 *  so switching chart type never changes the underlying numbers. */
export function PieChartView({ points }: PieChartViewProps) {
  const totalValue = points.reduce((sum, p) => sum + p.value, 0);

  let cursor = 0;
  const stops = points.map((point) => {
    const pct = totalValue === 0 ? 0 : (point.value / totalValue) * 100;
    const start = cursor;
    const end = cursor + pct;
    cursor = end;
    return { point, start, end, pct };
  });

  const gradient =
    totalValue === 0
      ? "#e5e7eb"
      : `conic-gradient(${stops.map((s) => `${s.point.color} ${s.start}% ${s.end}%`).join(", ")})`;

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-ink/10 bg-white p-6 dark:border-bone/10 dark:bg-white/[0.03] sm:flex-row sm:justify-center">
      <div
        className="h-40 w-40 flex-shrink-0 rounded-full"
        style={{ background: gradient }}
        role="img"
        aria-label="Pie chart of the dataset"
      />
      <ul className="flex flex-col gap-1.5">
        {stops.map(({ point, pct }) => (
          <li key={point.id} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 flex-shrink-0 rounded-sm" style={{ backgroundColor: point.color }} aria-hidden="true" />
            <span className="text-ink dark:text-bone">{point.label}</span>
            <span className="font-mono text-xs tabular-nums text-ink-soft dark:text-bone-soft">
              {point.value} ({pct.toFixed(0)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
