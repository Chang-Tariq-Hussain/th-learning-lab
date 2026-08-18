import type { QuizDifficulty } from "@/features/quiz-engine/types";

/** "mixed" is Practice Mode's own concept — a combination of whatever difficulties are available. The Quiz Engine's own `QuizDifficulty` never includes it (a single quiz always has one fixed difficulty). */
export type PracticeDifficultyOption = QuizDifficulty | "mixed";

/** Sentinel topic value meaning "every topic in this subject." Kept as a string (not a real topic slug) so it can sit in the same `topicSlug` field as a real selection. */
export const ALL_TOPICS_VALUE = "all" as const;

export const PRACTICE_QUESTION_COUNTS = [5, 10, 15, 20] as const;
export type PracticeQuestionCount = (typeof PRACTICE_QUESTION_COUNTS)[number];

export const PRACTICE_DIFFICULTIES: PracticeDifficultyOption[] = ["easy", "medium", "hard", "mixed"];

export const PRACTICE_DIFFICULTY_LABEL: Record<PracticeDifficultyOption, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  mixed: "Mixed",
};

/** One topic a student can practice, derived from the Quiz Engine's registry — see `question-bank.ts`. */
export interface PracticeTopicOption {
  /** Question-level topic slug (e.g. "periodic-trends"), or `ALL_TOPICS_VALUE`. */
  slug: string;
  label: string;
  questionCount: number;
}

/** One subject a student can practice, with its available topics. */
export interface PracticeSubjectOption {
  slug: string;
  label: string;
  colorToken: string;
  questionCount: number;
  topics: PracticeTopicOption[];
}

export interface PracticeConfig {
  subjectSlug: string;
  /** A real topic slug, or `ALL_TOPICS_VALUE`. */
  topicSlug: string;
  difficulty: PracticeDifficultyOption;
  requestedCount: PracticeQuestionCount;
}
