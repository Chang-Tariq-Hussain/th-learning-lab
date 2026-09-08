import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { DerivativeRules } from "@/features/subjects/mathematics/derivative-rules";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { LearningPathNextTopic } from "@/features/learning-path";

export const metadata: Metadata = {
  title: "Derivative Rules — Learn Differentiation Step by Step",
  description:
    "Learn the constant, power, constant multiple, sum, difference, product, and quotient rules for differentiation, one visual step at a time.",
};

export default function DerivativeRulesPage() {
  const content = getTopicContent("mathematics", "derivative-rules");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/derivative-rules" className="mb-4" />
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
          Derivative Rules — Learn Differentiation Step by Step
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Now that you know what a derivative means, learn how to calculate one: the constant, power,
          constant multiple, sum, difference, product, and quotient rules — each taught visually, one step
          at a time.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<DerivativeRules />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <DerivativeRules />
      )}

      <LearningPathNextTopic className="mt-10" />
    </Container>
  );
}
