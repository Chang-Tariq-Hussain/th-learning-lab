import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { DataComparisonLab } from "@/features/subjects/mathematics/data-comparison";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { LearningPathNextTopic } from "@/features/learning-path";

export const metadata: Metadata = {
  title: "Data Interpretation & Comparison",
  description: "Compare two datasets side by side — mean, median, range, and a chart, all updating together.",
};

export default function DataComparisonPage() {
  const content = getTopicContent("mathematics", "data-comparison");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/data-comparison" className="mb-4" />
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
          Data Interpretation & Comparison
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Edit two datasets side by side and watch mean, median, range, and a chart update together — then decide
          which one is more consistent.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<DataComparisonLab />} />
      ) : (
        <DataComparisonLab />
      )}

      <LearningPathNextTopic className="mt-10" />
    </Container>
  );
}
