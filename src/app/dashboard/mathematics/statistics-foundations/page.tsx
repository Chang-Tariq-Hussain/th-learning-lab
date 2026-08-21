import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";
import { StatisticsFoundations } from "@/features/subjects/mathematics/statistics-foundations";

const SIMULATION_HREF = "/dashboard/mathematics/statistics-foundations";

export const metadata: Metadata = {
  title: "Statistics Foundations — Data, Variables & Sampling",
  description:
    "Build intuition for data, variables, categorical vs numerical, population vs sample, and sampling methods — the visual foundations statistics is built on.",
};

export default function StatisticsFoundationsPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/statistics-foundations" className="mb-4" />
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
          Statistics Foundations — Data, Variables & Sampling
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Explore a real dataset, tell variables apart, and see how population, sample, and sampling method shape
          what a survey can tell you — one idea at a time.
        </p>
      </div>

      <StatisticsFoundations />

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Distinguish categorical variables from numerical variables.",
          "Define population and sample, and explain the relationship between them.",
          "Describe why sampling method affects how trustworthy a survey's results are.",
          "Identify the variable type and sampling approach used in a given dataset.",
        ]}
        concepts={[
          {
            term: "Categorical variables",
            explanation:
              "Variables that describe qualities or categories rather than amounts, like favorite color or country of birth. They can be counted and grouped, but not meaningfully averaged.",
          },
          {
            term: "Numerical variables",
            explanation:
              "Variables that represent measurable quantities, like height or test scores. They can be added, averaged, and used in calculations in ways categorical variables can't.",
          },
          {
            term: "Population and sample",
            explanation:
              "The population is the entire group you're interested in studying. A sample is a smaller subset of that population, actually measured or surveyed, used to make inferences about the whole population.",
          },
          {
            term: "Sampling method",
            explanation:
              "How a sample is chosen matters just as much as its size. A sample that isn't representative of the population — say, only surveying people in one location — can produce misleading results even if the sample itself is large.",
          },
        ]}
        howToUse={[
          "Explore the sample dataset and sort its variables into categorical and numerical.",
          "Identify the population the dataset is meant to represent, and the sample actually collected.",
          "Compare a few different sampling methods and note which are more likely to represent the population fairly.",
          "Think through what could go wrong if the sampling method were biased.",
        ]}
        whyItMatters="Every survey, poll, and scientific study you've ever seen reported in the news relies on getting these fundamentals right — the wrong sampling method can produce a confident-sounding statistic that's actually misleading. Being able to spot whether a variable is categorical or numerical, and whether a sample fairly represents its population, is the first line of defense against being misled by bad statistics."
        tryThis={[
          "Sort five variables from the dataset into categorical and numerical, explaining your reasoning for each.",
          "Describe a sampling method that would likely produce a biased sample, and explain why.",
          "Think of a survey you've seen or heard about — was its sample likely representative of the population it claimed to describe?",
        ]}
      />

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
