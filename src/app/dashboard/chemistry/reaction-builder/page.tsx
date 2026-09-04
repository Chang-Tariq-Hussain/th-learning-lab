import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";
import { ReactionBuilder } from "@/features/subjects/chemistry/reaction-builder";
import { getTopicContent, TopicExperience } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/chemistry/reaction-builder";

export const metadata: Metadata = {
  title: "Chemical Reaction Builder",
  description:
    "Step through simple reactions like 2H₂ + O₂ → 2H₂O and see how atoms rearrange without being created or destroyed.",
};

export default function ReactionBuilderPage() {
  const content = getTopicContent("chemistry", "reaction-builder");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          {
            label: "Chemical Reactions",
            href: "/dashboard/chemistry/chemical-reactions",
          },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Chemical Reactions
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Chemical Reaction Builder
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Pick a reaction and watch bonds break, atoms rearrange, and new bonds
          form — while the number of each atom stays exactly the same.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<ReactionBuilder />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <ReactionBuilder />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
