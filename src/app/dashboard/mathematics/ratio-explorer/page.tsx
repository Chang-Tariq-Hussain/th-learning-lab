import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { RatioExplorer } from "@/features/subjects/mathematics/ratio-explorer";

import { LearningPathNextTopic } from "@/features/learning-path";
export const metadata: Metadata = {
  title: "Ratio Explorer",
  description: "Add blue and red circles to discover what a ratio means, see it simplify, and match target ratios.",
};

export default function RatioExplorerPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/ratio-explorer" className="mb-4" />
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
          Ratio Explorer
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Add blue and red circles and watch the ratio comparing them update live.
        </p>
      </div>

      <RatioExplorer />

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Explain what a ratio compares and how to write one.",
          "Simplify a ratio to its simplest form.",
          "Recognize that different-looking ratios can represent the same comparison.",
          "Use a ratio to figure out how many of each item you'd need at a larger scale.",
        ]}
        concepts={[
          {
            term: "What a ratio is",
            explanation:
              "A ratio compares two quantities, showing how much of one thing there is relative to another. A ratio of 3 to 2 means for every 3 of the first thing, there are 2 of the second.",
            formula: "a : b",
            formulaCaption: "Ratio of a to b",
          },
          {
            term: "Simplifying a ratio",
            explanation:
              "Dividing both numbers in a ratio by their greatest common factor gives the simplest form. A ratio of 6:4 simplifies to 3:2 — the comparison stays exactly the same, just with smaller numbers.",
          },
          {
            term: "Equivalent ratios",
            explanation:
              "Ratios that simplify to the same simplest form represent the same comparison, even if the actual numbers are different. 6:4, 9:6, and 3:2 are all equivalent ratios.",
          },
        ]}
        howToUse={[
          "Add blue circles and red circles and watch the ratio update as you go.",
          "Notice how the ratio simplifies automatically as you add more of each color.",
          "Try to match a target ratio by adding the right number of blue and red circles.",
          "Compare two different circle counts that end up simplifying to the same ratio.",
        ]}
        whyItMatters="Ratios are everywhere once you start looking: a recipe that serves 4 people uses ratios to scale up to 8, paint colors are mixed using ratios, and maps use a ratio to relate distance on paper to distance in real life. Once you're comfortable simplifying and comparing ratios, scaling any recipe, mixture, or map becomes a matter of simple multiplication."
        tryThis={[
          "Build a ratio of 4 blue to 2 red circles. What's its simplest form?",
          "Find two different circle counts that both simplify to a 2:1 ratio.",
          "Predict how many red circles you'd need to keep a 3:1 ratio if you have 9 blue circles.",
        ]}
      />
      <LearningPathNextTopic className="mt-10" />

      </Container>
  );
}
