import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CoordinatePlaneExplorer } from "@/features/subjects/mathematics/coordinate-plane-explorer";
import { TopicLearningExperience, getTopicContent } from "@/features/learning";
import { LearningPathNextTopic } from "@/features/learning-path";

export const metadata: Metadata = {
  title: "Coordinate Plane Explorer",
  description:
    "Drag a point around an interactive Cartesian grid to learn the x-axis, y-axis, origin, coordinates, and the four quadrants.",
};

export default function CoordinatePlaneExplorerPage() {
  const content = getTopicContent("mathematics", "coordinate-plane-explorer");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/coordinate-plane-explorer" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Coordinate Geometry", href: "/dashboard/mathematics/coordinate-geometry" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">
          Mathematics · Coordinate Geometry
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Coordinate Plane Explorer
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Drag the point, hover the grid, and click a quadrant or the origin to learn how coordinates work.
        </p>
      </div>

      {content ? (
        <TopicLearningExperience content={content} simulation={<CoordinatePlaneExplorer />} />
      ) : (
        <CoordinatePlaneExplorer />
      )}

      <LearningPathNextTopic className="mt-10" />
    </Container>
  );
}
