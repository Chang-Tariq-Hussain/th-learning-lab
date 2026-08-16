import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { ConjugateAcidBasePairs } from "@/features/subjects/chemistry/conjugate-acid-base-pairs";

export const metadata: Metadata = {
  title: "Conjugate Acid–Base Pairs",
  description: "Pick a molecule and see its conjugate partner — every pair differs by exactly one proton.",
};

export default function ConjugateAcidBasePairsPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/conjugate-acid-base-pairs" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          { label: "Conjugate Acid–Base Pairs", href: "/dashboard/chemistry/conjugate-acid-base-pairs" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Acids &amp; Bases
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Conjugate Acid&ndash;Base Pairs
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Pick a molecule and see its conjugate partner — every pair differs by exactly one proton.
        </p>
      </div>

      <ConjugateAcidBasePairs />
    </Container>
  );
}
