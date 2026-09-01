import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CellularRespiration } from "@/features/subjects/biology/cellular-respiration";
import { TopicExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/biology/atp-energy-release";

export const metadata: Metadata = {
  title: "ATP & Energy Release",
  description: "Follow the energy: how ATP is released and made available for a cell to spend on its work.",
};

export default function AtpEnergyReleasePage() {
  const content = getTopicContent("biology", "atp-energy-release");

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
          ATP & Energy Release
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Follow the energy from glucose to ATP to cellular work, using
          the same cell scene from the Cellular Respiration simulation.
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
