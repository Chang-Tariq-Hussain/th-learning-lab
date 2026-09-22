import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { NumberSystemsDataUnits } from "@/features/subjects/information-technology/number-systems-data-units";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/information-technology/number-systems-data-units";

export const metadata: Metadata = {
  title: "Number Systems & Data Units",
  description:
    "Convert between decimal, binary, octal, and hexadecimal; explore place value; and work through bits, bytes, KB/MB/GB/TB vs KiB/MiB/GiB/TiB, storage, network transfer rates, memory addresses, and two's complement.",
};

export default function NumberSystemsDataUnitsPage() {
  const content = getTopicContent("information-technology", "number-systems-data-units");

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
          Number Systems &amp; Data Units
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Convert between decimal, binary, octal, and hexadecimal; see place value at work; and connect bits and bytes to KB/MB/GB/TB, KiB/MiB/GiB/TiB,
          storage sizes, network transfer rates, memory addresses, and signed integers.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<NumberSystemsDataUnits />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <NumberSystemsDataUnits />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
