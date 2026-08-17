import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Quiz } from "@/features/quiz-engine";
import { getQuizById } from "@/features/quiz-engine/registry";

export const metadata: Metadata = {
  title: "Motion Basics Quiz",
  description: "Test your understanding of distance, displacement, speed, velocity, and acceleration.",
};

/**
 * Standalone test route for the Quiz Engine, not yet wired into
 * `subjects.ts` — the simulation registry is for simulations, and the
 * quiz system has its own registry (`features/quiz-engine/registry`).
 * A future "Practice" tab on each topic page is the natural place to
 * surface quizzes like this one.
 */
export default function MotionQuizPage() {
  const quiz = getQuizById("physics-motion");
  if (!quiz) notFound();

  return (
    <Container className="py-10">
      <Button href={quiz.backHref} variant="ghost" size="md" className="mb-4">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Back to Physics
      </Button>
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Physics", href: "/dashboard/physics" },
          { label: quiz.title },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
          {quiz.subjectLabel} · {quiz.topicLabel}
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">{quiz.title}</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Test your understanding of distance, displacement, speed, velocity, and acceleration.
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <Quiz
          quizId={quiz.id}
          questions={quiz.questions}
          subjectLabel={quiz.subjectLabel}
          topicLabel={quiz.topicLabel}
          colorToken={quiz.colorToken}
          backHref={quiz.backHref}
          backLabel="Back to Physics"
        />
      </div>
    </Container>
  );
}
