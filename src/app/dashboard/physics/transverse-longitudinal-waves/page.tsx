import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { TransverseLongitudinalWaves } from "@/features/subjects/physics/transverse-longitudinal-waves";
import { TopicExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/physics/transverse-longitudinal-waves";

export const metadata: Metadata = {
  title: "Transverse vs Longitudinal Waves",
  description:
    "Watch particles move to discover the difference between transverse waves, where particles move perpendicular to wave travel, and longitudinal waves, where particles move parallel to it.",
};

export default function TransverseLongitudinalWavesPage() {
  const content = getTopicContent("physics", "transverse-longitudinal-waves");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
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
          Transverse vs Longitudinal Waves
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Toggle between the two wave types and watch how particles move to understand the key difference between
          them.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<TransverseLongitudinalWaves />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <TransverseLongitudinalWaves />
      )}
    </Container>
  );
}
