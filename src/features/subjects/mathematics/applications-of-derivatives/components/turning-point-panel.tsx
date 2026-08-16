"use client";

import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { FunctionGraph } from "../../calculus-foundations/components/function-graph";
import { StateChain } from "./state-chain";
import { buildColoredSegments, criticalMarkers, getAppFunction, TURNING_POINT_LABEL, type AppFunctionDef } from "../applications-model";

export interface TurningPointPanelProps {
  fnId: AppFunctionDef["id"];
}

/**
 * Shared by Level 4 (Local Minimum, f(x) = x²) and Level 5 (Local
 * Maximum, f(x) = -x²) — same graph + chain-diagram + label structure,
 * just driven by which function it's given, since the "before/after
 * sign change" idea (the brief's real emphasis, over any memorized
 * rule) is identical either way.
 */
export function TurningPointPanel({ fnId }: TurningPointPanelProps) {
  const fn = getAppFunction(fnId);
  const cp = fn.criticalPoints[0]!;
  const isMin = cp.type === "min";

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5">
      <BlockMath math={fn.latex} />

      <div className="aspect-square w-full max-w-md">
        <FunctionGraph
          segments={buildColoredSegments(fn)}
          markers={criticalMarkers(fn)}
          ariaLabel={`The graph of ${fn.label}, colored by increasing/decreasing region, with its ${TURNING_POINT_LABEL[cp.type].toLowerCase()} marked.`}
        />
      </div>

      <StateChain
        links={
          isMin
            ? [
                { label: "Decreasing", tone: "negative" },
                { label: "Critical Point", tone: "neutral" },
                { label: "Increasing", tone: "positive" },
              ]
            : [
                { label: "Increasing", tone: "positive" },
                { label: "Critical Point", tone: "neutral" },
                { label: "Decreasing", tone: "negative" },
              ]
        }
      />

      <span className="rounded-full border-2 border-subject-math bg-subject-math-soft px-5 py-1.5 font-mono text-sm font-semibold uppercase tracking-[0.15em] text-subject-math dark:bg-subject-math/15">
        {TURNING_POINT_LABEL[cp.type]}
      </span>

      <p className="max-w-md text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        {isMin
          ? "The function changes from decreasing to increasing."
          : "The function changes from increasing to decreasing."}
      </p>
    </div>
  );
}
