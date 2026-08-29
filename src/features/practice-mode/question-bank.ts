import { quizzes } from "@/features/quiz-engine/registry";
import type { QuizQuestion } from "@/features/quiz-engine/types";
import { selectAdaptiveQuestions } from "./adaptive-selection";
import type { QuestionAttemptRecord } from "./mastery-types";
import {
  ALL_TOPICS_VALUE,
  PRACTICE_DIFFICULTY_LABEL,
  type PracticeConfig,
  type PracticeDifficultyOption,
  type PracticeSubjectOption,
  type PracticeTopicOption,
} from "./types";

/**
 * Builds the Subject → Topic picker straight from the Quiz Engine's
 * `quizzes` registry — no separate practice-only question bank. Today
 * every registered `QuizMeta` is exactly one topic's worth of
 * questions (see `quiz-engine/README.md`), so grouping happens by
 * each question's own `topic` slug rather than assuming a 1:1
 * quiz-to-topic mapping — if a topic ever gets a second quiz, its
 * questions merge into the same topic option automatically instead of
 * silently splitting into two.
 *
 * Quizzes with zero questions are skipped, which is what keeps an
 * empty topic from ever appearing as a selectable option (see
 * `validateQuizQuestions` in the engine for the same idea applied to
 * a single quiz).
 */
export function getPracticeSubjects(): PracticeSubjectOption[] {
  const bySubject = new Map<string, PracticeSubjectOption>();

  for (const quiz of quizzes) {
    if (quiz.questions.length === 0) continue;

    let subject = bySubject.get(quiz.subjectSlug);
    if (!subject) {
      subject = {
        slug: quiz.subjectSlug,
        label: quiz.subjectLabel,
        colorToken: quiz.colorToken,
        questionCount: 0,
        topics: [],
      };
      bySubject.set(quiz.subjectSlug, subject);
    }

    const topicSlug = quiz.questions[0]!.topic;
    let topic = subject.topics.find((candidate) => candidate.slug === topicSlug);
    if (!topic) {
      topic = { slug: topicSlug, label: quiz.topicLabel, questionCount: 0 };
      subject.topics.push(topic);
    }

    topic.questionCount += quiz.questions.length;
    subject.questionCount += quiz.questions.length;
  }

  return Array.from(bySubject.values()).sort((a, b) => a.label.localeCompare(b.label));
}

export function getPracticeSubject(subjectSlug: string): PracticeSubjectOption | undefined {
  return getPracticeSubjects().find((subject) => subject.slug === subjectSlug);
}

/** A subject's topic options for the picker, with a synthetic "All Topics" entry prepended whenever there's more than one real topic to choose from. */
export function getTopicOptionsForSubject(subject: PracticeSubjectOption): PracticeTopicOption[] {
  if (subject.topics.length <= 1) return subject.topics;

  const allTopics: PracticeTopicOption = {
    slug: ALL_TOPICS_VALUE,
    label: `All ${subject.label} Topics`,
    questionCount: subject.questionCount,
  };
  return [allTopics, ...subject.topics];
}

/** Every question belonging to a subject, optionally scoped to one topic. */
function collectQuestions(subjectSlug: string, topicSlug: string): QuizQuestion[] {
  const pool: QuizQuestion[] = [];
  for (const quiz of quizzes) {
    if (quiz.subjectSlug !== subjectSlug) continue;
    for (const question of quiz.questions) {
      if (topicSlug === ALL_TOPICS_VALUE || question.topic === topicSlug) {
        pool.push(question);
      }
    }
  }
  return pool;
}

function filterByDifficulty(pool: QuizQuestion[], difficulty: PracticeDifficultyOption): QuizQuestion[] {
  if (difficulty === "mixed") return pool;
  return pool.filter((question) => question.difficulty === difficulty);
}

/** How many questions actually match a subject/topic/difficulty combination — used by the config screen to show graceful "only N available" messaging before the student commits to a count. */
export function countAvailableQuestions(
  subjectSlug: string,
  topicSlug: string,
  difficulty: PracticeDifficultyOption
): number {
  return filterByDifficulty(collectQuestions(subjectSlug, topicSlug), difficulty).length;
}

export function describeAvailability(
  count: number,
  difficulty: PracticeDifficultyOption
): string {
  const label = difficulty === "mixed" ? "" : `${PRACTICE_DIFFICULTY_LABEL[difficulty]} `;
  const noun = count === 1 ? "question is" : "questions are";
  return `Only ${count} ${label}${noun} currently available for this topic.`;
}

export interface PracticeSelectionResult {
  questions: QuizQuestion[];
  availableCount: number;
}

/**
 * Builds one practice round: filters the subject/topic's question
 * pool by difficulty, then hands it to the adaptive selector
 * (`adaptive-selection.ts`) along with the student's relevant recent
 * attempts — so the round prioritizes weak concepts, mixes in
 * previously-missed questions, and avoids repeating whatever was just
 * seen, rather than a flat random draw. The Quiz Engine itself now
 * shuffles every question's options unconditionally
 * (`useQuiz`/`utils/shuffle.ts`), so this no longer needs to do it —
 * one shuffle site instead of two.
 *
 * Never returns more than what's actually available, so a request for
 * more questions than exist degrades gracefully instead of crashing
 * or duplicating questions.
 */
export function selectPracticeQuestions(
  config: PracticeConfig,
  attempts: readonly QuestionAttemptRecord[],
): PracticeSelectionResult {
  const pool = filterByDifficulty(collectQuestions(config.subjectSlug, config.topicSlug), config.difficulty);

  const relevantAttempts = attempts.filter(
    (attempt) =>
      attempt.subjectSlug === config.subjectSlug &&
      (config.topicSlug === ALL_TOPICS_VALUE || attempt.topicSlug === config.topicSlug),
  );

  const questions = selectAdaptiveQuestions({
    pool,
    attempts: relevantAttempts,
    requestedCount: config.requestedCount,
  });

  return { questions, availableCount: pool.length };
}
