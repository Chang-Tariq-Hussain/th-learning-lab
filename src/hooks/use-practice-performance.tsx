"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { UNTAGGED_CONCEPT } from "@/features/practice-mode/mastery-types";
import type { PracticePerformanceState, QuestionAttemptRecord, TopicMasterySummary } from "@/features/practice-mode/mastery-types";
import { computeTopicMasterySummary } from "@/features/practice-mode/mastery";
import {
  clearPerformanceState,
  readPerformanceState,
  withAttemptsRecorded,
  writePerformanceState,
} from "@/features/practice-mode/performance-store";
import type { QuizCompletionResult } from "@/features/quiz-engine/types";

interface PracticePerformanceContextValue {
  /** false during the first render/SSR pass — same `hydrated` pattern
   *  `UserProfileProvider` and `LearningProgressProvider` already
   *  use, so performance-derived UI never mismatch-flashes between
   *  server and client. */
  hydrated: boolean;
  /** Every recorded attempt, oldest first — the raw material the
   *  Practice Engine's adaptive selector reads. Most UI should prefer
   *  `getTopicMastery` instead of reading this directly. */
  attempts: QuestionAttemptRecord[];
  getTopicMastery: (subjectSlug: string, topicSlug: string) => TopicMasterySummary;
  /** Records one finished quiz/practice round. Derives one
   *  `QuestionAttemptRecord` per answered question straight from the
   *  Quiz Engine's own `QuizCompletionResult` — no separate
   *  performance-tracking question format, and no engine changes:
   *  this is exactly the `onComplete` seam `quiz-engine/README.md`
   *  already documents as the intended persistence hook. */
  recordQuizCompletion: (result: QuizCompletionResult) => void;
  resetPerformance: () => void;
}

const PracticePerformanceContext = createContext<PracticePerformanceContextValue | null>(null);

/**
 * Local (no backend, no auth) Practice Engine performance tracking,
 * backed by localStorage via `@/features/practice-mode/performance-store`.
 * Mount once near the root (see `layout.tsx`), alongside
 * `UserProfileProvider` and `LearningProgressProvider`.
 *
 * Public API note: every method here takes plain strings/the Quiz
 * Engine's own `QuizCompletionResult` and returns plain data — no
 * caller reaches into localStorage or the state shape directly.
 * That's what makes this swappable for a server-backed implementation
 * later without changing any call site.
 */
export function PracticePerformanceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PracticePerformanceState>({ version: 1, attempts: [] });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readPerformanceState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writePerformanceState(state);
  }, [state, hydrated]);

  const getTopicMastery = useCallback(
    (subjectSlug: string, topicSlug: string) => computeTopicMasterySummary(state.attempts, subjectSlug, topicSlug),
    [state.attempts],
  );

  const recordQuizCompletion = useCallback((result: QuizCompletionResult) => {
    const attemptedAt = new Date().toISOString();
    const newAttempts: QuestionAttemptRecord[] = result.answers.map((answer) => ({
      questionId: answer.question.id,
      subjectSlug: answer.question.subject,
      topicSlug: answer.question.topic,
      concept: answer.question.concept ?? UNTAGGED_CONCEPT,
      difficulty: answer.question.difficulty,
      isCorrect: answer.isCorrect,
      attemptedAt,
    }));
    setState((prev) => withAttemptsRecorded(prev, newAttempts));
  }, []);

  const resetPerformance = useCallback(() => {
    clearPerformanceState();
    setState({ version: 1, attempts: [] });
  }, []);

  const value = useMemo<PracticePerformanceContextValue>(
    () => ({
      hydrated,
      attempts: state.attempts,
      getTopicMastery,
      recordQuizCompletion,
      resetPerformance,
    }),
    [hydrated, state.attempts, getTopicMastery, recordQuizCompletion, resetPerformance],
  );

  return <PracticePerformanceContext.Provider value={value}>{children}</PracticePerformanceContext.Provider>;
}

export function usePracticePerformance(): PracticePerformanceContextValue {
  const ctx = useContext(PracticePerformanceContext);
  if (!ctx) throw new Error("usePracticePerformance must be used within a PracticePerformanceProvider");
  return ctx;
}
