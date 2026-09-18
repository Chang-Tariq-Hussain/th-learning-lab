import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CpuArchitectureInstructionCycle } from "@/features/subjects/information-technology/cpu-architecture-instruction-cycle";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/information-technology/cpu-architecture-instruction-cycle";

export const metadata: Metadata = {
  title: "CPU Architecture & Instruction Cycle",
  description:
    "Step through Fetch, Decode, Execute, and Write Back inside a Virtual CPU Laboratory — watch the Program Counter, registers, ALU, and flags change as a small program runs.",
};

export default function CpuArchitectureInstructionCyclePage() {
  const content = getTopicContent("information-technology", "cpu-architecture-instruction-cycle");

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
          CPU Architecture & Instruction Cycle
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Step a small simulated program through Fetch, Decode, Execute, and Write Back — and watch the Program
          Counter, Instruction Register, registers, ALU, and flags change inside a Virtual CPU Laboratory.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<CpuArchitectureInstructionCycle />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <CpuArchitectureInstructionCycle />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
