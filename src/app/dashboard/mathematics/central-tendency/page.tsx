import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CentralTendency } from "@/features/subjects/mathematics/central-tendency";

export const metadata: Metadata = {
  title: "Measures of Central Tendency — Mean, Median, Mode & Range",
  description:
    "Build intuition for mean, median, mode, and range with a balancing-point visualization, sorting, frequency charts, and an outlier comparison.",
};

export default function CentralTendencyPage() {
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
    </Container>
  );
}
