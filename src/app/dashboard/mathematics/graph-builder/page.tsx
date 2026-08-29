import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { GraphBuilder } from "@/features/subjects/mathematics/graph-builder";
import { TopicLearningExperience, getTopicContent } from "@/features/learning";
import { LearningPathNextTopic } from "@/features/learning-path";

export const metadata: Metadata = {
  title: "Graphs & Data Visualization",
  description: "Edit a dataset's values and see it rendered as a bar graph, pie chart, or line graph.",
};

export default function GraphBuilderPage() {
  const content = getTopicContent("mathematics", "graph-builder");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/graph-builder" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Statistics", href: "/dashboard/mathematics/statistics" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">
          Mathematics · Statistics
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Graphs & Data Visualization
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Edit a dataset&apos;s values and watch it become a bar graph, pie chart, or line graph — and learn when
          each one fits.
        </p>
      </div>

      {content ? (
        <TopicLearningExperience content={content} simulation={<GraphBuilder />} />
      ) : (
        <GraphBuilder />
      )}

      <LearningPathNextTopic className="mt-10" />
    </Container>
  );
}
