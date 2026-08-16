"use client";

import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import { formatValue } from "../../calculus-foundations/calculus-model";
import { FunctionGraph } from "../../calculus-foundations/components/function-graph";
import { POINT_A_COLOR, TANGENT_COLOR, lineSegment, type DerivativeFunctionDef } from "../derivative-model";

export interface DerivativePanelProps {
  fn: DerivativeFunctionDef;
  x: number;
  onXChange: (x: number) => void;
}

const QUICK_PICKS = [1, 2, 3, 4];

/**
 * Introduces f'(x): the limit definition shown once for context (not
 * as something to memorize), then the tangent line + a rise/run
 * reading of its slope at whichever x the student picks.
 */
export function DerivativePanel({ fn, x, onXChange }: DerivativePanelProps) {
  const y = fn.evaluate(x);
  const slope = fn.derivative(x);
  const picks = QUICK_PICKS.filter((v) => v <= fn.domainMax);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="mx-auto aspect-square w-full max-w-md">
        <FunctionGraph
          segments={[
            { evaluate: fn.evaluate, from: fn.domainMin, to: fn.domainMax },
            lineSegment(x, y, slope, fn.domainMin, fn.domainMax, TANGENT_COLOR),
          ]}
          trackedPoint={{ x, y, color: POINT_A_COLOR }}
          onDragTrackedPointX={(nextX) => onXChange(Math.min(fn.domainMax, Math.max(fn.domainMin, nextX)))}
          ariaLabel="A tangent line at the chosen x, illustrating the derivative there."
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          The derivative <InlineMath math="f'(x)" /> tells us the instantaneous rate of change of a function.
        </p>

        <BlockMath math="f'(x) = \lim_{h \to 0} \dfrac{f(x+h) - f(x)}{h}" />

        <p className="flex flex-wrap items-center gap-2 rounded-card border border-line bg-white/60 px-4 py-3 dark:border-line-dark dark:bg-white/[0.03]">
          <InlineMath math={fn.latex} />
          <span className="text-ink-soft dark:text-bone-soft">→</span>
          <InlineMath math={fn.derivativeLatex} />
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">x =</span>
          {picks.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onXChange(v)}
              aria-pressed={Math.abs(x - v) < 0.001}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-sm transition-colors",
                Math.abs(x - v) < 0.001
                  ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
                  : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30"
              )}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="rounded-card border border-line bg-white/60 px-4 py-3 dark:border-line-dark dark:bg-white/[0.03]">
          <p className="font-mono text-sm text-ink dark:text-bone">
            x = {formatValue(x)} → f&apos;(x) = {formatValue(slope)}
          </p>
          <p className="mt-2 font-mono text-xs text-ink-soft dark:text-bone-soft">
            Rise = {formatValue(slope)} &nbsp; Run = 1 &nbsp; Slope = Rise / Run = {formatValue(slope)}
          </p>
        </div>
      </div>
    </div>
  );
}
