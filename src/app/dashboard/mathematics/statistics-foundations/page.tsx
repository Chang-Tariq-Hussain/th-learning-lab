import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { StatisticsFoundations } from "@/features/subjects/mathematics/statistics-foundations";

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
    </Container>
  );
}
