import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CellularEnergy } from "@/features/subjects/biology/cellular-energy";
import { TopicExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/biology/cellular-energy";

export const metadata: Metadata = {
  title: "Introduction to Cellular Energy",
  description: "How cells obtain, transform and use energy: nutrients, mitochondria, ATP, catabolism and anabolism, with an energy-flow challenge.",
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
        <p className="font-mono text-label uppercase tracking-eyebrow text-subject-biology">
          Biology · Cell Structure
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Introduction to Cellular Energy
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Follow energy from nutrients through mitochondria to ATP and cellular work, and compare catabolism with anabolism, in one animated cell.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<CellularEnergy />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <CellularEnergy />
      )}
    </Container>
  );
}
