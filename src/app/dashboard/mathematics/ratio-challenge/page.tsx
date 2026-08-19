import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { RatioChallenge } from "@/features/subjects/mathematics/ratio-challenge";

export const metadata: Metadata = {
  title: "Ratio Challenge",
  description: "Random ratio challenges from beginner to advanced — missing values, simplifying, equivalent ratios, and word problems with instant feedback.",
};

export default function RatioChallengePage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/ratio-challenge" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Ratios", href: "/dashboard/mathematics/ratios" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">
          Mathematics · Ratios
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Ratio Challenge
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Missing values, simplifying, equivalent ratios, and word problems — answer correctly to level up,
          miss one and the difficulty eases back off.
        </p>
      </div>

      <RatioChallenge />

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Apply ratio skills across several problem types: missing values, simplifying, equivalence, and word problems.",
          "Practice choosing the right approach based on what a problem is asking.",
          "Build speed and confidence solving ratio problems under light time pressure.",
          "Learn from mistakes by seeing which strategy applies when an answer is wrong.",
        ]}
        concepts={[
          {
            term: "Missing-value problems",
            explanation:
              "Given a ratio like 3:5 and a partial equivalent ratio like 6:?, you're solving for the missing number that keeps both ratios equivalent — usually by finding the scale factor between the two.",
          },
          {
            term: "Simplifying problems",
            explanation:
              "Given a ratio like 12:8, you're finding its simplest form by dividing both numbers by their greatest common factor.",
          },
          {
            term: "Equivalence problems",
            explanation:
              "Given two ratios, you're deciding whether they represent the same comparison — usually fastest to check with cross multiplication.",
          },
          {
            term: "Word problems",
            explanation:
              "A real-world scenario described in words that hides a ratio inside it — the first step is always translating the scenario into numbers before solving.",
          },
        ]}
        howToUse={[
          "Read each challenge carefully and identify which type of problem it is.",
          "Solve it and submit your answer for instant feedback.",
          "Answer correctly to level up to harder challenges; miss one and the difficulty eases back off.",
          "Use incorrect answers as a cue to double-check your approach before trying the next challenge.",
        ]}
        whyItMatters={`Mixing several ratio problem types together, the way this challenge does, mirrors how ratios actually show up in real life — you rarely get a clean, labeled "simplify this" problem out in the world. Being able to recognize which kind of ratio problem you're facing, and switch strategies quickly, is exactly the skill that makes ratios useful outside the classroom.`}
        tryThis={[
          "Before solving, name out loud which type of ratio problem you're looking at.",
          "After missing a challenge, explain what went wrong before moving to the next one.",
          "See how many levels you can climb by staying accurate rather than rushing.",
        ]}
      />
    </Container>
  );
}
