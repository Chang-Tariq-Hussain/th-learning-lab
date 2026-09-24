"use client";

import { cn } from "@/lib/utils";
import { DETAIL_LEVEL_BLURBS, DETAIL_LEVEL_LABELS, type DetailLevel } from "../model";

const LEVELS: DetailLevel[] = ["beginner", "intermediate", "technical"];

export function LevelSwitch({ level, onChange }: { level: DetailLevel; onChange: (level: DetailLevel) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Detail level">
        {LEVELS.map((l) => (
          <button
            key={l}
            role="radio"
            aria-checked={level === l}
            onClick={() => onChange(l)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              level === l
                ? "border-subject-it bg-subject-it text-paper"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
            )}
          >
            {DETAIL_LEVEL_LABELS[l]}
          </button>
        ))}
      </div>
      <p className="text-xs text-ink-soft dark:text-bone-soft">{DETAIL_LEVEL_BLURBS[level]}</p>
    </div>
  );
}
