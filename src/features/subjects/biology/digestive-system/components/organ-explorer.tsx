"use client";

import { cn } from "@/lib/utils";
import { ORGANS } from "../digestive-model";
import type { OrganId } from "../types";

interface OrganExplorerProps {
  activeId: OrganId | null;
  onSelect: (id: OrganId | null) => void;
}

export function OrganExplorer({ activeId, onSelect }: OrganExplorerProps) {
  const active = ORGANS.find((o) => o.id === activeId) ?? null;

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
        Organ Explorer
      </p>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {ORGANS.map((organ) => (
          <button
            key={organ.id}
            type="button"
            onClick={() => onSelect(activeId === organ.id ? null : organ.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              activeId === organ.id
                ? "border-subject-biology bg-subject-biology text-paper dark:text-chalkboard"
                : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone",
            )}
          >
            {organ.label}
          </button>
        ))}
      </div>

      <div className="mt-3 min-h-[3.5rem] text-center">
        {active ? (
          <>
            <p className="text-xs font-semibold text-ink dark:text-bone">
              {active.function}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
              {active.explanation}
            </p>
          </>
        ) : (
          <p className="text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
            Click an organ to see what it does.
          </p>
        )}
      </div>
    </div>
  );
}
