"use client";

import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import {
  CHAIN_COMPARISON_DERIVATIVE_LATEX,
  CHAIN_COMPARISON_LATEX,
  POWER_ONLY_DERIVATIVE_LATEX,
  POWER_ONLY_LATEX,
} from "../chain-rule-model";

/**
 * Section 7 — side-by-side comparison of a bare power (Power Rule
 * only) and a power applied to an inner function (Power Rule + Chain
 * Rule). Deliberately static and simple; the point is the contrast,
 * not another interactive control.
 */
export function PowerVsChainPanel() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
      <p className="max-w-lg text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        When the exponent is applied directly to x, the Power Rule is enough. When another function is
        inside the power, the Chain Rule is needed too.
      </p>

      <div className="grid w-full gap-4 sm:grid-cols-2">
        <div className="flex flex-col items-center gap-3 rounded-card border border-line bg-white/60 px-5 py-6 dark:border-line-dark dark:bg-white/[0.03]">
          <span className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft dark:border-line-dark dark:text-bone-soft">
            Power Rule only
          </span>
          <BlockMath math={POWER_ONLY_LATEX} />
          <p className="text-center text-xs text-ink-soft dark:text-bone-soft">
            The exponent applies straight to x — no inner function.
          </p>
          <BlockMath math={POWER_ONLY_DERIVATIVE_LATEX} />
        </div>

        <div className="flex flex-col items-center gap-3 rounded-card border-2 border-subject-math bg-subject-math-soft px-5 py-6 dark:bg-subject-math/15">
          <span className="rounded-full border border-subject-math px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-subject-math">
            Power Rule + Chain Rule
          </span>
          <BlockMath math={CHAIN_COMPARISON_LATEX} />
          <p className="text-center text-xs text-ink-soft dark:text-bone-soft">
            <InlineMath math="2x + 1" /> is an inner function inside the power.
          </p>
          <BlockMath math={CHAIN_COMPARISON_DERIVATIVE_LATEX} />
        </div>
      </div>
    </div>
  );
}
