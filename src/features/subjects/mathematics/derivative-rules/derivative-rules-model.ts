/**
 * Derivative Rules — data model.
 *
 * Reuses `formatValue` and the shared `FunctionGraph` coordinate math
 * from Calculus Foundations (same pattern Derivative Explorer follows).
 * This file adds only what's specific to this activity: small "term"
 * helpers for building f(x) = c·xⁿ style pieces and their derivatives,
 * the fixed worked examples for each rule, the rule-selector question
 * bank, and the mini-practice question bank.
 */

export { formatValue } from "../calculus-foundations/calculus-model";

// --- Power terms: c·x^n, the building block for every rule on this page ------------

export interface PowerTerm {
  /** Coefficient — its sign is what determines whether this term reads as "+" or "−" when it isn't first. */
  c: number;
  /** Exponent. */
  n: number;
}

export function termLatex(t: PowerTerm, leading = true): string {
  const sign = leading ? (t.c < 0 ? "-" : "") : t.c < 0 ? "- " : "+ ";
  const c = Math.abs(t.c);
  const coeff = c === 1 && t.n !== 0 ? "" : String(c);
  if (t.n === 0) return `${sign}${c}`;
  if (t.n === 1) return `${sign}${coeff}x`;
  return `${sign}${coeff}x^{${t.n}}`;
}

/** The power-rule derivative of a single c·xⁿ term: c·n·x^(n-1). */
export function derivativeOfTerm(t: PowerTerm): PowerTerm {
  return { c: t.c * t.n, n: Math.max(0, t.n - 1) };
}

export function evaluateTerm(t: PowerTerm, x: number): number {
  return t.c * Math.pow(x, t.n);
}

// --- Section 1: Constant Rule ---------------------------------------------------------

export const CONSTANT_OPTIONS = [2, 5, 10, 20];

// --- Section 2: Power Rule (the main section) ------------------------------------------

export const POWER_RULE_EXPONENTS = [2, 3, 4, 5];

// --- Section 3: Constant Multiple Rule --------------------------------------------------

export const CONSTANT_MULTIPLE_EXAMPLES: PowerTerm[] = [
  { c: 2, n: 2 },
  { c: 3, n: 2 },
  { c: 5, n: 3 },
  { c: 7, n: 4 },
];

// --- Section 4: Sum & Difference Rule ----------------------------------------------------

export interface SumExample {
  label: string;
  terms: [PowerTerm, PowerTerm];
}

export const SUM_EXAMPLES: SumExample[] = [
  {
    label: "Addition",
    terms: [
      { c: 1, n: 2 },
      { c: 1, n: 3 },
    ],
  },
  {
    label: "Subtraction",
    terms: [
      { c: 1, n: 3 },
      { c: -1, n: 2 },
    ],
  },
];

// --- Section 5: Step-by-step differentiation ---------------------------------------------

export const STEP_BY_STEP_TERMS: PowerTerm[] = [
  { c: 3, n: 3 },
  { c: 2, n: 2 },
  { c: -5, n: 1 },
  { c: 7, n: 0 },
];

// --- Sections 6 & 7: Product Rule & Quotient Rule -----------------------------------------

export const UV_EXAMPLE = {
  u: { c: 1, n: 2 } as PowerTerm, // x^2
  v: [
    { c: 1, n: 1 },
    { c: 1, n: 0 },
  ] as [PowerTerm, PowerTerm], // x + 1
};

export const U_LATEX = "x^2";
export const U_PRIME_LATEX = "2x";
export const V_LATEX = "x + 1";
export const V_PRIME_LATEX = "1";

// --- Section 8: Rule Selector -------------------------------------------------------------

export type RuleId =
  | "constant"
  | "power"
  | "constant-multiple"
  | "sum"
  | "product"
  | "quotient";

export const RULE_LABELS: Record<RuleId, string> = {
  constant: "Constant Rule",
  power: "Power Rule",
  "constant-multiple": "Constant Multiple",
  sum: "Sum Rule",
  product: "Product Rule",
  quotient: "Quotient Rule",
};

export interface RuleSelectorQuestion {
  latex: string;
  correct: RuleId;
}

export const RULE_SELECTOR_QUESTIONS: RuleSelectorQuestion[] = [
  { latex: "f(x) = 5", correct: "constant" },
  { latex: "f(x) = x^3", correct: "power" },
  { latex: "f(x) = 4x^2", correct: "constant-multiple" },
  { latex: "f(x) = x^2 + x", correct: "sum" },
  { latex: "f(x) = x^2(x + 1)", correct: "product" },
  { latex: "f(x) = \\dfrac{x^2}{x + 1}", correct: "quotient" },
];

// --- Mini Practice -------------------------------------------------------------------------

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
    prompt: "f(x) = 7. Find f'(x).",
    options: ["0", "7", "1", "7x"],
    correctIndex: 0,
    explanation: "A constant never changes, so its rate of change — and its derivative — is 0.",
  },
  {
    id: "q2",
    prompt: "f(x) = x³. Find f'(x).",
    options: ["x²", "3x", "3x²", "2x³"],
    correctIndex: 2,
    explanation: "Power Rule: bring the exponent down as a coefficient, then subtract 1 from it. 3x^(3-1) = 3x².",
  },
  {
    id: "q3",
    prompt: "f(x) = 4x². Find f'(x).",
    options: ["4x", "8x", "2x", "8x²"],
    correctIndex: 1,
    explanation: "Constant Multiple Rule: keep the 4 in front, then apply the power rule to x². 4 · 2x = 8x.",
  },
  {
    id: "q4",
    prompt: "f(x) = x³ + x². Find f'(x).",
    options: ["3x² + 2x", "3x + 2x", "x² + x", "3x² + x"],
    correctIndex: 0,
    explanation: "Sum Rule: differentiate each term separately, then add the results. 3x² + 2x.",
  },
  {
    id: "q5",
    promptLatex: "f(x) = x^2(x + 1)",
    prompt: "Which rule is needed for f(x) = x²(x + 1)?",
    options: ["Sum Rule", "Product Rule", "Quotient Rule", "Power Rule"],
    correctIndex: 1,
    explanation: "This is two functions multiplied together, x² and (x + 1), so it needs the Product Rule.",
  },
  {
    id: "q6",
    promptLatex: "f(x) = \\dfrac{x^2}{x + 1}",
    prompt: "Which rule is needed for f(x) = x² / (x + 1)?",
    options: ["Product Rule", "Sum Rule", "Quotient Rule", "Constant Rule"],
    correctIndex: 2,
    explanation: "This is one function divided by another, so it needs the Quotient Rule.",
  },
];
