"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EquationConfig } from "../equation-model";
import { countAtoms, usedElements } from "../equation-model";

interface AtomCountTableProps {
  equation: EquationConfig;
  coefficients: Record<string, number>;
}

/**
 * The table that directly teaches conservation of atoms: for every
 * element in the equation, how many atoms the current coefficients
 * put on each side, and whether those two totals match. This is
 * deliberately the same "before/after" idea as Reaction Builder's
 * `AtomCounter`, just recomputed live as the student changes
 * coefficients instead of being fixed by the reaction.
 */
export function AtomCountTable({ equation, coefficients }: AtomCountTableProps) {
  const elements = usedElements(equation);

  return (
    <div className="overflow-hidden rounded-card border border-line dark:border-line-dark">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line bg-ink/[0.02] dark:border-line-dark dark:bg-bone/[0.03]">
            <th className="px-4 py-2 text-left font-medium uppercase tracking-wide text-[11px] text-ink-soft dark:text-bone-soft">
              Element
            </th>
            <th className="px-4 py-2 text-center font-medium uppercase tracking-wide text-[11px] text-ink-soft dark:text-bone-soft">
              Reactants
            </th>
            <th className="px-4 py-2 text-center font-medium uppercase tracking-wide text-[11px] text-ink-soft dark:text-bone-soft">
              Products
            </th>
            <th className="px-4 py-2 text-center font-medium uppercase tracking-wide text-[11px] text-ink-soft dark:text-bone-soft">
              Match?
            </th>
          </tr>
        </thead>
        <tbody>
          {elements.map((element) => {
            const left = countAtoms(equation, element, "reactant", coefficients);
            const right = countAtoms(equation, element, "product", coefficients);
            const matches = left === right;
            return (
              <tr key={element} className="border-b border-line last:border-b-0 dark:border-line-dark">
                <td className="px-4 py-2 font-mono font-medium text-ink dark:text-bone">{element}</td>
                <td className="px-4 py-2 text-center font-mono text-ink dark:text-bone">{left}</td>
                <td className="px-4 py-2 text-center font-mono text-ink dark:text-bone">{right}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-center">
                    {matches ? (
                      <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
                    ) : (
                      <X className={cn("h-4 w-4 text-red-500/70 dark:text-red-400/70")} strokeWidth={2.5} />
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
