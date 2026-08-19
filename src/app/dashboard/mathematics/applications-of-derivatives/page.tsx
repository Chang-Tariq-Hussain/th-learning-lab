import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { ApplicationsOfDerivatives } from "@/features/subjects/mathematics/applications-of-derivatives";

export const metadata: Metadata = {
  title: "Applications of Derivatives — Increasing, Decreasing, Maxima & Minima",
  description:
    "See why derivatives are useful: increasing and decreasing regions, derivative sign, critical points, local maxima and minima, sign charts, and interactive practice.",
};

export default function ApplicationsOfDerivativesPage() {
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

      <ApplicationsOfDerivatives />

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Connect the sign of a derivative to whether a function is increasing or decreasing.",
          "Define a critical point and explain why the derivative is zero or undefined there.",
          "Identify local maxima and minima using a sign chart.",
          "Use derivative sign changes to describe a function's overall shape.",
        ]}
        concepts={[
          {
            term: "Increasing and decreasing",
            explanation:
              "Where a function's derivative is positive, the function is increasing — moving upward as x increases. Where the derivative is negative, the function is decreasing.",
            formula: "f'(x) > 0 \\Rightarrow \\text{increasing}, \\quad f'(x) < 0 \\Rightarrow \\text{decreasing}",
            formulaCaption: "Derivative sign and direction",
          },
          {
            term: "Critical points",
            explanation:
              "Points where the derivative equals zero or doesn't exist. These are the candidates for where a function might switch from increasing to decreasing, or vice versa.",
          },
          {
            term: "Local maxima and minima",
            explanation:
              "A local maximum occurs where the derivative changes from positive to negative — the function stops rising and starts falling. A local minimum occurs where it changes from negative to positive.",
          },
          {
            term: "Sign chart",
            explanation:
              "A simple diagram marking critical points along a number line and labeling the derivative's sign in each interval between them — a fast way to see a function's whole increasing/decreasing pattern at once.",
          },
        ]}
        howToUse={[
          "Look at the graphed function and find where it's rising versus falling.",
          "Locate the critical points where the slope momentarily flattens to zero.",
          "Check the sign chart to see the derivative's sign in each region.",
          "Match each sign change to a local maximum or local minimum on the graph.",
        ]}
        whyItMatters="This is exactly how derivatives get used outside the classroom — a business finds the price that maximizes profit, an engineer finds the dimensions that minimize material cost, and a physicist finds when a projectile reaches its highest point, all by locating where a derivative changes sign. The sign chart is the same tool professionals use to solve real optimization problems."
        tryThis={[
          "Find a critical point on the graph and describe, before checking, whether it's a maximum or minimum based on the curve's shape.",
          "Build the sign chart for a new function and predict where its local extrema will land before revealing them.",
          "Explain why a critical point isn't always a maximum or minimum — what else could happen there?",
        ]}
      />
    </Container>
  );
}
