"use client";

import { useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import { FunctionGraph } from "../../calculus-foundations/components/function-graph";
import { CONSTANT_OPTIONS } from "../derivative-rules-model";

/**
 * f(x) = c is a flat horizontal line — moving the constant only slides
 * the line up or down, it never tilts it, which is the visual case for
 * why its derivative is always 0.
 */
export function ConstantRulePanel() {
  const [c, setC] = useState(5);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="mx-auto aspect-square w-full max-w-md">
        <FunctionGraph
          segments={[{ evaluate: () => c, from: -9, to: 9 }]}
          ariaLabel={`A flat horizontal line at y = ${c}, the graph of f(x) = ${c}.`}
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          A constant function never changes — no matter what x is, the output stays the same.
        </p>

        <BlockMath math={`f(x) = ${c}`} />
        <BlockMath math="f'(x) = 0" />

        <p className="rounded-card border border-line bg-white/60 px-4 py-3 text-sm leading-relaxed text-ink dark:border-line-dark dark:bg-white/[0.03] dark:text-bone">
          A constant does not change, so its rate of change is zero.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
            f(x) =
          </span>
          {CONSTANT_OPTIONS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setC(v)}
              aria-pressed={c === v}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-sm transition-colors",
                c === v
                  ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
                  : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30",
              )}
            >
              {v}
            </button>
          ))}
        </div>

        <p className="text-xs text-ink-soft dark:text-bone-soft">
          Notice the line moves up and down, but it never tilts — the slope, <InlineMath math="f'(x)" />, stays{" "}
          <InlineMath math="0" /> for every value you pick.
        </p>
      </div>
    </div>
  );
}
