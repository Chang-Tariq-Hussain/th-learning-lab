"use client";

import { cn } from "@/lib/utils";
import type { DatasetPreset } from "../data-collection-model";

interface DatasetPickerProps {
  presets: DatasetPreset[];
  activeId: string;
  onSelect: (id: string) => void;
}

/** A row of small tabs for switching which survey/dataset is being
 *  collected. Switching resets that dataset's own observation list —
 *  each preset keeps independent state in the parent. */
export function DatasetPicker({ presets, activeId, onSelect }: DatasetPickerProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Choose a dataset">
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
