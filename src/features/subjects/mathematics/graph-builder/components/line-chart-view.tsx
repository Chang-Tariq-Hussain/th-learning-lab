"use client";

import type { DataPoint } from "../graph-builder-model";

interface LineChartViewProps {
  points: DataPoint[];
}

const WIDTH = 400;
const HEIGHT = 160;
const PADDING = 24;

/** Only shown for `sequential` datasets (see `availableChartTypes`)
 *  since a line implies a trend across an ordered axis. Coordinates
 *  are computed directly from `points`, matching the bar/pie views'
 *  "one dataset, three lenses" approach. */
export function LineChartView({ points }: LineChartViewProps) {
  const max = Math.max(1, ...points.map((p) => p.value));
  const stepX = points.length > 1 ? (WIDTH - PADDING * 2) / (points.length - 1) : 0;

  const coords = points.map((point, i) => {
    const x = PADDING + i * stepX;
    const y = HEIGHT - PADDING - (point.value / max) * (HEIGHT - PADDING * 2);
    return { x, y, point };
  });

  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-4 dark:border-bone/10 dark:bg-white/[0.03]">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Line graph of the dataset over time">
        <line x1={PADDING} y1={HEIGHT - PADDING} x2={WIDTH - PADDING} y2={HEIGHT - PADDING} stroke="currentColor" className="text-ink/15 dark:text-bone/15" strokeWidth={1} />
        <path d={path} fill="none" stroke="#2d9cdb" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {coords.map((c) => (
          <g key={c.point.id}>
            <circle cx={c.x} cy={c.y} r={4} fill="#2d9cdb" />
            <text x={c.x} y={HEIGHT - PADDING + 16} textAnchor="middle" className="fill-ink-soft dark:fill-bone-soft" fontSize={11}>
              {c.point.label}
            </text>
            <text x={c.x} y={c.y - 8} textAnchor="middle" className="fill-ink dark:fill-bone" fontSize={11}>
              {c.point.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
