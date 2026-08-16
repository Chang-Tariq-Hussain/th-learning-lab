"use client";

import { cn } from "@/lib/utils";
import type { CategoryId } from "../types";

interface BioticToggleProps {
  active: CategoryId | null;
  onSelect: (id: CategoryId | null) => void;
}

const OPTIONS: { id: CategoryId; label: string; caption: string }[] = [
  {
    id: "biotic",
    label: "Biotic",
    caption: "Biotic components are living parts of an ecosystem.",
  },
  {
    id: "abiotic",
    label: "Abiotic",
    caption: "Abiotic components are non-living parts of an ecosystem.",
  },
];

export function BioticToggle({ active, onSelect }: BioticToggleProps) {
  const activeOption = OPTIONS.find((o) => o.id === active) ?? null;

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
        Biotic vs Abiotic
      </p>
      <div className="mt-3 flex justify-center gap-2">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onSelect(active === o.id ? null : o.id)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              active === o.id
                ? "border-subject-biology bg-subject-biology text-paper dark:text-chalkboard"
                : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <p className="mt-3 min-h-[2.5rem] text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
        {activeOption ? activeOption.caption : "Select Biotic or Abiotic to highlight those components on the scene."}
      </p>
    </div>
  );
}
