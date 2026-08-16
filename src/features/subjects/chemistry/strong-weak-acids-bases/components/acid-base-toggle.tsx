"use client";

import { cn } from "@/lib/utils";
import type { Species } from "../types";

interface AcidBaseToggleProps {
  species: Species;
  onSelect: (species: Species) => void;
}

export function AcidBaseToggle({ species, onSelect }: AcidBaseToggleProps) {
  return (
    <div role="group" aria-label="Choose acids or bases" className="inline-flex rounded-full border border-line bg-white/40 p-1 dark:border-line-dark dark:bg-white/[0.02]">
      {(["acid", "base"] as const).map((option) => {
        const isSelected = option === species;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            aria-pressed={isSelected}
            className={cn(
              "rounded-full px-4 py-1.5 font-mono text-sm font-medium capitalize transition-colors",
              isSelected
                ? "bg-pine-600 text-paper dark:bg-pine-300 dark:text-chalkboard"
                : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone",
            )}
          >
            {option === "acid" ? "Acids" : "Bases"}
          </button>
        );
      })}
    </div>
  );
}
