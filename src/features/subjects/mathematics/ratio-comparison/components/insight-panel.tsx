"use client";

import { CheckCircle2, Sparkles, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { simplifyRatio } from "../ratio-utils";
import type { RatioTarget } from "../challenges";

export interface InsightPanelProps {
  aA: number;
  bA: number;
  aB: number;
  bB: number;
  equivalent: boolean;
  challenge: RatioTarget | null;
  celebrating: boolean;
  onStartPractice: () => void;
  onNewChallenge: () => void;
  onStopPractice: () => void;
}

export function InsightPanel({
  aA,
  bA,
  aB,
  bB,
  equivalent,
  challenge,
  celebrating,
  onStartPractice,
  onNewChallenge,
  onStopPractice,
}: InsightPanelProps) {
  const simplifiedA = simplifyRatio(aA, bA);
  const simplifiedB = simplifyRatio(aB, bB);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      {challenge && (
        <div
          role="status"
          className={cn(
            "flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-colors duration-300",
            celebrating
              ? "bg-subject-chemistry-soft text-subject-chemistry dark:bg-subject-chemistry/15"
              : "bg-subject-math-soft text-subject-math dark:bg-subject-math/15",
          )}
        >
          {celebrating ? (
            <>
              <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={2} />
              Equivalent — nice work!
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 shrink-0" strokeWidth={2} />
              Adjust Ratio B until it&apos;s equivalent to Ratio A.
            </>
          )}
        </div>
      )}

      <div className="rounded-[1.75rem] border border-line bg-white/70 p-5 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          {equivalent ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-subject-chemistry" strokeWidth={2} />
          ) : (
            <XCircle className="h-5 w-5 shrink-0 text-ink-soft/50 dark:text-bone-soft/50" strokeWidth={2} />
          )}
          <p className="font-display text-lg font-medium text-ink dark:text-bone">
            {equivalent ? "These ratios are equivalent" : "These ratios are not equivalent"}
          </p>
        </div>

        {equivalent ? (
          <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
            <strong className="font-semibold text-ink dark:text-bone">
              {aA} : {bA}
            </strong>{" "}
            and{" "}
            <strong className="font-semibold text-ink dark:text-bone">
              {aB} : {bB}
            </strong>{" "}
            both simplify to{" "}
            <strong className="font-semibold text-subject-math">
              {simplifiedA.a} : {simplifiedA.b}
            </strong>
            . Even though the numbers are different, both describe the same relationship between the two
            quantities — that&apos;s why their bars split at exactly the same spot.
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
            <strong className="font-semibold text-ink dark:text-bone">
              {aA} : {bA}
            </strong>{" "}
            simplifies to{" "}
            <strong className="font-semibold text-subject-math">
              {simplifiedA.a} : {simplifiedA.b}
            </strong>
            , but{" "}
            <strong className="font-semibold text-ink dark:text-bone">
              {aB} : {bB}
            </strong>{" "}
            simplifies to{" "}
            <strong className="font-semibold text-subject-math">
              {simplifiedB.a} : {simplifiedB.b}
            </strong>
            . Different simplest forms mean different relationships — that&apos;s why the bars split at
            different spots.
          </p>
        )}
      </div>

      <div className="rounded-[1.75rem] border border-line bg-white/70 p-5 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:p-6">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft dark:text-bone-soft">
          Practice
        </p>
        {!challenge ? (
          <>
            <p className="mb-4 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
              Get a random Ratio A, then adjust Ratio B to match it.
            </p>
            <Button size="sm" onClick={onStartPractice}>
              Start a challenge
            </Button>
          </>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={onNewChallenge}>
              New challenge
            </Button>
            <Button size="sm" variant="ghost" onClick={onStopPractice}>
              Stop
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
