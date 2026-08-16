"use client";

import { cn } from "@/lib/utils";
import { formatSlope, rise, run, slope, type SlopePoint } from "../model";
import type { Highlight } from "./slope-plane";

interface StepCalculationProps {
  a: SlopePoint;
  b: SlopePoint;
  selected: Highlight;
  onSelect: (step: Highlight) => void;
}

/**
 * Each step is a button so selecting it highlights the matching leg
 * (or the line itself) on the plane above — same pattern as Distance
 * Between Two Points, applied to run/rise/slope instead of Δx/Δy/d.
 */
export function StepCalculation({ a, b, selected, onSelect }: StepCalculationProps) {
  const runVal = run(a, b);
  const riseVal = rise(a, b);
  const m = slope(a, b);

  const steps: { key: Highlight; label: string; body: string }[] = [
    { key: "run", label: "Step 1 — Find Run", body: `Run = x₂ − x₁ = ${b.x} − ${a.x} = ${runVal}` },
    { key: "rise", label: "Step 2 — Find Rise", body: `Rise = y₂ − y₁ = ${b.y} − ${a.y} = ${riseVal}` },
    { key: "slope", label: "Step 3 — Slope", body: `m = Rise / Run = ${riseVal} / ${runVal} = ${formatSlope(m)}` },
  ];

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Step by Step</p>
      <div className="mt-3 flex flex-col gap-2">
        {steps.map((step) => (
          <button
            key={step.key}
            type="button"
            onClick={() => onSelect(step.key)}
            className={cn(
              "rounded-card border px-3 py-2 text-left transition-colors",
              selected === step.key
                ? "border-pine-500/50 bg-pine-500/10 dark:border-pine-300/40 dark:bg-pine-300/10"
                : "border-line hover:border-ink/25 dark:border-line-dark dark:hover:border-bone/25"
            )}
          >
            <p className="text-xs font-medium text-ink-soft dark:text-bone-soft">{step.label}</p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-ink dark:text-bone">{step.body}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
