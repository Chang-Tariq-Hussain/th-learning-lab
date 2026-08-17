import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";
import { cn } from "@/lib/utils";

export interface QuizCtaProps {
  href: string;
  colorToken: string;
  questionCount: number;
  className?: string;
}

/**
 * "Ready to test your understanding?" card — dropped into a
 * simulation page below the simulation itself, linking to that
 * topic's quiz. Deliberately quiet (a bordered card + text link, not
 * a large button) so it doesn't compete with the simulation above it.
 * Only rendered on pages that actually have a quiz — no "coming soon"
 * state needed since nothing links here unless a quiz exists.
 */
export function QuizCta({ href, colorToken, questionCount, className }: QuizCtaProps) {
  const colors = resolveSubjectColors(colorToken);

  return (
    <div
      className={cn(
        "mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white/60 px-5 py-4 dark:border-line-dark dark:bg-white/[0.03] sm:px-6",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", colors.bg, colors.text)}>
          <HelpCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-medium text-ink dark:text-bone">Ready to test your understanding?</p>
          <p className="text-xs text-ink-soft dark:text-bone-soft">
            {questionCount} {questionCount === 1 ? "question" : "questions"} · a few minutes
          </p>
        </div>
      </div>
      <Link
        href={href}
        className={cn("inline-flex shrink-0 items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline", colors.text)}
      >
        Take Quiz
        <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      </Link>
    </div>
  );
}
