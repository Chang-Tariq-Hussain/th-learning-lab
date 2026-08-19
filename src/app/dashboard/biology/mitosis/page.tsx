import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { Mitosis } from "@/features/subjects/biology/mitosis";

export const metadata: Metadata = {
  title: "Mitosis",
  description: "Watch one parent cell divide into two daughter cells through the stages of mitosis.",
};

export default function MitosisPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/biology/mitosis" className="mb-4" />
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
          Mitosis: How One Cell Becomes Two
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Press Start and watch a cell move through the stages of mitosis, or step through them one at a time.
        </p>
      </div>

      <Mitosis />

      <SimulationLearnMore
        colorToken="biology"
        objectives={[
          "List the main stages of mitosis in order.",
          "Explain what happens to the chromosomes at each stage.",
          "State how many daughter cells mitosis produces and how they compare to the parent cell.",
          "Explain why mitosis is important for growth and repair.",
        ]}
        concepts={[
          {
            term: "Prophase",
            explanation:
              "Chromosomes condense into visible, tightly-coiled structures, and the structure that will pull them apart starts to form.",
          },
          {
            term: "Metaphase",
            explanation:
              "The condensed chromosomes line up along the middle of the cell, ready to be pulled apart evenly.",
          },
          {
            term: "Anaphase",
            explanation:
              "The two halves of each chromosome are pulled apart and dragged toward opposite ends of the cell.",
          },
          {
            term: "Telophase and cytokinesis",
            explanation:
              "The separated chromosomes arrive at each end and begin to loosen back up, then the cell physically pinches apart into two separate cells.",
          },
          {
            term: "The result",
            explanation:
              "Mitosis produces two daughter cells, each with the exact same number and type of chromosomes as the original parent cell — genetically identical copies.",
          },
        ]}
        howToUse={[
          "Press Start to watch a cell move through all the stages of mitosis automatically.",
          "Or use the step controls to move through prophase, metaphase, anaphase, and telophase one at a time.",
          "At each stage, notice where the chromosomes are and what shape they're in.",
          "Watch the final step, where the single cell splits into two separate daughter cells.",
        ]}
        whyItMatters="Mitosis is how your body grows from a single fertilized cell into trillions of cells, and it's also how you heal a cut or replace worn-out skin and blood cells throughout your life. Every time your body needs more identical cells, whether for growth or repair, it relies on this same four-stage process to copy and divide."
        tryThis={[
          "Step through the stages one at a time and describe, in your own words, what's happening to the chromosomes at each step.",
          "Predict what would happen if the chromosomes didn't line up correctly during metaphase.",
          "Compare the two daughter cells at the end. Are they identical to each other and to the parent cell?",
        ]}
      />
    </Container>
  );
}
