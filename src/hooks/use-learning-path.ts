"use client";

import { useMemo } from "react";
import { getTopicContent } from "@/features/learning/registry";
import { computeLearningPathState, type LearningPathState } from "@/features/learning-path/engine";
import type { LearningPath } from "@/features/learning-path/types";
import { useLearningProgress } from "./use-learning-progress";

/**
 * Derives one learning path's per-student state, backed by the same
 * localStorage-persisted progress `@/features/learning`'s topic pages
 * already write to via `useLearningProgress` — no separate storage,
 * no accounts, nothing new to persist. Recomputes whenever the
 * underlying progress changes.
 */
export function useLearningPath(path: LearningPath): LearningPathState {
  const { getTopicProgress } = useLearningProgress();

  return useMemo(
    () =>
      computeLearningPathState(path, {
        getProgress: (key) => getTopicProgress(key.subjectSlug, key.topicSlug),
        getContent: (key) => getTopicContent(key.subjectSlug, key.topicSlug),
      }),
    [path, getTopicProgress],
  );
}
