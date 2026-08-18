import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { getQuizById } from "@/features/quiz-engine/registry";
import { ReactionKinetics } from "@/features/subjects/chemistry/reaction-kinetics";

export const metadata: Metadata = {
  title: "Reaction Kinetics — Understanding Reaction Rates",
  description:
    "Watch reactant particles collide, see which collisions succeed, and explore how concentration, temperature, surface area, and catalysts change reaction rate.",
};

export default function ReactionKineticsPage() {
  const quiz = getQuizById("chemistry-reaction-kinetics");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/reaction-kinetics" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          { label: "Reaction Kinetics", href: "/dashboard/chemistry/reaction-kinetics" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Reaction Kinetics
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Reaction Kinetics — Understanding Reaction Rates
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Watch particles collide, see why only some collisions succeed, and explore how concentration,
          temperature, surface area, and catalysts each change how fast a reaction runs.
        </p>
      </div>

      <ReactionKinetics />

      {quiz && (
        <QuizCta href="/dashboard/chemistry/reaction-kinetics-quiz" colorToken="chemistry" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}

      <SimulationLearnMore
        colorToken="chemistry"
        objectives={[
          "Explain collision theory: why particles must collide to react.",
          "Describe what makes a collision \"successful\" rather than just a bounce.",
          "Predict how concentration, temperature, surface area, and catalysts each affect reaction rate.",
          "Connect each factor back to how it changes the frequency or success rate of collisions.",
        ]}
        concepts={[
          {
            term: "Collision theory",
            explanation:
              "For a reaction to happen, particles have to physically collide. But not every collision leads to a reaction — only the ones with enough energy and the right orientation actually succeed.",
          },
          {
            term: "Concentration",
            explanation:
              "More particles packed into the same space means more frequent collisions, which generally speeds up the reaction.",
          },
          {
            term: "Temperature",
            explanation:
              "Higher temperature makes particles move faster. That means collisions happen more often, and more of them carry enough energy to actually react.",
          },
          {
            term: "Surface area",
            explanation:
              "Crushing a solid into powder exposes far more surface for other particles to collide with, which speeds up the reaction without changing anything else.",
          },
          {
            term: "Catalysts",
            explanation:
              "A catalyst makes it easier for collisions to succeed — increasing the reaction rate — without being used up itself.",
          },
        ]}
        howToUse={[
          "Work through the levels in order — each one isolates a single idea before combining them.",
          "In the collision levels, watch which particle collisions succeed (turn into product) and which just bounce apart.",
          "In the factor levels, make a prediction first, then adjust the slider and see if you were right.",
          "Use the Compare and Experiment levels to test combinations of factors against each other.",
        ]}
        whyItMatters="Collision theory explains everyday chemistry you've already noticed: food spoils faster at room temperature than in the fridge (temperature), a log burns slower than sawdust (surface area), and catalytic converters in cars use catalysts to clean up exhaust without wearing out. The same four factors — concentration, temperature, surface area, and catalysts — are also exactly what chemical engineers tune to control reactions in everything from manufacturing to medicine."
        tryThis={[
          "Predict which single factor you'd expect to speed up a reaction the most, then test it in the Experiment level.",
          "Compare a high-temperature, low-concentration setup against a low-temperature, high-concentration one — which reacts faster?",
          "Add a catalyst to a slow reaction and see how much the rate changes without touching anything else.",
        ]}
      />
    </Container>
  );
}
