import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { OsiModelExplorer } from "@/features/subjects/information-technology/osi-model-explorer";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/information-technology/osi-model-explorer";

export const metadata: Metadata = {
  title: "OSI Model Explorer",
  description:
    "Make the seven-layer OSI model click through an interactive stack, encapsulation and decapsulation animation, a simple packet journey, layer identification, and conceptual troubleshooting.",
};

export default function OsiModelExplorerPage() {
  const content = getTopicContent("information-technology", "osi-model-explorer");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Information Technology", href: "/dashboard/information-technology" },
          { label: "Networking Fundamentals", href: "/dashboard/information-technology/networking-fundamentals" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-it">
          Information Technology · Networking Fundamentals
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          OSI Model Explorer
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          The second topic in the Networking branch. Click through an interactive seven-layer stack, watch data get
          encapsulated and decapsulated between two computers, trace a simple packet journey, and practice
          identifying which layer is involved in a scenario or a fault.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<OsiModelExplorer />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <OsiModelExplorer />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
