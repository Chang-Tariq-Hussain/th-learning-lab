import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { DistanceBetweenTwoPoints } from "@/features/subjects/mathematics/distance-between-two-points";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { LearningPathNextTopic } from "@/features/learning-path";

export const metadata: Metadata = {
  title: "Distance Between Two Points",
  description:
    "Drag two points on a coordinate plane and watch the right triangle between them reveal the distance formula.",
};

export default function DistanceBetweenTwoPointsPage() {
  const content = getTopicContent("mathematics", "distance-between-two-points");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/distance-between-two-points" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Coordinate Geometry", href: "/dashboard/mathematics/coordinate-geometry" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Mathematics · Coordinate Geometry</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">Distance Between Two Points</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Drag point A or B and watch Δx, Δy, and the right triangle build the distance between them.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<DistanceBetweenTwoPoints />} />
      ) : (
        <DistanceBetweenTwoPoints />
      )}

      <LearningPathNextTopic className="mt-10" />
    </Container>
  );
}
