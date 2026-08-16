"use client";

import { FunctionGraph } from "../../calculus-foundations/components/function-graph";
import { POINT_A_COLOR, TANGENT_COLOR } from "../../derivative-explorer/derivative-model";
import { formatValue, tangentSegment, type CompositeFunctionDef } from "../chain-rule-model";

export interface GraphConnectionPanelProps {
  fn: CompositeFunctionDef;
  x: number;
  onXChange: (x: number) => void;
}

/**
 * Section 9 — reuses `FunctionGraph` exactly as Derivative Explorer
 * does: the composite curve plus its tangent line, with a draggable
 * point. Connects this activity back to "the derivative is the slope
 * of the tangent line" from the previous simulation, now applied to a
 * composite function.
 */
export function GraphConnectionPanel({ fn, x, onXChange }: GraphConnectionPanelProps) {
  const y = fn.evaluate(x);
  const slope = fn.derivative(x);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="aspect-square w-full max-w-md">
        <FunctionGraph
          segments={[
            { evaluate: fn.evaluate, from: fn.domainMin, to: fn.domainMax },
            tangentSegment(fn, x, TANGENT_COLOR),
          ]}
          trackedPoint={{ x, y, color: POINT_A_COLOR }}
          onDragTrackedPointX={(nextX) => onXChange(Math.min(fn.domainMax, Math.max(fn.domainMin, nextX)))}
          ariaLabel="The composite function's graph with a draggable point and its tangent line."
        />
      </div>

      <p className="rounded-card border border-line bg-white/60 px-4 py-3 font-mono text-sm text-ink dark:border-line-dark dark:bg-white/[0.03] dark:text-bone">
        x = {formatValue(x)} · f(x) = {formatValue(y)} · f&apos;(x) = {formatValue(slope)}
      </p>

      <p className="max-w-md text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        The Chain Rule calculates the derivative that describes the instantaneous rate of change of this
        composite function — the same slope-of-the-tangent idea from Derivative Explorer.
      </p>
    </div>
  );
}
