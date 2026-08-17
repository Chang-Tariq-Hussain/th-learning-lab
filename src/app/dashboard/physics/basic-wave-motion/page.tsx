import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { getQuizById } from "@/features/quiz-engine/registry";
import { BasicWaveMotion } from "@/features/subjects/physics/basic-wave-motion";

export const metadata: Metadata = {
  title: "Basic Wave Motion",
  description:
    "Watch a transverse wave travel and discover crest, trough, amplitude, wavelength, and equilibrium by interacting with it.",
};

export default function BasicWaveMotionPage() {
  const quiz = getQuizById("physics-wave-motion");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/physics/basic-wave-motion" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Physics", href: "/dashboard/physics" },
          { label: "Wave Motion", href: "/dashboard/physics/wave-motion" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
          Physics · Wave Motion
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Basic Wave Motion
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Watch the wave travel, then explore its crest, trough, amplitude, wavelength, and equilibrium position.
        </p>
      </div>

      <BasicWaveMotion />

      {quiz && (
        <QuizCta href="/dashboard/physics/wave-motion-quiz" colorToken="physics" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}
    </Container>
  );
}
