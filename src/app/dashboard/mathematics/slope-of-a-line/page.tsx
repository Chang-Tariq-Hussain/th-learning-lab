import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SlopeOfALine } from "@/features/subjects/mathematics/slope-of-a-line";
import { TopicLearningExperience, getTopicContent } from "@/features/learning";
import { LearningPathNextTopic } from "@/features/learning-path";

export const metadata: Metadata = {
  title: "Slope of a Line",
  description:
    "Drag two points on a coordinate plane and watch rise, run, and the right triangle build the slope of the line between them.",
};

export default function SlopeOfALinePage() {
  const content = getTopicContent("mathematics", "slope-of-a-line");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/slope-of-a-line" className="mb-4" />
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
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">Slope of a Line</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Drag point A or B and watch rise, run, and the right triangle build the slope between them.
        </p>
      </div>

      {content ? (
        <TopicLearningExperience content={content} simulation={<SlopeOfALine />} />
      ) : (
        <SlopeOfALine />
      )}

      <LearningPathNextTopic className="mt-10" />
    </Container>
  );
}
