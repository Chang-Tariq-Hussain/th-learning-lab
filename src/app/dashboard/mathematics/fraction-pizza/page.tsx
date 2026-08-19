import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { FractionPizza } from "@/features/subjects/mathematics/fraction-pizza";

export const metadata: Metadata = {
  title: "Fraction Pizza",
  description:
    "Cut a pizza into slices and click to select them, learning fractions, decimals, and percentages by eating instead of solving.",
};

export default function FractionPizzaPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/fraction-pizza" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Fractions", href: "/dashboard/mathematics/fractions" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">
          Mathematics · Fractions
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Fraction Pizza
        </h1>
      </div>

      <FractionPizza />

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Explain what the numerator and denominator of a fraction represent.",
          "Convert a fraction of a pizza into a decimal and a percentage.",
          "Compare two fractions to see which represents more of the pizza.",
          "Recognize that different fractions can represent the same amount.",
        ]}
        concepts={[
          {
            term: "Numerator and denominator",
            explanation:
              "The denominator (bottom number) tells you how many equal slices the pizza is cut into. The numerator (top number) tells you how many of those slices you've selected.",
            formula: "\\dfrac{\\text{numerator}}{\\text{denominator}}",
            formulaCaption: "Slices selected ÷ total slices",
          },
          {
            term: "Fractions as decimals",
            explanation:
              "Dividing the numerator by the denominator converts a fraction into a decimal. Selecting 3 out of 4 slices is the fraction 3/4, which equals the decimal 0.75.",
          },
          {
            term: "Fractions as percentages",
            explanation:
              "Multiplying a fraction's decimal form by 100 converts it into a percentage. 0.75 becomes 75%, meaning you've selected 75% of the whole pizza.",
          },
          {
            term: "Equivalent fractions",
            explanation:
              "Fractions like 1/2, 2/4, and 4/8 all represent the exact same amount of pizza, just cut into a different number of slices. The amount selected doesn't change, only how finely it's divided.",
          },
        ]}
        howToUse={[
          "Cut the pizza into a chosen number of slices.",
          "Click slices to select them and watch the fraction update live.",
          "Check the decimal and percentage shown for the fraction you've selected.",
          "Try cutting the same portion a different way — like 2/4 instead of 1/2 — and compare the results.",
        ]}
        whyItMatters="Fractions, decimals, and percentages are three different ways of describing the exact same amount, and being able to switch between them fluently comes up constantly — reading a discount as a percentage, splitting a bill fairly, or following a recipe that calls for 3/4 of a cup. Once you can flip between all three without hesitation, a lot of everyday math gets a lot faster."
        tryThis={[
          "Select 3 out of 8 slices. What's the decimal and percentage for that fraction?",
          "Find two different ways to cut and select pizza that both represent exactly half.",
          "Predict which is more pizza: 2/3 selected or 5/8 selected — then check by comparing their decimals.",
        ]}
      />
    </Container>
  );
}
