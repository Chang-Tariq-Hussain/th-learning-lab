"use client";

import { cn } from "@/lib/utils";
import type { WaveMode } from "../wave-model";

interface WaveModeToggleProps {
  mode: WaveMode;
  onChange: (mode: WaveMode) => void;
}

const TABS: { id: WaveMode; label: string }[] = [
  { id: "transverse", label: "Transverse" },
  { id: "longitudinal", label: "Longitudinal" },
];

export function WaveModeToggle({ mode, onChange }: WaveModeToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Wave type"
      className="mx-auto flex w-fit gap-1 rounded-full border border-line p-1 dark:border-line-dark"
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={mode === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-medium transition-colors",
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
