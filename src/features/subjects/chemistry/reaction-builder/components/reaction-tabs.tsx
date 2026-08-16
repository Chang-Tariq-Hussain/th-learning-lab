"use client";

import { cn } from "@/lib/utils";
import { REACTION_ORDER, REACTIONS, type ReactionId } from "../reaction-model";

interface ReactionTabsProps {
  reactionId: ReactionId;
  onChange: (id: ReactionId) => void;
}

/** Simple reaction selector, styled to match Molecule Builder's molecule tabs. */
export function ReactionTabs({ reactionId, onChange }: ReactionTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Reaction to build"
      className="flex flex-wrap gap-1 rounded-full border border-line p-1 dark:border-line-dark"
    >
      {REACTION_ORDER.map((id) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={reactionId === id}
          onClick={() => onChange(id)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
            reactionId === id
              ? "bg-pine-600 text-paper dark:bg-pine-300 dark:text-chalkboard"
              : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone",
          )}
        >
          {REACTIONS[id].name}
        </button>
      ))}
    </div>
  );
}
