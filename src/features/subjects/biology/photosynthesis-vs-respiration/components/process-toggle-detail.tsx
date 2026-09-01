"use client";

import { PROCESS_DETAILS } from "../model";
import type { ProcessKey } from "../types";

export interface ProcessToggleDetailProps {
  selected: ProcessKey;
  onSelect: (key: ProcessKey) => void;
}

const TOGGLE_ORDER: ProcessKey[] = ["photosynthesis", "respiration"];

const DETAIL_ROWS: Array<{ label: string; field: "inputs" | "outputs" | "energy" | "organelle" | "purpose" }> = [
  { label: "Inputs", field: "inputs" },
  { label: "Outputs", field: "outputs" },
  { label: "Energy", field: "energy" },
  { label: "Organelle", field: "organelle" },
  { label: "Purpose", field: "purpose" },
];

/**
 * "Click: [Photosynthesis] [Cellular Respiration], then reveal
 * Inputs / Outputs / Energy / Organelle / Purpose" — exactly the
 * brief's spec, built as two toggle buttons and one detail card
 * rather than a new interaction framework.
 */
export function ProcessToggleDetail({ selected, onSelect }: ProcessToggleDetailProps) {
  const detail = PROCESS_DETAILS[selected];

  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" aria-label="Choose a process to explore" className="flex justify-center gap-2">
        {TOGGLE_ORDER.map((key) => {
          const isSelected = key === selected;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`process-detail-${key}`}
              onClick={() => onSelect(key)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-chalkboard ${
                isSelected
                  ? "bg-pine-600 text-paper dark:bg-pine-500 dark:text-chalkboard"
                  : "border border-ink/15 text-ink dark:border-bone/20 dark:text-bone hover:border-ink/40 dark:hover:border-bone/40"
              }`}
            >
              {PROCESS_DETAILS[key].label}
            </button>
          );
        })}
      </div>

      <div
        id={`process-detail-${selected}`}
        role="tabpanel"
        className="rounded-[1.75rem] border border-line bg-white/70 p-6 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04]"
      >
        <h3 className="font-display text-lg font-medium text-ink dark:text-bone">{detail.label}</h3>
        <dl className="mt-4 flex flex-col gap-3">
          {DETAIL_ROWS.map((row) => (
            <div key={row.field} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="w-32 shrink-0 font-mono text-[11px] uppercase tracking-wide text-subject-biology">
                {row.label}
              </dt>
              <dd className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{detail[row.field]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
