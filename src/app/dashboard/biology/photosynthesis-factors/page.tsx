import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { Photosynthesis } from "@/features/subjects/biology/photosynthesis";
import { TopicExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/biology/photosynthesis-factors";

export const metadata: Metadata = {
  title: "Factors Affecting Photosynthesis",
  description: "See how light, carbon dioxide, and temperature speed up or slow down photosynthesis — predict, experiment, and explain.",
};

export default function PhotosynthesisFactorsPage() {
  const content = getTopicContent("biology", "photosynthesis-factors");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          { label: "Plant Biology", href: "/dashboard/biology/plant-biology" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
          Biology · Plant Biology
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Factors Affecting Photosynthesis
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Light, carbon dioxide, and temperature can all speed up or slow
          down the rate of photosynthesis. Change one variable at a time and
          see what happens.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<Photosynthesis showFactorControls />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <Photosynthesis showFactorControls />
      )}
    </Container>
  );
}
