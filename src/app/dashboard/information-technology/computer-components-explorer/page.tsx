import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { ComputerComponentsExplorer } from "@/features/subjects/information-technology/computer-components-explorer";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/information-technology/computer-components-explorer";

export const metadata: Metadata = {
  title: "Computer Components & Hardware Explorer",
  description:
    "Explore an interactive virtual computer — rotate, click, and inspect the CPU, RAM, GPU, storage, motherboard, and power system to learn what each part does.",
};

export default function ComputerComponentsExplorerPage() {
  const content = getTopicContent("information-technology", "computer-components-explorer");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Information Technology", href: "/dashboard/information-technology" },
          { label: "Computer Fundamentals", href: "/dashboard/information-technology/computer-fundamentals" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-it">
          Information Technology · Computer Fundamentals
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Computer Components & Hardware Explorer
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Rotate, zoom, and click through a virtual computer to learn what its major physical components are, where
          they sit, and how they connect.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<ComputerComponentsExplorer />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <ComputerComponentsExplorer />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
