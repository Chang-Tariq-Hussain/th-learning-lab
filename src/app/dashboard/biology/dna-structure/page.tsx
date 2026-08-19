import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
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

      <SimulationLearnMore
        colorToken="biology"
        objectives={[
          "Describe DNA's overall shape as a double helix.",
          "State the base-pairing rule: A with T, and C with G.",
          "Explain why base pairing is always this specific and never mixed.",
          "Predict the complementary strand given one strand's sequence.",
        ]}
        concepts={[
          {
            term: "The double helix",
            explanation:
              "DNA is made of two long strands twisted around each other in a spiral. Each strand is a chain of building blocks called nucleotides, and the two strands run alongside each other, held together in the middle.",
          },
          {
            term: "Bases",
            explanation:
              "Each nucleotide carries one of four bases: adenine (A), thymine (T), cytosine (C), or guanine (G). The sequence of these bases along a strand is what encodes genetic information.",
          },
          {
            term: "Base pairing rule",
            explanation:
              "A always pairs with T, and C always pairs with G — never any other combination. These specific pairs are what hold the two strands of the helix together, like rungs on a twisted ladder.",
            formula: "A \\equiv T \\quad\\quad C \\equiv G",
            formulaCaption: "Complementary base pairs",
          },
          {
            term: "Complementary strands",
            explanation:
              "Because of the pairing rule, knowing the sequence on one strand tells you the exact sequence on the other strand. The two strands are complementary, not identical.",
          },
        ]}
        howToUse={[
          "Click a base on one strand and watch its correct partner highlight on the other strand.",
          "Try predicting the pairing base before revealing it, using the A-T, C-G rule.",
          "Work along the strand, completing each pair, to build out the full double helix.",
          "Check your completed strand against the base-pairing rule for any mismatches.",
        ]}
        whyItMatters="This simple pairing rule is what makes DNA replication possible — when a cell divides, it can separate the two strands and rebuild a perfect matching partner for each one, using the same A-T, C-G rule every time. It's also the basis for DNA-based technologies like paternity testing, forensic analysis, and even PCR tests, all of which rely on these predictable, specific pairings."
        tryThis={[
          "Given the sequence A-T-C-G-A, write out its exact complementary strand without looking.",
          "Predict what would happen to a cell's DNA replication if A could pair with C instead of T.",
          "Count how many total bases are in a short strand shown, then predict the total in its double helix.",
        ]}
      />
    </Container>
  );
}
