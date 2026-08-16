"use client";

import { useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { FunctionGraph } from "../../calculus-foundations/components/function-graph";
import { ExampleSelector } from "./example-selector";
import {
  APP_FUNCTIONS,
  buildColoredSegments,
  criticalMarkers,
  formatValue,
  getAppFunction,
  type AppFunctionDef,
} from "../applications-model";

/**
 * Level 3 — Critical Points. Shows f(x), f'(x), the "solve f'(x) = 0"
 * line, and the resulting critical point(s) marked directly on the
 * (still colored) graph, with the general beginner-friendly definition
 * of a critical point underneath.
 */
export function CriticalPointsPanel() {
  const [fnId, setFnId] = useState<AppFunctionDef["id"]>("x2");
  const fn = getAppFunction(fnId);

  const handleFnChange = (id: AppFunctionDef["id"]) => setFnId(id);

  const solutionLatex =
    fn.criticalPoints.length === 1
      ? `x = ${formatValue(fn.criticalPoints[0]!.x)}`
      : fn.criticalPoints.map((c) => `x = ${formatValue(c.x)}`).join(", \\quad ");

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <ExampleSelector value={fnId} onChange={handleFnChange} />
        <BlockMath math={fn.latex} />
      </div>

      <div className="aspect-square w-full max-w-md">
        <FunctionGraph
          segments={buildColoredSegments(fn)}
          markers={criticalMarkers(fn)}
          ariaLabel="The function's graph with its critical points marked."
        />
      </div>

      <div className="flex flex-col items-center gap-2 rounded-card border border-line bg-white/60 px-6 py-4 dark:border-line-dark dark:bg-white/[0.03]">
        <BlockMath math={fn.derivativeLatex} />
        <p className="font-mono text-xs text-ink-soft dark:text-bone-soft">Set f&apos;(x) = 0:</p>
        <BlockMath math={solutionLatex} />
      </div>

      <p className="max-w-md text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        A critical point occurs where the derivative is zero or undefined. Critical points can help us
        locate maxima and minima.
      </p>
    </div>
  );
}
