"use client";

import { useState } from "react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Button } from "@/components/ui/button";
import { APPROACH_DISTANCES, LEFT_COLOR, approachX, formatValue } from "../calculus-model";
import { FunctionGraph } from "./function-graph";

export interface ApproachPanelProps {
  evaluate: (x: number) => number;
  domainMin: number;
  domainMax: number;
  target: number;
  latex: string;
}

/**
 * "Approaching a Value" — one point stepping toward the target from
 * the right, one click at a time, revealing a growing table of (x,
 * f(x)) pairs. This is the intuitive lead-in before Limit Explorer
 * formalizes left AND right approach together.
 */
export function ApproachPanel({ evaluate, domainMin, domainMax, target, latex }: ApproachPanelProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const distance = APPROACH_DISTANCES[stepIndex]!;
  const x = approachX(target, distance, "right");
  const y = evaluate(x);
  const atLimit = stepIndex === APPROACH_DISTANCES.length - 1;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="mx-auto aspect-square w-full max-w-md">
        <FunctionGraph
          segments={[{ evaluate, from: domainMin, to: domainMax }]}
          trackedPoint={{ x, y, color: LEFT_COLOR }}
          targetX={target}
          showGuides
          ariaLabel="A graph showing a point moving closer to the target x-value."
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          Watch what happens to <InlineMath math={latex} /> as x gets closer and closer to{" "}
          <InlineMath math={`${target}`} /> — without ever quite landing on it.
        </p>

        <div className="overflow-hidden rounded-card border border-line dark:border-line-dark">
          <table className="w-full text-sm">
            <thead className="bg-white/60 dark:bg-white/[0.03]">
              <tr>
                <th className="px-3 py-2 text-left font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
                  x
                </th>
                <th className="px-3 py-2 text-left font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft dark:text-bone-soft">
                  f(x)
                </th>
              </tr>
            </thead>
            <tbody>
              {APPROACH_DISTANCES.slice(0, stepIndex + 1).map((d, i) => {
                const rowX = approachX(target, d, "right");
                return (
                  <tr key={i} className="border-t border-line dark:border-line-dark">
                    <td className="px-3 py-1.5 font-mono tabular-nums text-ink dark:text-bone">{formatValue(rowX)}</td>
                    <td className="px-3 py-1.5 font-mono tabular-nums text-ink dark:text-bone">{formatValue(evaluate(rowX))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="rounded-card border border-line bg-white/60 px-4 py-3 text-sm text-ink dark:border-line-dark dark:bg-white/[0.03] dark:text-bone">
          As x gets closer to {formatValue(target)}, f(x) gets closer to {formatValue(evaluate(target))}.
        </p>

        <div className="flex gap-3">
          <Button variant="primary" size="md" onClick={() => setStepIndex((i) => Math.min(APPROACH_DISTANCES.length - 1, i + 1))} disabled={atLimit}>
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
