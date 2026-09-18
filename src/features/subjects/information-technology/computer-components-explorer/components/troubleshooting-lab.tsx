"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { COMPONENTS, TROUBLESHOOTING_SCENARIOS } from "../model";

export function TroubleshootingLab() {
  const [activeId, setActiveId] = useState(TROUBLESHOOTING_SCENARIOS[0]!.id);
  const [revealed, setRevealed] = useState(false);
  const active = TROUBLESHOOTING_SCENARIOS.find((s) => s.id === activeId)!;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Pick a symptom, think about which components could plausibly be involved, then reveal the areas worth
        investigating. A single symptom rarely has one guaranteed cause.
      </p>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Symptom">
        {TROUBLESHOOTING_SCENARIOS.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={activeId === s.id}
            onClick={() => {
              setActiveId(s.id);
              setRevealed(false);
            }}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              activeId === s.id
                ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft dark:hover:border-bone/30"
            )}
          >
            {s.symptom}
          </button>
        ))}
      </div>

      <div className="rounded-card border border-line p-4 dark:border-line-dark">
        <p className="text-sm font-medium text-ink dark:text-bone">{active.symptom}</p>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="mt-3 inline-flex h-9 items-center rounded-full border border-subject-it bg-subject-it-soft px-4 text-xs font-medium text-subject-it dark:bg-subject-it/20"
          >
            Reveal plausible areas to investigate
          </button>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {active.possibleAreas.map((area) => (
              <div key={area.componentId} className="rounded-md border border-line/70 p-2 dark:border-line-dark/70">
                <p className="text-xs font-semibold text-subject-it">{COMPONENTS[area.componentId].label}</p>
                <p className="text-xs text-ink-soft dark:text-bone-soft">{area.reason}</p>
              </div>
            ))}
            <p className="mt-1 text-xs text-ink-soft dark:text-bone-soft">{active.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
