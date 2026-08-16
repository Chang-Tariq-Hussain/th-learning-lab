"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { APPROACH_DISTANCES, formatValue } from "../../calculus-foundations/calculus-model";
import { FunctionGraph } from "../../calculus-foundations/components/function-graph";
import { POINT_A_COLOR, POINT_B_COLOR, SECANT_COLOR, lineSegment, secantSlope, type DerivativeFunctionDef } from "../derivative-model";

export interface ApproachPointPanelProps {
  fn: DerivativeFunctionDef;
  ax: number;
}

/**
 * Point B steps toward A one click at a time — same distance
 * sequence (1, 0.5, 0.1, 0.01, 0.001) as Calculus Foundations' own
 * "Approaching a Value" level — while a growing table shows the
 * secant slope closing in on the true derivative at A.
 */
export function ApproachPointPanel({ fn, ax }: ApproachPointPanelProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const distance = APPROACH_DISTANCES[stepIndex]!;
  const bx = Math.min(fn.domainMax, ax + distance);
  const ay = fn.evaluate(ax);
  const by = fn.evaluate(bx);
  const slope = secantSlope(fn, ax, bx);
  const trueSlope = fn.derivative(ax);
  const atLimit = stepIndex === APPROACH_DISTANCES.length - 1;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="mx-auto aspect-square w-full max-w-md">
        <FunctionGraph
          segments={[
            { evaluate: fn.evaluate, from: fn.domainMin, to: fn.domainMax },
            lineSegment(ax, ay, slope, fn.domainMin, fn.domainMax, SECANT_COLOR),
          ]}
          trackedPoint={{ x: ax, y: ay, color: POINT_A_COLOR, label: "A" }}
          approachDots={[{ x: bx, y: by, color: POINT_B_COLOR, label: "B" }]}
          ariaLabel="A secant line rotating toward the tangent line as point B moves closer to point A."
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          Keep moving B closer to A. Watch the secant line rotate — and its slope settle down toward one number.
        </p>

        <div className="overflow-hidden rounded-card border border-line dark:border-line-dark">
          <table className="w-full text-sm">
            <thead className="bg-white/60 dark:bg-white/[0.03]">
              <tr>
                <th className="px-3 py-2 text-left font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
                  Δx
                </th>
                <th className="px-3 py-2 text-left font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
                  Secant slope
                </th>
              </tr>
            </thead>
            <tbody>
              {APPROACH_DISTANCES.slice(0, stepIndex + 1).map((d, i) => {
                const rowBx = Math.min(fn.domainMax, ax + d);
                return (
                  <tr key={i} className="border-t border-line dark:border-line-dark">
                    <td className="px-3 py-1.5 font-mono tabular-nums text-ink dark:text-bone">{formatValue(d)}</td>
                    <td className="px-3 py-1.5 font-mono tabular-nums text-ink dark:text-bone">
                      {formatValue(secantSlope(fn, ax, rowBx))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="rounded-card border border-line bg-white/60 px-4 py-3 text-sm text-ink dark:border-line-dark dark:bg-white/[0.03] dark:text-bone">
          As Δx gets closer to 0, the secant slope gets closer to {formatValue(trueSlope)} — the true derivative at
          x = {formatValue(ax)}.
        </p>

        <div className="flex gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => setStepIndex((i) => Math.min(APPROACH_DISTANCES.length - 1, i + 1))}
            disabled={atLimit}
          >
            Move Closer
          </Button>
          <Button variant="secondary" size="md" onClick={() => setStepIndex(0)}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
