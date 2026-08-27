"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FACTOR_CANDIDATE_MAX, partnerFor } from "../model";

export interface FactorGridProps {
  target: number;
  /** Tiles the student has tapped, correct or not. */
  tried: Set<number>;
  /** Tiles confirmed correct (a subset of `tried`). */
  found: Set<number>;
  onTap: (candidate: number) => void;
}

/** A 1..12 grid of tappable candidate factors. Tapping a true factor
 *  locks it in green and reveals its pair partner (e.g. "3 × 4 = 12");
 *  tapping a non-factor flashes red and resets so it can be retried. */
export function FactorGrid({ target, tried, found, onTap }: FactorGridProps) {
  const candidates = Array.from({ length: FACTOR_CANDIDATE_MAX }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6" role="group" aria-label={`Factors of ${target}`}>
      {candidates.map((candidate) => {
        const isFound = found.has(candidate);
        const isWrongTry = tried.has(candidate) && !isFound;
        return (
          <button
            key={candidate}
            type="button"
            onClick={() => onTap(candidate)}
            disabled={isFound}
            aria-pressed={isFound}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 rounded-2xl border px-2 py-3 text-center transition-colors",
              isFound
                ? "border-subject-chemistry bg-subject-chemistry-soft text-subject-chemistry dark:bg-subject-chemistry/15"
                : isWrongTry
                  ? "border-subject-physics/50 bg-subject-physics/10 text-subject-physics"
                  : "border-line bg-white/70 text-ink hover:border-ink/30 dark:border-line-dark dark:bg-white/[0.04] dark:text-bone dark:hover:border-bone/30",
            )}
          >
            <span className="font-display text-xl font-medium">{candidate}</span>
            {isFound ? (
              <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em]">
                <Check className="h-3 w-3" strokeWidth={2.5} />
                {candidate} × {partnerFor(target, candidate)}
              </span>
            ) : isWrongTry ? (
              <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em]">
                <X className="h-3 w-3" strokeWidth={2.5} />
                not a factor
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
