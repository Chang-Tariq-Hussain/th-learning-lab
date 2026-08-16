"use client";

import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SYNAPSE_STEPS } from "../nervous-model";
import { SynapseScene } from "./synapse-scene";

interface SynapseExplorerProps {
  stepIndex: number;
  onStepChange: (index: number) => void;
}

export function SynapseExplorer({ stepIndex, onStepChange }: SynapseExplorerProps) {
  const step = SYNAPSE_STEPS[stepIndex]!;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === SYNAPSE_STEPS.length - 1;

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
        Synaptic Transmission
      </p>

      <div className="mx-auto mt-3 h-[210px] w-full max-w-md rounded-[1.25rem] border border-line bg-white/70 p-2 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]">
        <SynapseScene step={step.id} />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
        {SYNAPSE_STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onStepChange(i)}
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              i === stepIndex
                ? "bg-subject-biology"
                : "bg-ink/15 hover:bg-ink/30 dark:bg-bone/20 dark:hover:bg-bone/35",
            )}
            aria-label={`Go to step ${i + 1}: ${s.label}`}
          />
        ))}
      </div>

      <p className="mt-3 text-center text-sm font-semibold text-ink dark:text-bone">
        {stepIndex + 1}. {step.label}
      </p>
      <p className="mt-1 min-h-[3rem] text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        {step.caption}
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onStepChange(stepIndex - 1)}
          disabled={isFirst}
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
          Back
        </Button>
        {isLast ? (
          <Button variant="secondary" size="sm" onClick={() => onStepChange(0)}>
            <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
            Restart
          </Button>
        ) : (
          <Button variant="primary" size="sm" onClick={() => onStepChange(stepIndex + 1)}>
            Next
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </Button>
        )}
      </div>
    </div>
  );
}
