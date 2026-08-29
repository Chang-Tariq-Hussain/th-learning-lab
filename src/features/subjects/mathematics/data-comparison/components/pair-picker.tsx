"use client";

import { cn } from "@/lib/utils";
import type { DatasetPairPreset } from "../data-comparison-model";

interface PairPickerProps {
  presets: DatasetPairPreset[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function PairPicker({ presets, activeId, onSelect }: PairPickerProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Choose a dataset pair">
      {presets.map((preset) => {
        const active = preset.id === activeId;
        return (
          <button
            key={preset.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(preset.id)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
              active
                ? "border-subject-math bg-subject-math/10 text-subject-math"
                : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:text-bone"
            )}
          >
            {preset.title}
          </button>
        );
      })}
    </div>
  );
}
