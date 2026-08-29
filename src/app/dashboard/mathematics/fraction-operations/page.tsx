import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { FractionOperationsLab } from "@/features/subjects/mathematics/fraction-operations";
import { TopicExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/mathematics/fraction-operations";

export const metadata: Metadata = {
  title: "Fraction Operations Lab",
  description:
    "Add, subtract, multiply, and divide fractions with a live visual for each operation — common-denominator bars, an area-model grid, and a grouped-chunk bar.",
};

export default function FractionOperationsPage() {
  const content = getTopicContent("mathematics", "fraction-operations");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Fractions", href: "/dashboard/mathematics/fractions" },
        ]}
        className="mb-6"
      />

      <div className="mb-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Mathematics · Fractions</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Fraction Operations Lab
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Pick two fractions and an operation, and watch a visual built for exactly what that operation means.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<FractionOperationsLab />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <FractionOperationsLab />
      )}
    </Container>
  );
}
