"use client";

import { cn } from "@/lib/utils";
import type { GraphDataset } from "../graph-builder-model";

interface GraphDatasetPickerProps {
  datasets: GraphDataset[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function GraphDatasetPicker({ datasets, activeId, onSelect }: GraphDatasetPickerProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Choose a dataset">
      {datasets.map((dataset) => {
        const active = dataset.id === activeId;
        return (
          <button
            key={dataset.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(dataset.id)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
              active
                ? "border-subject-math bg-subject-math/10 text-subject-math"
                : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:text-bone"
            )}
          >
            {dataset.title}
          </button>
        );
      })}
    </div>
  );
}
