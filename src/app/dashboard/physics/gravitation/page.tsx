import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { Gravitation } from "@/features/subjects/physics/gravitation";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";

const SIMULATION_HREF = "/dashboard/physics/gravitation";

export const metadata: Metadata = {
  title: "Gravitation",
  description:
    "Interactive Gravitation lab — explore Newton's law of universal gravitation, compare weight across worlds, and launch a satellite into orbit under real physics.",
};

export default function GravitationPage() {
  const content = getTopicContent("physics", "gravitation");

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
          Gravitation
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Every mass attracts every other mass. Explore how mass and
          distance shape that pull, why weight isn&apos;t the same as
          mass, and how gravity alone can hold a satellite in orbit.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<Gravitation />} />
      ) : (
        <Gravitation />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
