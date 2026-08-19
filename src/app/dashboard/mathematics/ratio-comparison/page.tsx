import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { RatioComparison } from "@/features/subjects/mathematics/ratio-comparison";

export const metadata: Metadata = {
  title: "Ratio Comparison",
  description: "Drag sliders on two ratios and see instantly whether they're equivalent — and why.",
};

export default function RatioComparisonPage() {
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

      <RatioComparison />

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Determine whether two ratios are equivalent.",
          "Explain what it means for two ratios to \"line up\" visually.",
          "Use cross multiplication or simplifying to check equivalence numerically.",
          "Spot the difference between two ratios that look similar but aren't equal.",
        ]}
        concepts={[
          {
            term: "Equivalent ratios",
            explanation:
              "Two ratios are equivalent when they represent the same comparison, even if the actual numbers are different. 1:2 and 3:6 are equivalent, since both describe \"half as much.\"",
          },
          {
            term: "Checking equivalence",
            explanation:
              "One reliable way to check is cross multiplying: for a:b and c:d, they're equivalent if a × d equals b × c. If both products match, the ratios are equal.",
            formula: "\\dfrac{a}{b} = \\dfrac{c}{d} \\iff a \\times d = b \\times c",
            formulaCaption: "Cross-multiplication test for equivalence",
          },
          {
            term: "Why the bars line up",
            explanation:
              "When two ratios are equivalent, splitting a bar according to each ratio produces the exact same proportional split — that's why matching bars visually confirms what the cross-multiplication check proves numerically.",
          },
        ]}
        howToUse={[
          "Drag the sliders on the first ratio bar to set your starting comparison.",
          "Drag the sliders on the second ratio bar and watch whether the two bars line up.",
          "When they match, check the two ratios' numbers against each other to see the pattern.",
          "Try to find two ratios that look close but aren't actually equivalent.",
        ]}
        whyItMatters="Recognizing equivalent ratios is what lets you scale a recipe up or down, compare prices per unit while shopping, or check if a map's scale matches the real distances it represents. It's the same skill whether you're comparing 2:3 to 4:6 on a screen or comparing a small batch of paint mix to a large one in real life."
        tryThis={[
          "Set the first ratio to 2:3, then find a different-looking ratio that's equivalent to it.",
          "Use cross multiplication to verify your answer instead of just checking visually.",
          "Try to build two ratios that are close in value but not actually equivalent — how far off are they?",
        ]}
      />
    </Container>
  );
}
