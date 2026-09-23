import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { NetworkFundamentalsTopologies } from "@/features/subjects/information-technology/network-fundamentals-topologies";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/information-technology/network-fundamentals-topologies";

export const metadata: Metadata = {
  title: "Network Fundamentals & Topologies",
  description:
    "Build and explore computer networks, connect devices, compare network topologies, and understand how data travels between devices — the foundation for later networking simulations.",
};

export default function NetworkFundamentalsTopologiesPage() {
  const content = getTopicContent("information-technology", "network-fundamentals-topologies");

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
          Network Fundamentals & Topologies
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          The first topic in the Networking branch. Build and explore computer networks, connect devices, compare
          network topologies, and understand how data travels between devices — before diving into addressing and
          protocols in later simulations.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<NetworkFundamentalsTopologies />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <NetworkFundamentalsTopologies />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
