"use client";

import { useState } from "react";
import { CheckCircle2, Target, XCircle } from "lucide-react";
import { ControlPanel } from "@/features/simulation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { challenges } from "../challenges";
import type { Trajectory } from "../physics";

interface ChallengeModeProps {
  trajectory: Trajectory;
  activeChallengeId: string | null;
  onSelectChallenge: (id: string | null) => void;
}

/**
 * `Button` here is the app's shared UI primitive (`components/ui/button`,
 * re-exported nowhere by the simulation framework) — imported directly
 * since it isn't simulation-specific; only simulation state/canvas/chart
 * pieces come from `@/features/simulation`.
 */
export function ChallengeMode({ trajectory, activeChallengeId, onSelectChallenge }: ChallengeModeProps) {
  const [result, setResult] = useState<"success" | "fail" | null>(null);
  const [showHint, setShowHint] = useState(false);

  const active = challenges.find((c) => c.id === activeChallengeId);

  const select = (id: string) => {
    onSelectChallenge(id === activeChallengeId ? null : id);
    setResult(null);
    setShowHint(false);
  };

  const check = () => {
    if (!active) return;
    setResult(active.check(trajectory) ? "success" : "fail");
  };

  return (
    <ControlPanel title="Challenge mode">
      <div className="flex items-start gap-2 text-sm text-ink-soft dark:text-bone-soft">
        <Target className="mt-0.5 h-4 w-4 shrink-0 text-pine-600 dark:text-pine-300" strokeWidth={1.75} />
        <p>Pick an objective, adjust the controls, then check your shot.</p>
      </div>

      <div className="flex flex-col gap-2">
        {challenges.map((challenge) => (
          <button
            key={challenge.id}
            type="button"
            onClick={() => select(challenge.id)}
            className={cn(
              "rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
              activeChallengeId === challenge.id
                ? "border-pine-500 bg-pine-50 text-pine-900 dark:border-pine-300 dark:bg-pine-900/30 dark:text-pine-50"
                : "border-line text-ink hover:border-ink/30 dark:border-line-dark dark:text-bone dark:hover:border-bone/30"
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
              Check my shot
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setShowHint((v) => !v)}>
              {showHint ? "Hide hint" : "Show hint"}
            </Button>
          </div>

          {showHint ? (
            <p className="text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{active.hint}</p>
          ) : null}

          {result ? (
            <div
              role="status"
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                result === "success"
                  ? "bg-subject-chemistry-soft text-subject-chemistry dark:bg-subject-chemistry/10"
                  : "bg-subject-physics-soft text-subject-physics dark:bg-subject-physics/10"
              )}
            >
              {result === "success" ? (
                <>
                  <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  Objective met — nice shot.
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
    </ControlPanel>
  );
}
