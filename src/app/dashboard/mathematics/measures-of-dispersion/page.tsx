import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { MeasuresOfDispersion } from "@/features/subjects/mathematics/measures-of-dispersion";

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
    </Container>
  );
}
