"use client";

import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEVELS } from "../model";

interface LevelNavProps {
  levelIndex: number;
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
}

/** Top-of-page level indicator plus the app-wide Next Concept / Back / Reset pattern. */
export function LevelNav({ levelIndex, onNext, onBack, onReset }: LevelNavProps) {
  const level = LEVELS[levelIndex] ?? LEVELS[0]!;
  const isFirst = levelIndex === 0;
  const isLast = levelIndex === LEVELS.length - 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">{level.kicker} of {LEVELS.length}</p>
          <h2 className="mt-1 font-display text-xl font-medium text-ink dark:text-bone sm:text-2xl">{level.title}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack} disabled={isFirst}>
            <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            Back
          </Button>
          <Button variant="secondary" size="sm" onClick={onNext} disabled={isLast}>
            Next Concept
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </Button>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
            Reset
          </Button>
        </div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.06] dark:bg-bone/[0.08]">
        <div
          className="h-1.5 rounded-full bg-subject-chemistry transition-all duration-300"
          style={{ width: `${((levelIndex + 1) / LEVELS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
