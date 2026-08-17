"use client";

import { useState } from "react";
import { Quiz } from "./quiz";
import { QuizStartScreen } from "./components/quiz-start-screen";
import type { QuizCompletionResult, QuizMeta } from "./types";

export interface QuizExperienceProps {
  quiz: QuizMeta;
  backLabel?: string;
  onComplete?: (result: QuizCompletionResult) => void;
}

/**
 * Wraps the existing `<Quiz />` with a start screen shown first — the
 * engine itself (`quiz.tsx`, `use-quiz.ts`, results/feedback) is
 * untouched. This is the seam every topic quiz route should render
 * instead of `<Quiz />` directly (see `components/dashboard/topic-quiz-page.tsx`).
 */
export function QuizExperience({ quiz, backLabel = "Back to Topic", onComplete }: QuizExperienceProps) {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <QuizStartScreen
        title={quiz.title}
        subjectLabel={quiz.subjectLabel}
        topicLabel={quiz.topicLabel}
        colorToken={quiz.colorToken}
        description={quiz.description}
        difficulty={quiz.difficulty}
        estimatedTime={quiz.estimatedTime}
        questionCount={quiz.questions.length}
        onStart={() => setStarted(true)}
      />
    );
  }

  return (
    <Quiz
      quizId={quiz.id}
      questions={quiz.questions}
      subjectLabel={quiz.subjectLabel}
      topicLabel={quiz.topicLabel}
      colorToken={quiz.colorToken}
      backHref={quiz.backHref}
      backLabel={backLabel}
      onComplete={onComplete}
    />
  );
}
