"use client";

import { useEffect, type ReactNode } from "react";
import { Target } from "lucide-react";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { SectionShell } from "./section-shell";
import { Challenge, type ChallengeAttemptResult } from "./challenge";
import type { ChallengeSectionContent } from "../types";

export interface ChallengeSectionProps {
  subjectSlug: string;
  topicSlug: string;
  colorToken: string;
  content: ChallengeSectionContent;
  /** The topic's live simulation, forwarded to each `Challenge` for
   *  scenarios that need it (see `ChallengeScenario.requiresExperiment`). */
  experiment?: ReactNode;
  className?: string;
}

/**
 * CHALLENGE — the full section: intro copy, a live score readout,
 * and one `Challenge` card per scenario. Completion and score are
 * both derived from `TopicProgress.challengeSolvedIds` against this
 * content's scenario list (via a `useEffect` watching that real,
 * persisted value — not local component bookkeeping — so a topic
 * revisited after some scenarios were already solved in an earlier
 * session still completes correctly instead of requiring a full
 * re-solve in one sitting).
 */
export function ChallengeSection({ subjectSlug, topicSlug, colorToken, content, experiment, className }: ChallengeSectionProps) {
  const { getTopicProgress, recordChallengeAttempt, completeStep } = useLearningProgress();
  const progress = getTopicProgress(subjectSlug, topicSlug);
  const total = content.scenarios.length;
  const solvedCount = content.scenarios.filter((scenario) => progress.challengeSolvedIds.includes(scenario.id)).length;

  useEffect(() => {
    if (total > 0 && solvedCount === total) {
      completeStep(subjectSlug, topicSlug, "challenge");
    }
  }, [solvedCount, total, subjectSlug, topicSlug, completeStep]);

  function handleAttempt(result: ChallengeAttemptResult) {
    recordChallengeAttempt(subjectSlug, topicSlug, result.scenarioId, result.isCorrect);
  }

  return (
    <SectionShell icon={<Target className="h-4 w-4" strokeWidth={1.75} />} label="Challenge" colorToken={colorToken} className={className}>
      {content.intro ? <p className="mb-3 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{content.intro}</p> : null}
      <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">
        Score: {solvedCount}/{total} solved
      </p>
      <div className="flex flex-col gap-4">
        {content.scenarios.map((scenario) => (
          <Challenge
            key={scenario.id}
            scenario={scenario}
            colorToken={colorToken}
            experiment={experiment}
            alreadySolved={progress.challengeSolvedIds.includes(scenario.id)}
            onAttempt={handleAttempt}
          />
        ))}
      </div>
    </SectionShell>
  );
}
