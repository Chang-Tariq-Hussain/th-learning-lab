import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CellularRespiration } from "@/features/subjects/biology/cellular-respiration";
import { TopicExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/biology/cellular-energy";

export const metadata: Metadata = {
  title: "Introduction to Cellular Energy",
  description: "Why cells need energy, where it comes from, and what ATP does — predict, observe, and explain.",
};

export default function CellularEnergyPage() {
  const content = getTopicContent("biology", "cellular-energy");

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
          Introduction to Cellular Energy
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Every cell needs energy to do its work. See where that energy
          comes from, and what ATP does with it, using the same cell scene
          from the Cellular Respiration simulation.
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
