"use client";

import { cn } from "@/lib/utils";
import { LEVELS, type Level } from "../model";

interface ProgressBarProps {
  level: Level;
  onLevelChange: (level: Level) => void;
  correct: number;
  total: number;
  streak: number;
}

export function ProgressBar({ level, onLevelChange, correct, total, streak }: ProgressBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-white/60 p-3 dark:border-line-dark dark:bg-white/[0.03]">
      <div className="flex items-center gap-1.5">
        {LEVELS.map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => onLevelChange(lvl)}
            aria-pressed={level === lvl}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              level === lvl
                ? "bg-pine-600 text-paper dark:bg-pine-300 dark:text-chalkboard"
                : "text-ink-soft hover:bg-ink/[0.04] dark:text-bone-soft dark:hover:bg-bone/[0.06]"
            )}
          >
            Level {lvl}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 font-mono text-xs text-ink-soft dark:text-bone-soft">
        {streak >= 3 ? <span className="text-amber-600 dark:text-amber-400">🔥 {streak} in a row!</span> : null}
        <span>
          Correct: {correct} / {total}
        </span>
      </div>
    </div>
  );
}
