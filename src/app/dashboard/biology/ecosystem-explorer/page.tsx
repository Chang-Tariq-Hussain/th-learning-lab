import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";
import { EcosystemExplorer } from "@/features/subjects/biology/ecosystem-explorer";
import { TopicExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/biology/ecosystem-explorer";

export const metadata: Metadata = {
  title: "Ecosystem Explorer — Living & Non-Living Components",
  description:
    "Explore a small pond and forest ecosystem, discover biotic and abiotic components, and see how producers, consumers, and decomposers depend on each other.",
};

export default function EcosystemExplorerPage() {
  const content = getTopicContent("biology", "ecosystem-explorer");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          { label: "Ecology & Ecosystems", href: "/dashboard/biology/ecosystem-explorer" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
          Biology · Ecology & Ecosystems
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Ecosystem Explorer
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Explore a small pond and forest ecosystem. Click on plants, animals, and the environment around them to
          see how living and non-living components interact.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<EcosystemExplorer />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <EcosystemExplorer />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
