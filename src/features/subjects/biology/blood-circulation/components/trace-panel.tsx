"use client";

import { ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TRACE_COMPLETE_MESSAGE, TRACE_STEPS } from "../circulation-model";

interface TracePanelProps {
  step: number;
  complete: boolean;
  onNext: () => void;
  onRestart: () => void;
}

export function TracePanel({ step, complete, onNext, onRestart }: TracePanelProps) {
  if (complete) {
    return (
      <div className="rounded-card border border-subject-biology/40 bg-subject-biology-soft p-4 text-center dark:bg-subject-biology/10">
        <p className="font-display text-base font-medium text-ink dark:text-bone">✓ {TRACE_COMPLETE_MESSAGE}</p>
        <Button variant="ghost" size="sm" className="mt-2" onClick={onRestart}>
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
          Trace again
        </Button>
      </div>
    );
  }

  const current = TRACE_STEPS[step]!;

  return (
    <div className="rounded-card border border-subject-biology/40 bg-subject-biology-soft p-4 text-center dark:bg-subject-biology/10">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subject-biology">
        Step {step + 1} / {TRACE_STEPS.length} · {current.title}
      </p>
      <p className="mt-2 text-sm font-medium text-ink dark:text-bone">{current.caption}</p>
      <Button variant="primary" size="sm" className="mt-3" onClick={onNext}>
        {step === TRACE_STEPS.length - 1 ? "Finish" : "Next"}
        <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} />
      </Button>
    </div>
  );
}
