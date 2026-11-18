import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CellularRespiration } from "@/features/subjects/biology/cellular-respiration";
import { TopicExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/biology/cellular-respiration";

export const metadata: Metadata = {
  title: "Cellular Respiration",
  description: "A detailed lab of all five stages of cellular respiration with zoom levels, proton-flow control, ATP yield explorer and aerobic vs fermentation.",
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
        <p className="font-mono text-label uppercase tracking-eyebrow text-subject-biology">
          Biology · Cell Structure
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Cellular Respiration
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Follow glucose-derived carbon, electrons and energy through glycolysis, pyruvate oxidation, the citric acid cycle, the electron transport chain and ATP synthase, from the whole cell down to the molecule.
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
