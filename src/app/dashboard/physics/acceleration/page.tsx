import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { NewtonsLaws } from "@/features/subjects/physics/newtons-laws";
import { TopicLearningExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/physics/acceleration";

export const metadata: Metadata = {
  title: "Acceleration",
  description:
    "Apply a force and watch acceleration respond to F = ma in real time, using Newton's Laws Lab.",
};

export default function AccelerationPage() {
  const content = getTopicContent("physics", "acceleration");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Physics", href: "/dashboard/physics" },
          { label: "Kinematics", href: "/dashboard/physics/kinematics" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
          Physics · Kinematics
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Acceleration
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Set a mass and a force and watch F = ma play out live — using the
          same interactive lab you&apos;ll return to for Newton&apos;s Laws.
        </p>
      </div>

      {content ? (
        <TopicLearningExperience content={content} simulation={<NewtonsLaws />} />
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
