import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { BinaryDataRepresentation } from "@/features/subjects/information-technology/binary-data-representation";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/information-technology/binary-data-representation";

export const metadata: Metadata = {
  title: "Binary & Data Representation",
  description:
    "Toggle bits in an interactive Binary Data Laboratory to see how computers represent numbers and characters as 0s and 1s.",
};

export default function BinaryDataRepresentationPage() {
  const content = getTopicContent("information-technology", "binary-data-representation");

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
          Binary & Data Representation
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Toggle bits, build numbers, decode bytes, and encode characters —
          and see exactly how computers represent data using only 0s and 1s.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<BinaryDataRepresentation />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <BinaryDataRepresentation />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
