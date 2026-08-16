"use client";

import { useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { FunctionGraph } from "../../calculus-foundations/components/function-graph";
import { StepControls } from "../../derivative-rules/components/step-controls";
import { buildColoredSegments, criticalMarkers, formatValue, getAppFunction, TURNING_POINT_LABEL } from "../applications-model";

const fn = getAppFunction("cubic");

const STEPS = [
  { title: "The function", latex: fn.latex },
  { title: "Differentiate", latex: fn.derivativeLatex },
  { title: "Set the derivative to zero", latex: "3x^2 - 3 = 0" },
  {
    title: "Solve for x",
    latex: fn.criticalPoints.map((c) => `x = ${formatValue(c.x)}`).join(", \\quad "),
  },
  { title: "Classify each point", latex: "" },
];

/**
 * Level 7 — Critical Point Finder. A slightly more advanced example,
 * f(x) = x³ - 3x, walked through one named step at a time (same
 * `StepControls` pattern as Chain Rule Explorer's workspace), ending
 * with both critical points marked and classified on the graph.
 */
export function CriticalPointFinderPanel() {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-subject-math">
        {STEPS[step]!.title}
      </p>

      {STEPS[step]!.latex ? (
        <div className="flex min-h-[3.5rem] items-center justify-center rounded-card border border-line bg-white/60 px-6 py-4 dark:border-line-dark dark:bg-white/[0.03]">
          <BlockMath math={STEPS[step]!.latex} />
        </div>
      ) : null}

      <div className="aspect-square w-full max-w-md">
        <FunctionGraph
          segments={buildColoredSegments(fn)}
          markers={isLast ? criticalMarkers(fn) : []}
          ariaLabel="The graph of f(x) = x cubed minus 3x, with critical points marked once solved."
        />
      </div>

      {isLast ? (
        <div className="flex flex-wrap justify-center gap-3">
          {fn.criticalPoints.map((c) => (
            <div
              key={c.x}
              className="rounded-card border border-line bg-white/60 px-4 py-2.5 text-center font-mono text-sm dark:border-line-dark dark:bg-white/[0.03]"
            >
              x = {formatValue(c.x)} → <span className="font-semibold">{TURNING_POINT_LABEL[c.type]}</span>
            </div>
          ))}
        </div>
      ) : null}

      <StepControls
        index={step}
        total={STEPS.length}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onNext={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
        onReset={() => setStep(0)}
      />
    </div>
  );
}
