"use client";

import { cn } from "@/lib/utils";
import { STAGE_LABELS, type CycleStep } from "../model";

export interface ExecutionLogProps {
  steps: CycleStep[];
  currentIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

export function ExecutionLog({ steps, currentIndex, onSelect, className }: ExecutionLogProps) {
  return (
    <div className={cn("rounded-card border border-line bg-paper p-4 dark:border-line-dark dark:bg-chalkboard", className)}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subject-it">Execution Log</p>
      <ol className="mt-3 max-h-72 space-y-1 overflow-y-auto pr-1">
        {steps.length === 0 && <li className="text-sm text-ink-soft dark:text-bone-soft">Run a program to see its cycle-by-cycle log here.</li>}
        {steps.map((step, i) => (
          <li key={step.id}>
            <button
              onClick={() => onSelect(i)}
              className={cn(
                "w-full rounded-lg border px-3 py-1.5 text-left font-mono text-xs transition-colors",
                i === currentIndex
                  ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                  : "border-transparent text-ink-soft hover:border-line dark:text-bone-soft dark:hover:border-line-dark",
              )}
            >
              Cycle {step.cycle} — {STAGE_LABELS[step.stage]}
              <span className="ml-2 opacity-70">PC={step.pcBefore} IR=&ldquo;{step.ir.text}&rdquo;</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
