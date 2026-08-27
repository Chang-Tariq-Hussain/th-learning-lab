import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { FractionPizza } from "@/features/subjects/mathematics/fraction-pizza";
import { TopicLearningExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/mathematics/fraction-pizza";

export const metadata: Metadata = {
  title: "Fraction Pizza",
  description:
    "Cut a pizza into slices and click to select them, learning fractions, equivalence, comparison, and mixed numbers by eating instead of solving.",
};

export default function FractionPizzaPage() {
  const content = getTopicContent("mathematics", "fractions");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Fractions", href: "/dashboard/mathematics/fractions" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">
          Mathematics · Fractions
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Fraction Pizza
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Cut and select slices to see fractions, equivalence, and comparison directly, instead of just calculating them.
        </p>
      </div>

      {content ? (
        <TopicLearningExperience content={content} simulation={<FractionPizza />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <FractionPizza />
      )}
    </Container>
  );
}
