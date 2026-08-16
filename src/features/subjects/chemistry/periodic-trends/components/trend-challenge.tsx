"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { TRENDS, pickChallengePair, type ChallengePair, type TrendId } from "../periodic-trends-model";

interface TrendChallengeProps {
  trend: TrendId;
}

export function TrendChallenge({ trend }: TrendChallengeProps) {
  const [pair, setPair] = useState<ChallengePair>(() => pickChallengePair(trend));
  const [pairTrend, setPairTrend] = useState<TrendId>(trend);
  const [pick, setPick] = useState<"a" | "b" | null>(null);

  // If the selected trend changes, refresh the question to match it.
  if (pairTrend !== trend) {
    setPairTrend(trend);
    setPair(pickChallengePair(trend));
    setPick(null);
  }

  const meta = TRENDS[trend];
  const isCorrect = pick !== null && pick === pair.correct;

  const next = () => {
    setPair(pickChallengePair(trend));
    setPick(null);
  };

  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <p className="font-display text-base font-medium text-ink dark:text-bone">Trend Challenge</p>
        <button
          type="button"
          onClick={next}
          className="inline-flex items-center gap-1 text-xs font-medium text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
          New question
        </button>
      </div>

      <p className="mt-2 text-sm text-ink-soft dark:text-bone-soft">
        Which element has {meta.comparativeWord} {meta.shortLabel.toLowerCase()}?
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {(["a", "b"] as const).map((key) => {
          const el = pair[key];
          const chosen = pick === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setPick(key)}
              disabled={pick !== null}
              className={cn(
                "rounded-card border px-3 py-3 text-center transition-colors",
                "border-line dark:border-line-dark",
                chosen && isCorrect && "border-pine-500 bg-pine-50 dark:border-pine-300 dark:bg-pine-900/20",
                chosen && !isCorrect && "border-red-400 bg-red-50 dark:border-red-400/60 dark:bg-red-900/10",
                pick === null && "hover:border-ink/30 dark:hover:border-bone/30"
              )}
            >
              <span className="block font-display text-lg font-semibold text-ink dark:text-bone">{el.symbol}</span>
              <span className="block text-xs text-ink-soft dark:text-bone-soft">{el.name}</span>
            </button>
          );
        })}
      </div>

      {pick !== null ? (
        <p
          className={cn(
            "mt-3 text-sm font-medium",
            isCorrect ? "text-pine-600 dark:text-pine-300" : "text-red-600 dark:text-red-400"
          )}
        >
          {isCorrect ? "✓ Correct!" : meta.mistakeExplanation}
        </p>
      ) : null}
    </div>
  );
}
