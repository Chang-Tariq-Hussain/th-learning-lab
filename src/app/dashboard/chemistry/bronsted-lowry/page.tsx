import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { BronstedLowry } from "@/features/subjects/chemistry/bronsted-lowry";

export const metadata: Metadata = {
  title: "Brønsted–Lowry Theory",
  description: "Watch a proton move from acid to base and see why Brønsted–Lowry defines acids by what they donate.",
};

export default function BronstedLowryPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/bronsted-lowry" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          { label: "Brønsted–Lowry Theory", href: "/dashboard/chemistry/bronsted-lowry" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Acids &amp; Bases
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Brønsted–Lowry Theory
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Step through a proton transfer and see why the acid is the molecule that gives H⁺ away.
        </p>
      </div>

      <BronstedLowry />

      <SimulationLearnMore
        colorToken="chemistry"
        objectives={[
          "Define a Brønsted–Lowry acid as a proton (H⁺) donor and a base as a proton acceptor.",
          "Track where a proton moves during an acid-base reaction.",
          "Identify the conjugate acid-base pairs formed in a proton transfer.",
          "Explain how this definition is broader than just \"acids taste sour.\"",
        ]}
        concepts={[
          {
            term: "Brønsted–Lowry acid",
            explanation:
              "A substance that donates a proton (H⁺) to another substance. It doesn't need to contain a metal or have any particular formula — what matters is whether it gives up an H⁺.",
          },
          {
            term: "Brønsted–Lowry base",
            explanation:
              "A substance that accepts a proton (H⁺) from an acid. The base grabs the H⁺ that the acid lets go of.",
          },
          {
            term: "Proton transfer",
            explanation:
              "A Brønsted–Lowry reaction is really just one particle — H⁺ — moving from the acid to the base. Everything else about the two molecules stays the same during that handoff.",
            formula: "HA + B \\rightarrow A^- + HB^+",
            formulaCaption: "Acid HA donates H⁺ to base B",
          },
          {
            term: "Conjugate pairs",
            explanation:
              "After the proton moves, the acid becomes its conjugate base (missing one H⁺) and the base becomes its conjugate acid (gained one H⁺). Every Brønsted–Lowry reaction produces one new pair like this.",
          },
        ]}
        howToUse={[
          "Look at the two starting molecules and identify which one looks like it's holding onto an extra H⁺.",
          "Step through the reaction and watch the proton move from one molecule to the other.",
          "Check which molecule gave the proton away — that one is the acid.",
          "Identify the two new molecules formed and match each one to the conjugate acid or conjugate base it became.",
        ]}
        whyItMatters={`The Brønsted–Lowry definition is what lets chemists classify substances as acids and bases even when they don't fit the simple "tastes sour, tastes bitter" picture. It explains how ammonia can act as a base without containing any OH⁻, and it's the framework behind buffer systems in your blood, which rely on rapid proton transfers to keep your pH stable even as your body produces acid all day long.`}
        tryThis={[
          "After the proton transfer, label all four species: the acid, the base, the conjugate acid, and the conjugate base.",
          "Predict, before running the reaction, which molecule will end up donating the proton.",
          "Think of a molecule that could act as either an acid or a base depending on what it reacts with — what would make it switch roles?",
        ]}
      />
    </Container>
  );
}
