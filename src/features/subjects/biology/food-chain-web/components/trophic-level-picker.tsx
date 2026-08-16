"use client";

import { cn } from "@/lib/utils";
import { TROPHIC_LEVEL_LABELS } from "../food-web-model";
import type { TrophicLevel } from "../types";

interface TrophicLevelPickerProps {
  active: TrophicLevel | null;
  onSelect: (level: TrophicLevel | null) => void;
}

const LEVELS: TrophicLevel[] = [1, 2, 3, 4];

export function TrophicLevelPicker({ active, onSelect }: TrophicLevelPickerProps) {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
        Trophic Levels
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {LEVELS.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onSelect(active === level ? null : level)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              active === level
                ? "border-subject-biology bg-subject-biology text-paper dark:text-chalkboard"
                : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone",
            )}
          >
            Level {level}
          </button>
        ))}
      </div>
      <p className="mt-3 min-h-[2.5rem] text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        {active
          ? `Level ${active} — ${TROPHIC_LEVEL_LABELS[active]}`
          : "Select a level to highlight the matching organisms in the scene."}
      </p>
    </div>
  );
}
