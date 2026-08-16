"use client";

import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { formatValue } from "../../calculus-foundations/calculus-model";
import { FunctionGraph } from "../../calculus-foundations/components/function-graph";
import {
  POINT_A_COLOR,
  POINT_B_COLOR,
  SECANT_COLOR,
  lineSegment,
  secantSlope,
  type DerivativeFunctionDef,
} from "../derivative-model";
import { LabeledSlider } from "./labeled-slider";

export interface SecantPanelProps {
  fn: DerivativeFunctionDef;
  ax: number;
  onAxChange: (x: number) => void;
  deltaX: number;
  onDeltaXChange: (dx: number) => void;
  /** "rate" leads with the Δx/Δy/average-rate formula; "line" leads with the secant-line label. Same mechanics either way. */
  focus: "rate" | "line";
}

/**
 * Two points A and B on the curve, joined by a secant line — the
 * shared engine behind Level 1 and Level 2. B is always `ax + deltaX`
 * (clamped to the domain), so the same "distance between points"
 * slider that appears again in Level 3 already does double duty here.
 */
export function SecantPanel({ fn, ax, onAxChange, deltaX, onDeltaXChange, focus }: SecantPanelProps) {
  const bx = Math.min(fn.domainMax, Math.max(fn.domainMin, ax + deltaX));
  const ay = fn.evaluate(ax);
  const by = fn.evaluate(bx);
  const dx = bx - ax;
  const dy = by - ay;
  const slope = secantSlope(fn, ax, bx);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="mx-auto aspect-square w-full max-w-md">
        <FunctionGraph
          segments={[
            { evaluate: fn.evaluate, from: fn.domainMin, to: fn.domainMax },
            lineSegment(ax, ay, slope, fn.domainMin, fn.domainMax, SECANT_COLOR),
          ]}
          trackedPoint={{ x: ax, y: ay, color: POINT_A_COLOR, label: "A" }}
          onDragTrackedPointX={(nextX) => onAxChange(Math.min(fn.domainMax, Math.max(fn.domainMin, nextX)))}
          approachDots={[{ x: bx, y: by, color: POINT_B_COLOR, label: "B" }]}
          ariaLabel="A curve with two points connected by a secant line."
        />
      </div>

      <div className="flex flex-col gap-4">
        {focus === "line" ? (
          <p className="rounded-full border border-line bg-white/60 px-4 py-1.5 text-center font-mono text-xs uppercase tracking-[0.15em] text-ink dark:border-line-dark dark:bg-white/[0.03] dark:text-bone">
            Secant Line
          </p>
        ) : null}

        <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          {focus === "rate"
            ? "Drag point A along the curve, or use the slider to move B closer or further away. The line through A and B is the secant line."
            : "A line through any two points on a curve is called a secant line. Move A or B and watch it swing."}
        </p>

        <div className="grid grid-cols-2 gap-3 font-mono text-sm">
          <div className="rounded-card border border-line px-4 py-2.5 dark:border-line-dark">
            <p className="text-ink-soft dark:text-bone-soft">Point A</p>
            <p className="tabular-nums text-ink dark:text-bone">
              ({formatValue(ax)}, {formatValue(ay)})
            </p>
          </div>
          <div className="rounded-card border border-line px-4 py-2.5 dark:border-line-dark">
            <p className="text-ink-soft dark:text-bone-soft">Point B</p>
            <p className="tabular-nums text-ink dark:text-bone">
              ({formatValue(bx)}, {formatValue(by)})
            </p>
          </div>
        </div>

        <div className="rounded-card border border-line bg-white/60 px-4 py-3 dark:border-line-dark dark:bg-white/[0.03]">
          <p className="font-mono text-sm text-ink dark:text-bone">
            Δx = {formatValue(dx)} &nbsp; Δy = {formatValue(dy)}
          </p>
          <p className="mt-1 font-mono text-sm text-ink dark:text-bone">
            <InlineMath math="\dfrac{\Delta y}{\Delta x}" /> = Average Rate of Change = {formatValue(slope)}
          </p>
        </div>

        <LabeledSlider
          id="secant-delta-slider"
          label="Distance between points"
          value={deltaX}
          onChange={onDeltaXChange}
          min={0.1}
          max={Math.min(fn.domainMax - fn.domainMin, 3)}
          step={0.05}
        />
      </div>
    </div>
  );
}
