/**
 * Chain Rule Explorer — data model.
 *
 * Reuses the shared coordinate math and `FunctionGraph` plotter from
 * Calculus Foundations (same grid, same component, same pattern
 * Derivative Explorer and Derivative Rules already follow), plus
 * `formatValue` and the tangent-line `lineSegment` helper from
 * Derivative Explorer. This file adds only what's specific to the
 * Chain Rule: composite (inner/outer) function definitions with every
 * intermediate latex string the step-by-step panels need, the nested
 * three-layer example, the power-vs-chain comparison, the "choose the
 * method" question bank, and the mini-challenge question bank.
 */

import type { GraphSegment } from "../calculus-foundations/components/function-graph";
import { lineSegment } from "../derivative-explorer/derivative-model";

export type { GraphSegment };
export { formatValue } from "../calculus-foundations/calculus-model";
export { lineSegment };

// --- Composite (inner/outer) functions ---------------------------------------

export interface CompositeFunctionDef {
  id: "a" | "b" | "c";
  /** Short label for pickers, e.g. "(x + 1)²". */
  label: string;
  /** Full definition, e.g. "y = (x + 1)^2". */
  fullLatex: string;

  innerLatex: string; // "x + 1"
  innerLabelLatex: string; // "g(x) = x + 1"
  outerLatex: string; // "u^2"
  outerLabelLatex: string; // "f(u) = u^2"

  evaluateInner: (x: number) => number;
  evaluateOuter: (u: number) => number;
  evaluate: (x: number) => number;

  /** Outer derivative, written in terms of u, e.g. "2u". */
  outerDerivativeLatex: string;
  outerDerivativeAtU: (u: number) => number;
  /** Inner derivative, written in terms of x, e.g. "1". */
  innerDerivativeLatex: string;
  innerDerivative: (x: number) => number;

  multiplyLatex: string; // "2u \cdot 1"
  substituteLatex: string; // "2(x + 1) \cdot 1"
  finalLatex: string; // "2(x + 1)"
  derivative: (x: number) => number;

  domainMin: number;
  domainMax: number;
  defaultX: number;
}

export const COMPOSITE_FUNCTIONS: CompositeFunctionDef[] = [
  {
    id: "a",
    label: "(x + 1)²",
    fullLatex: "y = (x + 1)^2",
    innerLatex: "x + 1",
    innerLabelLatex: "g(x) = x + 1",
    outerLatex: "u^2",
    outerLabelLatex: "f(u) = u^2",
    evaluateInner: (x) => x + 1,
    evaluateOuter: (u) => u * u,
    evaluate: (x) => Math.pow(x + 1, 2),
    outerDerivativeLatex: "2u",
    outerDerivativeAtU: (u) => 2 * u,
    innerDerivativeLatex: "1",
    innerDerivative: () => 1,
    multiplyLatex: "2u \\cdot 1",
    substituteLatex: "2(x + 1) \\cdot 1",
    finalLatex: "2(x + 1)",
    derivative: (x) => 2 * (x + 1),
    domainMin: -4,
    domainMax: 2,
    defaultX: 0,
  },
  {
    id: "b",
    label: "(2x + 3)⁴",
    fullLatex: "y = (2x + 3)^4",
    innerLatex: "2x + 3",
    innerLabelLatex: "g(x) = 2x + 3",
    outerLatex: "u^4",
    outerLabelLatex: "f(u) = u^4",
    evaluateInner: (x) => 2 * x + 3,
    evaluateOuter: (u) => Math.pow(u, 4),
    evaluate: (x) => Math.pow(2 * x + 3, 4),
    outerDerivativeLatex: "4u^3",
    outerDerivativeAtU: (u) => 4 * u * u * u,
    innerDerivativeLatex: "2",
    innerDerivative: () => 2,
    multiplyLatex: "4u^3 \\cdot 2",
    substituteLatex: "4(2x + 3)^3 \\cdot 2",
    finalLatex: "8(2x + 3)^3",
    derivative: (x) => 8 * Math.pow(2 * x + 3, 3),
    domainMin: -2.3,
    domainMax: -0.6,
    defaultX: -1,
  },
  {
    id: "c",
    label: "(x² + 1)³",
    fullLatex: "y = (x^2 + 1)^3",
    innerLatex: "x^2 + 1",
    innerLabelLatex: "g(x) = x^2 + 1",
    outerLatex: "u^3",
    outerLabelLatex: "f(u) = u^3",
    evaluateInner: (x) => x * x + 1,
    evaluateOuter: (u) => u * u * u,
    evaluate: (x) => Math.pow(x * x + 1, 3),
    outerDerivativeLatex: "3u^2",
    outerDerivativeAtU: (u) => 3 * u * u,
    innerDerivativeLatex: "2x",
    innerDerivative: (x) => 2 * x,
    multiplyLatex: "3u^2 \\cdot 2x",
    substituteLatex: "3(x^2 + 1)^2 \\cdot 2x",
    finalLatex: "6x(x^2 + 1)^2",
    derivative: (x) => 6 * x * Math.pow(x * x + 1, 2),
    domainMin: -1.2,
    domainMax: 1.2,
    defaultX: 0.8,
  },
];

