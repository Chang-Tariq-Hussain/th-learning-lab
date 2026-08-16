"use client";

import { useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import { getComposite } from "../chain-rule-model";

type Highlight = "inner" | "outer";

const fn = getComposite("c");

/**
 * Fixed y = (x² + 1)³ example (per the brief). Clicking Inner/Outer
 * highlights the matching box below the full expression, and the
 * explanation line updates to match — the same "click to highlight a
 * piece of a shared expression" pattern used throughout the rules
 * activity, just applied to composite structure instead of terms.
 */
export function InnerOuterPanel() {
  const [highlight, setHighlight] = useState<Highlight>("inner");

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <BlockMath math={fn.fullLatex} />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setHighlight("inner")}
          aria-pressed={highlight === "inner"}
          className={cn(
            "rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.15em] transition-colors",
            highlight === "inner"
              ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
              : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft"
          )}
        >
          Inner Function
        </button>
        <button
          type="button"
          onClick={() => setHighlight("outer")}
          aria-pressed={highlight === "outer"}
          className={cn(
            "rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.15em] transition-colors",
            highlight === "outer"
              ? "border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-400 dark:bg-amber-900/20 dark:text-amber-300"
              : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft"
          )}
        >
          Outer Function
        </button>
      </div>

      <div className="flex w-full flex-col items-center gap-3 rounded-card border border-line bg-white/60 px-6 py-6 dark:border-line-dark dark:bg-white/[0.03] sm:flex-row sm:justify-center">
        <div
          className={cn(
            "rounded-lg border-2 px-5 py-4 text-center transition-colors",
            highlight === "inner"
              ? "border-subject-math bg-subject-math-soft dark:bg-subject-math/15"
              : "border-line/60 opacity-50 dark:border-line-dark/60"
          )}
        >
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
            Inner
          </p>
          <InlineMath math={fn.innerLatex} />
        </div>

        <span className="text-lg text-ink-soft dark:text-bone-soft">→ u →</span>

        <div
          className={cn(
            "rounded-lg border-2 px-5 py-4 text-center transition-colors",
            highlight === "outer"
              ? "border-amber-500 bg-amber-50 dark:border-amber-400 dark:bg-amber-900/20"
              : "border-line/60 opacity-50 dark:border-line-dark/60"
          )}
        >
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
            Outer
          </p>
          <InlineMath math={fn.outerLatex} />
        </div>
      </div>

      <p className="max-w-md text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        {highlight === "inner"
          ? "First calculate the inner function, then apply the outer function."
          : "The outer function, u³, is applied last — after the inner function has already produced a value."}
      </p>
    </div>
  );
}
