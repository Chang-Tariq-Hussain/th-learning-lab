import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { RatioComparison } from "@/features/subjects/mathematics/ratio-comparison";
import { TopicLearningExperience, getTopicContent } from "@/features/learning";
import { LearningPathNextTopic } from "@/features/learning-path";

export const metadata: Metadata = {
  title: "Ratio Comparison",
  description: "Drag sliders on two ratios and see instantly whether they're equivalent — and why.",
};

export default function RatioComparisonPage() {
  const content = getTopicContent("mathematics", "ratio-comparison");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/ratio-comparison" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Ratios", href: "/dashboard/mathematics/ratios" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">
          Mathematics · Ratios
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Ratio Comparison
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Drag the sliders on both ratios and watch whether their bars line up.
        </p>
      </div>

      {content ? (
        <TopicLearningExperience content={content} simulation={<RatioComparison />} />
      ) : (
        <RatioComparison />
      )}

      <LearningPathNextTopic className="mt-10" />
    </Container>
  );
}
