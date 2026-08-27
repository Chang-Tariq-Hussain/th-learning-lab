import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { CrossMultiplicationExplorer } from "@/features/subjects/mathematics/cross-multiplication-explorer";

import { LearningPathNextTopic } from "@/features/learning-path";
export const metadata: Metadata = {
  title: "Cross Multiplication Explorer",
  description: "Watch the two diagonal multiplications animate to see why 2/3 = 4/6 — then try your own fractions.",
};

export default function CrossMultiplicationExplorerPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/cross-multiplication-explorer" className="mb-4" />
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
          Cross Multiplication Explorer
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Watch each diagonal multiplication animate in turn, then change any number to test a new pair of fractions.
        </p>
      </div>

      <CrossMultiplicationExplorer />

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Perform cross multiplication on two fractions to test if they're equal.",
          "Explain why multiplying diagonally works as a shortcut for comparing fractions.",
          "Use cross multiplication to solve for an unknown value in an equation of fractions.",
          "Recognize when cross multiplication is the fastest tool for a problem.",
        ]}
        concepts={[
          {
            term: "Cross multiplication",
            explanation:
              "For two fractions set equal to each other, multiply the numerator of one by the denominator of the other, on both diagonals. If the two results match, the fractions are equal.",
            formula: "\\dfrac{a}{b} = \\dfrac{c}{d} \\;\\Rightarrow\\; a \\times d = b \\times c",
            formulaCaption: "Cross multiplication",
          },
          {
            term: "Why it works",
            explanation:
              "Cross multiplication is really just clearing the denominators from both sides of the equation at once, which turns a fraction comparison into a simple multiplication comparison — same idea, faster to compute.",
          },
          {
            term: "Solving for an unknown",
            explanation:
              "If one number in the equation is missing, cross multiplying turns the problem into a simple one-step (or two-step) equation you can solve directly for that unknown.",
          },
        ]}
        howToUse={[
          "Look at the two fractions shown, set equal to each other.",
          "Watch each diagonal multiplication animate one at a time.",
          "Compare the two diagonal products to confirm whether the fractions are equal.",
          "Change a number in either fraction and see how the diagonal products respond.",
        ]}
        whyItMatters="Cross multiplication is one of the fastest tools for comparing fractions or solving for a missing value in a proportion, and it shows up constantly in unit conversions, recipe scaling, and map-reading, where you're regularly setting one ratio equal to another and solving for what's missing."
        tryThis={[
          "Change one fraction so the two are no longer equal — watch how the diagonal products stop matching.",
          "Use cross multiplication by hand to solve for a missing number, then check it against the simulation.",
          "Think of a proportion problem from real life where cross multiplication would be the fastest way to solve it.",
        ]}
      />
      <LearningPathNextTopic className="mt-10" />

      </Container>
  );
}
