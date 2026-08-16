"use client";

import { cn } from "@/lib/utils";
import { REACTIONS } from "../model";
import type { ReactionSlug } from "../types";

interface ReactionPickerProps {
  selected: ReactionSlug;
  onSelect: (slug: ReactionSlug) => void;
}

export function ReactionPicker({ selected, onSelect }: ReactionPickerProps) {
  return (
    <div role="group" aria-label="Choose a reaction" className="flex flex-wrap gap-2">
      {REACTIONS.map((reaction) => {
        const isSelected = reaction.slug === selected;
        return (
          <button
            key={reaction.slug}
            type="button"
            onClick={() => onSelect(reaction.slug)}
            aria-pressed={isSelected}
            className={cn(
              "rounded-full border px-3.5 py-1.5 font-mono text-sm font-medium transition-colors",
              "border-line dark:border-line-dark",
              isSelected
                ? "border-transparent bg-pine-600 text-paper dark:bg-pine-300 dark:text-chalkboard"
                : "bg-white/40 text-ink-soft hover:border-ink/25 dark:bg-white/[0.02] dark:text-bone-soft dark:hover:border-bone/25",
            )}
          >
            {reaction.label}
          </button>
        );
      })}
    </div>
  );
}
