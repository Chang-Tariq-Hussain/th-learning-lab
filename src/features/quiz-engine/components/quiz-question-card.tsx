"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";
import type { QuizQuestion } from "../types";
import { QuizOptionButton } from "./quiz-option-button";

const DIFFICULTY_LABEL: Record<QuizQuestion["difficulty"], string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export interface QuizQuestionCardProps {
  question: QuizQuestion;
  subjectLabel: string;
  topicLabel: string;
  colorToken: string;
  selectedAnswer: string | null;
  isSubmitted: boolean;
  onSelectAnswer: (value: string) => void;
  onCheckAnswer: () => void;
}

export function QuizQuestionCard({
  question,
  subjectLabel,
  topicLabel,
  colorToken,
  selectedAnswer,
  isSubmitted,
  onSelectAnswer,
  onCheckAnswer,
}: QuizQuestionCardProps) {
  const colors = resolveSubjectColors(colorToken);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Roving-tabindex arrow-key navigation for the radiogroup, per the
  // WAI-ARIA authoring practices for a radio group: Up/Left moves to
  // the previous option, Down/Right to the next, wrapping at the ends.
  function handleOptionKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (isSubmitted) return;

    const optionCount = question.options.length;
    let nextIndex: number | null = null;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (index + 1) % optionCount;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (index - 1 + optionCount) % optionCount;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = optionCount - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      const option = question.options[nextIndex];
      if (option !== undefined) {
        onSelectAnswer(option);
        optionRefs.current[nextIndex]?.focus();
      }
    }
  }

  return (
    <div className="w-full rounded-[1.75rem] border border-line bg-white/70 p-5 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:p-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${colors.text}`}>
          {subjectLabel} · {topicLabel}
        </p>
        <Badge>{DIFFICULTY_LABEL[question.difficulty]}</Badge>
      </div>

      <p className="mb-6 text-lg font-medium leading-snug text-ink dark:text-bone sm:text-xl">
        {question.question}
      </p>

      <div
        role="radiogroup"
        aria-label="Answer options"
        className="flex flex-col gap-3"
      >
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === question.correctAnswer;
          // Only the selected option (or, once submitted, the selected
          // option and the correct one) sit in the tab order — this is
          // the "roving tabindex" pattern so Tab moves past the whole
          // group in one stop, while arrow keys move within it.
          const isTabbable = selectedAnswer ? isSelected : index === 0;

          return (
            <QuizOptionButton
              key={`${question.id}-${index}`}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              optionText={option}
              isSelected={isSelected}
              isRevealed={isSubmitted}
              isCorrectOption={isCorrectOption}
              colorToken={colorToken}
              onSelect={() => onSelectAnswer(option)}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
              tabIndex={isTabbable ? 0 : -1}
            />
          );
        })}
      </div>

      {!isSubmitted && (
        <div className="mt-6 flex justify-end">
          <Button variant="primary" size="md" onClick={onCheckAnswer} disabled={selectedAnswer === null}>
            Check Answer
          </Button>
        </div>
      )}
    </div>
  );
}
