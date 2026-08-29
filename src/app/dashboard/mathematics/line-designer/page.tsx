import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { LineDesigner } from "@/features/subjects/mathematics/line-designer";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { LearningPathNextTopic } from "@/features/learning-path";

export const metadata: Metadata = {
  title: "Line Designer",
  description: "Adjust slope and y-intercept sliders and watch the equation y = mx + b and its graph update together.",
};

export default function LineDesignerPage() {
  const content = getTopicContent("mathematics", "line-designer");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/line-designer" className="mb-4" />
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
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">Line Designer</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Move the m and b sliders and watch the line — and the equation y = mx + b — update together.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<LineDesigner />} />
      ) : (
        <LineDesigner />
      )}

      <LearningPathNextTopic className="mt-10" />
    </Container>
  );
}
