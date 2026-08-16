import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { ArrheniusTheory } from "@/features/subjects/chemistry/arrhenius-theory";

export const metadata: Metadata = {
  title: "Arrhenius Theory",
  description: "See HCl and NaOH dissolve in water and watch how an Arrhenius acid and base differ.",
};

export default function ArrheniusTheoryPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/arrhenius-theory" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          { label: "Arrhenius Theory", href: "/dashboard/chemistry/arrhenius-theory" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Acids &amp; Bases
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Arrhenius Theory
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Watch HCl and NaOH dissolve in water — an Arrhenius acid produces H⁺, an Arrhenius base produces OH⁻.
        </p>
      </div>

      <ArrheniusTheory />
    </Container>
  );
}
