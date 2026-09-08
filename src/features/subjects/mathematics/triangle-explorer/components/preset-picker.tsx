"use client";

import { Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TRIANGLE_PRESETS, randomizedTriangle, type TriangleVertices } from "../model";

interface PresetPickerProps {
  activePreset: string | null;
  onLoad: (presetKey: string | null, vertices: TriangleVertices) => void;
}

/**
 * Quick-load chips for each named preset plus a "Random" shuffle.
 * `activePreset` is tracked by the parent (cleared as soon as the
 * student drags a vertex, since the shape is no longer exactly that
 * preset) purely to highlight which chip is currently active — it
 * doesn't gate anything else.
 */
export function PresetPicker({ activePreset, onLoad }: PresetPickerProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {Object.entries(TRIANGLE_PRESETS).map(([key, preset]) => (
        <button
          key={key}
          type="button"
          onClick={() => onLoad(key, preset.vertices)}
          aria-pressed={activePreset === key}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            activePreset === key
              ? "border-transparent bg-pine-600 text-paper dark:bg-pine-300 dark:text-chalkboard"
              : "border-line text-ink-soft hover:border-ink/25 hover:text-ink dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/25 dark:hover:text-bone",
          )}
        >
          {preset.label}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onLoad(null, randomizedTriangle())}
        className="flex items-center gap-1.5 rounded-full border border-dashed border-line px-3.5 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:border-ink/25 hover:text-ink dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/25 dark:hover:text-bone"
      >
        <Shuffle className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
        Random
      </button>
    </div>
  );
}
