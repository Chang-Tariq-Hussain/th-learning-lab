"use client";

import { ArrowRight } from "lucide-react";
import type { EquationConfig } from "../equation-model";
import { FormulaTerm } from "./formula-term";

interface EquationRowProps {
  equation: EquationConfig;
  coefficients: Record<string, number>;
  onCoefficientChange: (termId: string, next: number) => void;
}

/** Lays out every reactant term, an arrow, then every product term — the equation itself, fully interactive. */
export function EquationRow({ equation, coefficients, onCoefficientChange }: EquationRowProps) {
  const reactants = equation.terms.filter((t) => t.side === "reactant");
  const products = equation.terms.filter((t) => t.side === "product");

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {reactants.map((term, i) => (
        <div key={term.id} className="flex items-center gap-3">
          {i > 0 ? <span className="text-lg font-medium text-ink-soft dark:text-bone-soft">+</span> : null}
          <FormulaTerm
            term={term}
            coefficient={coefficients[term.id] ?? 1}
            onChange={(next) => onCoefficientChange(term.id, next)}
          />
        </div>
      ))}

      <ArrowRight className="mx-1 h-6 w-6 shrink-0 text-subject-chemistry" strokeWidth={2} />

      {products.map((term, i) => (
        <div key={term.id} className="flex items-center gap-3">
          {i > 0 ? <span className="text-lg font-medium text-ink-soft dark:text-bone-soft">+</span> : null}
          <FormulaTerm
            term={term}
            coefficient={coefficients[term.id] ?? 1}
            onChange={(next) => onCoefficientChange(term.id, next)}
          />
        </div>
      ))}
    </div>
  );
}
