import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { EquationPlayground } from "@/features/subjects/mathematics/equation-playground";

export const metadata: Metadata = {
  title: "Equation Playground",
  description:
    "Slide a number into the missing box and discover whether it makes the equation true — no calculator, no auto-solving.",
};

export default function EquationPlaygroundPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/equation-playground" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Algebra", href: "/dashboard/mathematics/algebra" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">
          Mathematics · Algebra
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Equation Playground
        </h1>
      </div>

      <EquationPlayground />
    </Container>
  );
}
