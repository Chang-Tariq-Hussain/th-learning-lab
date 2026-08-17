import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { getQuizById } from "@/features/quiz-engine/registry";
import { BondBuilder } from "@/features/subjects/chemistry/bond-builder";

export const metadata: Metadata = {
  title: "Bond Builder",
  description: "Bring atoms together and watch ionic and covalent bonds form, electron by electron.",
};

export default function BondBuilderPage() {
  const quiz = getQuizById("chemistry-chemical-bonding");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/bond-builder" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          { label: "Chemical Bonding", href: "/dashboard/chemistry/chemical-bonding" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Chemical Bonding
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Bond Builder
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Bring two atoms together and see what happens to their electrons —
          one transfers to form an ionic bond, or two get shared to form a
          covalent bond.
        </p>
      </div>

      <BondBuilder />

      {quiz && (
        <QuizCta href="/dashboard/chemistry/chemical-bonding-quiz" colorToken="chemistry" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}
    </Container>
  );
}
