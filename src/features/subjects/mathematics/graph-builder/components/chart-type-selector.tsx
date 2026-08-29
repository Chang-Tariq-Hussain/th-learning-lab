"use client";

import type { ChartType } from "../graph-builder-model";

interface ChartTypeSelectorProps {
  available: ChartType[];
  active: ChartType;
  onSelect: (type: ChartType) => void;
}

const LABELS: Record<ChartType, string> = {
  bar: "Bar Graph",
  pie: "Pie Chart",
  line: "Line Graph",
};

export function ChartTypeSelector({ available, active, onSelect }: ChartTypeSelectorProps) {
  return (
    <div className="flex justify-center gap-1 rounded-full border border-ink/10 p-1 dark:border-bone/10" role="tablist" aria-label="Choose a chart type">
      {available.map((type) => (
        <button
          key={type}
          type="button"
          role="tab"
          aria-selected={active === type}
          onClick={() => onSelect(type)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
            active === type
              ? "bg-subject-math text-white"
              : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone"
          }`}
        >
          {LABELS[type]}
        </button>
      ))}
    </div>
  );
}
