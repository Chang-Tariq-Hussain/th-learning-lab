"use client";

import type { ReactNode } from "react";
import { BookOpen, ClipboardList, FlaskConical, HelpCircle, MessageCircleQuestion, Target, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { computeApplicableSteps } from "../mastery";
import { STEP_LABELS, type LearningStep, type TopicContent } from "../types";

const STEP_ICON_SIZE = "h-3.5 w-3.5";

const STEP_ICONS: Record<LearningStep, ReactNode> = {
  learn: <BookOpen className={STEP_ICON_SIZE} strokeWidth={1.75} aria-hidden="true" />,
  predict: <HelpCircle className={STEP_ICON_SIZE} strokeWidth={1.75} aria-hidden="true" />,
  explore: <FlaskConical className={STEP_ICON_SIZE} strokeWidth={1.75} aria-hidden="true" />,
  explain: <MessageCircleQuestion className={STEP_ICON_SIZE} strokeWidth={1.75} aria-hidden="true" />,
  practice: <ClipboardList className={STEP_ICON_SIZE} strokeWidth={1.75} aria-hidden="true" />,
  challenge: <Target className={STEP_ICON_SIZE} strokeWidth={1.75} aria-hidden="true" />,
  mastery: <Trophy className={STEP_ICON_SIZE} strokeWidth={1.75} aria-hidden="true" />,
};

export interface TopicJourneyProps {
  content: TopicContent;
  className?: string;
}

/**
 * The LEARN -> ... -> MASTERY step rail. Purely a progress readout —
 * it doesn't gate or lock later sections, it just reflects
 * `TopicProgress.stepsCompleted` (via `useLearningProgress`) against
 * this topic's actual step sequence (via `computeApplicableSteps`, so
 * a topic without a Challenge section shows a shorter rail instead of
 * a permanently-empty step).
 */
export function TopicJourney({ content, className }: TopicJourneyProps) {
  const { getTopicProgress, hydrated } = useLearningProgress();
  const progress = getTopicProgress(content.subjectSlug, content.topicSlug);
  const steps = computeApplicableSteps(content);
  const colors = resolveSubjectColors(content.colorToken);

  // Before hydration, nothing is known to be complete yet — render the
  // same "all upcoming" state the server would, to avoid a hydration
  // mismatch (same pattern as `UserProfileProvider`'s `hydrated` flag).
  const completed = hydrated ? progress.stepsCompleted : [];
  const firstIncompleteIndex = steps.findIndex((step) => !completed.includes(step));

  return (
    <div className={cn("flex flex-wrap items-center gap-y-2", className)} role="list" aria-label="Learning journey">
      {steps.map((step, index) => {
        const done = completed.includes(step);
        const isCurrent = !done && index === firstIncompleteIndex;

        return (
          <div key={step} role="listitem" className="flex items-center">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide whitespace-nowrap transition-colors",
                done
                  ? cn("border-transparent", colors.bg, colors.text)
                  : isCurrent
                    ? cn("border-ink/25 text-ink dark:border-bone/30 dark:text-bone")
                    : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
              )}
            >
              {STEP_ICONS[step]}
              {STEP_LABELS[step]}
            </div>
            {index < steps.length - 1 ? (
              <span className="mx-1.5 h-px w-4 shrink-0 bg-line dark:bg-line-dark sm:w-6" aria-hidden="true" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
