import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { FactorFinder } from "@/features/subjects/mathematics/factor-finder";
import { TopicLearningExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/mathematics/factor-finder";

export const metadata: Metadata = {
  title: "Factor Finder",
  description:
    "Tap your way through factor pairs and multiples grids to build an intuitive feel for how factors and multiples work.",
};

export default function FactorFinderPage() {
  const content = getTopicContent("mathematics", "factors-multiples");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Number Sense", href: "/dashboard/mathematics/number-sense" },
        ]}
        className="mb-6"
      />

      <div className="mb-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Mathematics · Number Sense</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Factor Finder
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Tap the numbers that divide a target evenly, then flip to Multiples mode to build multiples of your own.
        </p>
      </div>

      {content ? (
        <TopicLearningExperience content={content} simulation={<FactorFinder />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <FactorFinder />
      )}
    </Container>
  );
}
