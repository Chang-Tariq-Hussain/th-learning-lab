"use client";

import { useCallback, useState } from "react";
import { Quiz } from "@/features/quiz-engine/quiz";
import type { QuizQuestion } from "@/features/quiz-engine/types";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";
import { PracticeConfigScreen } from "./components/practice-config-screen";
import { getPracticeSubjects, getTopicOptionsForSubject, selectPracticeQuestions } from "./question-bank";
import { ALL_TOPICS_VALUE, type PracticeConfig } from "./types";

/** Where "Back to Learning" sends a student once a round is over. */
const BACK_TO_LEARNING_HREF = "/dashboard";

interface ActiveRound {
  config: PracticeConfig;
  questions: QuizQuestion[];
  /** Bumped on every "Practice Again" so `<Quiz key={roundKey} />` remounts with a fresh `useQuiz` instance instead of resuming old state. */
  roundKey: number;
}

/**
 * Practice Mode's top-level client component: configuration screen →
 * hand a randomized question set to the existing `<Quiz />` → results.
 * This is the only place Practice Mode owns any state; question
 * selection lives in `question-bank.ts` and the actual quiz-taking UI
 * is entirely the Quiz Engine's, untouched.
 */
export function PracticeSession() {
  const [subjects] = useState(() => getPracticeSubjects());
  const [round, setRound] = useState<ActiveRound | null>(null);
  const [lastConfig, setLastConfig] = useState<PracticeConfig | undefined>(undefined);

  const startRound = useCallback((config: PracticeConfig, roundKey: number) => {
    const selection = selectPracticeQuestions(config);
    setRound({ config, questions: selection.questions, roundKey });
    setLastConfig(config);
  }, []);

  function handleStart(config: PracticeConfig) {
    startRound(config, Date.now());
  }

  function handlePracticeAgain() {
    if (!round) return;
    // Re-select from the question bank rather than reusing `round.questions`,
    // so a new random draw (and a new option order) is possible each time.
    startRound(round.config, round.roundKey + 1);
  }

  function handleChangeTopic() {
    setRound(null);
  }

  if (subjects.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-ink/15 p-10 text-center dark:border-bone/20">
        <p className="text-sm text-ink-soft dark:text-bone-soft">
          No practice questions are available yet — check back soon.
        </p>
      </div>
    );
  }

  if (!round) {
    return <PracticeConfigScreen subjects={subjects} initialConfig={lastConfig} onStart={handleStart} />;
  }

  const subject = subjects.find((candidate) => candidate.slug === round.config.subjectSlug);
  const topicOption = subject
    ? getTopicOptionsForSubject(subject).find((candidate) => candidate.slug === round.config.topicSlug)
    : undefined;
  const topicLabel =
    topicOption?.label ?? (round.config.topicSlug === ALL_TOPICS_VALUE ? "All Topics" : "Practice");
  const colorToken = subject?.colorToken ?? "physics";
  const colors = resolveSubjectColors(colorToken);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${colors.text}`}>
        {subject?.label ?? "Practice"} · {topicLabel}
      </p>

      <Quiz
        key={round.roundKey}
        quizId={`practice-${round.config.subjectSlug}-${round.config.topicSlug}-${round.roundKey}`}
        questions={round.questions}
        subjectLabel={subject?.label ?? ""}
        topicLabel={topicLabel}
        colorToken={colorToken}
        backHref={BACK_TO_LEARNING_HREF}
        backLabel="Back to Learning"
        resultsTitle="Practice Complete!"
        retryLabel="Practice Again"
        onRetryOverride={handlePracticeAgain}
        secondaryAction={{ label: "Change Topic", onClick: handleChangeTopic }}
      />
    </div>
  );
}
