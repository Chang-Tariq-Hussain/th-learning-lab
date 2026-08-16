"use client";

import { cn } from "@/lib/utils";
import { distance, formatDistance, formatNumber, midpoint, type MidPoint } from "../model";
import type { Highlight } from "./midpoint-plane";

interface StepCalculationProps {
  a: MidPoint;
  b: MidPoint;
  selected: Highlight;
  onSelect: (step: Highlight) => void;
}

/**
 * Each half-distance step is a button so selecting it highlights the
 * matching half of the segment on the plane above — mirrors the
 * step-selector pattern from Distance Between Two Points, adapted so
 * the two halves (A->M and M->B) are what's compared, not legs of a
 * triangle.
 */
export function StepCalculation({ a, b, selected, onSelect }: StepCalculationProps) {
  const m = midpoint(a, b);
  const halfDist = distance(a, m);

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Step by Step</p>
      <div className="mt-3 flex flex-col gap-2">
        <div className="rounded-card border border-line px-3 py-2 dark:border-line-dark">
          <p className="text-xs font-medium text-ink-soft dark:text-bone-soft">Step 1 — x-coordinate</p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-ink dark:text-bone">
            x = (x₁ + x₂) / 2 = ({a.x} + {b.x}) / 2 = {formatNumber(m.x)}
          </p>
        </div>
        <div className="rounded-card border border-line px-3 py-2 dark:border-line-dark">
          <p className="text-xs font-medium text-ink-soft dark:text-bone-soft">Step 2 — y-coordinate</p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-ink dark:text-bone">
            y = (y₁ + y₂) / 2 = ({a.y} + {b.y}) / 2 = {formatNumber(m.y)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelect(selected === "am" ? "none" : "am")}
          className={cn(
            "rounded-card border px-3 py-2 text-left transition-colors",
            selected === "am"
              ? "border-pine-500/50 bg-pine-500/10 dark:border-pine-300/40 dark:bg-pine-300/10"
              : "border-line hover:border-ink/25 dark:border-line-dark dark:hover:border-bone/25"
          )}
        >
          <p className="text-xs font-medium text-ink-soft dark:text-bone-soft">A → M</p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-ink dark:text-bone">{formatDistance(halfDist)} units</p>
        </button>
        <button
          type="button"
          onClick={() => onSelect(selected === "mb" ? "none" : "mb")}
          className={cn(
            "rounded-card border px-3 py-2 text-left transition-colors",
            selected === "mb"
              ? "border-amber-500/50 bg-amber-500/10 dark:border-amber-400/40 dark:bg-amber-400/10"
              : "border-line hover:border-ink/25 dark:border-line-dark dark:hover:border-bone/25"
          )}
        >
          <p className="text-xs font-medium text-ink-soft dark:text-bone-soft">M → B</p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-ink dark:text-bone">{formatDistance(halfDist)} units</p>
        </button>
      </div>
      <p className="mt-3 text-center text-sm font-medium text-subject-math">Both halves are equal.</p>
    </div>
  );
}
