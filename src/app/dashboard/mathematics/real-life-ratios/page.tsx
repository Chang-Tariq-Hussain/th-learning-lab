import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { RealLifeRatios } from "@/features/subjects/mathematics/real-life-ratios";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { LearningPathNextTopic } from "@/features/learning-path";

export const metadata: Metadata = {
  title: "Real-Life Ratios",
  description: "Solve illustrated ratio problems — paint mixing, recipes, marbles, trees, and more.",
};

export default function RealLifeRatiosPage() {
  const content = getTopicContent("mathematics", "real-life-ratios");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/real-life-ratios" className="mb-4" />
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
          Real-Life Ratios
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          A new illustrated scenario every round — figure out how many keep the ratio the same.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<RealLifeRatios />} />
      ) : (
        <RealLifeRatios />
      )}

      <LearningPathNextTopic className="mt-10" />
    </Container>
  );
}
