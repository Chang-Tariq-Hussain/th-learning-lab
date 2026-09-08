import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { ChainRuleExplorer } from "@/features/subjects/mathematics/chain-rule-explorer";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { LearningPathNextTopic } from "@/features/learning-path";

export const metadata: Metadata = {
  title: "Chain Rule Explorer — Differentiating Composite Functions",
  description:
    "Build intuition for the Chain Rule by exploring composite functions: function machines, inner and outer functions, step-by-step differentiation, and Chain Rule vs Power Rule.",
};

export default function ChainRuleExplorerPage() {
  const content = getTopicContent("mathematics", "chain-rule-explorer");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/chain-rule-explorer" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Calculus", href: "/dashboard/mathematics/calculus" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Mathematics · Calculus</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Chain Rule Explorer — Differentiating Composite Functions
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          A composite function is a function inside another function. See how the output of an inner
          function feeds into an outer function, then learn how the Chain Rule connects their two rates of
          change.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<ChainRuleExplorer />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <ChainRuleExplorer />
      )}

      <LearningPathNextTopic className="mt-10" />
    </Container>
  );
}
