import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";
import { ReactionBuilder } from "@/features/subjects/chemistry/reaction-builder";

const SIMULATION_HREF = "/dashboard/chemistry/reaction-builder";

export const metadata: Metadata = {
  title: "Chemical Reaction Builder",
  description:
    "Step through simple reactions like 2H₂ + O₂ → 2H₂O and see how atoms rearrange without being created or destroyed.",
};

export default function ReactionBuilderPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/reaction-builder" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          {
            label: "Chemical Reactions",
            href: "/dashboard/chemistry/chemical-reactions",
          },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Chemical Reactions
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Chemical Reaction Builder
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Pick a reaction and watch bonds break, atoms rearrange, and new bonds
          form — while the number of each atom stays exactly the same.
        </p>
      </div>

      <ReactionBuilder />

      <SimulationLearnMore
        colorToken="chemistry"
        objectives={[
          "Explain the law of conservation of mass as it applies to chemical reactions.",
          "Identify reactants and products in a chemical equation.",
          "Balance a simple equation by adjusting coefficients, not subscripts.",
          "Describe a chemical reaction as atoms rearranging, not disappearing.",
        ]}
        concepts={[
          {
            term: "Conservation of mass",
            explanation:
              "Atoms are never created or destroyed in a chemical reaction — only rearranged into new combinations. Every atom present in the reactants has to show up somewhere in the products.",
          },
          {
            term: "Reactants and products",
            explanation:
              "Reactants are the substances you start with, written on the left of the arrow. Products are the substances you end up with, written on the right.",
            formula: "2H_2 + O_2 \\rightarrow 2H_2O",
            formulaCaption: "Reactants → products",
          },
          {
            term: "Coefficients vs. subscripts",
            explanation:
              "The subscript in a formula (like the 2 in H₂O) tells you how many atoms are in one molecule and can never be changed. The coefficient in front of a formula (like the 2 in 2H₂O) tells you how many molecules you have, and that's the number you adjust to balance an equation.",
          },
          {
            term: "Balancing",
            explanation:
              "An equation is balanced when the same number of each type of atom appears on both sides. Balancing an equation is really just accounting for where every atom went.",
          },
        ]}
        howToUse={[
          "Pick a reaction and look at the reactants on the left side.",
          "Step through the reaction and watch the bonds break apart.",
          "Watch the same atoms come back together into new products on the right.",
          "Count the atoms on each side before and after — the totals should match exactly.",
        ]}
        whyItMatters="Every chemical process you rely on, from your car's engine burning fuel to your own cells releasing energy from food, is atoms rearranging according to this same principle. Balancing equations isn't just a classroom exercise — it's how chemists calculate exactly how much of each ingredient a reaction needs, which matters everywhere from manufacturing medicine to designing rocket fuel."
        tryThis={[
          "Count every atom in the reactants and every atom in the products. Do the totals for each element match?",
          "Try changing a coefficient and predict whether the equation is still balanced.",
          "Pick a different reaction and predict its products before running the simulation.",
        ]}
      />

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
