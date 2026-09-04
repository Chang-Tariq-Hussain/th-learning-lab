"use client";

import { useCallback, useMemo, useState } from "react";
import { RotateCcw, ArrowRight as NextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EquationTabs } from "./components/equation-tabs";
import { EquationRow } from "./components/equation-row";
import { AtomCountTable } from "./components/atom-count-table";
import { BalanceStatus } from "./components/balance-status";
import { HintPanel } from "./components/hint-panel";
import {
  EQUATIONS,
  EQUATION_ORDER,
  initialCoefficients,
  isBalanced,
} from "./equation-model";

/**
 * Chemical Equation Balancer — a focused, primarily-2D companion to
 * Reaction Builder. Where Reaction Builder shows *why* an equation
 * stays balanced (atoms physically rearranging, in 3D-adjacent
 * space), this teaches the practical skill: adjust coefficients
 * (never subscripts) until the atom counts on both sides match,
 * across several practice equations.
 *
 * Deliberately owns only two pieces of state — which equation is
 * selected, and that equation's current coefficients — with every
 * derived value (atom counts, balanced/not) computed fresh from
 * `equation-model.ts` on every render rather than cached, since the
 * numbers involved are tiny.
 */
export function EquationBalancer() {
  const [equationId, setEquationId] = useState<string>(EQUATION_ORDER[0]!);
  const equation = EQUATIONS[equationId]!;
  const [coefficients, setCoefficients] = useState<Record<string, number>>(() => initialCoefficients(equation));

  const balanced = useMemo(() => isBalanced(equation, coefficients), [equation, coefficients]);

  const handleEquationChange = useCallback((id: string) => {
    setEquationId(id);
    setCoefficients(initialCoefficients(EQUATIONS[id]!));
  }, []);

  const handleCoefficientChange = useCallback((termId: string, next: number) => {
    setCoefficients((prev) => ({ ...prev, [termId]: next }));
  }, []);

  const handleReset = useCallback(() => {
    setCoefficients(initialCoefficients(equation));
  }, [equation]);

  const handleNextEquation = useCallback(() => {
    const currentIndex = EQUATION_ORDER.indexOf(equationId);
    const nextId = EQUATION_ORDER[(currentIndex + 1) % EQUATION_ORDER.length]!;
    handleEquationChange(nextId);
  }, [equationId, handleEquationChange]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <EquationTabs equationId={equationId} onChange={handleEquationChange} />
      </div>

      <p className="text-center text-sm text-ink-soft dark:text-bone-soft">{equation.description}</p>

      <div className="rounded-card border border-line bg-white/40 p-6 dark:border-line-dark dark:bg-white/[0.02]">
        <EquationRow equation={equation} coefficients={coefficients} onCoefficientChange={handleCoefficientChange} />
      </div>

      <BalanceStatus balanced={balanced} />

      <AtomCountTable equation={equation} coefficients={coefficients} />

      <p className="text-center text-xs italic text-ink-soft/70 dark:text-bone-soft/70">
        Only the number in front of each formula (the coefficient) changes here — the small numbers inside a formula
        (subscripts) are fixed, because changing one would turn it into a different substance entirely.
      </p>

      {!balanced ? <HintPanel hints={equation.hints} /> : null}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="secondary" size="sm" onClick={handleReset}>
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
          Reset
        </Button>
        <Button variant="primary" size="sm" onClick={handleNextEquation}>
          Next Equation
          <NextIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
        </Button>
      </div>
    </div>
  );
}
