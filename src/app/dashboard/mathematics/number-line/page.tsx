import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { NumberLine } from "@/features/subjects/mathematics/number-line";

export const metadata: Metadata = {
  title: "Interactive Number Line",
  description: "Drag a marker along a number line from -20 to +20 to learn positive numbers, negative numbers, zero, and absolute value.",
};

export default function NumberLinePage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/number-line" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Number Sense", href: "/dashboard/mathematics/number-sense" },
        ]}
        className="mb-6"
      />

      <div className="mb-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Mathematics · Number Sense</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Interactive Number Line
        </h1>
      </div>

      <NumberLine />

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Locate positive numbers, negative numbers, and zero on a number line.",
          "Explain what zero represents as the dividing point on the line.",
          "Define absolute value as distance from zero.",
          "Compare two numbers by their position on the number line.",
        ]}
        concepts={[
          {
            term: "Positive and negative numbers",
            explanation:
              "Positive numbers sit to the right of zero, negative numbers sit to the left. Moving right always means getting larger, moving left always means getting smaller — even among negative numbers.",
          },
          {
            term: "Zero",
            explanation:
              "The point that separates positive numbers from negative numbers. Zero itself is neither positive nor negative.",
          },
          {
            term: "Absolute value",
            explanation:
              "The distance a number sits from zero, always given as a non-negative value. Both 5 and -5 have an absolute value of 5, since both are exactly 5 units away from zero.",
            formula: "|{-5}| = 5",
            formulaCaption: "Absolute value of -5",
          },
        ]}
        howToUse={[
          "Drag the marker along the number line and watch its value update.",
          "Move the marker into negative territory and notice how the value changes sign.",
          "Compare the marker's distance from zero on the positive and negative sides.",
          "Place the marker at two different numbers with the same absolute value and compare their positions.",
        ]}
        whyItMatters="Number lines make sense of ideas that feel abstract otherwise, like why -10 is smaller than -3, or why a temperature of -5 degrees is colder than 2 degrees even though 5 is bigger than 2 as a plain number. This same mental model of positive, negative, and distance-from-zero also underlies bank balances, elevation above and below sea level, and countless real-world measurements."
        tryThis={[
          "Place the marker at -8 and -8's opposite. What do you notice about their positions and distances from zero?",
          "Predict which of two negative numbers is larger before checking their positions on the line.",
          "Find two different numbers with an absolute value of 12.",
        ]}
      />
    </Container>
  );
}
