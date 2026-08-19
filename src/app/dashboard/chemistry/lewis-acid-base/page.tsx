import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { LewisAcidBase } from "@/features/subjects/chemistry/lewis-acid-base";

export const metadata: Metadata = {
  title: "Lewis Acid–Base Theory",
  description: "Watch an electron pair move from a Lewis base to a Lewis acid and see how a coordinate bond forms.",
};

export default function LewisAcidBasePage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/lewis-acid-base" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          { label: "Lewis Acid–Base Theory", href: "/dashboard/chemistry/lewis-acid-base" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Acids &amp; Bases
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Lewis Acid–Base Theory
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Step through an electron-pair donation and see why the Lewis acid is the species that accepts it.
        </p>
      </div>

      <LewisAcidBase />

      <SimulationLearnMore
        colorToken="chemistry"
        objectives={[
          "Define a Lewis acid as an electron-pair acceptor.",
          "Define a Lewis base as an electron-pair donor.",
          "Explain how a coordinate (dative) bond forms between the two.",
          "Recognize that the Lewis definition covers reactions with no protons involved at all.",
        ]}
        concepts={[
          {
            term: "Lewis acid",
            explanation:
              "A species that accepts a pair of electrons to form a new bond. It doesn't need to contain hydrogen at all — what matters is that it has room to accept an electron pair, often because it's missing a full outer shell.",
          },
          {
            term: "Lewis base",
            explanation:
              "A species that donates a pair of electrons to form a new bond. It needs a lone pair of electrons available to share.",
          },
          {
            term: "Coordinate (dative) bond",
            explanation:
              "A covalent bond where both shared electrons come from the same atom — the Lewis base supplies the whole pair, and the Lewis acid supplies an empty spot to receive it.",
            formula: "A + :B \\rightarrow A{-}B",
            formulaCaption: "Lewis acid A accepts a lone pair from base B",
          },
          {
            term: "Broader than Brønsted–Lowry",
            explanation:
              "Every Brønsted–Lowry acid-base reaction is also a Lewis acid-base reaction, but the Lewis definition goes further — it describes reactions where no proton moves at all, as long as an electron pair is being shared.",
          },
        ]}
        howToUse={[
          "Identify the species with a lone electron pair available — that's the Lewis base.",
          "Identify the species with an open spot to accept electrons — that's the Lewis acid.",
          "Step through the reaction and watch the electron pair move from the base to the acid.",
          "Notice the new bond that forms is a coordinate bond, made entirely from the base's electrons.",
        ]}
        whyItMatters="The Lewis definition is what lets chemists explain reactions that don't fit neatly into the proton-transfer picture, like how metal ions bond with surrounding molecules to form complexes, or how catalysts work in many industrial reactions. It's the broadest of the acid-base theories, and it's the one that connects most directly to bonding and molecular structure."
        tryThis={[
          "Before running the reaction, guess which species has the lone pair and which has the open spot.",
          "Compare this reaction to a Brønsted–Lowry proton transfer — what's similar, and what's different?",
          "Think of a metal ion bonding with water molecules. Which one do you think acts as the Lewis acid?",
        ]}
      />
    </Container>
  );
}
