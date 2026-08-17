import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { getQuizById } from "@/features/quiz-engine/registry";
import { AcidsBasesBasics } from "@/features/subjects/chemistry/acids-bases-basics";

export const metadata: Metadata = {
  title: "Acids & Bases — The Basics",
  description:
    "Explore everyday substances on the pH scale and build intuition for what makes something acidic, neutral, or basic.",
};

export default function AcidsBasesBasicsPage() {
  const quiz = getQuizById("chemistry-acids-bases");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/acids-bases-basics" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          { label: "Acids & Bases — The Basics", href: "/dashboard/chemistry/acids-bases-basics" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Acids &amp; Bases
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Acids &amp; Bases — The Basics
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Pick a familiar substance and see where it lands on the pH scale — no equations yet, just intuition.
        </p>
      </div>

      <AcidsBasesBasics />

      {quiz && (
        <QuizCta href="/dashboard/chemistry/acids-bases-quiz" colorToken="chemistry" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}
    </Container>
  );
}