export function getComposite(id: CompositeFunctionDef["id"]): CompositeFunctionDef {
  return COMPOSITE_FUNCTIONS.find((f) => f.id === id) ?? COMPOSITE_FUNCTIONS[0]!;
}

/** Builds a straight-line graph segment for the tangent line, reusing the same helper Derivative Explorer uses. */
export function tangentSegment(fn: CompositeFunctionDef, x: number, color?: string): GraphSegment {
  return lineSegment(x, fn.evaluate(x), fn.derivative(x), fn.domainMin, fn.domainMax, color);
}

// --- Step-by-step workspace (Level 4): y = (3x^2 + 2)^4 -----------------------

export const WORKSPACE_EXAMPLE: CompositeFunctionDef = {
  id: "a",
  label: "(3x² + 2)⁴",
  fullLatex: "y = (3x^2 + 2)^4",
  innerLatex: "3x^2 + 2",
  innerLabelLatex: "u = 3x^2 + 2",
  outerLatex: "u^4",
  outerLabelLatex: "f(u) = u^4",
  evaluateInner: (x) => 3 * x * x + 2,
  evaluateOuter: (u) => Math.pow(u, 4),
  evaluate: (x) => Math.pow(3 * x * x + 2, 4),
  outerDerivativeLatex: "4u^3",
  outerDerivativeAtU: (u) => 4 * u * u * u,
  innerDerivativeLatex: "6x",
  innerDerivative: (x) => 6 * x,
  multiplyLatex: "4u^3 \\cdot 6x",
  substituteLatex: "24x(3x^2 + 2)^3",
  finalLatex: "24x(3x^2 + 2)^3",
  derivative: (x) => 24 * x * Math.pow(3 * x * x + 2, 3),
  domainMin: -1,
  domainMax: 1,
  defaultX: 0.5,
};

export interface WorkspaceStep {
  title: string;
  subtitle: string;
  latex: string;
}

export function buildWorkspaceSteps(fn: CompositeFunctionDef): WorkspaceStep[] {
  return [
    { title: "Step 1", subtitle: "Identify the inner function.", latex: fn.innerLabelLatex },
    { title: "Step 2", subtitle: "Identify the outer function.", latex: fn.outerLabelLatex },
    { title: "Step 3", subtitle: "Differentiate the outer function.", latex: fn.outerDerivativeLatex },
    { title: "Step 4", subtitle: "Differentiate the inner function.", latex: fn.innerDerivativeLatex },
    { title: "Step 5", subtitle: "Multiply.", latex: fn.multiplyLatex },
    { title: "Step 6", subtitle: "Substitute u back in.", latex: fn.finalLatex },
  ];
}

// --- Chain Rule Visual (Level 3): 5-step animated transformation --------------

export interface ChainStep {
  title: string;
  latex: string;
}

export function buildChainSteps(fn: CompositeFunctionDef): ChainStep[] {
  return [
    { title: "Outer derivative", latex: fn.outerDerivativeLatex },
    { title: "Inner derivative", latex: fn.innerDerivativeLatex },
    { title: "Multiply", latex: fn.multiplyLatex },
    { title: "Replace u", latex: fn.substituteLatex },
    { title: "Final", latex: fn.finalLatex },
  ];
}

// --- Nested functions (Level 6): y = ((x + 1)^2 + 2)^3 -------------------------

