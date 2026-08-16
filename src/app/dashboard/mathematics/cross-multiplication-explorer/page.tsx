import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CrossMultiplicationExplorer } from "@/features/subjects/mathematics/cross-multiplication-explorer";

export const metadata: Metadata = {
  title: "Cross Multiplication Explorer",
  description: "Watch the two diagonal multiplications animate to see why 2/3 = 4/6 — then try your own fractions.",
};

export default function CrossMultiplicationExplorerPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/cross-multiplication-explorer" className="mb-4" />
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
          Cross Multiplication Explorer
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Watch each diagonal multiplication animate in turn, then change any number to test a new pair of fractions.
        </p>
      </div>

      <CrossMultiplicationExplorer />
    </Container>
  );
}
