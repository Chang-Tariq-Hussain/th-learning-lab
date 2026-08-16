"use client";

import { formatValue } from "../../calculus-foundations/calculus-model";
import { FunctionGraph } from "../../calculus-foundations/components/function-graph";
import {
  POINT_A_COLOR,
  POINT_B_COLOR,
  SECANT_COLOR,
  TANGENT_COLOR,
  lineSegment,
  secantSlope,
  type DerivativeFunctionDef,
} from "../derivative-model";

export interface RateComparisonPanelProps {
  fn: DerivativeFunctionDef;
  x: number;
}

/** A fixed, generous gap so the two-point side of the comparison reads clearly as "two points, one line". */
const COMPARISON_GAP = 1;

/**
 * Side by side: the same function, the same point x, shown once with
 * a secant line (two points -> average rate) and once with a tangent
 * line (one point -> instantaneous rate).
 */
export function RateComparisonPanel({ fn, x }: RateComparisonPanelProps) {
  const bx = Math.min(fn.domainMax, x + COMPARISON_GAP);
  const ay = fn.evaluate(x);
  const by = fn.evaluate(bx);
  const avgSlope = secantSlope(fn, x, bx);
  const instSlope = fn.derivative(x);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="flex flex-col items-center gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
          Average Rate · Two Points → Secant
        </p>
        <div className="aspect-square w-full max-w-xs">
          <FunctionGraph
            segments={[
              { evaluate: fn.evaluate, from: fn.domainMin, to: fn.domainMax },
              lineSegment(x, ay, avgSlope, fn.domainMin, fn.domainMax, SECANT_COLOR),
            ]}
            trackedPoint={{ x, y: ay, color: POINT_A_COLOR, label: "A" }}
            approachDots={[{ x: bx, y: by, color: POINT_B_COLOR, label: "B" }]}
            ariaLabel="Two points connected by a secant line, showing the average rate of change."
          />
        </div>
        <p className="font-mono text-sm text-ink dark:text-bone">Average rate = {formatValue(avgSlope)}</p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
          Instantaneous Rate · One Point → Tangent
        </p>
        <div className="aspect-square w-full max-w-xs">
          <FunctionGraph
            segments={[
              { evaluate: fn.evaluate, from: fn.domainMin, to: fn.domainMax },
              lineSegment(x, ay, instSlope, fn.domainMin, fn.domainMax, TANGENT_COLOR),
            ]}
            trackedPoint={{ x, y: ay, color: POINT_A_COLOR }}
            ariaLabel="One point with a tangent line, showing the instantaneous rate of change."
          />
        </div>
        <p className="font-mono text-sm text-ink dark:text-bone">Instantaneous rate = {formatValue(instSlope)}</p>
      </div>
    </div>
  );
}
