import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { MoleculeBuilder } from "@/features/subjects/chemistry/molecule-builder";
import { getTopicContent } from "@/features/learning";
import { MoleculeBuilderTopicExperience } from "./topic-experience-client";

export const metadata: Metadata = {
  title: "Molecule Builder",
  description:
    "Rotate real 3D molecules — H₂, H₂O, CO₂, BF₃, and CH₄ — to see how electron-pair repulsion shapes them.",
};

export default function MoleculeBuilderPage() {
  const content = getTopicContent("chemistry", "molecule-builder");
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
          Pick a molecule and rotate it in 3D — see why water bends, why
          carbon dioxide is a straight line, and why methane can&apos;t be
          drawn flat without lying about its shape.
        </p>
      </div>

      {content ? (
        <MoleculeBuilderTopicExperience content={content} />
      ) : (
        <MoleculeBuilder />
      )}
    </Container>
  );
}
