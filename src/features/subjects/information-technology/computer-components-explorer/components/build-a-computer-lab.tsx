"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BUILD_SLOTS, type BuildSlotId } from "../model";

export function BuildAComputerLab() {
  const [picks, setPicks] = useState<Partial<Record<BuildSlotId, string>>>({});

  const requiredSlots = BUILD_SLOTS.filter((s) => s.required).map((s) => s.id);
  const allRequiredCompatible = requiredSlots.every((slotId) => {
    const slot = BUILD_SLOTS.find((s) => s.id === slotId)!;
    const pickId = picks[slotId];
    const option = slot.options.find((o) => o.id === pickId);
    return option?.compatible === true;
  });
  const allRequiredPicked = requiredSlots.every((slotId) => picks[slotId]);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Choose a part for each slot. CPU, RAM, storage, and a power supply are required; a dedicated GPU is optional.
        Not every real-world compatibility rule is modeled here — this checks the ideas that matter most for a
        beginner.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {BUILD_SLOTS.map((slot) => {
          const pickId = picks[slot.id];
          const option = slot.options.find((o) => o.id === pickId);
          return (
            <div key={slot.id} className="rounded-card border border-line p-4 dark:border-line-dark">
              <p className="font-mono text-xs uppercase tracking-wide text-subject-it">
                {slot.label}
                {!slot.required && <span className="text-ink-soft dark:text-bone-soft"> · optional</span>}
              </p>
              <div className="mt-2 flex flex-col gap-2">
                {slot.options.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setPicks((p) => ({ ...p, [slot.id]: o.id }))}
                    className={cn(
                      "rounded-md border px-3 py-2 text-left text-sm transition-colors",
                      pickId === o.id
                        ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
                        : "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              {option && (
                <p
                  className={cn(
                    "mt-2 flex items-start gap-1.5 text-xs",
                    option.compatible ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                  )}
                >
                  {option.compatible ? <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" /> : <X className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
                  {option.note}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {allRequiredPicked && (
        <div
          className={cn(
            "rounded-card border p-4 text-sm",
            allRequiredCompatible
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300"
          )}
        >
          {allRequiredCompatible
            ? "This build is compatible. Every required slot has a part that fits."
            : "This build has an incompatibility. Check the flagged part(s) above before continuing."}
        </div>
      )}
    </div>
  );
}
