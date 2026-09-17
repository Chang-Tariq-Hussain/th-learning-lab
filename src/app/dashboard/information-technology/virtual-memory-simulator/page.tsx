import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { VirtualMemorySimulator } from "@/features/subjects/information-technology/virtual-memory-simulator";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/information-technology/virtual-memory-simulator";

export const metadata: Metadata = {
  title: "Virtual Memory Simulator",
  description:
    "Explore how an operating system gives processes a large virtual address space even when physical RAM is limited — residency, address translation, memory pressure, and process isolation.",
};

export default function VirtualMemorySimulatorPage() {
  const content = getTopicContent("information-technology", "virtual-memory-simulator");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Information Technology", href: "/dashboard/information-technology" },
          { label: "Operating Systems", href: "/dashboard/information-technology/operating-systems" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-it">
          Information Technology · Operating Systems
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Virtual Memory Simulator
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Physical RAM is limited, but processes often act like they have far more memory than that. See how
          virtual address spaces, residency, and backing storage make that possible.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<VirtualMemorySimulator />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <VirtualMemorySimulator />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
