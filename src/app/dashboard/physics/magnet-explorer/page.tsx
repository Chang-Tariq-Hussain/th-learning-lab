import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { getQuizById } from "@/features/quiz-engine/registry";
import { MagnetExplorer } from "@/features/subjects/physics/magnet-explorer";

export const metadata: Metadata = {
  title: "Interactive Magnet Explorer",
  description:
    "Drag and rotate two bar magnets to discover that every magnet has two poles, like poles repel, and opposite poles attract.",
};

export default function MagnetExplorerPage() {
  const quiz = getQuizById("physics-electromagnetism");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/physics/magnet-explorer" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Physics", href: "/dashboard/physics" },
          { label: "Electromagnetism", href: "/dashboard/physics/electromagnetism" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
          Physics · Electromagnetism
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Interactive Magnet Explorer
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Drag and rotate two bar magnets to discover how they behave —
          every magnet has two poles, matching poles push apart, and
          opposite poles pull together.
        </p>
      </div>

      <MagnetExplorer />

      {quiz && (
        <QuizCta href="/dashboard/physics/electromagnetism-quiz" colorToken="physics" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}
    </Container>
  );
}
