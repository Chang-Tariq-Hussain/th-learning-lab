import { FormulaCard } from "./formula-card";
import { VariableTable } from "./variable-table";
import { cn } from "@/lib/utils";
import type { FormulaVariable } from "../../types";

export interface FormulaExplanationProps {
  formula: string;
  caption?: string;
  /** Plain-language description of what the formula means and when it applies. */
  explanation: string;
  variables?: FormulaVariable[];
  className?: string;
}

/**
 * The common "here's the equation, here's what it means, here's what
 * each symbol stands for" block, composed from `FormulaCard` +
 * `VariableTable`. Use this directly, or compose the pieces yourself for
 * a custom layout.
 */
export function FormulaExplanation({
  formula,
  caption,
  explanation,
  variables,
  className,
}: FormulaExplanationProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <FormulaCard formula={formula} caption={caption} />
      <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{explanation}</p>
      {variables && variables.length > 0 ? <VariableTable variables={variables} /> : null}
    </div>
  );
}
