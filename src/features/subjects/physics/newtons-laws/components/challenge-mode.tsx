"use client";

import { Button } from "@/components/ui/button";
import { ControlPanel } from "@/features/simulation";
import { cn } from "@/lib/utils";
import { CheckCircle2, Lightbulb, Target, XCircle } from "lucide-react";
import { useState } from "react";
import {
  cartChallenges,
  law3Challenges,
  predictionPrompts,
} from "../challenges";
import type { Law3Readouts } from "../law3-engine";
import type { CartReadouts } from "../physics";

export interface ChallengeModeProps {
  activeLaw: 1 | 2 | 3;
  cartReadouts: CartReadouts;
  law3Readouts: Law3Readouts;
}

export function ChallengeMode({
  activeLaw,
  cartReadouts,
  law3Readouts,
}: ChallengeModeProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [result, setResult] = useState<"success" | "fail" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [revealedPredictions, setRevealedPredictions] = useState<Set<string>>(
    new Set(),
  );

  const isLaw3 = activeLaw === 3;
  const cartChallenge = cartChallenges.find((c) => c.id === activeId);
  const law3Challenge = law3Challenges.find((c) => c.id === activeId);

  const select = (id: string) => {
    setActiveId(id === activeId ? null : id);
    setResult(null);
    setShowHint(false);
  };

  const check = () => {
    if (cartChallenge)
      setResult(cartChallenge.check(cartReadouts) ? "success" : "fail");
    else if (law3Challenge)
      setResult(law3Challenge.check(law3Readouts) ? "success" : "fail");
  };

  const togglePrediction = (id: string) => {
    setRevealedPredictions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const list = isLaw3 ? law3Challenges : cartChallenges;
  const active = cartChallenge ?? law3Challenge;

  return (
    <ControlPanel title="Challenge mode">
      <div className="flex items-start gap-2 text-sm text-ink-soft dark:text-bone-soft">
        <Target
          className="mt-0.5 h-4 w-4 shrink-0 text-pine-600 dark:text-pine-300"
          strokeWidth={1.75}
        />
        <p>Pick an objective, adjust the controls, then check your result.</p>
      </div>

      <div className="flex flex-col gap-2">
        {list.map((challenge) => (
          <button
            key={challenge.id}
            type="button"
            onClick={() => select(challenge.id)}
            className={cn(
              "rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
              activeId === challenge.id
                ? "border-pine-500 bg-pine-50 text-pine-900 dark:border-pine-300 dark:bg-pine-900/30 dark:text-pine-50"
                : "border-line text-ink hover:border-ink/30 dark:border-line-dark dark:text-bone dark:hover:border-bone/30",
            )}
          >
            <span className="font-medium">{challenge.title}</span>
            <span className="mt-0.5 block text-xs text-ink-soft dark:text-bone-soft">
              {challenge.description}
            </span>
          </button>
        ))}
      </div>

      {active ? (
        <div className="flex flex-col gap-3 rounded-lg border border-line p-3 dark:border-line-dark">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={check}>
              Check my result
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowHint((v) => !v)}
            >
              {showHint ? "Hide hint" : "Show hint"}
            </Button>
          </div>

          {showHint ? (
            <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
              {active.hint}
            </p>
          ) : null}

          {result ? (
            <div
              role="status"
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                result === "success"
                  ? "bg-subject-chemistry-soft text-subject-chemistry dark:bg-subject-chemistry/10"
                  : "bg-subject-physics-soft text-subject-physics dark:bg-subject-physics/10",
              )}
            >
              {result === "success" ? (
                <>
                  <CheckCircle2
                    className="h-4 w-4 shrink-0"
                    strokeWidth={1.75}
                  />
                  Objective met — nice work.
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  Not quite — adjust the controls and try again.
                </>
              )}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-2 border-t border-line pt-4 dark:border-line-dark">
        <div className="flex items-start gap-2 text-sm text-ink-soft dark:text-bone-soft">
          <Lightbulb
            className="mt-0.5 h-4 w-4 shrink-0 text-pine-600 dark:text-pine-300"
            strokeWidth={1.75}
          />
          <p>Predict before you run it:</p>
        </div>
        {predictionPrompts.map((prompt) => {
          const revealed = revealedPredictions.has(prompt.id);
          return (
            <div
              key={prompt.id}
              className="rounded-lg border border-line p-3 dark:border-line-dark"
            >
              <p className="text-sm text-ink dark:text-bone">
                {prompt.question}
              </p>
              <button
                type="button"
                onClick={() => togglePrediction(prompt.id)}
                className="mt-2 text-xs font-medium text-pine-600 underline-offset-2 hover:underline dark:text-pine-300"
              >
                {revealed ? "Hide answer" : "Reveal answer"}
              </button>
              {revealed ? (
                <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
                  {prompt.reveal}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </ControlPanel>
  );
}
