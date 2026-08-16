"use client";

import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import type { FormulaVariable } from "../../types";

export interface VariableTableProps {
  variables: FormulaVariable[];
  className?: string;
}

/** Small reference table mapping each symbol in a formula to its meaning and unit. */
export function VariableTable({ variables, className }: VariableTableProps) {
  return (
    <table className={cn("w-full border-collapse text-sm", className)}>
      <thead>
        <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft dark:border-line-dark dark:text-bone-soft">
          <th className="py-2 pr-3 font-mono font-medium">Symbol</th>
          <th className="py-2 pr-3 font-medium">Meaning</th>
          <th className="py-2 font-medium">Unit</th>
        </tr>
      </thead>
      <tbody>
        {variables.map((variable) => (
          <tr
            key={variable.symbol}
            className="border-b border-line/60 last:border-none dark:border-line-dark/60"
          >
            <td className="py-2 pr-3 font-mono text-ink dark:text-bone">
              <InlineMath math={variable.symbol} />
            </td>
            <td className="py-2 pr-3 text-ink-soft dark:text-bone-soft">{variable.meaning}</td>
            <td className="py-2 font-mono text-xs text-ink-soft dark:text-bone-soft">
              {variable.unit ?? "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
