import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { DerivativeExplorer } from "@/features/subjects/mathematics/derivative-explorer";

export const metadata: Metadata = {
  title: "Derivative Explorer — Tangent Line & Instantaneous Rate of Change",
  description:
    "See a derivative before you calculate one: secant lines, points getting closer, tangent lines, and the instantaneous rate of change.",
};

export default function DerivativeExplorerPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/derivative-explorer" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Calculus", href: "/dashboard/mathematics/calculus" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Mathematics · Calculus</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Derivative Explorer — Tangent Line & Instantaneous Rate of Change
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Watch a secant line rotate into a tangent line as two points become one — and see why its slope is
          called the derivative.
        </p>
      </div>

      <DerivativeExplorer />
    </Container>
  );
}
