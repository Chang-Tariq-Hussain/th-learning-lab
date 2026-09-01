"use client";

import { cn } from "@/lib/utils";
import type { Mode } from "../types";

export interface ModeTabsProps {
  value: Mode;
  onChange: (mode: Mode) => void;
}

const OPTIONS: { mode: Mode; label: string }[] = [
  { mode: "diffusion", label: "Diffusion" },
  { mode: "osmosis", label: "Osmosis" },
  { mode: "active-transport", label: "Active Transport" },
];

export function ModeTabs({ value, onChange }: ModeTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Transport type"
      className="flex flex-wrap justify-center gap-1 rounded-full border border-line bg-white/60 p-1 dark:border-line-dark dark:bg-white/[0.03]"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.mode}
          type="button"
          role="tab"
          aria-selected={value === option.mode}
          onClick={() => onChange(option.mode)}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-medium transition-colors",
            value === option.mode
              ? "bg-subject-biology text-white dark:text-chalkboard"
              : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
