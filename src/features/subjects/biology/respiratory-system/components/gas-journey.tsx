"use client";

import { ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { JOURNEYS } from "../respiratory-model";
import type { GasId } from "../types";

interface GasJourneyProps {
  gas: GasId | null;
  step: number;
  onSelect: (gas: GasId) => void;
  onNext: () => void;
  onRestart: () => void;
}

const GAS_STYLE: Record<GasId, string> = {
  o2: "border-rose-400 bg-rose-500 text-white dark:border-rose-500",
  co2: "border-sky-400 bg-sky-500 text-white dark:border-sky-500",
};

export function GasJourney({ gas, step, onSelect, onNext, onRestart }: GasJourneyProps) {
  const journey = gas ? JOURNEYS[gas] : null;
  const complete = journey ? step >= journey.steps.length : false;

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Gas Journeys</p>

      <div className="mt-3 flex justify-center gap-2">
        {(["o2", "co2"] as GasId[]).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              gas === id
                ? GAS_STYLE[id]
                : "border-ink/15 text-ink-soft hover:border-ink/30 hover:text-ink dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/30 dark:hover:text-bone"
            )}
          >
            {JOURNEYS[id].label}
          </button>
        ))}
      </div>

      {journey ? (
        <div className="mt-3">
          <ol className="flex flex-wrap items-center justify-center gap-1.5">
            {journey.steps.map((s, i) => (
              <li key={s.label} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                    i < step || complete
                      ? GAS_STYLE[journey.id]
                      : i === step
                        ? "border-ink/40 text-ink dark:border-bone/40 dark:text-bone"
                        : "border-ink/10 text-ink-soft/60 dark:border-bone/15 dark:text-bone-soft/50"
                  )}
                >
                  {s.label}
                </span>
                {i < journey.steps.length - 1 ? <ChevronRight className="h-3 w-3 text-ink-soft/40 dark:text-bone-soft/40" strokeWidth={1.75} /> : null}
              </li>
            ))}
          </ol>

          <p className="mt-3 min-h-[2.5rem] text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
            {complete ? journey.summary : journey.steps[step]!.caption}
          </p>

          <div className="mt-2 flex justify-center gap-2">
            {complete ? (
              <Button variant="ghost" size="sm" onClick={onRestart}>
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
                Restart
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={onNext}>
                {step === journey.steps.length - 1 ? "Finish" : "Next"}
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-3 min-h-[2.5rem] text-center text-xs leading-relaxed text-ink-soft dark:text-bone-soft">
          Choose a gas to trace its journey through the body.
        </p>
      )}
    </div>
  );
}
