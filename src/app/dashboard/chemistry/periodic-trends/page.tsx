import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { getQuizById } from "@/features/quiz-engine/registry";
import { PeriodicTrends } from "@/features/subjects/chemistry/periodic-trends";

export const metadata: Metadata = {
  title: "Periodic Trends",
  description:
    "Explore the periodic table and discover how atomic radius, ionization energy, electronegativity, and metallic character change in predictable patterns.",
};

export default function PeriodicTrendsPage() {
  const quiz = getQuizById("chemistry-periodic-trends");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/periodic-trends" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          { label: "Periodic Trends", href: "/dashboard/chemistry/periodic-trends" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Periodic Trends
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Periodic Trends
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Pick a trend and watch the periodic table light up — discover the patterns instead of just memorizing
          the arrows.
        </p>
      </div>

      <PeriodicTrends />

      {quiz && (
        <QuizCta href="/dashboard/chemistry/periodic-trends-quiz" colorToken="chemistry" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}

      <SimulationLearnMore
        colorToken="chemistry"
        objectives={[
          "Describe how atomic radius, ionization energy, electronegativity, and metallic character change across a period and down a group.",
          "Explain why these trends exist in terms of nuclear charge and electron shielding.",
          "Predict, for any two main-group elements, which one has the larger value for a given trend.",
          "Recognize that all four trends are really driven by the same underlying cause.",
        ]}
        concepts={[
          {
            term: "Atomic radius",
            explanation:
              "Decreases left to right across a period (more protons pull the same outer shell in tighter) and increases down a group (each new period adds a whole new electron shell).",
          },
          {
            term: "Ionization energy",
            explanation:
              "The energy needed to remove an electron. It increases left to right (electrons are held more tightly) and increases up a group (outer electrons sit closer to the nucleus).",
          },
          {
            term: "Electronegativity",
            explanation:
              "How strongly an atom pulls on shared electrons in a bond. It follows the same direction as ionization energy — up and to the right, peaking near fluorine.",
          },
          {
            term: "Metallic character",
            explanation:
              "How readily an atom loses electrons rather than gains them. It runs opposite to electronegativity — strongest toward the lower-left of the table, weakest toward the upper-right.",
          },
          {
            term: "The common cause",
            explanation:
              "All four trends trace back to two things pulling against each other: increasing nuclear charge (more protons pulling harder) across a period, and increasing distance/shielding (more electron shells) down a group.",
          },
        ]}
        howToUse={[
          "Pick a trend from the selector above the table.",
          "Watch the color gradient sweep across the table as you do — brighter cells mean a higher value for that trend.",
          "Hover or tap any element to see its exact position in the trend.",
          "Switch trends and compare — notice which ones move in the same direction and which move opposite each other.",
        ]}
        whyItMatters="These four trends aren't just facts to memorize — they explain real chemical behavior. Metallic character predicts why sodium reacts violently with water but chlorine doesn't. Electronegativity predicts which atom in a bond pulls electrons toward itself, which is the basis for polarity in molecules like water. Once you see all four trends as the result of the same tug-of-war between nuclear charge and shielding, the periodic table stops being a chart to memorize and starts being something you can reason through."
        tryThis={[
          "Compare sodium (Na) and chlorine (Cl) on all four trends — predict which one loses electrons more easily.",
          "Find the element with the smallest atomic radius on the table. Why does it end up there?",
          "Pick any two elements in the same group and explain, in terms of shielding, why the lower one has a larger radius.",
        ]}
      />
    </Container>
  );
}
