"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { ClipboardList } from "lucide-react";
import { RulerDivider } from "@/components/ui/ruler-divider";
import { getQuizById } from "@/features/quiz-engine/registry";
import { QuizExperience } from "@/features/quiz-engine/quiz-experience";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { usePracticePerformance } from "@/hooks/use-practice-performance";
import { computeApplicableSteps } from "../mastery";
import type { TopicContent } from "../types";
import { ChallengeSection } from "./challenge-section";
import { ExplainSection } from "./explain-section";
import { ExploreSection } from "./explore-section";
import { LearnSection } from "./learn-section";
import { MasterySection } from "./mastery-section";
import { PredictSection } from "./predict-section";
import { SectionShell } from "./section-shell";
import { TopicJourney } from "./topic-journey";

export interface TopicLearningExperienceProps {
  content: TopicContent;
  /** The live, subject-specific simulation, rendered inside the
   *  Explore step. This is the only piece of the whole experience
   *  that isn't generic — everything else (journey, sections,
   *  progress, mastery) is shared across every subject. */
  simulation: ReactNode;
  className?: string;
}

/**
 * The reusable shell every topic page renders below its header: the
 * step rail, then whichever of LEARN / PREDICT / EXPLORE / EXPLAIN /
 * PRACTICE / CHALLENGE / MASTERY that topic's `TopicContent`
 * defines, in that order. Sections aren't gated or locked in this
 * phase — everything is visible on one page, matching how the
 * existing `SimulationLearnMore` block already renders beneath a
 * simulation — but each section's completion is tracked so the
 * journey rail and mastery section reflect real progress.
 *
 * `content.practice.quizId` is resolved against the *existing* quiz
 * registry (`getQuizById`) — no quiz question data is owned by this
 * component or duplicated here.
 *
 * This is the same component regardless of subject or topic — Simple
 * Motion (the reference implementation) supplies every optional
 * section; a topic that only has Learn + Explore renders a shorter
 * page automatically, with no special-casing here.
 */
export function TopicLearningExperience({ content, simulation, className }: TopicLearningExperienceProps) {
  const { subjectSlug, topicSlug, colorToken } = content;
  const { getTopicProgress, completeStep, recordQuizResult, hydrated } = useLearningProgress();
  const { recordQuizCompletion } = usePracticePerformance();
  const progress = getTopicProgress(subjectSlug, topicSlug);
  const quiz = content.practice ? getQuizById(content.practice.quizId) : undefined;
  const applicableSteps = useMemo(() => computeApplicableSteps(content), [content]);

  // The MASTERY step is the one step this component completes on the
  // student's behalf rather than via a button: once every other
  // applicable step for this topic is done, mark the journey's final
  // step complete automatically. `withStepCompleted` is a no-op (same
  // state reference) once already complete, so this settles after one
  // extra render instead of looping.
  useEffect(() => {
    if (!hydrated) return;
    const otherStepsDone = applicableSteps
      .filter((step) => step !== "mastery")
      .every((step) => progress.stepsCompleted.includes(step));
    if (otherStepsDone && !progress.stepsCompleted.includes("mastery")) {
      completeStep(subjectSlug, topicSlug, "mastery");
    }
  }, [hydrated, applicableSteps, progress.stepsCompleted, subjectSlug, topicSlug, completeStep]);

  return (
    <div className={className}>
      <RulerDivider className="mb-6" />
      <TopicJourney content={content} className="mb-8" />

      <div className="flex flex-col gap-10">
        <LearnSection subjectSlug={subjectSlug} topicSlug={topicSlug} colorToken={colorToken} content={content.learn} />

        {content.predict && content.predict.scenarios.length > 0 ? (
          <>
            <RulerDivider />
            <PredictSection
              subjectSlug={subjectSlug}
              topicSlug={topicSlug}
              colorToken={colorToken}
              content={content.predict}
              experiment={simulation}
            />
          </>
        ) : null}

        <RulerDivider />
        <ExploreSection subjectSlug={subjectSlug} topicSlug={topicSlug} colorToken={colorToken} content={content.explore}>
          {simulation}
        </ExploreSection>

        {content.explain && content.explain.questions.length > 0 ? (
          <>
            <RulerDivider />
            <ExplainSection subjectSlug={subjectSlug} topicSlug={topicSlug} colorToken={colorToken} content={content.explain} />
          </>
        ) : null}

        {quiz ? (
          <>
            <RulerDivider />
            <SectionShell icon={<ClipboardList className="h-4 w-4" strokeWidth={1.75} />} label="Practice" colorToken={colorToken}>
              <div className="mx-auto max-w-2xl">
                <QuizExperience
                  quiz={quiz}
                  onComplete={(result) => {
                    recordQuizResult(subjectSlug, topicSlug, result.percentage / 100);
                    completeStep(subjectSlug, topicSlug, "practice");
                    recordQuizCompletion(result);
                  }}
                />
              </div>
            </SectionShell>
          </>
        ) : null}

        {content.challenge && content.challenge.scenarios.length > 0 ? (
          <>
            <RulerDivider />
            <ChallengeSection
              subjectSlug={subjectSlug}
              topicSlug={topicSlug}
              colorToken={colorToken}
              content={content.challenge}
              experiment={simulation}
            />
          </>
        ) : null}

        <RulerDivider />
        <MasterySection content={content} />
      </div>
    </div>
  );
}
