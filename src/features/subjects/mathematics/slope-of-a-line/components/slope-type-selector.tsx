"use client";

import { cn } from "@/lib/utils";
import { SLOPE_PRESETS, SLOPE_TYPE_INFO, type SlopeType } from "../model";

interface SlopeTypeSelectorProps {
  active: SlopeType;
  onSelect: (type: SlopeType) => void;
}

const TYPES: SlopeType[] = ["positive", "negative", "zero", "undefined"];

/** Loads one of the four canonical slope-type example pairs onto the plane. */
export function SlopeTypeSelector({ active, onSelect }: SlopeTypeSelectorProps) {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Slope Types</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            className={cn(
              "rounded-card border px-3 py-2 text-center transition-colors",
              active === type
                ? "border-pine-500/50 bg-pine-500/10 dark:border-pine-300/40 dark:bg-pine-300/10"
                : "border-line hover:border-ink/25 dark:border-line-dark dark:hover:border-bone/25"
            )}
          >
            <p className="text-lg leading-none">{SLOPE_TYPE_INFO[type].arrow}</p>
            <p className="mt-1 text-xs font-medium capitalize text-ink-soft dark:text-bone-soft">{type}</p>
          </button>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-ink-soft/80 dark:text-bone-soft/80">
        A = ({SLOPE_PRESETS[active].a.x}, {SLOPE_PRESETS[active].a.y}) · B = ({SLOPE_PRESETS[active].b.x}, {SLOPE_PRESETS[active].b.y})
      </p>
    </div>
  );
}
