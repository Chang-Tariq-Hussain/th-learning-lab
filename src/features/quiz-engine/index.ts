"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split like every simulation feature — quiz pages only pay for
 * this chunk when a student actually opens one, and `ssr: false`
 * matches the rest of the platform's client-only interactive
 * features. `QuizProps` is re-exported so pages get full prop
 * typing on the dynamic wrapper.
 */
export const Quiz = dynamic(() => import("./quiz").then((mod) => mod.Quiz), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});

export type { QuizProps } from "./quiz";
export type {
  MultipleChoiceQuestion,
  QuizAnswerRecord,
  QuizCompletionResult,
  QuizDifficulty,
  QuizMeta,
  QuizQuestion,
  QuestionType,
} from "./types";
