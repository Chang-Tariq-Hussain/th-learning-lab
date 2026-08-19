import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { ProportionBuilder } from "@/features/subjects/mathematics/proportion-builder";

export const metadata: Metadata = {
  title: "Proportion Builder",
  description: "Drag a slider to find the missing value in a : b = c : d, and see visually why both sides stay equal.",
};

export default function ProportionBuilderPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/proportion-builder" className="mb-4" />
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
          Proportion Builder
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Ratio 2 is missing one number. Drag the slider until both bars split the same way.
        </p>
      </div>

      <ProportionBuilder />

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Define a proportion as two equal ratios.",
          "Solve for a missing value in a proportion using the scale factor between ratios.",
          "Explain why both ratios in a proportion must split the same way visually.",
          "Use cross multiplication as an alternative way to solve for a missing value.",
        ]}
        concepts={[
          {
            term: "Proportion",
            explanation:
              "A statement that two ratios are equal to each other. Writing a:b = c:d says the comparison between a and b is the same as the comparison between c and d.",
            formula: "a : b = c : d",
            formulaCaption: "A proportion — two equal ratios",
          },
          {
            term: "Scale factor",
            explanation:
              "The number you multiply one ratio by to get the other. If 2:3 scales up to 6:9, the scale factor is 3 — every number in the first ratio got multiplied by 3.",
          },
          {
            term: "Solving with cross multiplication",
            explanation:
              "For a proportion a:b = c:d, multiplying a by d and b by c gives two equal products. Setting them equal to each other and solving is a reliable way to find a missing value.",
            formula: "a \\times d = b \\times c",
            formulaCaption: "Cross multiplication",
          },
        ]}
        howToUse={[
          "Look at the first ratio, which is fully filled in.",
          "Drag the slider on the second ratio, which is missing one value.",
          "Watch the bars for both ratios and find the slider position where they split identically.",
          "Check your answer using the scale factor or cross multiplication.",
        ]}
        whyItMatters="Proportions are the tool behind scaling anything up or down while keeping it in the same relative shape — resizing a photo, converting a recipe from 4 servings to 10, or figuring out how much paint you need for a wall twice as big as a test patch. Once you can set up and solve a proportion, you can scale almost any two related quantities."
        tryThis={[
          "Set the first ratio to 3:4, then find the missing value that keeps 3:4 = 9:? true.",
          "Solve the same problem two ways — using the scale factor, and using cross multiplication — and compare.",
          "Predict the missing value before dragging the slider, then check yourself.",
        ]}
      />
    </Container>
  );
}
