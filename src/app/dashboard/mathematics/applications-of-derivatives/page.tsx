import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { ApplicationsOfDerivatives } from "@/features/subjects/mathematics/applications-of-derivatives";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { LearningPathNextTopic } from "@/features/learning-path";

export const metadata: Metadata = {
  title: "Applications of Derivatives — Increasing, Decreasing, Maxima & Minima",
  description:
    "See why derivatives are useful: increasing and decreasing regions, derivative sign, critical points, local maxima and minima, sign charts, and interactive practice.",
};

export default function ApplicationsOfDerivativesPage() {
  const content = getTopicContent("mathematics", "applications-of-derivatives");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/applications-of-derivatives" className="mb-4" />
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
          Applications of Derivatives — Increasing, Decreasing, Maxima &amp; Minima
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          A positive derivative means a function is increasing. A negative derivative means it&apos;s
          decreasing. See how that one idea locates every local maximum and minimum.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<ApplicationsOfDerivatives />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <ApplicationsOfDerivatives />
      )}

      <LearningPathNextTopic className="mt-10" />
    </Container>
  );
}
