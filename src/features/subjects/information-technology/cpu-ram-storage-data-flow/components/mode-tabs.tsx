"use client";

import { cn } from "@/lib/utils";
import { MODES, type ModeId } from "../model";

export function ModeTabs({ active, onSelect }: { active: ModeId; onSelect: (id: ModeId) => void }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Simulation mode">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            role="tab"
            aria-selected={mode.id === active}
            onClick={() => onSelect(mode.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              mode.id === active
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30"
            )}
          >
            {mode.shortLabel}
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm text-ink-soft dark:text-bone-soft">{MODES.find((m) => m.id === active)?.description}</p>
    </div>
  );
}
