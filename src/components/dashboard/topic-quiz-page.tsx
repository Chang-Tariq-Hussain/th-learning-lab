import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { QuizMeta } from "@/features/quiz-engine";
import { QuizExperience } from "@/features/quiz-engine/quiz-experience";
import { resolveSubjectColors } from "@/features/subjects/subject-colors";
import { ArrowLeft } from "lucide-react";

const SUBJECT_HREF: Record<string, string> = {
  physics: "/dashboard/physics",
  chemistry: "/dashboard/chemistry",
  biology: "/dashboard/biology",
  mathematics: "/dashboard/mathematics",
};

export interface TopicQuizPageProps {
  quiz: QuizMeta;
  /** Label for both the top "back" button and the results screen's
   *  "Back to Topic" action — e.g. "Back to Periodic Trends". */
  backLabel: string;
}

/**
 * Shared shell every topic-quiz route renders — header, breadcrumbs,
 * a back link to the subject dashboard, and `<QuizExperience />`.
 * Keeps ~18 near-identical route files down to one layout definition;
 * each `page.tsx` only supplies `getQuizById(...)` and this component.
 */
export function TopicQuizPage({ quiz, backLabel }: TopicQuizPageProps) {
  const subjectHref = SUBJECT_HREF[quiz.subjectSlug] ?? "/dashboard";
  const colors = resolveSubjectColors(quiz.colorToken);

  return (
    <Container className="py-10">
      <Button href={quiz.backHref} variant="ghost" size="md" className="mb-4">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        {backLabel}
      </Button>
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: quiz.subjectLabel, href: subjectHref },
          { label: quiz.title },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p
          className={`font-mono text-[11px] uppercase tracking-[0.2em] ${colors.text}`}
        >
          {quiz.subjectLabel} · {quiz.topicLabel}
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          {quiz.title}
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          {quiz.description}
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <QuizExperience quiz={quiz} backLabel={backLabel} />
      </div>
    </Container>
  );
}
