import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { MeasuresOfDispersion } from "@/features/subjects/mathematics/measures-of-dispersion";

import { LearningPathNextTopic } from "@/features/learning-path";
export const metadata: Metadata = {
  title: "Measures of Dispersion — Variance & Standard Deviation",
  description:
    "See why two datasets with the same mean can have very different spread, then build up variance and standard deviation step by step.",
};

export default function MeasuresOfDispersionPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/measures-of-dispersion" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Statistics", href: "/dashboard/mathematics/statistics" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Mathematics · Statistics</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Measures of Dispersion — Variance & Standard Deviation
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Two datasets can share the same mean and still look nothing alike. See why, then build variance and
          standard deviation up from deviations, one step at a time.
        </p>
      </div>

      <MeasuresOfDispersion />

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Explain why two datasets can share the same mean but look very different.",
          "Define deviation as the distance of a value from the mean.",
          "Calculate variance and standard deviation from a set of deviations.",
          "Compare the spread of two datasets using standard deviation.",
        ]}
        concepts={[
          {
            term: "Deviation",
            explanation:
              "How far a single value sits from the dataset's mean. Some deviations are positive (above the mean), some are negative (below the mean).",
            formula: "\\text{deviation} = x_i - \\bar{x}",
            formulaCaption: "Deviation of a value from the mean",
          },
          {
            term: "Variance",
            explanation:
              "The average of the squared deviations. Squaring makes every deviation positive before averaging, so spread in either direction counts the same way instead of canceling out.",
            formula: "\\text{variance} = \\dfrac{\\sum (x_i - \\bar{x})^2}{n}",
            formulaCaption: "Variance",
          },
          {
            term: "Standard deviation",
            explanation:
              "The square root of the variance. Taking the square root brings the units back in line with the original data, making it easier to interpret as a typical distance from the mean.",
            formula: "\\text{standard deviation} = \\sqrt{\\text{variance}}",
            formulaCaption: "Standard deviation",
          },
        ]}
        howToUse={[
          "Compare two datasets with the same mean but different spreads.",
          "Watch each value's deviation from the mean get calculated and squared.",
          "See the squared deviations averaged into the variance, then square-rooted into the standard deviation.",
          "Compare the two datasets' standard deviations to see which one is more spread out.",
        ]}
        whyItMatters="Standard deviation is what separates a reliable average from a shaky one — two classes can both average 75% on a test, but if one class's scores cluster tightly around 75 while the other ranges from 40 to 100, the mean alone hides that huge difference. Standard deviation is used everywhere from grading curves to quality control to financial risk, precisely because it captures the spread the mean leaves out."
        tryThis={[
          "Build two datasets with the same mean but very different standard deviations. What do their value spreads look like?",
          "Calculate the deviation of a single value from the mean, then square it by hand and compare to the simulation.",
          "Predict which of two datasets has the larger standard deviation just by looking at how spread out the values are, then check your answer.",
        ]}
      />
      <LearningPathNextTopic className="mt-10" />

      </Container>
  );
}
