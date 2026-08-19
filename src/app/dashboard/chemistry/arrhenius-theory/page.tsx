import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
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

      <SimulationLearnMore
        colorToken="chemistry"
        objectives={[
          "Define an Arrhenius acid as a substance that produces H⁺ ions in water.",
          "Define an Arrhenius base as a substance that produces OH⁻ ions in water.",
          "Explain why the Arrhenius definition only applies to reactions happening in water.",
          "Predict whether a substance is an Arrhenius acid or base based on what it releases when dissolved.",
        ]}
        concepts={[
          {
            term: "Arrhenius acid",
            explanation:
              "A substance that increases the concentration of hydrogen ions (H⁺) when it dissolves in water. Hydrochloric acid is a classic example.",
            formula: "HCl \\xrightarrow{H_2O} H^+ + Cl^-",
            formulaCaption: "HCl dissolving in water",
          },
          {
            term: "Arrhenius base",
            explanation:
              "A substance that increases the concentration of hydroxide ions (OH⁻) when it dissolves in water. Sodium hydroxide is a classic example.",
            formula: "NaOH \\xrightarrow{H_2O} Na^+ + OH^-",
            formulaCaption: "NaOH dissolving in water",
          },
          {
            term: "Why water matters",
            explanation:
              "This definition is specifically about what happens in water. A substance that acts like an acid in another solvent wouldn't count as an Arrhenius acid — it's the earliest and narrowest of the major acid-base theories, later broadened by the Brønsted–Lowry definition.",
          },
        ]}
        howToUse={[
          "Drop the HCl sample into the water and watch what ions appear.",
          "Reset, then drop in the NaOH sample instead and compare the ions produced.",
          "Notice that HCl releases H⁺ while NaOH releases OH⁻ — that's the whole distinction.",
          "Try to predict which ion a new substance would release before revealing the answer.",
        ]}
        whyItMatters="The Arrhenius definition was the first clear, testable way to separate acids from bases, and it's still the mental model most people reach for first: acids make things more H⁺-rich, bases make things more OH⁻-rich. It's the foundation that later definitions like Brønsted–Lowry built on and expanded to cover reactions that don't even involve water."
        tryThis={[
          "Predict which ion, H⁺ or OH⁻, a new substance will release based on its name or formula before testing it.",
          "Think about why this definition wouldn't work for a reaction happening in a non-water solvent.",
          "Compare the ions released by HCl and NaOH — what happens if you mix the two solutions together?",
        ]}
      />
    </Container>
  );
}
