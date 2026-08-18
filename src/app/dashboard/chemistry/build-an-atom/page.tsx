import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { getQuizById } from "@/features/quiz-engine/registry";
import { BuildAnAtom } from "@/features/subjects/chemistry/build-an-atom";

export const metadata: Metadata = {
  title: "Build an Atom",
  description: "Add and remove protons, neutrons, and electrons to build any element and see how charge and mass change.",
};

export default function BuildAnAtomPage() {
  const quiz = getQuizById("chemistry-atom");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/build-an-atom" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          { label: "Atomic Structure", href: "/dashboard/chemistry/atomic-structure" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Atomic Structure
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Build an Atom
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Add and remove protons, neutrons, and electrons and watch the
          element, mass, and charge update instantly. Click any particle
          to learn what it does.
        </p>
      </div>

      <BuildAnAtom />

      {quiz && (
        <QuizCta href="/dashboard/chemistry/atom-quiz" colorToken="chemistry" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}

      <SimulationLearnMore
        colorToken="chemistry"
        objectives={[
          "Identify the three subatomic particles in an atom and where each one lives.",
          "Explain how the number of protons determines which element an atom is.",
          "Calculate an atom's mass number and net charge from its particle counts.",
          "Distinguish between isotopes (same element, different neutrons) and ions (same element, different electrons).",
        ]}
        concepts={[
          {
            term: "Protons, neutrons, and electrons",
            explanation:
              "Protons (positive) and neutrons (neutral) sit together in the nucleus. Electrons (negative) occupy the space around it. Protons and neutrons have roughly the same mass; electrons are about 1,800 times lighter.",
          },
          {
            term: "Atomic number (Z)",
            explanation:
              "The number of protons in an atom. It's fixed for a given element — change the proton count and you get a different element entirely.",
          },
          {
            term: "Mass number (A)",
            explanation: "The total number of protons and neutrons in the nucleus.",
            formula: "A = Z + N",
            formulaCaption: "Z = protons, N = neutrons",
          },
          {
            term: "Net charge",
            explanation:
              "An atom with equal protons and electrons is neutral. Add or remove electrons without changing the protons, and it becomes a charged ion instead.",
            formula: "\\text{charge} = \\text{protons} - \\text{electrons}",
          },
        ]}
        howToUse={[
          "Drag protons, neutrons, and electrons from the tray onto the atom, or use the +/− controls in the panel.",
          "Watch the element name update the moment the proton count changes — that's what defines the element.",
          "Add or remove neutrons without touching the protons to build an isotope of the same element.",
          "Add or remove electrons without touching the protons to turn the atom into a positive or negative ion.",
          "Click any particle for a short explanation of what it does.",
        ]}
        whyItMatters="Every material you interact with — the air you breathe, the screen you're reading this on, your own body — is built from about 90 naturally occurring elements, and the only thing that tells them apart is their proton count. Isotopes like carbon-14 are used to date fossils, and ions like the sodium and potassium in your cells are what let your nerves fire. Understanding this one number — protons — unlocks most of the periodic table."
        tryThis={[
          "Build carbon (6 protons). Now add 2 neutrons — you've made carbon-14, used in radiocarbon dating.",
          "Build a neutral sodium atom, then remove one electron. What ion have you made, and what's its charge?",
          "Try to change the element without changing the proton count. What happens?",
        ]}
      />
    </Container>
  );
}
