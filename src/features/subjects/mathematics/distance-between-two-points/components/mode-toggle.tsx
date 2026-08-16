"use client";

import { cn } from "@/lib/utils";

export type Mode = "explore" | "calculate";

export function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  const options: { key: Mode; label: string }[] = [
    { key: "explore", label: "Explore" },
    { key: "calculate", label: "Calculate" },
  ];

  return (
    <div className="mx-auto flex w-fit gap-1 rounded-full border border-line bg-white/60 p-1 dark:border-line-dark dark:bg-white/[0.03]">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => onChange(option.key)}
          aria-pressed={mode === option.key}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            mode === option.key
              ? "bg-pine-600 text-paper dark:bg-pine-300 dark:text-chalkboard"
              : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
