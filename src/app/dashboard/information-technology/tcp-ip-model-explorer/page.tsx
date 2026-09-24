import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { TcpIpModelExplorer } from "@/features/subjects/information-technology/tcp-ip-model-explorer";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/information-technology/tcp-ip-model-explorer";

export const metadata: Metadata = {
  title: "TCP/IP Model Explorer",
  description:
    "Explore the four-layer TCP/IP model: an interactive stack, its mapping to OSI, encapsulation and decapsulation, a protocol map, a request/response journey, a simple network path, and conceptual troubleshooting.",
};

export default function TcpIpModelExplorerPage() {
  const content = getTopicContent("information-technology", "tcp-ip-model-explorer");

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
          TCP/IP Model Explorer
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          The third topic in the Networking branch. See how the practical four-layer TCP/IP model organizes
          communication, how it relates to the OSI model you just explored, and how data is wrapped, sent, and
          unwrapped between two computers.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<TcpIpModelExplorer />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <TcpIpModelExplorer />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
