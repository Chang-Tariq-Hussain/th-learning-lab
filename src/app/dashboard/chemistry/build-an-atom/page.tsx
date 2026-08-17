import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { getQuizById } from "@/features/quiz-engine/registry";
import { BuildAnAtom } from "@/features/subjects/chemistry/build-an-atom";

export const metadata: Metadata = {
  title: "Build an Atom",
  description: "Add and remove protons, neutrons, and electrons to build any element and see how charge and mass change.",
};

export default function BuildAnAtomPage() {
  const quiz = getQuizById("chemistry-atom");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/build-an-atom" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          { label: "Atomic Structure", href: "/dashboard/chemistry/atomic-structure" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Atomic Structure
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Build an Atom
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Add and remove protons, neutrons, and electrons and watch the
          element, mass, and charge update instantly. Click any particle
          to learn what it does.
        </p>
      </div>

      <BuildAnAtom />

      {quiz && (
        <QuizCta href="/dashboard/chemistry/atom-quiz" colorToken="chemistry" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}
    </Container>
  );
}
