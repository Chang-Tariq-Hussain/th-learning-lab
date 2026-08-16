/**
 * Derivative Explorer — data model.
 *
 * Reuses the shared coordinate math and the generic `FunctionGraph`
 * plotter straight from Calculus Foundations (same grid, same pixel
 * mapping, same component — not a second graph engine), plus its
 * `formatValue`/`APPROACH_DISTANCES`/marker-color constants. This
 * file adds only what's specific to derivatives: the two functions
 * with known derivatives, secant/tangent line construction, and the
 * mini-challenge question bank.
 */

import type { GraphSegment } from "../calculus-foundations/components/function-graph";

export type { GraphSegment };

export interface DerivativeFunctionDef {
  id: "x2" | "x3";
  label: string;
  latex: string;
  derivativeLatex: string;
  evaluate: (x: number) => number;
  derivative: (x: number) => number;
  domainMin: number;
  domainMax: number;
  defaultX: number;
}

export const DERIVATIVE_FUNCTIONS: DerivativeFunctionDef[] = [
  {
    id: "x2",
    label: "f(x) = x²",
    latex: "f(x) = x^2",
    derivativeLatex: "f'(x) = 2x",
    evaluate: (x) => x * x,
    derivative: (x) => 2 * x,
    domainMin: -3,
    domainMax: 3,
    defaultX: 1,
  },
  {
    id: "x3",
    label: "f(x) = x³",
    latex: "f(x) = x^3",
    derivativeLatex: "f'(x) = 3x^2",
    evaluate: (x) => x * x * x,
    derivative: (x) => 3 * x * x,
    domainMin: -2,
    domainMax: 2,
    defaultX: 1,
  },
];

export function getDerivativeFunction(id: DerivativeFunctionDef["id"]): DerivativeFunctionDef {
  return DERIVATIVE_FUNCTIONS.find((f) => f.id === id) ?? DERIVATIVE_FUNCTIONS[0]!;
}

/** Builds a straight-line graph segment through (x0, y0) with the given slope, reusing the curve-plotting machinery for lines too. */
export function lineSegment(x0: number, y0: number, slope: number, from: number, to: number, color?: string): GraphSegment {
  return { evaluate: (x) => y0 + slope * (x - x0), from, to, color };
}

/** Average rate of change (secant slope) between two x-values. */
export function secantSlope(fn: DerivativeFunctionDef, x1: number, x2: number): number {
  if (x1 === x2) return fn.derivative(x1);
  return (fn.evaluate(x2) - fn.evaluate(x1)) / (x2 - x1);
}

// --- Sign of the derivative (Level 7) ---------------------------------------

export type DerivativeSign = "negative" | "zero" | "positive";

export function signOf(slope: number): DerivativeSign {
  if (Math.abs(slope) < 0.05) return "zero";
  return slope < 0 ? "negative" : "positive";
}

export const SIGN_COPY: Record<DerivativeSign, { badge: string; explanation: string; color: string }> = {
  negative: { badge: "Derivative < 0", explanation: "The function is decreasing.", color: "#DC2626" },
  zero: { badge: "Derivative = 0", explanation: "The function is momentarily flat.", color: "#6B7280" },
  positive: { badge: "Derivative > 0", explanation: "The function is increasing.", color: "#2F7D68" },
};

// --- Shared line colors -------------------------------------------------------

export const POINT_A_COLOR = "#2F7D68";
export const POINT_B_COLOR = "#D97706";
export const SECANT_COLOR = "#D97706";
export const TANGENT_COLOR = "#2563EB";

// --- Position -> velocity (conceptual, Section 11) ---------------------------

/** s(t) = t^2, so v(t) = ds/dt = 2t — the object visibly speeds up, echoing f(x) = x^2 used throughout. */
export function position(t: number): number {
  return t * t;
}
export function velocity(t: number): number {
  return 2 * t;
}
export const VELOCITY_DURATION = 3;

// --- Mini challenge -------------------------------------------------------------

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
    prompt: "What does the slope of a tangent line represent?",
    options: ["Average rate of change", "Instantaneous rate of change", "The function's maximum value", "The y-intercept"],
    correctIndex: 1,
    explanation: "A tangent line touches the curve at one point, so its slope is the rate of change right there.",
  },
  {
    id: "q2",
    prompt: "What happens to the secant line when the two points get closer?",
    options: [
      "It approaches the tangent line.",
      "It becomes vertical.",
      "It disappears.",
      "It stays exactly the same.",
    ],
    correctIndex: 0,
    explanation: "As the gap shrinks, the secant's slope converges to the tangent's slope.",
  },
  {
    id: "q3",
    prompt: "For f(x) = x², what is f'(2)?",
    options: ["2", "4", "6", "8"],
    correctIndex: 1,
    explanation: "f'(x) = 2x, so f'(2) = 2 × 2 = 4.",
  },
  {
    id: "q4",
    prompt: "What does a positive derivative generally indicate?",
    options: ["The function is decreasing.", "The function is flat.", "The function is increasing.", "The function has a hole."],
    correctIndex: 2,
    explanation: "A positive slope means the graph is rising as x increases.",
  },
  {
    id: "q5",
    prompt: "What does a zero derivative indicate at a smooth turning point?",
    options: [
      "The function is undefined there.",
      "The tangent is horizontal.",
      "The function is discontinuous.",
      "The slope is infinite.",
    ],
    correctIndex: 1,
    explanation: "A zero derivative means a horizontal tangent — the graph is momentarily flat.",
  },
];
