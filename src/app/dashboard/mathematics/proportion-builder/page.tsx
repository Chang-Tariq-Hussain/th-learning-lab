import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
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
    </Container>
  );
}
