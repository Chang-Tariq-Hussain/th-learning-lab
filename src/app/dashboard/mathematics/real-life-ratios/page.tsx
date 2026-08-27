import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { RealLifeRatios } from "@/features/subjects/mathematics/real-life-ratios";

import { LearningPathNextTopic } from "@/features/learning-path";
export const metadata: Metadata = {
  title: "Real-Life Ratios",
  description: "Solve illustrated ratio problems — paint mixing, recipes, marbles, trees, and more.",
};

export default function RealLifeRatiosPage() {
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

      <RealLifeRatios />

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Translate a real-world scenario into a ratio.",
          "Scale a ratio up or down to solve a practical problem.",
          "Recognize ratios hiding in everyday situations like recipes, mixtures, and groups.",
          "Check whether a proposed quantity keeps a given ratio the same.",
        ]}
        concepts={[
          {
            term: "Spotting the ratio",
            explanation:
              "Real-world ratio problems rarely say the word \"ratio\" outright. Phrases like \"for every,\" \"per,\" or \"mixed with\" are usually signals that two quantities are being compared.",
          },
          {
            term: "Scaling a real-world ratio",
            explanation:
              "Once you know the ratio, scaling it up or down means multiplying both quantities by the same factor — if a paint mix uses 1 part blue to 3 parts white, doubling the batch means 2 parts blue to 6 parts white.",
          },
          {
            term: "Keeping the ratio the same",
            explanation:
              "A mixture, recipe, or group only keeps its intended proportions if every quantity scales by the identical factor. Changing just one quantity without adjusting the others breaks the ratio.",
          },
        ]}
        howToUse={[
          "Read the scenario carefully and identify the two quantities being compared.",
          "Figure out the ratio those quantities represent.",
          "Solve for how many of each item are needed to keep that same ratio at a new scale.",
          "Submit your answer and move on to the next illustrated scenario.",
        ]}
        whyItMatters="This is exactly the kind of ratio reasoning you use scaling a recipe for a dinner party, mixing cleaning solution to the right strength, or figuring out how much fertilizer a garden needs based on its size. Ratios in the real world are almost always dressed up in a story first — learning to spot them quickly is what actually makes the math useful."
        tryThis={[
          "Before solving, write down in your own words what ratio the scenario is describing.",
          "After solving, double-check that your answer keeps the exact same ratio as the original scenario.",
          "Try to think of one more real-life situation, outside this simulation, that hides a ratio.",
        ]}
      />
      <LearningPathNextTopic className="mt-10" />

      </Container>
  );
}
