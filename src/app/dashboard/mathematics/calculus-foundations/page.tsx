import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { getQuizById } from "@/features/quiz-engine/registry";
import { CalculusFoundations } from "@/features/subjects/mathematics/calculus-foundations";

export const metadata: Metadata = {
  title: "Calculus Foundations — Functions, Graphs & Limits",
  description:
    "Build intuition for functions, graphs, limits, and continuity — the visual foundations calculus is built on.",
};

export default function CalculusFoundationsPage() {
  const quiz = getQuizById("mathematics-calculus");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/calculus-foundations" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Calculus", href: "/dashboard/mathematics/calculus" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Mathematics · Calculus</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Calculus Foundations — Functions, Graphs & Limits
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          See how calculus is built before you see the formulas: functions, graphs, approaching a value, limits,
          and continuity — one idea at a time.
        </p>
      </div>

      <CalculusFoundations />

      {quiz && (
        <QuizCta href="/dashboard/mathematics/calculus-quiz" colorToken="math" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}
    </Container>
  );
}
