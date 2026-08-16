/**
 * Applications of Derivatives — data model.
 *
 * Reuses the shared coordinate math and `FunctionGraph` plotter from
 * Calculus Foundations, `formatValue` from the same file, and the
 * derivative-sign vocabulary (`signOf`, `SIGN_COPY`) plus tracked-point
 * colors and `lineSegment` from Derivative Explorer — the same
 * cross-Calculus reuse pattern Chain Rule Explorer already follows.
 * This file adds only what's specific to this activity: three
 * predefined, hand-verified functions with known critical points, and
 * the helpers that turn a function + its critical points into colored
 * increasing/decreasing graph segments and a sign chart.
 */

import type { GraphMarker, GraphSegment } from "../calculus-foundations/components/function-graph";
import { formatValue } from "../calculus-foundations/calculus-model";
import { SIGN_COPY, signOf, type DerivativeSign } from "../derivative-explorer/derivative-model";

export type { GraphSegment, GraphMarker, DerivativeSign };
export { formatValue, SIGN_COPY, signOf };

// --- Functions -----------------------------------------------------------------

export type TurningPointType = "min" | "max";

export interface CriticalPoint {
  x: number;
  y: number;
  type: TurningPointType;
}

export interface AppFunctionDef {
  id: "x2" | "negx2" | "cubic";
  label: string;
  latex: string;
  derivativeLatex: string;
  evaluate: (x: number) => number;
  derivative: (x: number) => number;
  domainMin: number;
  domainMax: number;
  defaultX: number;
  criticalPoints: CriticalPoint[];
}

export const APP_FUNCTIONS: AppFunctionDef[] = [
  {
    id: "x2",
    label: "f(x) = x²",
    latex: "f(x) = x^2",
    derivativeLatex: "f'(x) = 2x",
    evaluate: (x) => x * x,
    derivative: (x) => 2 * x,
    domainMin: -3,
    domainMax: 3,
    defaultX: -2,
    criticalPoints: [{ x: 0, y: 0, type: "min" }],
  },
  {
    id: "negx2",
    label: "f(x) = -x²",
    latex: "f(x) = -x^2",
    derivativeLatex: "f'(x) = -2x",
    evaluate: (x) => -(x * x),
    derivative: (x) => -2 * x,
    domainMin: -3,
    domainMax: 3,
    defaultX: -2,
    criticalPoints: [{ x: 0, y: 0, type: "max" }],
  },
  {
    id: "cubic",
    label: "f(x) = x³ - 3x",
    latex: "f(x) = x^3 - 3x",
    derivativeLatex: "f'(x) = 3x^2 - 3",
    evaluate: (x) => x * x * x - 3 * x,
    derivative: (x) => 3 * x * x - 3,
    domainMin: -2.2,
    domainMax: 2.2,
    defaultX: -2,
    criticalPoints: [
      { x: -1, y: 2, type: "max" },
      { x: 1, y: -2, type: "min" },
    ],
  },
];

export function getAppFunction(id: AppFunctionDef["id"]): AppFunctionDef {
  return APP_FUNCTIONS.find((f) => f.id === id) ?? APP_FUNCTIONS[0]!;
}

/** Builds a straight-line graph segment through (x0, y0) with the given slope — same helper Derivative Explorer uses for tangent lines. */
export function lineSegment(x0: number, y0: number, slope: number, from: number, to: number, color?: string): GraphSegment {
  return { evaluate: (x) => y0 + slope * (x - x0), from, to, color };
}

// --- Colored increasing/decreasing segments -------------------------------------

/**
 * Splits a function's domain at its critical points and colors each
 * piece by the sign of its derivative at the midpoint — green where
 * increasing, red where decreasing — so the curve itself shows the
 * behavior instead of relying on a text label. Works for any function
 * in `APP_FUNCTIONS`, generically, since it only reads `derivative`
 * and `criticalPoints`.
 */
export function buildColoredSegments(fn: AppFunctionDef): GraphSegment[] {
  const breakpoints = [fn.domainMin, ...fn.criticalPoints.map((c) => c.x).sort((a, b) => a - b), fn.domainMax];
  const segments: GraphSegment[] = [];
  for (let i = 0; i < breakpoints.length - 1; i++) {
    const from = breakpoints[i]!;
    const to = breakpoints[i + 1]!;
    if (to - from < 0.001) continue;
    const mid = (from + to) / 2;
    const sign = signOf(fn.derivative(mid));
    segments.push({
      evaluate: fn.evaluate,
      from,
      to,
      color: sign === "negative" ? SIGN_COPY.negative.color : SIGN_COPY.positive.color,
    });
  }
  return segments;
}

