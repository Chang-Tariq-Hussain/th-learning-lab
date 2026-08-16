import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { DnaStructure } from "@/features/subjects/biology/dna-structure";

export const metadata: Metadata = {
  title: "DNA Structure & Base Pairing",
  description: "Explore the DNA double helix and learn how bases pair: A with T, and C with G.",
};

export default function DnaStructurePage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/biology/dna-structure" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          { label: "Cell Structure", href: "/dashboard/biology/cell-structure" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Biology · Cell Structure</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          DNA Structure &amp; Base Pairing
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Click a base to see its pair, or complete the strand yourself: A pairs with T, and C pairs with G.
        </p>
      </div>

      <DnaStructure />
    </Container>
  );
}
