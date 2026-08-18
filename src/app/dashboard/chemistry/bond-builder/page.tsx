import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { getQuizById } from "@/features/quiz-engine/registry";
import { BondBuilder } from "@/features/subjects/chemistry/bond-builder";

export const metadata: Metadata = {
  title: "Bond Builder",
  description: "Bring atoms together and watch ionic and covalent bonds form, electron by electron.",
};

export default function BondBuilderPage() {
  const quiz = getQuizById("chemistry-chemical-bonding");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/bond-builder" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          { label: "Chemical Bonding", href: "/dashboard/chemistry/chemical-bonding" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Chemical Bonding
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Bond Builder
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Bring two atoms together and see what happens to their electrons —
          one transfers to form an ionic bond, or two get shared to form a
          covalent bond.
        </p>
      </div>

      <BondBuilder />

      {quiz && (
        <QuizCta href="/dashboard/chemistry/chemical-bonding-quiz" colorToken="chemistry" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}

      <SimulationLearnMore
        colorToken="chemistry"
        objectives={[
          "Distinguish between ionic and covalent bonds based on what happens to the electrons.",
          "Explain why atoms bond in the first place.",
          "Predict whether two atoms are more likely to transfer or share electrons.",
          "Describe what an ion is and how it forms.",
        ]}
        concepts={[
          {
            term: "Why atoms bond",
            explanation:
              "Atoms are most stable with a full outer (valence) shell of electrons. Bonding — whether by transferring or sharing electrons — is how atoms reach that stable arrangement.",
          },
          {
            term: "Ionic bonds",
            explanation:
              "Form when one atom transfers an electron to another. The atom that loses an electron becomes a positive ion; the one that gains it becomes a negative ion. Opposite charges then attract, holding the compound together — like sodium (1 valence electron to give away) and chlorine (needs just 1 more).",
          },
          {
            term: "Covalent bonds",
            explanation:
              "Form when atoms share electrons instead of transferring them completely. Both atoms count the shared pair toward their own stable outer shell — like two hydrogen atoms sharing a pair to each get a full shell.",
          },
          {
            term: "Valence electrons",
            explanation:
              "Only the outermost electrons — the valence electrons — take part in bonding. How many an atom has determines whether it tends to give electrons away, take them, or share.",
          },
        ]}
        howToUse={[
          "Choose Ionic or Covalent mode from the tabs.",
          "Bring the two atoms together and watch what happens to their electrons.",
          "Read the status line as the electrons transfer or become shared.",
          "Check the explanation panel once the bond forms to see why it happened that way.",
        ]}
        whyItMatters="The difference between ionic and covalent bonding explains why table salt (an ionic compound) dissolves in water and conducts electricity when it does, while water itself (held together by covalent bonds) doesn't fall apart the same way. Nearly every material property you can name — melting point, solubility, conductivity — traces back to which of these two bonding patterns holds the substance together."
        tryThis={[
          "Watch the sodium-chlorine bond form. Which atom ends up positively charged, and which negatively?",
          "Watch the hydrogen-hydrogen bond form. Why does neither atom become an ion here?",
          "Based on valence electrons alone, predict before starting whether a pair will bond ionically or covalently.",
        ]}
      />
    </Container>
  );
}
