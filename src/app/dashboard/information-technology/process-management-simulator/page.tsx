import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { ProcessManagementSimulator } from "@/features/subjects/information-technology/process-management-simulator";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/information-technology/process-management-simulator";

export const metadata: Metadata = {
  title: "Process Management Simulator",
  description:
    "Explore how an operating system tracks and manages a process's state and resources — lifecycle, PCB, context switching, and I/O waiting.",
};

export default function ProcessManagementSimulatorPage() {
  const content = getTopicContent("information-technology", "process-management-simulator");

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
          Process Management Simulator
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          A process is a program in execution. Follow one through its lifecycle, inspect its
          Process Control Block, and see how the OS switches between processes and handles I/O.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<ProcessManagementSimulator />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <ProcessManagementSimulator />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
