import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { getQuizById } from "@/features/quiz-engine/registry";
import { CellularRespiration } from "@/features/subjects/biology/cellular-respiration";

export const metadata: Metadata = {
  title: "Cellular Respiration",
  description: "Watch a cell use glucose and oxygen to release energy, carbon dioxide, and water.",
};

export default function CellularRespirationPage() {
  const quiz = getQuizById("biology-cellular-respiration");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/biology/cellular-respiration" className="mb-4" />
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
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">Cellular Respiration</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Press Start and watch glucose and oxygen travel to the mitochondrion to release energy, carbon dioxide, and water.
        </p>
      </div>

      <CellularRespiration />

      {quiz && (
        <QuizCta href="/dashboard/biology/cellular-respiration-quiz" colorToken="biology" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}

      <SimulationLearnMore
        colorToken="biology"
        objectives={[
          "Name the raw materials a cell needs for cellular respiration.",
          "Name the products cellular respiration releases and what the cell does with each.",
          "Explain where cellular respiration takes place inside a cell.",
          "Write and interpret the overall chemical equation for cellular respiration.",
        ]}
        concepts={[
          {
            term: "What goes in",
            explanation:
              "A cell takes in glucose, a sugar built up from food, and oxygen, breathed in and carried through the bloodstream. Both travel to the mitochondrion to be broken down.",
          },
          {
            term: "What comes out",
            explanation:
              "Cellular respiration releases usable energy the cell can run on, along with carbon dioxide and water as byproducts, which the body breathes out or removes as waste.",
          },
          {
            term: "The overall reaction",
            explanation:
              "All of this can be summarized in one balanced equation: one molecule of glucose plus six of oxygen breaks down into six molecules of carbon dioxide, six of water, and usable energy.",
            formula: "C_6H_{12}O_6 + 6O_2 \\rightarrow 6CO_2 + 6H_2O + \\text{energy}",
            formulaCaption: "Cellular respiration, balanced equation",
          },
          {
            term: "The mitochondrion",
            explanation:
              "The organelle where most cellular respiration happens — often called the cell's powerhouse, since it's where glucose and oxygen are converted into a form of energy the rest of the cell can actually use.",
          },
        ]}
        howToUse={[
          "Press Start and watch glucose and oxygen travel toward the mitochondrion.",
          "Notice where each raw material enters the cell and where it heads.",
          "Watch the mitochondrion convert the inputs into energy, carbon dioxide, and water.",
          "Follow the carbon dioxide and water as they're released as waste products.",
        ]}
        whyItMatters="Cellular respiration is how nearly every cell in your body — and in almost every living organism — turns food into usable energy. It's the flip side of photosynthesis: plants build glucose using sunlight, and then cells everywhere, including in that same plant, break it back down through this process to power everything from muscle contractions to brain activity."
        tryThis={[
          "Compare this equation to photosynthesis's equation. What do you notice about the inputs and outputs?",
          "Predict what would happen to a cell that couldn't get enough oxygen for this reaction.",
          "Count how many CO₂ and H₂O molecules the equation produces — why do you think it's six of each?",
        ]}
      />
    </Container>
  );
}
