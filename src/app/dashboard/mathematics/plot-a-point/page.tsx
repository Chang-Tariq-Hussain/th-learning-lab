import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { PlotAPoint } from "@/features/subjects/mathematics/plot-a-point";
import { TopicLearningExperience, getTopicContent } from "@/features/learning";
import { LearningPathNextTopic } from "@/features/learning-path";

export const metadata: Metadata = {
  title: "Plot a Point",
  description: "Given a coordinate, place the point on the Cartesian plane — a short, focused plotting challenge.",
};

export default function PlotAPointPage() {
  const content = getTopicContent("mathematics", "plot-a-point");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/plot-a-point" className="mb-4" />
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
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">Plot a Point</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          You&apos;ll be given a coordinate like (4, 3) — tap or click the grid to plot it.
        </p>
      </div>

      {content ? (
        <TopicLearningExperience content={content} simulation={<PlotAPoint />} />
      ) : (
        <PlotAPoint />
      )}

      <LearningPathNextTopic className="mt-10" />
    </Container>
  );
}
