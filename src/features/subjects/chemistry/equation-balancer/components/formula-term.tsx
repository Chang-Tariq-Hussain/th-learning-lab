"use client";

import type { EquationTerm } from "../equation-model";
import { CoefficientStepper } from "./coefficient-stepper";

interface FormulaTermProps {
  term: EquationTerm;
  coefficient: number;
  onChange: (next: number) => void;
}

/** One "[– N +]  Formula" block. The formula itself is always plain, unstyled text — there is nothing to click on it, which is the point: only the coefficient changes. */
export function FormulaTerm({ term, coefficient, onChange }: FormulaTermProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-card border border-line bg-white/40 px-4 py-3 dark:border-line-dark dark:bg-white/[0.02]">
      <CoefficientStepper value={coefficient} onChange={onChange} label={term.formula} />
      <span className="font-mono text-xl font-semibold text-ink dark:text-bone">{term.formula}</span>
    </div>
  );
}
