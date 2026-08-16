/**
 * Calculus Foundations — data model.
 *
 * Reuses the shared coordinate math (grid bounds, pixel<->world
 * conversion) from Coordinate Plane Explorer's `coordinate-model.ts`,
 * same pattern as Slope of a Line and Distance Between Two Points.
 * This file adds only what's specific to this activity: the small set
 * of function-machine functions, the "approaching a value" step
 * sequence, the fixed piecewise/hole examples used to teach limits
 * and continuity, and the mini-challenge question bank.
 */

import { GRID_MAX, GRID_MIN } from "../coordinate-plane-explorer/coordinate-model";

// --- Function machine ---------------------------------------------------------

export type FunctionId = "x" | "x2" | "2x1" | "x3";

export interface FunctionDef {
  id: FunctionId;
  label: string;
  /** KaTeX source for the function definition, e.g. "f(x) = x^2". */
  latex: string;
  evaluate: (x: number) => number;
  /** The x-range this function is explored over — kept narrow enough that f(x) stays on the shared -10..10 grid. */
  domainMin: number;
  domainMax: number;
  defaultX: number;
}

export const FUNCTIONS: FunctionDef[] = [
  {
    id: "x",
    label: "f(x) = x",
    latex: "f(x) = x",
    evaluate: (x) => x,
    domainMin: -9,
    domainMax: 9,
    defaultX: 3,
  },
  {
    id: "x2",
    label: "f(x) = x²",
    latex: "f(x) = x^2",
    evaluate: (x) => x * x,
    domainMin: -3,
    domainMax: 3,
    defaultX: 2,
  },
  {
    id: "2x1",
    label: "f(x) = 2x + 1",
    latex: "f(x) = 2x + 1",
    evaluate: (x) => 2 * x + 1,
    domainMin: -4.5,
    domainMax: 4.5,
    defaultX: 2,
  },
  {
    id: "x3",
    label: "f(x) = x³",
    latex: "f(x) = x^3",
    evaluate: (x) => x * x * x,
    domainMin: -2,
    domainMax: 2,
    defaultX: 1.5,
  },
];

export function getFunction(id: FunctionId): FunctionDef {
  return FUNCTIONS.find((f) => f.id === id) ?? FUNCTIONS[0]!;
}

/** Rounds to 3 decimals and trims trailing zeros, e.g. 4, 3.5, 2.001 — never "-0". */
export function formatValue(n: number): string {
  const rounded = Math.round((n + 0) * 1000) / 1000;
  const safe = Object.is(rounded, -0) ? 0 : rounded;
  if (Number.isInteger(safe)) return String(safe);
  return safe
    .toFixed(3)
    .replace(/0+$/, "")
    .replace(/\.$/, "");
}

// --- Approaching a value --------------------------------------------------

/** Successive distances from the target — each step halves-then-decimates the gap, matching the brief's 3, 2.5, 2.1, 2.01, 2.001 pattern. */
export const APPROACH_DISTANCES = [1, 0.5, 0.1, 0.01, 0.001];

export function approachX(target: number, distance: number, direction: "left" | "right"): number {
  return direction === "left" ? target - distance : target + distance;
}

/** Whether two values are close enough to call the two-sided limit "the same". */
export function valuesConverge(a: number, b: number): boolean {
  return Math.abs(a - b) < 0.02;
}

// --- Limit Explorer default example: lim x->2 of x^2 = 4 ------------------

export const LIMIT_TARGET = 2;
export const LIMIT_FUNCTION = getFunction("x2");

// --- Left/right approach: one simple jump discontinuity --------------------

export const JUMP_TARGET = 2;

/** A single jump discontinuity at x = 2 — left piece approaches 4, right piece approaches 1, so the two-sided limit does not exist. */
export function jumpLeftPiece(x: number): number {
  return x + 2;
}
export function jumpRightPiece(x: number): number {
  return x - 1;
}
export const JUMP_DOMAIN_MIN = -2;
export const JUMP_DOMAIN_MAX = 5;

// --- Continuity: continuous vs. discontinuous example -----------------------

export const CONTINUOUS_EXAMPLE = getFunction("x2");

// --- Hole in a graph: one removable discontinuity ---------------------------

/** f(x) = (x^2 - 4) / (x - 2), which simplifies to x + 2 everywhere except x = 2, where it's undefined — a hole at (2, 4). */
export const HOLE_TARGET = 2;
export const HOLE_VALUE = 4;
export function holeFunction(x: number): number {
  return x + 2;
}
export const HOLE_DOMAIN_MIN = -2;
export const HOLE_DOMAIN_MAX = 5;

// --- Calculus connection bridge ---------------------------------------------

export const BRIDGE_STAGES: { label: string; done: boolean }[] = [
  { label: "Functions", done: true },
  { label: "Graphs", done: true },
  { label: "Limits", done: true },
  { label: "Continuity", done: true },
  { label: "Derivatives", done: false },
  { label: "Integrals", done: false },
];

// --- Mini challenge -----------------------------------------------------------

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
    prompt: "In a function, what is the input usually represented by?",
    options: ["y", "x", "f", "="],
    correctIndex: 1,
    explanation: "By convention, x is the input and f(x) is the output.",
  },
  {
    id: "q2",
    prompt: "If f(x) = x², what is f(3)?",
    options: ["6", "3", "9", "12"],
    correctIndex: 2,
    explanation: "f(3) = 3² = 9.",
  },
  {
    id: "q3",
    prompt: "What does x → 2 mean?",
    options: [
      "x is getting closer to 2.",
      "x is equal to 2.",
      "x is 2 times bigger.",
      "x is undefined at 2.",
    ],
    correctIndex: 0,
    explanation: "The arrow means x is approaching 2, not necessarily reaching it.",
  },
  {
    id: "q4",
    prompt: "If the left and right sides approach the same value, what can we say about the limit?",
    options: [
      "The limit does not exist.",
      "The limit is undefined.",
      "The limit exists.",
      "The function is discontinuous.",
    ],
    correctIndex: 2,
    explanation: "When both sides agree, the two-sided limit exists and equals that value.",
  },
  {
    id: "q5",
    prompt: "What does a hole in a graph represent?",
    options: [
      "A point where the function is negative.",
      "A missing point where the function may be undefined.",
      "A point where the graph repeats.",
      "The steepest point on the curve.",
    ],
    correctIndex: 1,
    explanation: "A hole marks an x-value the function skips, even though nearby values approach a clear number.",
  },
];

// --- Shared marker colors -----------------------------------------------------

/** Pine-500 — used for the "from the left" approach dot and the primary tracked point. */
export const LEFT_COLOR = "#2F7D68";
/** Amber-600 — used for the "from the right" approach dot. */
export const RIGHT_COLOR = "#D97706";

// Re-exported so components only need to import from this one model file.
export { GRID_MAX, GRID_MIN };
