"use client";

import { cn } from "@/lib/utils";
import type { Mode } from "../types";

interface ModeToggleProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

const OPTIONS: { id: Mode; label: string }[] = [
  { id: "chain", label: "Food Chain" },
  { id: "web", label: "Food Web" },
];

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex justify-center gap-2">
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            mode === o.id
              ? "border-subject-biology bg-subject-biology text-paper dark:text-chalkboard"
              : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
