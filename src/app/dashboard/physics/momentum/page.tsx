import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { Momentum } from "@/features/subjects/physics/momentum";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/physics/momentum";

export const metadata: Metadata = {
  title: "Momentum",
  description:
    "Interactive Momentum lab — push skaters apart, collide two carts, and watch mass times velocity stay conserved through elastic and inelastic collisions.",
};

export default function MomentumPage() {
  const content = getTopicContent("physics", "momentum");

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
          Momentum
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Push two skaters apart or launch a collision between two carts —
          watch mass times velocity, p = mv, add up to a quantity that stays
          exactly conserved no matter how the collision plays out.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<Momentum />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <Momentum />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
