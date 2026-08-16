"use client";

import { cn } from "@/lib/utils";
import type { CellKind } from "../types";

export interface CellSwitchProps {
  value: CellKind;
  onChange: (kind: CellKind) => void;
}

const OPTIONS: { kind: CellKind; label: string }[] = [
  { kind: "animal", label: "Animal Cell" },
  { kind: "plant", label: "Plant Cell" },
];

export function CellSwitch({ value, onChange }: CellSwitchProps) {
  return (
    <div role="tablist" aria-label="Cell type" className="flex gap-1 rounded-full border border-line bg-white/60 p-1 dark:border-line-dark dark:bg-white/[0.03]">
      {OPTIONS.map((option) => (
        <button
          key={option.kind}
          type="button"
          role="tab"
          aria-selected={value === option.kind}
          onClick={() => onChange(option.kind)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            value === option.kind
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
