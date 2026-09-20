import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CacheMemoryExplorer } from "@/features/subjects/information-technology/cache-memory-explorer";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/information-technology/cache-memory-explorer";

export const metadata: Metadata = {
  title: "Cache Memory Explorer",
  description:
    "Explore why CPUs use cache memory and how it works — cache hits and misses, hit rate, locality, cache lines, eviction, replacement policies, mapping, and the effect on average access time, in a hands-on Cache Memory Laboratory.",
};

export default function CacheMemoryExplorerPage() {
  const content = getTopicContent("information-technology", "cache-memory-explorer");

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
          Cache Memory Explorer
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          The CPU can work far faster than main memory can supply data. Discover how a small, fast cache keeps copies of
          useful data close to the CPU — and run your own experiments with hits, misses, locality, cache lines, eviction,
          and performance in a Cache Memory Laboratory.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<CacheMemoryExplorer />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <CacheMemoryExplorer />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
