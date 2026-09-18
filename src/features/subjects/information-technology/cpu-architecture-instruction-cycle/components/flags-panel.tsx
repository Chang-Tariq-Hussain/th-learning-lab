"use client";

import { cn } from "@/lib/utils";
import type { Flags } from "../model";

const FLAG_LABELS: { key: keyof Flags; label: string }[] = [
  { key: "zero", label: "Zero" },
  { key: "negative", label: "Negative" },
  { key: "carry", label: "Carry" },
  { key: "overflow", label: "Overflow" },
];

export interface FlagsPanelProps {
  flags: Flags;
  previous?: Flags;
  className?: string;
}

export function FlagsPanel({ flags, previous, className }: FlagsPanelProps) {
  return (
    <div className={cn("rounded-card border border-line bg-paper p-4 dark:border-line-dark dark:bg-chalkboard", className)}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subject-it">Status / Flags</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {FLAG_LABELS.map(({ key, label }) => {
          const on = flags[key];
          const changed = previous ? previous[key] !== on : false;
          return (
            <div
              key={key}
              className={cn(
                "flex flex-col items-center rounded-xl border px-2 py-2",
                on ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/20" : "border-line dark:border-line-dark",
                changed && "ring-2 ring-subject-it/50",
              )}
            >
              <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{label}</span>
              <span className={cn("font-mono text-sm font-semibold", on ? "text-subject-it" : "text-ink dark:text-bone")}>{on ? 1 : 0}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
