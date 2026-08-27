"use client";

import { cn } from "@/lib/utils";
import { OPERATION_LABELS, type Operation } from "../model";

const OPERATIONS: Operation[] = ["add", "subtract", "multiply", "divide"];

export function OperationTabs({ operation, onChange }: { operation: Operation; onChange: (next: Operation) => void }) {
  return (
    <div
      role="tablist"
      aria-label="Fraction operation"
      className="flex flex-wrap items-center justify-center gap-1 rounded-full border border-line bg-white/70 p-1 dark:border-line-dark dark:bg-white/[0.04]"
    >
      {OPERATIONS.map((op) => (
        <button
          key={op}
          type="button"
          role="tab"
          aria-selected={operation === op}
          onClick={() => onChange(op)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            operation === op
              ? "bg-subject-math text-white dark:bg-subject-math dark:text-chalkboard"
              : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone",
          )}
        >
          {OPERATION_LABELS[op]}
        </button>
      ))}
    </div>
  );
}
