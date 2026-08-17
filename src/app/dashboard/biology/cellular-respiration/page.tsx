import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { getQuizById } from "@/features/quiz-engine/registry";
import { CellularRespiration } from "@/features/subjects/biology/cellular-respiration";

export const metadata: Metadata = {
  title: "Cellular Respiration",
  description: "Watch a cell use glucose and oxygen to release energy, carbon dioxide, and water.",
};

export default function CellularRespirationPage() {
  const quiz = getQuizById("biology-cellular-respiration");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/biology/cellular-respiration" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          { label: "Cell Structure", href: "/dashboard/biology/cell-structure" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Biology · Cell Structure</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">Cellular Respiration</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Press Start and watch glucose and oxygen travel to the mitochondrion to release energy, carbon dioxide, and water.
        </p>
      </div>

      <CellularRespiration />

      {quiz && (
        <QuizCta href="/dashboard/biology/cellular-respiration-quiz" colorToken="biology" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}
    </Container>
  );
}
