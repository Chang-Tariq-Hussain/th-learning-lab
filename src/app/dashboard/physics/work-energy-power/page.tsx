import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { WorkEnergyPower } from "@/features/subjects/physics/work-energy-power";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/physics/work-energy-power";

export const metadata: Metadata = {
  title: "Work, Energy & Power",
  description:
    "Interactive Work, Energy & Power lab — push a box to see mechanical work, compare kinetic and potential energy, and race machines to see power in action.",
};

export default function WorkEnergyPowerPage() {
  const content = getTopicContent("physics", "work-energy-power");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Physics", href: "/dashboard/physics" },
          { label: "Newtonian Mechanics", href: "/dashboard/physics/newtonian-mechanics" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
          Physics · Newtonian Mechanics
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Work, Energy &amp; Power
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Push a box to see how force and displacement combine into
          mechanical work, compare kinetic and potential energy side by
          side, and race two machines to see what power really measures.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<WorkEnergyPower />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <WorkEnergyPower />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
