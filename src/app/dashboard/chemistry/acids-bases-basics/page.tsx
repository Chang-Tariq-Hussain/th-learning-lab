import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { getQuizById } from "@/features/quiz-engine/registry";
import { AcidsBasesBasics } from "@/features/subjects/chemistry/acids-bases-basics";

export const metadata: Metadata = {
  title: "Acids & Bases — The Basics",
  description:
    "Explore everyday substances on the pH scale and build intuition for what makes something acidic, neutral, or basic.",
};

export default function AcidsBasesBasicsPage() {
  const quiz = getQuizById("chemistry-acids-bases");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/acids-bases-basics" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          { label: "Acids & Bases — The Basics", href: "/dashboard/chemistry/acids-bases-basics" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Acids &amp; Bases
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Acids &amp; Bases — The Basics
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Pick a familiar substance and see where it lands on the pH scale — no equations yet, just intuition.
        </p>
      </div>

      <AcidsBasesBasics />

      {quiz && (
        <QuizCta href="/dashboard/chemistry/acids-bases-quiz" colorToken="chemistry" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}

      <SimulationLearnMore
        colorToken="chemistry"
        objectives={[
          "Place everyday substances on the pH scale as acidic, neutral, or basic.",
          "Explain what the pH scale actually measures.",
          "Recognize that a small change in pH means a big change in acidity.",
          "Connect familiar tastes and household products to their approximate pH.",
        ]}
        concepts={[
          {
            term: "The pH scale",
            explanation:
              "A scale from 0 to 14 that tells you how acidic or basic a substance is. Lower numbers are more acidic, higher numbers are more basic, and 7 is neutral — plain water.",
            formula: "0 \\; \\text{acidic} \\;\\longleftarrow\\; 7 \\;\\longrightarrow\\; \\text{basic} \\; 14",
            formulaCaption: "pH scale",
          },
          {
            term: "Acids",
            explanation:
              "Substances with a pH below 7. They tend to taste sour and release extra hydrogen ions (H⁺) when dissolved in water — lemon juice and vinegar are common examples.",
          },
          {
            term: "Bases",
            explanation:
              "Substances with a pH above 7. They tend to feel slippery and release hydroxide ions (OH⁻) when dissolved in water — soap and baking soda are common examples.",
          },
          {
            term: "Each step is a big jump",
            explanation:
              "The pH scale is logarithmic: a substance with pH 4 is 10 times more acidic than one with pH 5, not just \"one unit\" more. Small pH differences add up fast.",
          },
        ]}
        howToUse={[
          "Pick a substance from the list — like lemon juice, milk, or soap.",
          "Watch where it lands on the pH scale and read off its approximate pH value.",
          "Compare two substances at a time to see how far apart they sit on the scale.",
          "Look for the pattern: sour, food-related items cluster low; cleaning products cluster high.",
        ]}
        whyItMatters="pH shows up everywhere, from the antacid tablets that neutralize excess stomach acid, to the soil pH farmers test before planting, to the strict pH range your blood has to stay in for your cells to work properly. Reading a pH value is the first step to understanding chemistry that affects your health, your food, and the environment around you."
        tryThis={[
          "Find the most acidic substance in the list and the most basic. How many pH units apart are they?",
          "Guess a substance's pH before revealing it, based on how it tastes or feels — how close were you?",
          "Group the substances into three sets: acidic, neutral, and basic. What do the substances in each group have in common?",
        ]}
      />
    </Container>
  );
}
