"use client";

import { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownSelector } from "@/features/simulation/components/controls/dropdown-selector";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";
import { cn } from "@/lib/utils";
import {
  countAvailableQuestions,
  describeAvailability,
  getTopicOptionsForSubject,
} from "../question-bank";
import {
  ALL_TOPICS_VALUE,
  PRACTICE_DIFFICULTIES,
  PRACTICE_DIFFICULTY_LABEL,
  PRACTICE_QUESTION_COUNTS,
  type PracticeConfig,
  type PracticeDifficultyOption,
  type PracticeQuestionCount,
  type PracticeSubjectOption,
} from "../types";

const labelClasses = "mb-2 block text-sm font-medium text-ink dark:text-bone";

export interface PracticeConfigScreenProps {
  subjects: PracticeSubjectOption[];
  /** Prefills the form when the student returns here via "Change Topic" after a round. */
  initialConfig?: PracticeConfig;
  onStart: (config: PracticeConfig) => void;
}

/**
 * The configuration screen students see before every practice round —
 * subject, topic, difficulty, and question count, with live "only N
 * available" messaging so choosing a combination with too few
 * questions can't lead to a broken or empty quiz. Purely a config
 * builder: it never touches question data directly, it hands a
 * `PracticeConfig` to `onStart` and lets `PracticeSession` pull the
 * actual randomized set from `question-bank.ts`.
 */
export function PracticeConfigScreen({ subjects, initialConfig, onStart }: PracticeConfigScreenProps) {
  const formId = useId();
  const firstSubject = subjects[0];

  const [subjectSlug, setSubjectSlug] = useState(initialConfig?.subjectSlug ?? firstSubject?.slug ?? "");
  const [topicSlug, setTopicSlug] = useState(initialConfig?.topicSlug ?? ALL_TOPICS_VALUE);
  const [difficulty, setDifficulty] = useState<PracticeDifficultyOption>(initialConfig?.difficulty ?? "mixed");
  const [requestedCount, setRequestedCount] = useState<PracticeQuestionCount>(initialConfig?.requestedCount ?? 10);

  const subject = subjects.find((candidate) => candidate.slug === subjectSlug) ?? firstSubject;
  const topicOptions = useMemo(() => (subject ? getTopicOptionsForSubject(subject) : []), [subject]);

  const availableCount = subject ? countAvailableQuestions(subject.slug, topicSlug, difficulty) : 0;
  const hasNoQuestions = availableCount === 0;
  const isShortOnQuestions = !hasNoQuestions && availableCount < requestedCount;

  function handleSubjectChange(nextSlug: string) {
    setSubjectSlug(nextSlug);
    setTopicSlug(ALL_TOPICS_VALUE);
  }

  function handleStart() {
    if (!subject || hasNoQuestions) return;
    onStart({ subjectSlug: subject.slug, topicSlug, difficulty, requestedCount });
  }

  if (!subject) {
    return (
      <div className="rounded-card border border-dashed border-ink/15 p-10 text-center dark:border-bone/20">
        <p className="text-sm text-ink-soft dark:text-bone-soft">
          No practice questions are available yet — check back soon.
        </p>
      </div>
    );
  }

  const colors = resolveSubjectColors(subject.colorToken);
  const startLabel = hasNoQuestions
    ? "No Questions Available"
    : isShortOnQuestions
      ? `Practice ${availableCount} ${availableCount === 1 ? "Question" : "Questions"}`
      : "Start Practice";

  return (
    <div className="mx-auto w-full max-w-xl rounded-[1.75rem] border border-line bg-white/70 p-6 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:p-10">
      <p className={cn("font-mono text-[11px] uppercase tracking-[0.2em]", colors.text)}>Practice Mode</p>
      <h2 className="mt-2 font-display text-2xl font-medium text-ink dark:text-bone sm:text-3xl">
        Choose what you want to practice
      </h2>

      <div className="mt-8 flex flex-col gap-6">
        <DropdownSelector
          label="Subject"
          value={subject.slug}
          options={subjects.map((option) => ({ value: option.slug, label: option.label }))}
          onChange={handleSubjectChange}
        />

        <DropdownSelector
          label="Topic"
          value={topicSlug}
          options={topicOptions.map((option) => ({
            value: option.slug,
            label: `${option.label} (${option.questionCount})`,
          }))}
          onChange={setTopicSlug}
        />

        <fieldset>
          <legend className={labelClasses}>Difficulty</legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Difficulty">
            {PRACTICE_DIFFICULTIES.map((option) => {
              const inputId = `${formId}-difficulty-${option}`;
              const checked = difficulty === option;
              return (
                <div key={option}>
                  <input
                    type="radio"
                    id={inputId}
                    name={`${formId}-difficulty`}
                    value={option}
                    checked={checked}
                    onChange={() => setDifficulty(option)}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={inputId}
                    className={cn(
                      "block cursor-pointer touch-manipulation rounded-full border px-4 py-2 text-sm transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-pine-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-paper dark:peer-focus-visible:ring-offset-chalkboard",
                      checked
                        ? "border-pine-600 bg-pine-600 text-paper dark:bg-pine-500 dark:text-chalkboard"
                        : "border-ink/15 text-ink-soft hover:border-ink/30 dark:border-bone/20 dark:text-bone-soft dark:hover:border-bone/40"
                    )}
                  >
                    {PRACTICE_DIFFICULTY_LABEL[option]}
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>

        <DropdownSelector
          label="Number of Questions"
          value={String(requestedCount)}
          options={PRACTICE_QUESTION_COUNTS.map((count) => ({ value: String(count), label: String(count) }))}
          onChange={(value) => setRequestedCount(Number(value) as PracticeQuestionCount)}
          className="max-w-[10rem]"
        />

        {hasNoQuestions ? (
          <p role="status" className="text-sm text-ink-soft dark:text-bone-soft">
            {difficulty === "mixed"
              ? "No practice questions are available for this topic yet."
              : `No ${PRACTICE_DIFFICULTY_LABEL[difficulty]} practice questions are available for this topic yet.`}{" "}
            Try a different topic{difficulty !== "mixed" ? " or difficulty" : ""}.
          </p>
        ) : isShortOnQuestions ? (
          <p role="status" className="text-sm text-ink-soft dark:text-bone-soft">
            {describeAvailability(availableCount, difficulty)}
          </p>
        ) : null}
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="primary" size="md" onClick={handleStart} disabled={hasNoQuestions}>
          {startLabel}
        </Button>
      </div>
    </div>
  );
}
