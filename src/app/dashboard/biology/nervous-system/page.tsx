import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { getQuizById } from "@/features/quiz-engine/registry";
import { NervousSystem } from "@/features/subjects/biology/nervous-system";

export const metadata: Metadata = {
  title: "Nervous System — From Neuron to Signal Transmission",
  description:
    "Explore the parts of a neuron, watch an action potential fire, step through synaptic transmission, and see how the nervous system is organized.",
};

export default function NervousSystemPage() {
  const quiz = getQuizById("biology-nervous-system");
  return (
    <Container className="py-10">
      <SimulationBackLink
        simulationHref="/dashboard/biology/nervous-system"
        className="mb-4"
      />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          {
            label: "Human Physiology",
            href: "/dashboard/biology/human-physiology",
          },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
          Biology · Human Physiology
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Nervous System — From Neuron to Signal Transmission
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Explore the parts of a neuron, fire an action potential, step
          through how a synapse passes a signal to the next neuron, and see
          how the nervous system is organized.
        </p>
      </div>

      <NervousSystem />

      {quiz && (
        <QuizCta href="/dashboard/biology/nervous-system-quiz" colorToken="biology" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}
    </Container>
  );
}
