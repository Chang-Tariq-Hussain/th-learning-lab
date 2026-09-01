import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CellularRespiration } from "@/features/subjects/biology/cellular-respiration";
import { TopicExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/biology/cellular-respiration";

export const metadata: Metadata = {
  title: "Cellular Respiration",
  description: "Watch a cell use glucose and oxygen to release energy, carbon dioxide, and water — predict, run, and explain the process.",
};

export default function CellularRespirationPage() {
  const content = getTopicContent("biology", "cellular-respiration");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          { label: "Cell Structure", href: "/dashboard/biology/cell-structure" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
          Biology · Cell Structure
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Cellular Respiration
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          How a cell uses glucose and oxygen to release usable energy,
          producing ATP, carbon dioxide, and water. Predict what will
          happen, then run the simulation to check yourself.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<CellularRespiration />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <CellularRespiration />
      )}
    </Container>
  );
}
