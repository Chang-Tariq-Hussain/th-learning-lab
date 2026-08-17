"use client";

import { Clock, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";
import type { QuizDifficulty } from "../types";

const DIFFICULTY_LABEL: Record<QuizDifficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export interface QuizStartScreenProps {
  title: string;
  subjectLabel: string;
  topicLabel: string;
  colorToken: string;
  description: string;
  difficulty: QuizDifficulty;
  estimatedTime: number;
  questionCount: number;
  onStart: () => void;
}

/**
 * Shown before a student begins a quiz — question count, estimated
 * time, difficulty, and a short description, then a single "Start
 * Quiz" action. Purely presentational; `<QuizExperience />` is what
 * decides when to show this vs. the quiz itself.
 */
export function QuizStartScreen({
  title,
  subjectLabel,
  topicLabel,
  colorToken,
  description,
  difficulty,
  estimatedTime,
  questionCount,
  onStart,
}: QuizStartScreenProps) {
  const colors = resolveSubjectColors(colorToken);

  return (
    <div className="w-full rounded-[1.75rem] border border-line bg-white/70 p-6 text-center shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:p-10">
      <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${colors.text}`}>
        {subjectLabel} · {topicLabel}
      </p>
      <h2 className="mt-2 font-display text-2xl font-medium text-ink dark:text-bone sm:text-3xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
        {description}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <Badge>
          <HelpCircle className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
          {questionCount} {questionCount === 1 ? "Question" : "Questions"}
        </Badge>
        <Badge>
          <Clock className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
          ~{estimatedTime} min
        </Badge>
        <Badge>{DIFFICULTY_LABEL[difficulty]}</Badge>
      </div>

      <div className="mt-8">
        <Button variant="primary" size="md" onClick={onStart}>
          Start Quiz
        </Button>
      </div>
    </div>
  );
}
