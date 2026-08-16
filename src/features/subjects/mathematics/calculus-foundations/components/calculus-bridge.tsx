"use client";

import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRIDGE_STAGES } from "../calculus-model";

/**
 * Section 10 — a simple visual bridge from what this simulation
 * covered to what comes next. Derivatives and Integrals are shown
 * grayed out on purpose: they're future simulations, not built here.
 */
export function CalculusBridge() {
  return (
    <div className="flex flex-col items-center gap-6 rounded-card border border-line bg-white/60 px-6 py-8 text-center dark:border-line-dark dark:bg-white/[0.03]">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {BRIDGE_STAGES.map((stage, i) => (
          <div key={stage.label} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-4 py-2 font-mono text-sm font-semibold",
                stage.done
                  ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
                  : "border-dashed border-ink/20 text-ink-soft/60 dark:border-bone/20 dark:text-bone-soft/50"
              )}
            >
              {stage.done ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : null}
              {stage.label}
            </div>
            {i < BRIDGE_STAGES.length - 1 ? (
              <ArrowRight className="h-4 w-4 text-ink-soft/40 dark:text-bone-soft/40" strokeWidth={1.75} />
            ) : null}
          </div>
        ))}
      </div>

      <p className="max-w-md font-display text-xl font-medium text-ink dark:text-bone">
        You are building the foundation for calculus.
      </p>
      <p className="max-w-md text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        Derivatives and integrals build directly on functions, graphs, limits, and continuity — the ideas you just
        explored. Those are separate simulations, coming next.
      </p>
    </div>
  );
}
