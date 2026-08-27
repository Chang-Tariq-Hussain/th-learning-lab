"use client";

import { cn } from "@/lib/utils";
import type { Mode } from "../model";

const OPTIONS: { id: Mode; label: string }[] = [
  { id: "factors", label: "Find Factors" },
  { id: "multiples", label: "Find Multiples" },
];

export function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (next: Mode) => void }) {
  return (
    <div
      role="radiogroup"
      aria-label="Mode"
      className="flex items-center gap-1 rounded-full border border-line bg-white/70 p-1 dark:border-line-dark dark:bg-white/[0.04]"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={mode === option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            mode === option.id
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
