"use client";

import { cn } from "@/lib/utils";
import { MOLECULE_ORDER, MOLECULES, type MoleculeId } from "../molecule-model";

interface MoleculeTabsProps {
  moleculeId: MoleculeId;
  onChange: (id: MoleculeId) => void;
  disabled?: boolean;
}

/** Simple three-way molecule selector, styled to match Bond Builder's mode tabs. */
export function MoleculeTabs({
  moleculeId,
  onChange,
  disabled = false,
}: MoleculeTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Molecule to build"
      className="flex flex-wrap gap-1 rounded-full border border-line p-1 dark:border-line-dark"
    >
      {MOLECULE_ORDER.map((id) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={moleculeId === id}
          disabled={disabled}
          onClick={() => onChange(id)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
            moleculeId === id
              ? "bg-pine-600 text-paper dark:bg-pine-300 dark:text-chalkboard"
              : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone",
          )}
        >
          {MOLECULES[id].tabLabel}
        </button>
      ))}
    </div>
  );
}
