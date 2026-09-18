import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { DeadlockSimulator } from "@/features/subjects/information-technology/deadlock-simulator";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/information-technology/deadlock-simulator";

export const metadata: Metadata = {
  title: "Deadlock Simulator",
  description:
    "See why operating-system deadlocks occur and how they're prevented, avoided, detected, and recovered from — the four Coffman conditions, a live Resource Allocation Graph, the Banker's Algorithm, and detection and recovery labs.",
};

export default function DeadlockSimulatorPage() {
  const content = getTopicContent("information-technology", "deadlock-simulator");

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
          Deadlock Simulator
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          File System Explorer covered how storage is organized. This topic asks a different question: what happens when
          processes end up permanently waiting on resources held by one another — and what the operating system can do about
          it, before, during, and after it happens.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<DeadlockSimulator />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <DeadlockSimulator />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
