"use client";

import { useState } from "react";
import { SimulationLayout } from "@/features/simulation";
import { cn } from "@/lib/utils";
import { formatValue } from "../../calculus-foundations/calculus-model";
import { FunctionGraph } from "../../calculus-foundations/components/function-graph";
import { POINT_A_COLOR, TANGENT_COLOR, lineSegment, type DerivativeFunctionDef } from "../derivative-model";

export interface DerivativeGraphPanelProps {
  fn: DerivativeFunctionDef;
  x: number;
  onXChange: (x: number) => void;
}

/**
 * f(x) on top, f'(x) below it — moving the point on the top graph
 * moves the matching point on the bottom one, making the derivative
 * itself a function students can see, not just a number at a point.
 */
export function DerivativeGraphPanel({ fn, x, onXChange }: DerivativeGraphPanelProps) {
  const [showDerivative, setShowDerivative] = useState(true);
  const y = fn.evaluate(x);
  const slope = fn.derivative(x);

  const drag = (nextX: number) => onXChange(Math.min(fn.domainMax, Math.max(fn.domainMin, nextX)));

  return (
    <SimulationLayout
      stageLabel="Function and derivative graphs"
      aspect={showDerivative ? 1.8 : 1}
      stageCap="26rem"
      stage={
        <div className={cn("grid h-full gap-2", showDerivative ? "grid-cols-2" : "grid-cols-1")}>
          <div className="flex min-h-0 flex-col items-center gap-1">
            <p className="font-mono text-label uppercase text-ink-soft dark:text-bone-soft">f(x)</p>
            <div className="min-h-0 w-full flex-1">
              <FunctionGraph
                segments={[
                  { evaluate: fn.evaluate, from: fn.domainMin, to: fn.domainMax },
                  lineSegment(x, y, slope, fn.domainMin, fn.domainMax, TANGENT_COLOR),
                ]}
                trackedPoint={{ x, y, color: POINT_A_COLOR }}
                onDragTrackedPointX={drag}
                ariaLabel="The function's graph with a draggable point and its tangent line."
              />
            </div>
          </div>

          {showDerivative ? (
            <div className="flex min-h-0 flex-col items-center gap-1">
              <p className="font-mono text-label uppercase text-ink-soft dark:text-bone-soft">f&apos;(x)</p>
              <div className="min-h-0 w-full flex-1">
                <FunctionGraph
                  segments={[{ evaluate: fn.derivative, from: fn.domainMin, to: fn.domainMax, color: TANGENT_COLOR }]}
                  trackedPoint={{ x, y: slope, color: TANGENT_COLOR }}
                  onDragTrackedPointX={drag}
                  ariaLabel="The derivative's graph with the point matching the one on f(x)."
                />
              </div>
            </div>
          ) : null}
        </div>
      }
      readouts={
        <p className="text-center font-mono text-xs text-ink dark:text-bone">
          x = {formatValue(x)} · f(x) = {formatValue(y)} · f&apos;(x) = {formatValue(slope)}
        </p>
      }
      controls={
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowDerivative((s) => !s)}
            aria-pressed={showDerivative}
            className={cn(
              "min-h-11 rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.15em] transition-colors lg:min-h-0",
              showDerivative
                ? "border-subject-math bg-subject-math-soft text-subject-math dark:bg-subject-math/15"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft"
            )}
          >
            {showDerivative ? "Hide" : "Show"} Derivative Graph
          </button>
        </div>
      }
    />
  );
}
