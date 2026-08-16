"use client";

import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface StepControlsProps {
  index: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
  onReset?: () => void;
  nextLabel?: string;
}

/**
 * A compact "show next step" control used inside a single level's panel
 * (sum/difference splitting, the 4-step differentiation walkthrough,
 * product/quotient rule construction). Deliberately smaller and lighter
 * than `LevelNav`, which instead moves between whole levels.
 */
export function StepControls({ index, total, onBack, onNext, onReset, nextLabel }: StepControlsProps) {
  const isLast = index === total - 1;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <div className="mr-1 flex items-center gap-1">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              i === index ? "bg-subject-math" : i < index ? "bg-subject-math/40" : "bg-ink/15 dark:bg-bone/15",
            )}
          />
        ))}
      </div>
      <Button variant="ghost" size="sm" onClick={onBack} disabled={index === 0}>
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
        Back
      </Button>
      {onReset ? (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
          Restart
        </Button>
      ) : null}
      <Button variant="secondary" size="sm" onClick={onNext} disabled={isLast}>
        {nextLabel ?? "Next Step"}
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
      </Button>
    </div>
  );
}
