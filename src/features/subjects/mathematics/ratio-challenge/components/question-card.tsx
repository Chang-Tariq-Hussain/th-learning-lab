"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { ConfettiBurst } from "./confetti-burst";
import type { Question, QuestionKind } from "../types";
import { DIFFICULTY_LABEL } from "../types";

const KIND_LABEL: Record<QuestionKind, string> = {
  "missing-value": "Missing value",
  simplify: "Simplify",
  "equivalent-mc": "Equivalent ratios",
  "equivalent-dragdrop": "Build the ratio",
  "word-problem": "Word problem",
};

export interface QuestionCardProps {
  question: Question;
  confettiKey: number;
  children: ReactNode;
}

export function QuestionCard({ question, confettiKey, children }: QuestionCardProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-[1.75rem] border border-line bg-white/70 p-5 shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.04] sm:p-8">
      <ConfettiBurst triggerKey={confettiKey} />

      <div className="mb-5 flex items-center justify-between gap-3">
        <Badge>{DIFFICULTY_LABEL[question.difficulty]}</Badge>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft dark:text-bone-soft">
          {KIND_LABEL[question.kind]}
        </span>
      </div>

      <p className="mb-6 text-center font-display text-xl font-medium leading-snug text-ink dark:text-bone sm:text-2xl">
        {question.prompt}
      </p>

      {children}
    </div>
  );
}
