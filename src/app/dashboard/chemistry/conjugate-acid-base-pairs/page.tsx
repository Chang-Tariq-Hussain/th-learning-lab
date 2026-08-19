import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
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

      <SimulationLearnMore
        colorToken="chemistry"
        objectives={[
          "Define a conjugate acid-base pair as two species that differ by exactly one proton.",
          "Find the conjugate base of a given acid, and the conjugate acid of a given base.",
          "Explain why a strong acid has a very weak conjugate base, and vice versa.",
          "Recognize conjugate pairs inside a full acid-base equation.",
        ]}
        concepts={[
          {
            term: "Conjugate base",
            explanation:
              "What's left of an acid after it donates a proton (H⁺). It has exactly one fewer H than the acid it came from.",
            formula: "HA \\rightarrow H^+ + A^-",
            formulaCaption: "A⁻ is the conjugate base of HA",
          },
          {
            term: "Conjugate acid",
            explanation:
              "What a base becomes after it accepts a proton (H⁺). It has exactly one more H than the base it came from.",
            formula: "B + H^+ \\rightarrow HB^+",
            formulaCaption: "HB⁺ is the conjugate acid of B",
          },
          {
            term: "One proton, always",
            explanation:
              "No matter which pair you look at, the acid and its conjugate base always differ by a single H⁺ — nothing else about the molecule changes. That one-proton difference is what defines the pair.",
          },
          {
            term: "Strength runs opposite",
            explanation:
              "A strong acid gives up its proton so easily that what's left behind — its conjugate base — has very little pull to grab it back, making the conjugate base weak. The reverse holds too: a weak acid's conjugate base tends to be relatively strong.",
          },
        ]}
        howToUse={[
          "Pick a molecule from the list to use as your starting acid or base.",
          "Watch it gain or lose a single proton to form its conjugate partner.",
          "Compare the two formulas side by side and count the hydrogens — they should differ by exactly one.",
          "Try a few different starting molecules and look for the same one-proton pattern each time.",
        ]}
        whyItMatters="Conjugate acid-base pairs are the working parts behind every buffer solution, including the ones in your own blood that keep its pH from swinging even as your body constantly produces and removes acid. Recognizing a conjugate pair on sight is also what makes it possible to predict which side of an acid-base reaction is favored, since equilibrium always shifts toward the weaker acid and weaker base in the pair."
        tryThis={[
          "Pick an acid, find its conjugate base, then find the conjugate acid of that base. Do you end up back where you started?",
          "Predict whether a strong acid's conjugate base will be a strong or weak base, then check your reasoning against what you see.",
          "Look at a full acid-base equation and try to label both conjugate pairs it contains.",
        ]}
      />
    </Container>
  );
}
