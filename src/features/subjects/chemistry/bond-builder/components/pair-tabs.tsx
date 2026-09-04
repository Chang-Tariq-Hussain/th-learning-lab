"use client";

import { cn } from "@/lib/utils";

interface PairOption {
  id: string;
  label: string;
  formula: string;
}

interface PairTabsProps {
  options: PairOption[];
  selectedId: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

/**
 * Secondary selector, below the Ionic/Covalent mode tabs: which
 * specific atom pair to bond. Lets a single mode show more than one
 * example — Na+Cl vs Mg+O for ionic (1 vs 2 transferred electrons),
 * H2 vs O2 vs N2 for covalent (single/double/triple bond order) —
 * instead of the simulation being locked to one fixed pair per mode.
 */
export function PairTabs({ options, selectedId, onChange, disabled = false }: PairTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Atom pair"
      className="flex flex-wrap gap-1 rounded-full border border-line p-1 dark:border-line-dark"
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="tab"
          aria-selected={selectedId === option.id}
          disabled={disabled}
          onClick={() => onChange(option.id)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
            selectedId === option.id
              ? "bg-subject-chemistry text-white"
              : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone"
          )}
        >
          {option.formula}
        </button>
      ))}
    </div>
  );
}
