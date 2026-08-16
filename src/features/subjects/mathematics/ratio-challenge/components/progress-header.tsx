"use client";

import { Flame, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { DIFFICULTY_LABEL, MAX_DIFFICULTY, type Difficulty } from "../types";

export interface ProgressHeaderProps {
  score: number;
  streak: number;
  bestStreak: number;
  difficulty: Difficulty;
  /** 0–1 progress toward leveling up, reset whenever the streak breaks or the level changes. */
  levelProgress: number;
}

const STREAK_TO_LEVEL_UP = 3;

export function ProgressHeader({ score, streak, bestStreak, difficulty, levelProgress }: ProgressHeaderProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-mono text-sm text-ink-soft dark:text-bone-soft">
          <Trophy className="h-4 w-4 text-subject-math" strokeWidth={2} />
          <span className="tabular-nums text-ink dark:text-bone">{score}</span>
          <span className="text-ink-soft/60 dark:text-bone-soft/60">pts</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-sm text-ink-soft dark:text-bone-soft">
          <Flame
            className={cn("h-4 w-4", streak > 0 ? "text-subject-chemistry" : "text-ink-soft/40 dark:text-bone-soft/40")}
            strokeWidth={2}
          />
          <span className="tabular-nums text-ink dark:text-bone">{streak}</span>
          <span className="text-ink-soft/60 dark:text-bone-soft/60">streak</span>
          {bestStreak > 0 && (
            <span className="text-ink-soft/50 dark:text-bone-soft/50">(best {bestStreak})</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft dark:text-bone-soft">
          {DIFFICULTY_LABEL[difficulty]}
        </span>
        <div
          className="flex h-2 w-24 items-center gap-1 rounded-full bg-ink/[0.06] p-0.5 dark:bg-bone/[0.08]"
          role="progressbar"
          aria-label="Progress toward next difficulty level"
          aria-valuemin={0}
          aria-valuemax={STREAK_TO_LEVEL_UP}
          aria-valuenow={Math.round(levelProgress * STREAK_TO_LEVEL_UP)}
        >
          {Array.from({ length: STREAK_TO_LEVEL_UP }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-full flex-1 rounded-full transition-colors duration-300",
                difficulty === MAX_DIFFICULTY
                  ? "bg-subject-math/70"
                  : i < Math.round(levelProgress * STREAK_TO_LEVEL_UP)
                    ? "bg-subject-math"
                    : "bg-transparent",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
