"use client";

import { cn } from "@/lib/utils";
import { NUTRIENTS } from "../digestive-model";
import type { NutrientId } from "../types";

interface NutrientTypesProps {
  activeId: NutrientId | null;
  onSelect: (id: NutrientId | null) => void;
}

export function NutrientTypes({ activeId, onSelect }: NutrientTypesProps) {
  const active = NUTRIENTS.find((n) => n.id === activeId) ?? null;

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
        Nutrient Types
      </p>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {NUTRIENTS.map((nutrient) => (
          <button
            key={nutrient.id}
            type="button"
            onClick={() =>
              onSelect(activeId === nutrient.id ? null : nutrient.id)
            }
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              activeId === nutrient.id
                ? "border-subject-biology bg-subject-biology text-paper dark:text-chalkboard"
                : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone",
            )}
          >
            {nutrient.label}
          </button>
        ))}
      </div>

      <p className="mt-3 min-h-[2.5rem] text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        {active
          ? active.explanation
          : "Click a nutrient to see what it's used for."}
      </p>
    </div>
  );
}
