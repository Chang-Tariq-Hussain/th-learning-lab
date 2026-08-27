"use client";

import { cn } from "@/lib/utils";
import type { Operation } from "../model";

const OPTIONS: { id: Operation; label: string }[] = [
  { id: "add", label: "+ Add" },
  { id: "subtract", label: "− Subtract" },
];

export function OperationToggle({
  operation,
  onChange,
}: {
  operation: Operation;
  onChange: (next: Operation) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Operation"
      className="flex items-center gap-1 rounded-full border border-line bg-white/70 p-1 dark:border-line-dark dark:bg-white/[0.04]"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={operation === option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            operation === option.id
              ? "bg-subject-math text-white dark:bg-subject-math dark:text-chalkboard"
              : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
