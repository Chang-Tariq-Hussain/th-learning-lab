import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CircularMotion } from "@/features/subjects/physics/circular-motion";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/physics/circular-motion";

export const metadata: Metadata = {
  title: "Circular Motion",
  description:
    "Interactive Circular Motion lab — send an object around a circle at constant speed and see why it's still accelerating, with live velocity and centripetal force vectors.",
};

export default function CircularMotionPage() {
  const content = getTopicContent("physics", "circular-motion");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Physics", href: "/dashboard/physics" },
          { label: "Circular Motion & Gravitation", href: "/dashboard/physics/circular-motion-and-gravitation" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
          Physics · Circular Motion &amp; Gravitation
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Circular Motion
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Set a radius and speed and watch an object travel around a
          circle — constant speed, but a velocity direction that never
          stops changing, which is exactly why it&apos;s always accelerating
          toward the center.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<CircularMotion />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <CircularMotion />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
