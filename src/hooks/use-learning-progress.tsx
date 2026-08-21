"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { computeMasteryLevel } from "@/features/learning/mastery";
import type { LearningProgressState, LearningStep, MasteryLevel, TopicProgress } from "@/features/learning/types";
import {
  clearProgressState,
  getTopicProgress as getTopicProgressFromState,
  readProgressState,
  withChallengeAttempt,
  withPredictionAnswer,
  withQuizResult,
  withStepCompleted,
  writeProgressState,
} from "@/lib/learning-progress";

interface LearningProgressContextValue {
  /** false during the first render/SSR pass — matches the `hydrated`
   *  pattern `UserProfileProvider` already uses, so progress UI never
   *  mismatch-flashes between server and client. */
  hydrated: boolean;
  getTopicProgress: (subjectSlug: string, topicSlug: string) => TopicProgress;
  getMasteryLevel: (subjectSlug: string, topicSlug: string) => MasteryLevel;
  completeStep: (subjectSlug: string, topicSlug: string, step: LearningStep) => void;
  recordPrediction: (subjectSlug: string, topicSlug: string, correct: boolean) => void;
  recordQuizResult: (subjectSlug: string, topicSlug: string, scoreFraction: number) => void;
  recordChallengeAttempt: (subjectSlug: string, topicSlug: string, scenarioId: string, solved: boolean) => void;
  resetProgress: () => void;
}

const LearningProgressContext = createContext<LearningProgressContextValue | null>(null);

/**
 * Local (no backend, no auth) learning progress, backed by
 * localStorage via `@/lib/learning-progress`. Mount once near the
 * root (see `layout.tsx`), alongside `UserProfileProvider`.
 *
 * Public API note: every method here takes plain `subjectSlug` /
 * `topicSlug` strings and primitive values, and returns void or plain
 * data — no component that calls `useLearningProgress()` reaches into
 * localStorage or the state shape directly. That's what makes this
 * swappable for a server-backed implementation later (e.g. one that
 * calls an API and revalidates) without changing any call site.
 */
export function LearningProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LearningProgressState>({ version: 1, topics: {} });
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount (client-only — localStorage doesn't exist during SSR).
  useEffect(() => {
    setState(readProgressState());
    setHydrated(true);
  }, []);

  // Persist after every change, but never before the initial read
  // completes — otherwise this would overwrite real stored progress
  // with the empty initial state on first mount.
  useEffect(() => {
    if (!hydrated) return;
    writeProgressState(state);
  }, [state, hydrated]);

  const getTopicProgress = useCallback(
    (subjectSlug: string, topicSlug: string) => getTopicProgressFromState(state, subjectSlug, topicSlug),
    [state],
  );

  const getMasteryLevel = useCallback(
    (subjectSlug: string, topicSlug: string) =>
      computeMasteryLevel(getTopicProgressFromState(state, subjectSlug, topicSlug)),
    [state],
  );

  const completeStep = useCallback((subjectSlug: string, topicSlug: string, step: LearningStep) => {
    setState((prev) => withStepCompleted(prev, subjectSlug, topicSlug, step));
  }, []);

  const recordPrediction = useCallback((subjectSlug: string, topicSlug: string, correct: boolean) => {
    setState((prev) => withPredictionAnswer(prev, subjectSlug, topicSlug, correct));
  }, []);

  const recordQuizResult = useCallback((subjectSlug: string, topicSlug: string, scoreFraction: number) => {
    setState((prev) => withQuizResult(prev, subjectSlug, topicSlug, scoreFraction));
  }, []);

  const recordChallengeAttempt = useCallback((subjectSlug: string, topicSlug: string, scenarioId: string, solved: boolean) => {
    setState((prev) => withChallengeAttempt(prev, subjectSlug, topicSlug, scenarioId, solved));
  }, []);

  const resetProgress = useCallback(() => {
    clearProgressState();
    setState({ version: 1, topics: {} });
  }, []);

  const value = useMemo<LearningProgressContextValue>(
    () => ({
      hydrated,
      getTopicProgress,
      getMasteryLevel,
      completeStep,
      recordPrediction,
      recordQuizResult,
      recordChallengeAttempt,
      resetProgress,
    }),
    [
      hydrated,
      getTopicProgress,
      getMasteryLevel,
      completeStep,
      recordPrediction,
      recordQuizResult,
      recordChallengeAttempt,
      resetProgress,
    ],
  );

  return <LearningProgressContext.Provider value={value}>{children}</LearningProgressContext.Provider>;
}

export function useLearningProgress(): LearningProgressContextValue {
  const ctx = useContext(LearningProgressContext);
  if (!ctx) throw new Error("useLearningProgress must be used within a LearningProgressProvider");
  return ctx;
}
