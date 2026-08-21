"use client";

import { AlertTriangle, BookOpen, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormulaCard } from "@/features/simulation/components/formula/formula-card";
import { cn } from "@/lib/utils";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { SectionShell } from "./section-shell";
import type { LearnSectionContent } from "../types";

export interface LearnSectionProps {
  subjectSlug: string;
  topicSlug: string;
  colorToken: string;
  content: LearnSectionContent;
  className?: string;
}

/** LEARN — the first step of every topic. Renders the same
 *  objectives/concepts/why-it-matters shape `SimulationLearnMore`
 *  already established, now sourced from `TopicContent` instead of
 *  page-level JSX props and wired to progress tracking, plus three
 *  optional additions any topic can supply: a glossary of key terms,
 *  small visual aids, and common-misconception callouts. */
export function LearnSection({ subjectSlug, topicSlug, colorToken, content, className }: LearnSectionProps) {
  const { completeStep, getTopicProgress } = useLearningProgress();
  const progress = getTopicProgress(subjectSlug, topicSlug);
  const done = progress.stepsCompleted.includes("learn");
  const colors = resolveSubjectColors(colorToken);

  return (
    <SectionShell icon={<BookOpen className="h-4 w-4" strokeWidth={1.75} />} label="Learn" colorToken={colorToken} className={className}>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-card border border-line bg-white/60 p-5 dark:border-line-dark dark:bg-white/[0.03] sm:p-6">
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-ink dark:text-bone">
            <Target className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            Learning objectives
          </p>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
            {content.objectives.map((objective, index) => (
              <li key={index} className="flex gap-2">
                <span className={cn("mt-2 h-1 w-1 shrink-0 rounded-full", colors.bar)} aria-hidden="true" />
                {objective}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-card border border-line bg-white/60 p-5 dark:border-line-dark dark:bg-white/[0.03] sm:p-6">
          <p className="mb-3 text-sm font-medium text-ink dark:text-bone">Key concepts</p>
          <div className="flex flex-col gap-4">
            {content.concepts.map((concept, index) => (
              <div key={index}>
                <p className="text-sm font-medium text-ink dark:text-bone">{concept.term}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{concept.explanation}</p>
                {concept.formula ? (
                  <FormulaCard formula={concept.formula} caption={concept.formulaCaption} className="mt-2 py-3" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{content.whyItMatters}</p>

      {content.keyTerms && content.keyTerms.length > 0 ? (
        <div className="mt-4 rounded-card border border-line bg-white/60 p-5 dark:border-line-dark dark:bg-white/[0.03] sm:p-6">
          <p className="mb-3 text-sm font-medium text-ink dark:text-bone">Key terms</p>
          <dl className="grid gap-3 sm:grid-cols-2">
            {content.keyTerms.map((entry, index) => (
              <div key={index}>
                <dt className={cn("font-mono text-[11px] uppercase tracking-wide", colors.text)}>{entry.term}</dt>
                <dd className="mt-0.5 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{entry.definition}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      {content.visualAids && content.visualAids.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {content.visualAids.map((aid) => (
            <div
              key={aid.id}
              className="rounded-card border border-line bg-white/60 p-5 text-center dark:border-line-dark dark:bg-white/[0.03]"
            >
              {aid.visual}
              <p className="mt-3 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{aid.caption}</p>
            </div>
          ))}
        </div>
      ) : null}

      {content.misconceptions && content.misconceptions.length > 0 ? (
        <div className="mt-4 flex flex-col gap-3">
          <p className="text-sm font-medium text-ink dark:text-bone">Common misconceptions</p>
          {content.misconceptions.map((entry) => (
            <div
              key={entry.id}
              className="flex gap-3 rounded-card border border-dashed border-[#E0663D]/40 bg-[#E0663D]/[0.04] p-4 dark:border-[#E0663D]/30 dark:bg-[#E0663D]/[0.06]"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#E0663D]" strokeWidth={1.75} aria-hidden="true" />
              <div className="text-sm leading-relaxed">
                <p className="text-ink dark:text-bone">
                  <span className="font-medium">Misconception: </span>
                  {entry.misconception}
                </p>
                <p className="mt-1 text-ink-soft dark:text-bone-soft">
                  <span className="font-medium text-ink dark:text-bone">Actually: </span>
                  {entry.correction}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <Button
        variant="secondary"
        size="sm"
        className="mt-4"
        disabled={done}
        onClick={() => completeStep(subjectSlug, topicSlug, "learn")}
      >
        {done ? "Learn step complete" : "I've read this — mark Learn complete"}
      </Button>
    </SectionShell>
  );
}
