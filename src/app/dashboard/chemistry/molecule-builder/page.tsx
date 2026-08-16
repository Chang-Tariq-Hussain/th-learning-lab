import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { MoleculeBuilder } from "@/features/subjects/chemistry/molecule-builder";

export const metadata: Metadata = {
  title: "Molecule Builder",
  description:
    "Join atoms step by step to build H₂, H₂O, and CO₂, and see how molecules form.",
};

export default function MoleculeBuilderPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/molecule-builder" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          {
            label: "Chemical Bonding",
            href: "/dashboard/chemistry/chemical-bonding",
          },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Chemical Bonding
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Molecule Builder
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Pick a molecule and join its atoms one step at a time — watch them
          move together, bond, and form H₂, H₂O, or CO₂.
        </p>
      </div>

      <MoleculeBuilder />
    </Container>
  );
}
