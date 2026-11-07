"use client";

import { Compass, GitCompare, Puzzle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CellMode } from "../types";

export const MODES: { mode: CellMode; label: string; blurb: string; Icon: typeof Compass }[] = [
  { mode: "explore", label: "Explore", blurb: "Tap any part of the cell to learn about it.", Icon: Compass },
  { mode: "identify", label: "Identify", blurb: "Find the named structure in the cell.", Icon: Search },
  { mode: "function", label: "Function", blurb: "Match a highlighted structure to its job.", Icon: Puzzle },
  { mode: "compare", label: "Compare", blurb: "See what plant and animal cells share, and what they don't.", Icon: GitCompare },
];

export interface ModeTabsProps {
  value: CellMode;
  onChange: (mode: CellMode) => void;
  /** id of the element the selected tab controls. */
  panelId: string;
}

/** Four activity tabs with arrow-key navigation (roving tabindex), so keyboard users move between them as a single stop. */
export function ModeTabs({ value, onChange, panelId }: ModeTabsProps) {
  const move = (delta: number, from: number) => {
    const next = MODES[(from + delta + MODES.length) % MODES.length]!;
    onChange(next.mode);
    requestAnimationFrame(() => document.getElementById(`cell-mode-tab-${next.mode}`)?.focus());
  };
  return (
    <div role="tablist" aria-label="Activity" className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-white/60 p-1 dark:border-line-dark dark:bg-white/[0.03] sm:grid-cols-4">
      {MODES.map(({ mode, label, Icon }, i) => {
        const on = value === mode;
        return (
          <button
            key={mode}
            id={`cell-mode-tab-${mode}`}
            type="button"
            role="tab"
            aria-selected={on}
            aria-controls={panelId}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(mode)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") (e.preventDefault(), move(1, i));
              else if (e.key === "ArrowLeft") (e.preventDefault(), move(-1, i));
              else if (e.key === "Home") (e.preventDefault(), move(-i, i));
              else if (e.key === "End") (e.preventDefault(), move(MODES.length - 1 - i, i));
            }}
            className={cn(
              "flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink dark:focus-visible:outline-bone",
              on ? "bg-subject-biology text-white dark:text-chalkboard" : "text-ink-soft hover:bg-ink/[0.04] hover:text-ink dark:text-bone-soft dark:hover:bg-bone/[0.06] dark:hover:text-bone",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
