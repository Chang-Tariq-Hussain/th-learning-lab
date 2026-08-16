"use client";

import { cn } from "@/lib/utils";
import { deltaX, deltaY, distance, formatDistance, type DistPoint } from "../model";
import type { Highlight } from "./distance-plane";

interface StepCalculationProps {
  a: DistPoint;
  b: DistPoint;
  selected: Highlight;
  onSelect: (step: Highlight) => void;
}

/**
 * Each step is a button so selecting it highlights the matching leg
 * (or hypotenuse) on the plane above — this is what visually ties the
 * abstract formula to the concrete triangle instead of just dumping
 * all four formulas on screen at once.
 */
export function StepCalculation({ a, b, selected, onSelect }: StepCalculationProps) {
  const dx = deltaX(a, b);
  const dy = deltaY(a, b);
  const d = distance(a, b);
  const dxSq = dx * dx;
  const dySq = dy * dy;

  const steps: { key: Highlight; label: string; body: string }[] = [
    { key: "dx", label: "Step 1 — Find Δx", body: `Δx = x₂ − x₁ = ${b.x} − ${a.x} = ${dx}` },
    { key: "dy", label: "Step 2 — Find Δy", body: `Δy = y₂ − y₁ = ${b.y} − ${a.y} = ${dy}` },
    { key: "d", label: "Step 3 — Pythagorean theorem", body: `d = √(Δx² + Δy²) = √(${dx}² + ${dy}²)` },
    { key: "d", label: "Step 4 — Calculate", body: `d = √(${dxSq} + ${dySq}) = √${dxSq + dySq} = ${formatDistance(d)} units` },
  ];

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Step by Step</p>
      <div className="mt-3 flex flex-col gap-2">
        {steps.map((step, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(step.key)}
            className={cn(
              "rounded-card border px-3 py-2 text-left transition-colors",
              selected === step.key && step.key !== "none"
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