/** Same colored-piece idea, applied to the derivative curve itself, so the derivative graph visually matches the original's green/red regions. */
export function buildColoredDerivativeSegments(fn: AppFunctionDef): GraphSegment[] {
  const breakpoints = [fn.domainMin, ...fn.criticalPoints.map((c) => c.x).sort((a, b) => a - b), fn.domainMax];
  const segments: GraphSegment[] = [];
  for (let i = 0; i < breakpoints.length - 1; i++) {
    const from = breakpoints[i]!;
    const to = breakpoints[i + 1]!;
    if (to - from < 0.001) continue;
    const mid = (from + to) / 2;
    const sign = signOf(fn.derivative(mid));
    segments.push({
      evaluate: fn.derivative,
      from,
      to,
      color: sign === "negative" ? SIGN_COPY.negative.color : SIGN_COPY.positive.color,
    });
  }
  return segments;
}

/** Critical-point markers for a function, ready to hand to `FunctionGraph`. Leaves `color` unset so the marker uses `FunctionGraph`'s theme-aware ink/bone default instead of a hardcoded, dark-mode-unfriendly hex value. */
export function criticalMarkers(fn: AppFunctionDef): GraphMarker[] {
  return fn.criticalPoints.map((c) => ({ x: c.x, y: c.y, kind: "closed" }));
}

export const TURNING_POINT_LABEL: Record<TurningPointType, string> = {
  min: "Local Minimum",
  max: "Local Maximum",
};

// --- Sign chart (Level 8) -------------------------------------------------------

export interface SignInterval {
  label: string;
  sign: DerivativeSign;
}

/** Builds the labeled intervals ("x < -1", "-1 < x < 1", "x > 1") and each one's derivative sign for a function's sign chart. */
export function buildSignChart(fn: AppFunctionDef): SignInterval[] {
  const xs = fn.criticalPoints.map((c) => c.x).sort((a, b) => a - b);
  const bounds = [fn.domainMin, ...xs, fn.domainMax];
  const intervals: SignInterval[] = [];
  for (let i = 0; i < bounds.length - 1; i++) {
    const from = bounds[i]!;
    const to = bounds[i + 1]!;
    const mid = (from + to) / 2;
    const sign = signOf(fn.derivative(mid));
    let label: string;
    if (i === 0) label = `x < ${formatValue(xs[0]!)}`;
    else if (i === bounds.length - 2) label = `x > ${formatValue(xs[xs.length - 1]!)}`;
    else label = `${formatValue(xs[i - 1]!)} < x < ${formatValue(xs[i]!)}`;
    intervals.push({ label, sign });
  }
  return intervals;
}

// --- Real-world connection (Section 10, folded into Level 6) --------------------

export const PROFIT_FUNCTION = getAppFunction("negx2");

// --- Interactive Challenge: Maximum, Minimum, or Neither (Level 9) --------------

export type PointClassification = "maximum" | "minimum" | "neither";

export interface PointChallengeQuestion {
  id: string;
  fn: AppFunctionDef;
  pointX: number;
  correct: PointClassification;
  explanation: string;
}

const CUBIC = getAppFunction("cubic");
const X2 = getAppFunction("x2");
const NEG_X2 = getAppFunction("negx2");

export const POINT_CHALLENGE_QUESTIONS: PointChallengeQuestion[] = [
  {
    id: "p1",
    fn: X2,
    pointX: 0,
    correct: "minimum",
    explanation: "f'(x) changes from negative to positive here — the function turns from decreasing to increasing.",
  },
  {
    id: "p2",
    fn: NEG_X2,
    pointX: 0,
    correct: "maximum",
    explanation: "f'(x) changes from positive to negative here — the function turns from increasing to decreasing.",
  },
  {
    id: "p3",
    fn: CUBIC,
    pointX: 1,
    correct: "minimum",
    explanation: "Before x = 1 the function is decreasing; after it, increasing — that's a local minimum.",
  },
  {
    id: "p4",
    fn: CUBIC,
    pointX: 0.3,
    correct: "neither",
    explanation: "f'(0.3) isn't zero here — the curve is just decreasing through this point, not turning.",
  },
];

// --- Mini Practice (Level 9) ------------------------------------------------------

export interface ChallengeQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  {
    id: "q1",
    prompt: "If f'(x) > 0, what is the function generally doing?",
    options: ["Increasing", "Decreasing", "Staying flat", "Undefined"],
    correctIndex: 0,
    explanation: "A positive derivative means the graph is rising as x increases.",
  },
  {
    id: "q2",
    prompt: "If f'(x) < 0, what is the function generally doing?",
    options: ["Increasing", "Decreasing", "Staying flat", "Undefined"],
    correctIndex: 1,
    explanation: "A negative derivative means the graph is falling as x increases.",
  },
  {
    id: "q3",
    prompt: "What can a point where f'(x) = 0 represent?",
    options: ["A critical point", "A vertical asymptote", "A hole", "The y-intercept"],
    correctIndex: 0,
    explanation: "A critical point occurs where the derivative is zero (or undefined).",
  },
  {
    id: "q4",
    prompt: "If the derivative changes from positive to negative, what type of turning point can occur?",
    options: ["Local minimum", "Local maximum", "Vertical asymptote", "Discontinuity"],
    correctIndex: 1,
    explanation: "Increasing then decreasing is exactly the sign change at a local maximum.",
  },
];
