import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { getQuizById } from "@/features/quiz-engine/registry";
import { PeriodicTrends } from "@/features/subjects/chemistry/periodic-trends";

export const metadata: Metadata = {
  title: "Periodic Trends",
  description:
    "Explore the periodic table and discover how atomic radius, ionization energy, electronegativity, and metallic character change in predictable patterns.",
};

export default function PeriodicTrendsPage() {
  const quiz = getQuizById("chemistry-periodic-trends");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/periodic-trends" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          { label: "Periodic Trends", href: "/dashboard/chemistry/periodic-trends" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Periodic Trends
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Periodic Trends
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Pick a trend and watch the periodic table light up — discover the patterns instead of just memorizing
          the arrows.
        </p>
      </div>

      <PeriodicTrends />

      {quiz && (
        <QuizCta href="/dashboard/chemistry/periodic-trends-quiz" colorToken="chemistry" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}
    </Container>
  );
}
