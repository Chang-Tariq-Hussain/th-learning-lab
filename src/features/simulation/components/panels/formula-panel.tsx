import { Sigma } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormulaPanelProps {
  title?: string;
  className?: string;
  /** Typically one or more `FormulaCard` / `FormulaExplanation` components. */
  children: React.ReactNode;
}

/**
 * Panel chrome for formula content — pairs with `FormulaCard`,
 * `FormulaExplanation`, and `VariableTable`, which handle the actual
 * KaTeX rendering. Kept as a separate component so a panel can hold
 * multiple formulas (e.g. a formula plus a rearranged form).
 */
export function FormulaPanel({ title = "Formula", className, children }: FormulaPanelProps) {
  return (
    <section
      className={cn(
        "rounded-card border border-line bg-white/50 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5",
        className
      )}
    >
      <h3 className="mb-4 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">
        <Sigma className="h-3.5 w-3.5" strokeWidth={2} />
        {title}
      </h3>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}
