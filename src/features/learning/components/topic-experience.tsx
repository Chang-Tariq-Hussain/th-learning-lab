"use client";

import { useState, type ReactNode } from "react";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import type { TopicContent } from "../types";
import { TopicLearningExperience } from "./topic-learning-experience";
import { TopicModeSwitch, type TopicMode } from "./topic-mode-switch";

export interface TopicExperienceProps {
  content: TopicContent;
  /** The live, subject-specific simulation. Rendered once — the same
   *  element instance is handed to whichever mode is active, so
   *  Quick Explore and Learn & Master always share one simulation,
   *  never two separate implementations. */
  simulation: ReactNode;
  /** Forwarded to `TopicLearningExperience` — see its props of the
   *  same names. Only relevant in Learn & Master mode; Quick Explore
   *  doesn't render Challenge at all. */
  challengeExperimentOverrides?: Record<string, ReactNode>;
  challengeVerifiers?: Record<string, () => boolean>;
  className?: string;
}

/**
 * The two-experience-mode shell every topic page with Golden Learning
 * Experience content renders instead of calling
 * `TopicLearningExperience` directly.
 *
 * Quick Explore preserves the *original* topic experience — short
 * notes + simulation + controls — by reusing `SimulationLearnMore`
 * fed directly from `content.learn` / `content.explore`. Those two
 * sections already carry the same objectives/concepts/how-to-use/
 * why-it-matters/try-this shape `SimulationLearnMore` was built
 * around, so this doesn't invent or duplicate any content — it's the
 * same authored data the Learn and Explore steps already use, just
 * rendered as one lightweight block instead of a guided, step-tracked
 * journey.
 *
 * Learn & Master is the existing `TopicLearningExperience`,
 * unmodified.
 *
 * The selected mode is local, transient UI state — it is never
 * persisted and never touches `useLearningProgress`, so switching
 * back and forth can't reset or fake-complete any step, mastery, or
 * Learning Path progress. Quick Explore in particular never calls
 * `completeStep`, so browsing it never marks any Golden Learning step
 * complete.
 */
export function TopicExperience({
  content,
  simulation,
  challengeExperimentOverrides,
  challengeVerifiers,
  className,
}: TopicExperienceProps) {
  const [mode, setMode] = useState<TopicMode>("quick");

  return (
    <div className={className}>
      <TopicModeSwitch mode={mode} onChange={setMode} colorToken={content.colorToken} className="mb-8" />

      {mode === "quick" ? (
        <div className="flex flex-col gap-6">
          {simulation}
          <SimulationLearnMore
            colorToken={content.colorToken}
            objectives={content.learn.objectives}
            concepts={content.learn.concepts}
            howToUse={content.explore.howToUse}
            whyItMatters={content.learn.whyItMatters}
            tryThis={content.explore.tryThis}
            className="mt-0"
          />
        </div>
      ) : (
        <TopicLearningExperience
          content={content}
          simulation={simulation}
          challengeExperimentOverrides={challengeExperimentOverrides}
          challengeVerifiers={challengeVerifiers}
        />
      )}
    </div>
  );
}
