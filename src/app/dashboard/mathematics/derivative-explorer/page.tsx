import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";
import { DerivativeExplorer } from "@/features/subjects/mathematics/derivative-explorer";

const SIMULATION_HREF = "/dashboard/mathematics/derivative-explorer";

import { LearningPathNextTopic } from "@/features/learning-path";
export const metadata: Metadata = {
  title: "Derivative Explorer — Tangent Line & Instantaneous Rate of Change",
  description:
    "See a derivative before you calculate one: secant lines, points getting closer, tangent lines, and the instantaneous rate of change.",
};

export default function DerivativeExplorerPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/derivative-explorer" className="mb-4" />
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
          Derivative Explorer — Tangent Line & Instantaneous Rate of Change
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Watch a secant line rotate into a tangent line as two points become one — and see why its slope is
          called the derivative.
        </p>
      </div>

      <DerivativeExplorer />

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Explain what a secant line represents on a graph.",
          "Describe what happens to a secant line as its two points move closer together.",
          "Define a tangent line as the limit of secant lines.",
          "Connect the tangent line's slope to the idea of a derivative.",
        ]}
        concepts={[
          {
            term: "Secant line",
            explanation:
              "A straight line connecting two distinct points on a curve. Its slope represents the average rate of change of the function between those two points.",
          },
          {
            term: "Points getting closer",
            explanation:
              "As the second point on the secant line slides closer and closer to the first, the secant line rotates and starts to hug the curve more tightly around that one point.",
          },
          {
            term: "Tangent line",
            explanation:
              "The line the secant line approaches as the two points merge into one — it touches the curve at exactly that single point and matches the curve's direction there.",
          },
          {
            term: "Derivative as slope",
            explanation:
              "The slope of the tangent line at a point is called the derivative of the function at that point. It measures the instantaneous rate of change, rather than the average rate of change over an interval.",
          },
        ]}
        howToUse={[
          "Watch the secant line connecting two points on the curve.",
          "Drag the second point closer to the first and watch the secant line's slope change.",
          "Keep moving the point closer until the secant line settles into the tangent line.",
          "Read off the tangent line's slope as the derivative at that point.",
        ]}
        whyItMatters="This transition from average rate of change to instantaneous rate of change is the entire idea behind a derivative, and it's how you get from a speedometer's constant readout to describing the exact speed of a car at one precise instant. Every derivative formula you'll learn afterward is just a faster way to compute what this tangent-line process already shows you visually."
        tryThis={[
          "Move the second point extremely close to the first and estimate the slope by eye before checking the exact value.",
          "Compare the tangent line's slope at a steep part of the curve versus a flat part. What does that tell you about the derivative there?",
          "Explain in your own words why a secant line's slope is called an average rate of change but a tangent line's slope is called instantaneous.",
        ]}
      />

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
      <LearningPathNextTopic className="mt-10" />

      </Container>
  );
}
