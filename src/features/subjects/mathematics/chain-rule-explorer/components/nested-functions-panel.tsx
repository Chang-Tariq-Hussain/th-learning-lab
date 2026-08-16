"use client";

import { useState } from "react";
import { ArrowDown } from "lucide-react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { XSlider } from "../../calculus-foundations/components/x-slider";
import {
  NESTED_DEFAULT_X,
  NESTED_DOMAIN_MAX,
  NESTED_DOMAIN_MIN,
  formatValue,
  nestedDerivative,
  nestedLayer1,
  nestedLayer2,
  nestedLayer3,
} from "../chain-rule-model";

/**
 * Section 10 — one nested example, three layers deep, no further:
 * x -> x + 1 -> (x + 1)² + 2 -> ((x + 1)² + 2)³. Shows that the Chain
 * Rule is just applied repeatedly, one layer at a time, without
 * computing a full worked derivative — the goal here is the idea, not
 * another six-step drill.
 */
export function NestedFunctionsPanel() {
  const [x, setX] = useState(NESTED_DEFAULT_X);
  const [showDerivative, setShowDerivative] = useState(false);

  const l1 = nestedLayer1(x);
  const l2 = nestedLayer2(x);
  const l3 = nestedLayer3(x);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <BlockMath math="y = ((x + 1)^2 + 2)^3" />
      <p className="max-w-lg text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        The Chain Rule can be applied repeatedly — each layer wraps around the one before it.
      </p>

      <div className="flex flex-col items-center gap-2 rounded-card border border-line bg-white/60 px-6 py-6 dark:border-line-dark dark:bg-white/[0.03]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">x</p>
        <p className="font-display text-2xl font-semibold text-ink dark:text-bone tabular-nums">
          {formatValue(x)}
        </p>

        <ArrowDown className="my-1 h-5 w-5 text-ink-soft/60 dark:text-bone-soft/60" strokeWidth={1.75} />

        <div className="rounded-full border-2 border-subject-math bg-subject-math-soft px-4 py-1.5 dark:bg-subject-math/15">
          <p className="font-mono text-xs font-semibold text-subject-math">Layer 1: x + 1</p>
        </div>
        <p className="font-display text-lg font-medium text-ink dark:text-bone tabular-nums">
          {formatValue(l1)}
        </p>

        <ArrowDown className="my-1 h-5 w-5 text-ink-soft/60 dark:text-bone-soft/60" strokeWidth={1.75} />

        <div className="rounded-full border-2 border-amber-500 bg-amber-50 px-4 py-1.5 dark:border-amber-400 dark:bg-amber-900/20">
          <p className="font-mono text-xs font-semibold text-amber-700 dark:text-amber-300">
            Layer 2: (x + 1)² + 2
          </p>
        </div>
        <p className="font-display text-lg font-medium text-ink dark:text-bone tabular-nums">
          {formatValue(l2)}
        </p>

        <ArrowDown className="my-1 h-5 w-5 text-ink-soft/60 dark:text-bone-soft/60" strokeWidth={1.75} />

        <div className="rounded-full border-2 border-pine-500 bg-pine-50 px-4 py-1.5 dark:border-pine-300 dark:bg-pine-900/20">
          <p className="font-mono text-xs font-semibold text-pine-700 dark:text-pine-300">
            Layer 3: ((x + 1)² + 2)³
          </p>
        </div>
        <p className="font-display text-2xl font-semibold text-subject-math tabular-nums">
          {formatValue(l3)}
        </p>
      </div>

      <XSlider value={x} onChange={setX} min={NESTED_DOMAIN_MIN} max={NESTED_DOMAIN_MAX} />

      <button
        type="button"
        onClick={() => setShowDerivative((s) => !s)}
        className="rounded-full border border-line px-4 py-1.5 font-mono text-xs uppercase tracking-[0.15em] text-ink-soft transition-colors hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30"
      >
        {showDerivative ? "Hide" : "Show"} the Derivative
      </button>

      {showDerivative ? (
        <div className="flex flex-col items-center gap-2 rounded-card border border-line bg-white/60 px-5 py-4 text-center dark:border-line-dark dark:bg-white/[0.03]">
          <p className="text-sm text-ink-soft dark:text-bone-soft">
            Apply the Chain Rule once per layer, from the outside in:
          </p>
          <BlockMath math="y' = 3((x+1)^2+2)^2 \cdot 2(x+1)" />
          <p className="text-xs text-ink-soft dark:text-bone-soft">
            At <InlineMath math={`x = ${formatValue(x)}`} />, y&apos; = {formatValue(nestedDerivative(x))}
          </p>
        </div>
      ) : null}
    </div>
  );
}
