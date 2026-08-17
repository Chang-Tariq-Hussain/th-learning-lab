"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { formatValue } from "../../calculus-foundations/calculus-model";
import { FunctionGraph } from "../../calculus-foundations/components/function-graph";
import {
  POINT_A_COLOR,
  SIGN_COPY,
  getDerivativeFunction,
  lineSegment,
  signOf,
} from "../derivative-model";

/**
 * Fixed to f(x) = x² — the brief's own example, since it's the
 * simplest curve with a genuine turning point where the sign of the
 * derivative flips exactly once.
 */
const FN = getDerivativeFunction("x2");

export function SignPanel() {
  const [x, setX] = useState(-1.5);
  const y = FN.evaluate(x);
  const slope = FN.derivative(x);
  const sign = signOf(slope);
  const copy = SIGN_COPY[sign];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="mx-auto aspect-square w-full max-w-md">
        <FunctionGraph
          segments={[
            { evaluate: FN.evaluate, from: FN.domainMin, to: FN.domainMax },
            lineSegment(x, y, slope, FN.domainMin, FN.domainMax, copy.color),
          ]}
          trackedPoint={{ x, y, color: POINT_A_COLOR }}
          onDragTrackedPointX={(nextX) =>
            setX(Math.min(FN.domainMax, Math.max(FN.domainMin, nextX)))
          }
          ariaLabel="A tangent line whose slope changes sign as the point moves across the curve's turning point."
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          Drag the point from left to right across the bottom of the curve and
          watch the tangent line&apos;s slope change sign.
        </p>

        <div
          className={cn("rounded-card border-2 px-4 py-3 text-center")}
          style={{
            borderColor: copy.color,
            backgroundColor: `${copy.color}14`,
          }}
        >
          <p
            className="font-mono text-sm font-semibold"
            style={{ color: copy.color }}
          >
            {copy.badge}
          </p>
          <p className="mt-1 text-sm text-ink dark:text-bone">
            {copy.explanation}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft dark:text-bone-soft">
          <div
            className={cn(
              "rounded-card border px-2 py-2 text-center",
              sign === "negative" &&
                "border-current text-red-600 dark:text-red-400",
            )}
          >
            Left
            <br />
            &lt; 0
          </div>
          <div
            className={cn(
              "rounded-card border px-2 py-2 text-center",
              sign === "zero" &&
                "border-current text-gray-600 dark:text-gray-300",
            )}
          >
            Bottom
            <br />= 0
          </div>
          <div
            className={cn(
              "rounded-card border px-2 py-2 text-center",
              sign === "positive" &&
                "border-current text-pine-600 dark:text-pine-300",
            )}
          >
            Right
            <br />
            &gt; 0
          </div>
        </div>

        <p className="rounded-card border border-line bg-white/60 px-4 py-3 font-mono text-sm text-ink dark:border-line-dark dark:bg-white/[0.03] dark:text-bone">
          x = {formatValue(x)} → f&apos;(x) = {formatValue(slope)}
        </p>
      </div>
    </div>
  );
}
