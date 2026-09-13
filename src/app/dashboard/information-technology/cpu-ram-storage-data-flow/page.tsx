import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CpuRamStorageDataFlow } from "@/features/subjects/information-technology/cpu-ram-storage-data-flow";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/information-technology/cpu-ram-storage-data-flow";

export const metadata: Metadata = {
  title: "CPU–RAM–Storage Data Flow",
  description:
    "Step through how the CPU, RAM, and storage work together when you open an app, save a file, or run a program.",
};

export default function CpuRamStorageDataFlowPage() {
  const content = getTopicContent("information-technology", "cpu-ram-storage-data-flow");

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
          CPU–RAM–Storage Data Flow
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Open an app, save a file, or run a program — and watch, step by
          step, where the data actually goes.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<CpuRamStorageDataFlow />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <CpuRamStorageDataFlow />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
