import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CellExplorer } from "@/features/subjects/biology/cell-explorer";
import { TopicExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/biology/cell-structure-organization";

export const metadata: Metadata = {
  title: "Cell Structure & Organization",
  description: "The boundary, cytoplasm, and genetic material every cell is built from — explored hands-on in the Cell Explorer.",
};

export default function CellStructureOrganizationPage() {
  const content = getTopicContent("biology", "cell-structure-organization");

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
          Cell Structure & Organization
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          A cell isn&apos;t a random bag of parts — its boundary, cytoplasm,
          and genetic material each do a specific job. Use the same
          Cell Explorer you saw last topic on a mission to find each one.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<CellExplorer />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <CellExplorer />
      )}
    </Container>
  );
}
