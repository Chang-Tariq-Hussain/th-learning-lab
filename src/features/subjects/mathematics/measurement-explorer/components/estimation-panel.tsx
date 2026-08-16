"use client";

import { QuizPanel } from "../../statistics-foundations/components/quiz-panel";
import { ESTIMATION_QUESTIONS } from "../measurement-model";

/**
 * Level 8 — Estimation. Reuses the shared `QuizPanel`: pick the best
 * estimate, then the explanation reveals the actual approximate
 * measurement — the same "select, get feedback, move on" flow as
 * every other quiz in the platform.
 */
export function EstimationPanel() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <p className="text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        You don&apos;t always need an exact number right away — a reasonable estimate is a great place to start.
      </p>
      <QuizPanel questions={ESTIMATION_QUESTIONS} restartLabel="Try Again" />
    </div>
  );
}
