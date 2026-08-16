"use client";

import { cn } from "@/lib/utils";
import type { BondMode } from "../bond-model";

interface ModeTabsProps {
  mode: BondMode;
  onChange: (mode: BondMode) => void;
  disabled?: boolean;
}

const TABS: { id: BondMode; label: string }[] = [
  { id: "ionic", label: "Ionic Bond" },
  { id: "covalent", label: "Covalent Bond" },
];

/** Simple two-way mode selector, styled to match the tab bar used elsewhere (e.g. Projectile Motion's mode tabs). */
export function ModeTabs({ mode, onChange, disabled = false }: ModeTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Bond type"
      className="flex gap-1 rounded-full border border-line p-1 dark:border-line-dark"
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={mode === tab.id}
          disabled={disabled}
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
            mode === tab.id
              ? "bg-pine-600 text-paper dark:bg-pine-300 dark:text-chalkboard"
              : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
