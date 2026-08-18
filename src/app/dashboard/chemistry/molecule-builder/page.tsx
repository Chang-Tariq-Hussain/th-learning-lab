import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
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

      <SimulationLearnMore
        colorToken="chemistry"
        objectives={[
          "Explain why atoms bond: to reach a full, stable outer shell of electrons.",
          "Describe a covalent bond as a shared pair of electrons between two atoms.",
          "Predict how many bonds an atom like hydrogen, oxygen, or carbon can form.",
          "Read a molecular formula (H₂O, CO₂) and connect it to the atoms it's built from.",
        ]}
        concepts={[
          {
            term: "Covalent bonding",
            explanation:
              "Atoms bond by sharing pairs of electrons rather than transferring them. Each shared pair counts as one bond, and the shared electrons are pulled toward both nuclei at once, holding the atoms together.",
          },
          {
            term: "The octet rule",
            explanation:
              "Most atoms are most stable with 8 electrons in their outer shell (hydrogen just wants 2). Atoms form exactly as many bonds as they need to fill that shell — that's why oxygen forms 2 bonds and carbon forms 4.",
          },
          {
            term: "Single vs. double bonds",
            explanation:
              "Sharing one pair of electrons makes a single bond; sharing two pairs makes a double bond. CO₂ has two double bonds — one between carbon and each oxygen.",
            formula: "\\text{O=C=O}",
            formulaCaption: "Carbon dioxide, two C=O double bonds",
          },
        ]}
        howToUse={[
          "Choose a target molecule — H₂, H₂O, or CO₂ — from the selector.",
          "Add the atoms it's made from one at a time and watch them drift into place.",
          "Join atoms in order to form each bond, and watch the shared electrons appear between them.",
          "Once every bond is made, check the finished molecule against its formula.",
          "Reset and try a different molecule to compare how many bonds each central atom needs.",
        ]}
        whyItMatters="Covalent bonds are what hold together the water you drink, the oxygen you breathe, and the sugars, proteins, and DNA inside every living cell. The same sharing-electrons idea that joins two hydrogen atoms into H₂ also builds the huge, complex molecules that make life possible — it's one rule with an enormous reach."
        tryThis={[
          "Build H₂O and count the bonds on oxygen. Why does oxygen stop at two?",
          "Build CO₂ and compare its double bonds to the single bonds in H₂. What's different about how the electrons are shared?",
          "Before building each molecule, predict how many total bonds it will need — then check yourself.",
        ]}
      />
    </Container>
  );
}
