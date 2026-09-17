import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { FileSystemExplorer } from "@/features/subjects/information-technology/file-system-explorer";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/information-technology/file-system-explorer";

export const metadata: Metadata = {
  title: "File System Explorer",
  description:
    "Explore a virtual file system — navigate folders, trace file paths, see how files occupy storage blocks, and step through open/save/delete operations.",
};

export default function FileSystemExplorerPage() {
  const content = getTopicContent("information-technology", "file-system-explorer");

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
          File System Explorer
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Files don&apos;t just disappear into storage — the operating system organizes them into folders,
          paths, and storage blocks it can find again. Explore a virtual file system to see how.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<FileSystemExplorer />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <FileSystemExplorer />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
