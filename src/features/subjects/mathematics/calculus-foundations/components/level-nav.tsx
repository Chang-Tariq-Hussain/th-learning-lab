"use client";

import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface LevelNavProps {
  stepIndex: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onReset: () => void;
  onJump: (index: number) => void;
}

/**
 * The one navigation surface for the whole leveled progression —
 * dots show every step and jump directly to it (useful for review),
 * while Back / Next Concept / Reset drive the linear path the brief
 * asks for.
 */
export function LevelNav({ stepIndex, totalSteps, onBack, onNext, onReset, onJump }: LevelNavProps) {
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  return (
    <div className="flex flex-col items-center gap-3 border-t border-line pt-4 dark:border-line-dark">
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {Array.from({ length: totalSteps }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onJump(i)}
            aria-label={`Go to step ${i + 1}`}
            aria-current={i === stepIndex}
            className={cn(
              "h-2.5 w-2.5 rounded-full transition-colors",
              i === stepIndex
                ? "bg-subject-math"
                : i < stepIndex
                  ? "bg-subject-math/40"
                  : "bg-ink/15 dark:bg-bone/15"
            )}
          />
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={onBack} disabled={isFirst}>
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Back
        </Button>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
          Reset
        </Button>
        <Button variant="primary" size="sm" onClick={onNext} disabled={isLast}>
          Next Concept
          <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
        </Button>
      </div>
    </div>
  );
}
