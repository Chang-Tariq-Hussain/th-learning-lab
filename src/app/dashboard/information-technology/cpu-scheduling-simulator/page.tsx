import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CpuSchedulingSimulator } from "@/features/subjects/information-technology/cpu-scheduling-simulator";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/information-technology/cpu-scheduling-simulator";

export const metadata: Metadata = {
  title: "CPU Scheduling Simulator",
  description:
    "Experiment with FCFS, SJF, Round Robin, and Priority Scheduling to see how an operating system decides which process gets the CPU next.",
};

export default function CpuSchedulingSimulatorPage() {
  const content = getTopicContent("information-technology", "cpu-scheduling-simulator");

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
          CPU Scheduling Simulator
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Multiple processes may be ready to run, but the CPU can only run one at a time. Experiment
          with the algorithms an operating system uses to decide which one goes next.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<CpuSchedulingSimulator />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <CpuSchedulingSimulator />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
