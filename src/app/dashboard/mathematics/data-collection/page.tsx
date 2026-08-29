import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { DataCollectionLab } from "@/features/subjects/mathematics/data-collection";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { LearningPathNextTopic } from "@/features/learning-path";

export const metadata: Metadata = {
  title: "Data Collection & Representation",
  description:
    "Collect survey observations and watch the same data become a raw list, a frequency table, and a bar graph.",
};

export default function DataCollectionPage() {
  const content = getTopicContent("mathematics", "data-collection");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/data-collection" className="mb-4" />
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
          Data Collection & Representation
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Collect observations one at a time and watch the same data become a raw list, a frequency table, and a
          bar graph.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<DataCollectionLab />} />
      ) : (
        <DataCollectionLab />
      )}

      <LearningPathNextTopic className="mt-10" />
    </Container>
  );
}
