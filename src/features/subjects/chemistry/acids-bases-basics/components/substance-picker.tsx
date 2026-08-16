"use client";

import { cn } from "@/lib/utils";
import { CLASSIFICATION_COLOR, SUBSTANCES, type Substance } from "../acids-bases-model";

interface SubstancePickerProps {
  selected: string[];
  compareMode: boolean;
  onSelect: (substance: Substance) => void;
}

export function SubstancePicker({ selected, compareMode, onSelect }: SubstancePickerProps) {
  return (
    <div
      role="group"
      aria-label="Choose a substance"
      className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5"
    >
      {SUBSTANCES.map((substance) => {
        const isSelected = selected.includes(substance.slug);
        return (
          <button
            key={substance.slug}
            type="button"
            onClick={() => onSelect(substance)}
            aria-pressed={isSelected}
            className={cn(
              "flex flex-col items-start gap-2 rounded-card border p-3 text-left transition-colors",
              "border-line dark:border-line-dark",
              isSelected
                ? "border-transparent bg-white dark:bg-white/[0.06]"
                : "bg-white/40 hover:border-ink/25 dark:bg-white/[0.02] dark:hover:border-bone/25"
            )}
            style={isSelected ? { boxShadow: `0 0 0 2px ${CLASSIFICATION_COLOR[substance.classification]}` } : undefined}
          >
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: CLASSIFICATION_COLOR[substance.classification] }}
            />
            <span className="font-display text-sm font-medium leading-snug text-ink dark:text-bone">
              {substance.name}
            </span>
          </button>
        );
      })}
      {compareMode ? (
        <p className="col-span-full text-xs text-ink-soft dark:text-bone-soft">
          Pick up to two substances to compare them.
        </p>
      ) : null}
    </div>
  );
}
