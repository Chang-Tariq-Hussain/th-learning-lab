"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactionConfig, ReactionStep } from "../reaction-model";

interface ReactionEquationDiagramProps {
  reaction: ReactionConfig;
  step: ReactionStep;
}

/**
 * A compact "Reactants → Products" summary card, always on screen no
 * matter which step the animation is on. This is deliberately separate
 * from the animated `ReactionStage` below it — it's the one place a
 * student can see the whole equation and both molecule counts at a
 * glance, while the stage shows *how* it happens.
 */
export function ReactionEquationDiagram({
  reaction,
  step,
}: ReactionEquationDiagramProps) {
  const reactantsActive = step <= 3;
  const productsActive = step >= 4;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-card border border-line bg-white/60 px-4 py-3 dark:border-line-dark dark:bg-white/[0.03]">
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft">
          {reaction.reactantsLabel}
        </span>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {reaction.reactantsMolecules.map((m) => (
            <span
              key={m.formula}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-sm font-semibold transition-colors",
                reactantsActive
                  ? "border-subject-chemistry/40 bg-subject-chemistry-soft text-subject-chemistry dark:bg-subject-chemistry/10"
                  : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
              )}
            >
              {m.count > 1 ? m.count : ""}
              {m.formula}
            </span>
          ))}
        </div>
      </div>

      <ArrowRight
        className="h-5 w-5 shrink-0 text-ink-soft/60 dark:text-bone-soft/60"
        strokeWidth={1.75}
      />

      <div className="flex flex-col items-center gap-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft">
          {reaction.productsLabel}
        </span>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {reaction.productsMolecules.map((m) => (
            <span
              key={m.formula}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-sm font-semibold transition-colors",
                productsActive
                  ? "border-subject-chemistry/40 bg-subject-chemistry-soft text-subject-chemistry dark:bg-subject-chemistry/10"
                  : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
              )}
            >
              {m.count > 1 ? m.count : ""}
              {m.formula}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
