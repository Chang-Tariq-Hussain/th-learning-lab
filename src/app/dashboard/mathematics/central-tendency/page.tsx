import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CentralTendency } from "@/features/subjects/mathematics/central-tendency";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { LearningPathNextTopic } from "@/features/learning-path";

export const metadata: Metadata = {
  title: "Measures of Central Tendency — Mean, Median, Mode & Range",
  description:
    "Build intuition for mean, median, mode, and range with a balancing-point visualization, sorting, frequency charts, and an outlier comparison.",
};

export default function CentralTendencyPage() {
  const content = getTopicContent("mathematics", "central-tendency");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/central-tendency" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Statistics", href: "/dashboard/mathematics/statistics" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-label uppercase tracking-eyebrow text-subject-math">
          Mathematics · Statistics
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Measures of Central Tendency — Mean, Median, Mode & Range
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Edit a dataset and watch mean, median, mode, and range respond — then see why an outlier can shift the
          mean far more than the median.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<CentralTendency />} />
      ) : (
        <CentralTendency />
      )}

      <LearningPathNextTopic className="mt-10" />
    </Container>
  );
}
