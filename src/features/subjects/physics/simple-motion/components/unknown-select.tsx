"use client";

import { cn } from "@/lib/utils";
import type { UnknownQuantity } from "../motion-model";

interface UnknownSelectProps {
  unknown: UnknownQuantity;
  onChange: (unknown: UnknownQuantity) => void;
  disabled?: boolean;
}

const TABS: { id: UnknownQuantity; label: string }[] = [
  { id: "speed", label: "Speed is unknown" },
  { id: "time", label: "Time is unknown" },
  { id: "distance", label: "Distance is unknown" },
];

/**
 * Segmented control for picking which of Speed/Time/Distance the
 * student is solving for — styled to match the tab bar used elsewhere
 * (e.g. Bond Builder's Ionic/Covalent tabs). Switching tabs just picks
 * a different slot to solve; it doesn't change any slider values.
 */
export function UnknownSelect({
  unknown,
  onChange,
  disabled = false,
}: UnknownSelectProps) {
  return (
    <div
      role="tablist"
      aria-label="Which value should be solved for"
      className="flex w-full flex-wrap justify-center gap-1 rounded-full border border-line p-1 dark:border-line-dark"
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={unknown === tab.id}
          disabled={disabled}
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
            unknown === tab.id
              ? "bg-pine-600 text-paper dark:bg-pine-300 dark:text-chalkboard"
              : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
