"use client";

import { formatValue } from "../../calculus-foundations/calculus-model";
import { FunctionGraph } from "../../calculus-foundations/components/function-graph";
import { POINT_A_COLOR, TANGENT_COLOR, lineSegment, type DerivativeFunctionDef } from "../derivative-model";

export interface TangentPanelProps {
  fn: DerivativeFunctionDef;
  x: number;
  onXChange: (x: number) => void;
}

/**
 * One point, one line — the tangent line at x, computed from the
 * actual derivative (not approximated from a secant), following the
 * point as it's dragged along the curve.
 */
export function TangentPanel({ fn, x, onXChange }: TangentPanelProps) {
  const y = fn.evaluate(x);
  const slope = fn.derivative(x);

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
          ariaLabel="A tangent line touching the curve at a single, draggable point."
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="rounded-full border border-line bg-white/60 px-4 py-1.5 text-center font-mono text-xs uppercase tracking-[0.15em] text-ink dark:border-line-dark dark:bg-white/[0.03] dark:text-bone">
          Tangent Line
        </p>
        <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          The tangent line shows the direction of the curve at one point. Drag the point along the curve and watch
          the line follow it.
        </p>
        <div className="rounded-card border border-line bg-white/60 px-4 py-3 font-mono text-sm text-ink dark:border-line-dark dark:bg-white/[0.03] dark:text-bone">
          <p>
            Point: ({formatValue(x)}, {formatValue(y)})
          </p>
          <p className="mt-1">Tangent slope: {formatValue(slope)}</p>
        </div>
      </div>
    </div>
  );
}
