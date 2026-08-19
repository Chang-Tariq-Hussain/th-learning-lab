import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { getQuizById } from "@/features/quiz-engine/registry";
import { CentralTendency } from "@/features/subjects/mathematics/central-tendency";

export const metadata: Metadata = {
  title: "Measures of Central Tendency — Mean, Median, Mode & Range",
  description:
    "Build intuition for mean, median, mode, and range with a balancing-point visualization, sorting, frequency charts, and an outlier comparison.",
};

export default function CentralTendencyPage() {
  const quiz = getQuizById("mathematics-statistics");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/central-tendency" className="mb-4" />
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
          Measures of Central Tendency — Mean, Median, Mode & Range
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Edit a dataset and watch mean, median, mode, and range respond — then see why an outlier can shift the
          mean far more than the median.
        </p>
      </div>

      <CentralTendency />

      {quiz && (
        <QuizCta href="/dashboard/mathematics/statistics-quiz" colorToken="math" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Calculate the mean, median, and mode of a dataset.",
          "Calculate the range of a dataset.",
          "Explain why an outlier affects the mean more than the median.",
          "Choose the most appropriate measure of central tendency for a given dataset.",
        ]}
        concepts={[
          {
            term: "Mean",
            explanation:
              "The sum of every value in a dataset, divided by how many values there are — the balancing point of the data.",
            formula: "\\text{mean} = \\dfrac{\\text{sum of values}}{\\text{number of values}}",
            formulaCaption: "Mean",
          },
          {
            term: "Median",
            explanation:
              "The middle value when a dataset is sorted from smallest to largest. If there are two middle values, the median is their average.",
          },
          {
            term: "Mode",
            explanation:
              "The value that appears most often in a dataset. A dataset can have one mode, more than one, or none at all if every value appears equally often.",
          },
          {
            term: "Range",
            explanation:
              "The difference between the largest and smallest value in a dataset — a quick, simple measure of how spread out the data is.",
            formula: "\\text{range} = \\text{max} - \\text{min}",
            formulaCaption: "Range",
          },
          {
            term: "Outliers and the mean",
            explanation:
              "Because the mean factors in every value equally, one unusually large or small number can pull it noticeably away from where most of the data actually sits. The median, which only cares about the middle position, barely moves.",
          },
        ]}
        howToUse={[
          "Edit the dataset and watch the mean, median, mode, and range update live.",
          "Sort the values and locate the median by eye before checking the calculated value.",
          "Add an extreme outlier and watch how much the mean shifts compared to the median.",
          "Compare the frequency chart to visually confirm which value is the mode.",
        ]}
        whyItMatters="These four measures are the starting point for almost every statistic you'll see reported in the news, from average income (mean) to a typical home price (often median, specifically because it resists outliers) to the most common shoe size sold (mode). Knowing which measure resists outliers and which doesn't helps you spot when a reported average might be misleading."
        tryThis={[
          "Add one extreme value to a dataset and compare how much the mean and median each move.",
          "Build a dataset where the mean and median are far apart. What does that tell you about the data's shape?",
          "Find a dataset with no mode at all — is that possible with any values you choose?",
        ]}
      />
    </Container>
  );
}
