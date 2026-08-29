"use client";

import { Minus, Plus } from "lucide-react";
import type { DataPoint } from "../graph-builder-model";

interface ValueEditorProps {
  points: DataPoint[];
  unit: string;
  onChange: (id: string, next: number) => void;
}

/** Lets the student directly change a category's value and watch
 *  every chart type respond immediately — the core "change the data,
 *  see the graph change" interaction this topic is built around. */
export function ValueEditor({ points, unit, onChange }: ValueEditorProps) {
  return (
    <div className="flex flex-col gap-2">
      {points.map((point) => (
        <div key={point.id} className="flex items-center gap-3 rounded-xl border border-ink/10 bg-white px-3 py-2 dark:border-bone/10 dark:bg-white/[0.04]">
          <span className="text-lg leading-none" aria-hidden="true">
            {point.emoji}
          </span>
          <span className="w-24 text-sm font-medium text-ink dark:text-bone">{point.label}</span>
          <button
            type="button"
            onClick={() => onChange(point.id, point.value - 1)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft"
            aria-label={`Decrease ${point.label}`}
          >
            <Minus className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          <span className="w-14 text-center font-mono text-sm tabular-nums text-ink dark:text-bone">{point.value}</span>
          <button
            type="button"
            onClick={() => onChange(point.id, point.value + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft"
            aria-label={`Increase ${point.label}`}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          <span className="text-xs text-ink-soft dark:text-bone-soft">{unit}</span>
        </div>
      ))}
    </div>
  );
}
