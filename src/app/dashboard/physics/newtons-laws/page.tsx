import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { NewtonsLaws } from "@/features/subjects/physics/newtons-laws";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/physics/newtons-laws";

export const metadata: Metadata = {
  title: "Newton's Laws of Motion",
  description:
    "An interactive laboratory for Newton's Three Laws of Motion — inertia, F = ma, and action-reaction, explored through experimentation rather than memorization.",
};

export default function NewtonsLawsPage() {
  const content = getTopicContent("physics", "newtons-laws");

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
          Newton&apos;s Laws of Motion
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Inertia, F = ma, and action-reaction — pushed, pulled, and collided
          with in real time. Three laws, one shared physics engine, built to be
          experimented with rather than memorized.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<NewtonsLaws />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <NewtonsLaws />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
