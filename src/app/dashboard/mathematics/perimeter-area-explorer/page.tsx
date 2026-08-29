import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { PerimeterAreaExplorer } from "@/features/subjects/mathematics/perimeter-area-explorer";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { LearningPathNextTopic } from "@/features/learning-path";

export const metadata: Metadata = {
  title: "Perimeter & Area Explorer — Measuring 2D Shapes",
  description:
    "Discover perimeter and area visually — count around a boundary, count unit squares, resize a rectangle live, and see why the same perimeter can enclose very different areas.",
};

export default function PerimeterAreaExplorerPage() {
  const content = getTopicContent("mathematics", "perimeter-area-explorer");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/perimeter-area-explorer" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Measurement", href: "/dashboard/mathematics/measurement" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Mathematics · Measurement</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Perimeter & Area Explorer — Measuring 2D Shapes
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Count around a boundary, count unit squares, resize a rectangle live, and discover why shapes with the
          same perimeter can cover very different areas.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<PerimeterAreaExplorer />} />
      ) : (
        <PerimeterAreaExplorer />
      )}

      <LearningPathNextTopic className="mt-10" />
    </Container>
  );
}
