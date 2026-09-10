import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CompassExplorer } from "@/features/subjects/physics/compass-explorer";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/physics/compass-explorer";

export const metadata: Metadata = {
  title: "Interactive Compass Explorer",
  description:
    "Drag a magnet and a compass around the same playground to discover that a compass is just a tiny magnet whose needle follows the field.",
};

export default function CompassExplorerPage() {
  const content = getTopicContent("physics", "compass-explorer");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Physics", href: "/dashboard/physics" },
          { label: "Electromagnetism", href: "/dashboard/physics/electromagnetism" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
          Physics · Electromagnetism
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Interactive Compass Explorer
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Drag the magnet and the compass around the playground and watch
          the needle turn to follow the magnet&apos;s field — a compass is
          just a tiny magnet, always finding North.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<CompassExplorer />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <CompassExplorer />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
