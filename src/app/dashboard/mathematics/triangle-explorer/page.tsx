import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { TriangleExplorer } from "@/features/subjects/mathematics/triangle-explorer";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { LearningPathNextTopic } from "@/features/learning-path";

export const metadata: Metadata = {
  title: "Triangle Explorer",
  description: "Drag a triangle's vertices to explore side lengths, angles, classification, the angle sum theorem, and the Pythagorean theorem.",
};

export default function TriangleExplorerPage() {
  const content = getTopicContent("mathematics", "triangle-explorer");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/triangle-explorer" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Geometry", href: "/dashboard/mathematics/geometry" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">
          Mathematics · Geometry
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Triangle Explorer
        </h1>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<TriangleExplorer />} />
      ) : (
        <TriangleExplorer />
      )}

      <LearningPathNextTopic className="mt-10" />
    </Container>
  );
}