export const NESTED_DOMAIN_MIN = -3;
export const NESTED_DOMAIN_MAX = 1.5;
export const NESTED_DEFAULT_X = 0.5;

export function nestedLayer1(x: number): number {
  return x + 1;
}
export function nestedLayer2(x: number): number {
  const v = nestedLayer1(x);
  return v * v + 2;
}
export function nestedLayer3(x: number): number {
  return Math.pow(nestedLayer2(x), 3);
}
/** d/dx of ((x+1)^2 + 2)^3, via the chain rule applied twice. */
export function nestedDerivative(x: number): number {
  const v = nestedLayer1(x);
  const w = nestedLayer2(x);
  return 3 * w * w * (2 * v);
}

// --- Chain Rule vs Power Rule (Level 5) -----------------------------------------

export const POWER_ONLY_LATEX = "y = x^4";
export const POWER_ONLY_DERIVATIVE_LATEX = "y' = 4x^3";
export const CHAIN_COMPARISON_LATEX = "y = (2x + 1)^4";
export const CHAIN_COMPARISON_DERIVATIVE_LATEX = "y' = 8(2x + 1)^3";

export type MethodId = "power" | "chain";

export const METHOD_LABELS: Record<MethodId, string> = {
  power: "Power Rule",
  chain: "Chain Rule",
};

export interface MethodQuestion {
  latex: string;
  correct: MethodId;
  explanation: string;
}

export const METHOD_QUESTIONS: MethodQuestion[] = [
  {
    latex: "y = x^5",
    correct: "power",
    explanation: "The exponent applies directly to x, so the Power Rule alone is enough.",
  },
  {
    latex: "y = (x + 2)^5",
    correct: "chain",
    explanation: "Another expression, x + 2, sits inside the power, so the Chain Rule is needed.",
  },
  {
    latex: "y = (3x^2 + 1)^4",
    correct: "chain",
    explanation: "The power is applied to 3x² + 1, an inner function, so the Chain Rule is needed.",
  },
  {
    latex: "y = x^3 + 2x",
    correct: "power",
    explanation: "Each term has x raised directly to a power, so the Power Rule (with the Sum Rule) is enough.",
  },
];

// --- Mini Challenge -------------------------------------------------------------

export interface ChallengeQuestion {
  id: string;
  prompt: string;
  promptLatex?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  {
    id: "q1",
    prompt: "Is x⁴ a composite function requiring the Chain Rule?",
    options: ["Yes", "No"],
    correctIndex: 1,
    explanation: "The exponent applies directly to x — there's no inner function, so the Power Rule alone is enough.",
  },
  {
    id: "q2",
    prompt: "Is (x + 2)⁴ a composite function?",
    options: ["Yes", "No"],
    correctIndex: 0,
    explanation: "x + 2 sits inside the power, so this is an outer function u⁴ wrapped around an inner function x + 2.",
  },
  {
    id: "q3",
    promptLatex: "y = (x + 1)^2",
    prompt: "Find the derivative.",
    options: ["2(x + 1)", "2x", "(x + 1)", "2x + 1"],
    correctIndex: 0,
    explanation: "Outer derivative 2u times inner derivative 1, then substitute u = x + 1, gives 2(x + 1).",
  },
  {
    id: "q4",
    promptLatex: "y = (2x + 3)^3",
    prompt: "Find the derivative.",
    options: ["6(2x + 3)²", "3(2x + 3)²", "6x(2x + 3)²", "(2x + 3)²"],
    correctIndex: 0,
    explanation: "Outer derivative 3u² times inner derivative 2, then substitute u = 2x + 3, gives 6(2x + 3)².",
  },
  {
    id: "q5",
    promptLatex: "y = (3x^2 + 1)^4",
    prompt: "Identify the inner function.",
    options: ["3x² + 1", "u⁴", "4u³", "x²"],
    correctIndex: 0,
    explanation: "The inner function is whatever sits inside the power: u = 3x² + 1.",
  },
  {
    id: "q6",
    prompt: "What does the Chain Rule combine?",
    options: [
      "The derivative of the outer function and the derivative of the inner function.",
      "The sum of two functions.",
      "The product of two functions' values.",
      "The quotient of two derivatives.",
    ],
    correctIndex: 0,
    explanation: "d/dx[f(g(x))] = f'(g(x)) · g'(x) — the outer derivative times the inner derivative.",
  },
];
