"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChoiceQuestion } from "../types";

export interface MultipleChoiceQuestionProps {
  question: ChoiceQuestion;
  locked: boolean;
  onSubmit: (correct: boolean) => void;
}

export function MultipleChoiceQuestion({ question, locked, onSubmit }: MultipleChoiceQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handlePick = (index: number) => {
    if (locked) return;
    setSelected(index);
    onSubmit(index === question.correctIndex);
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {question.choices.map((choice, index) => {
        const isCorrect = index === question.correctIndex;
        const isSelected = index === selected;

        return (
          <button
            key={`${question.id}-${index}`}
            type="button"
            disabled={locked}
            onClick={() => handlePick(index)}
            className={cn(
              "flex items-center justify-between gap-2 rounded-xl border-2 px-4 py-3 text-left font-display text-lg font-medium tabular-nums transition-colors",
              "disabled:cursor-default",
              locked && isCorrect
                ? "border-subject-chemistry bg-subject-chemistry-soft text-subject-chemistry dark:bg-subject-chemistry/15"
                : locked && isSelected && !isCorrect
                  ? "border-subject-physics bg-subject-physics-soft text-subject-physics dark:bg-subject-physics/15"
                  : locked
                    ? "border-line text-ink-soft/50 dark:border-line-dark dark:text-bone-soft/40"
                    : "border-ink/15 text-ink hover:border-subject-math hover:bg-subject-math-soft dark:border-bone/20 dark:text-bone dark:hover:bg-subject-math/15",
            )}
          >
            {choice}
            {locked && isCorrect && <Check className="h-5 w-5 shrink-0" strokeWidth={2.5} />}
            {locked && isSelected && !isCorrect && <X className="h-5 w-5 shrink-0" strokeWidth={2.5} />}
          </button>
        );
      })}
    </div>
  );
}
