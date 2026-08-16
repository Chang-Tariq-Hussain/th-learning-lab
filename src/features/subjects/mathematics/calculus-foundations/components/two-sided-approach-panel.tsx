"use client";

import { useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Button } from "@/components/ui/button";
import {
  APPROACH_DISTANCES,
  LEFT_COLOR,
  RIGHT_COLOR,
  approachX,
  formatValue,
  valuesConverge,
} from "../calculus-model";
import { FunctionGraph, type GraphMarker, type GraphSegment } from "./function-graph";

export interface TwoSidedApproachPanelProps {
  segments: GraphSegment[];
  markers?: GraphMarker[];
  evaluateLeft: (x: number) => number;
  evaluateRight: (x: number) => number;
  target: number;
  latex: string;
}

/**
 * Two points step toward the same target from opposite sides at once
 * — the same panel drives both the "limit exists" example (Limit
 * Explorer, Level 4) and the "limit does not exist" example (Left &
 * Right Approach, Level 5); which one it demonstrates depends only on
 * whether `evaluateLeft`/`evaluateRight` agree at the target.
 */
export function TwoSidedApproachPanel({
  segments,
  markers = [],
  evaluateLeft,
  evaluateRight,
  target,
  latex,
}: TwoSidedApproachPanelProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const distance = APPROACH_DISTANCES[stepIndex]!;
  const xLeft = approachX(target, distance, "left");
  const xRight = approachX(target, distance, "right");
  const yLeft = evaluateLeft(xLeft);
  const yRight = evaluateRight(xRight);
  const atLimit = stepIndex === APPROACH_DISTANCES.length - 1;
  const converges = atLimit && valuesConverge(yLeft, yRight);
  const diverges = atLimit && !valuesConverge(yLeft, yRight);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="mx-auto aspect-square w-full max-w-md">
        <FunctionGraph
          segments={segments}
          markers={markers}
          approachDots={[
            { x: xLeft, y: yLeft, color: LEFT_COLOR, label: "left" },
            { x: xRight, y: yRight, color: RIGHT_COLOR, label: "right" },
          ]}
          targetX={target}
          ariaLabel="A graph showing two points approaching the same x-value from the left and right."
        />
      </div>

      <div className="flex flex-col gap-4">
        <BlockMath math={latex} />

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-card border border-line px-4 py-3 dark:border-line-dark" style={{ borderColor: LEFT_COLOR }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em]" style={{ color: LEFT_COLOR }}>
              From left
            </p>
            <p className="mt-1 font-mono text-lg tabular-nums text-ink dark:text-bone">
              x = {formatValue(xLeft)} → f(x) = {formatValue(yLeft)}
            </p>
          </div>
          <div className="rounded-card border border-line px-4 py-3 dark:border-line-dark" style={{ borderColor: RIGHT_COLOR }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.15em]" style={{ color: RIGHT_COLOR }}>
              From right
            </p>
            <p className="mt-1 font-mono text-lg tabular-nums text-ink dark:text-bone">
              x = {formatValue(xRight)} → f(x) = {formatValue(yRight)}
            </p>
          </div>
        </div>

        <div className="rounded-card border border-line bg-white/60 px-4 py-3 text-sm dark:border-line-dark dark:bg-white/[0.03]">
          {converges ? (
            <p className="font-semibold text-pine-600 dark:text-pine-300">
              Limit exists — both sides approach f(x) = {formatValue(yLeft)}.
            </p>
          ) : diverges ? (
            <p className="font-semibold text-amber-600 dark:text-amber-400">
              Limit does not exist — the left side approaches {formatValue(yLeft)}, the right side approaches{" "}
              {formatValue(yRight)}.
            </p>
          ) : (
            <p className="text-ink-soft dark:text-bone-soft">Keep moving closer to see whether the limit exists.</p>
          )}
        </div>

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
