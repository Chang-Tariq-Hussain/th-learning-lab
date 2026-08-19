import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { StrongWeakAcidsBases } from "@/features/subjects/chemistry/strong-weak-acids-bases";

export const metadata: Metadata = {
  title: "Strong vs Weak Acids and Bases",
  description: "Compare how strong and weak acids and bases ionize in water, and see why strength isn't the same as concentration.",
};

export default function StrongWeakAcidsBasesPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/strong-weak-acids-bases" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          { label: "Strong vs Weak Acids and Bases", href: "/dashboard/chemistry/strong-weak-acids-bases" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Acids &amp; Bases
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Strong vs Weak Acids and Bases
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Watch how much of each acid or base actually separates into ions in water — and why that&apos;s different from concentration.
        </p>
      </div>

      <StrongWeakAcidsBases />

      <SimulationLearnMore
        colorToken="chemistry"
        objectives={[
          "Distinguish strength (how much an acid or base ionizes) from concentration (how much is dissolved).",
          "Explain why a strong acid ionizes almost completely in water while a weak acid barely does.",
          "Predict which of two acids will conduct electricity better or react faster.",
          "Identify a few common strong and weak acids and bases.",
        ]}
        concepts={[
          {
            term: "Ionization",
            explanation:
              "When an acid or base dissolves in water, it can split apart into ions. How completely it splits apart is what determines whether it's called \"strong\" or \"weak\" — it has nothing to do with how much of it you dissolved.",
          },
          {
            term: "Strong acids and bases",
            explanation:
              "Ionize almost completely — essentially every molecule splits into ions. Hydrochloric acid (HCl) and sodium hydroxide (NaOH) are classic examples.",
            formula: "HCl \\rightarrow H^+ + Cl^-",
            formulaCaption: "Complete ionization, one-way arrow",
          },
          {
            term: "Weak acids and bases",
            explanation:
              "Only partially ionize — most of the molecules stay intact, and only a small fraction splits into ions at any given moment. Acetic acid (vinegar) is a common example.",
            formula: "CH_3COOH \\rightleftharpoons H^+ + CH_3COO^-",
            formulaCaption: "Partial ionization, equilibrium arrow",
          },
          {
            term: "Strength vs. concentration",
            explanation:
              "A dilute strong acid can still be more reactive than a concentrated weak acid, because strength is about the fraction that ionizes, while concentration is about how much total acid is dissolved. The two are independent.",
          },
        ]}
        howToUse={[
          "Pick a strong acid or base and watch how much of it splits into ions in the water.",
          "Switch to a weak acid or base with the same starting amount and compare.",
          "Notice how many intact (un-ionized) molecules remain floating around for the weak example.",
          "Try adjusting concentration and see that it changes the amount of ions, not the strength pattern itself.",
        ]}
        whyItMatters="Whether an acid is strong or weak decides how it behaves in the real world — strong acids like the ones in car batteries or drain cleaner are far more corrosive than weak acids like the citric acid in lemons, even at similar concentrations. Your own stomach relies on a strong acid (HCl) to digest food, while your blood relies on weak acids and bases to keep its pH tightly controlled. Knowing the difference is what lets chemists, doctors, and even cooks predict how a substance will actually react."
        tryThis={[
          "Compare a strong and a weak acid at the same concentration. Which one has more free ions floating in solution?",
          "Predict which would conduct electricity better — a strong acid or a weak acid at the same concentration — then think about why ions matter for conductivity.",
          "Can you think of a situation where a dilute strong acid might still be more dangerous than a concentrated weak acid?",
        ]}
      />
    </Container>
  );
}
