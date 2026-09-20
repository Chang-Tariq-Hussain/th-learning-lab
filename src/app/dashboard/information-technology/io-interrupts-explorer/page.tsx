import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { IoInterruptsExplorer } from "@/features/subjects/information-technology/io-interrupts-explorer";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/information-technology/io-interrupts-explorer";

export const metadata: Metadata = {
  title: "I/O & Interrupts Explorer",
  description:
    "Generate device events and watch how a computer responds — device controllers, polling vs interrupts, the ISR, interrupt priority, masking, vectors, memory-mapped I/O, and DMA.",
};

export default function IoInterruptsExplorerPage() {
  const content = getTopicContent("information-technology", "io-interrupts-explorer");

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
          I/O &amp; Interrupts Explorer
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          How does a computer respond when a keyboard, mouse, disk, network adapter, or timer needs the CPU&apos;s attention? Generate device events, compare
          polling with interrupts, trace an interrupt service routine, manage several interrupts at once, and experiment with DMA.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<IoInterruptsExplorer />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <IoInterruptsExplorer />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
