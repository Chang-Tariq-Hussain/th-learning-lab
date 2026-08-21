"use client";

import { useState } from "react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { SectionShell } from "./section-shell";
import type { ExplainQuestion, ExplainSectionContent } from "../types";

function ExplainItem({ question }: { question: ExplainQuestion }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-card border border-line bg-white/60 dark:border-line-dark dark:bg-white/[0.03]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 p-4 text-left text-sm font-medium text-ink dark:text-bone"
      >
        {question.question}
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-ink-soft transition-transform dark:text-bone-soft", open && "rotate-180")}
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </button>
      {open ? <p className="px-4 pb-4 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{question.answer}</p> : null}
    </div>
  );
}

export interface ExplainSectionProps {
  subjectSlug: string;
  topicSlug: string;
  colorToken: string;
  content: ExplainSectionContent;
  className?: string;
}

/** EXPLAIN — "why does this happen?" question/answer pairs, sitting
 *  between hands-on exploration and formal practice. */
export function ExplainSection({ subjectSlug, topicSlug, colorToken, content, className }: ExplainSectionProps) {
  const { completeStep, getTopicProgress } = useLearningProgress();
  const progress = getTopicProgress(subjectSlug, topicSlug);
  const done = progress.stepsCompleted.includes("explain");

  return (
    <SectionShell
      icon={<MessageCircleQuestion className="h-4 w-4" strokeWidth={1.75} />}
      label="Explain — why does this happen?"
      colorToken={colorToken}
      className={className}
    >
      <div className="flex flex-col gap-3">
        {content.questions.map((question) => (
          <ExplainItem key={question.id} question={question} />
        ))}
      </div>

      <Button
        variant="secondary"
        size="sm"
        className="mt-4"
        disabled={done}
        onClick={() => completeStep(subjectSlug, topicSlug, "explain")}
      >
        {done ? "Explain step complete" : "Mark Explain complete"}
      </Button>
    </SectionShell>
  );
}
