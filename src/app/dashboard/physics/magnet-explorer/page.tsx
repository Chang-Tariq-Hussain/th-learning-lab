import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { getQuizById } from "@/features/quiz-engine/registry";
import { MagnetExplorer } from "@/features/subjects/physics/magnet-explorer";

export const metadata: Metadata = {
  title: "Interactive Magnet Explorer",
  description:
    "Drag and rotate two bar magnets to discover that every magnet has two poles, like poles repel, and opposite poles attract.",
};

export default function MagnetExplorerPage() {
  const quiz = getQuizById("physics-electromagnetism");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/physics/magnet-explorer" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Physics", href: "/dashboard/physics" },
          { label: "Electromagnetism", href: "/dashboard/physics/electromagnetism" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
          Physics · Electromagnetism
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Interactive Magnet Explorer
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Drag and rotate two bar magnets to discover how they behave —
          every magnet has two poles, matching poles push apart, and
          opposite poles pull together.
        </p>
      </div>

      <MagnetExplorer />

      {quiz && (
        <QuizCta href="/dashboard/physics/electromagnetism-quiz" colorToken="physics" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}

      <SimulationLearnMore
        colorToken="physics"
        objectives={[
          "Identify the north and south poles on a bar magnet.",
          "Predict whether two magnets will attract or repel based on which poles face each other.",
          "Describe a magnetic field as the invisible region where a magnet's force acts.",
          "Explain why magnets always come with two poles, never just one.",
        ]}
        concepts={[
          {
            term: "Magnetic poles",
            explanation:
              "Every magnet has a north pole and a south pole, no matter how small you cut it — you can't isolate a single pole on its own.",
          },
          {
            term: "Attraction and repulsion",
            explanation:
              "Like poles push each other away, and opposite poles pull toward each other. North facing north repels; north facing south attracts.",
          },
          {
            term: "Magnetic field",
            explanation:
              "The region of space around a magnet where its force can be felt. Field lines loop out of the north pole and back into the south pole, and the force is strongest where the lines are closest together.",
          },
        ]}
        howToUse={[
          "Drag each bar magnet around the workspace to change its position.",
          "Rotate a magnet to point its north or south pole toward the other magnet.",
          "Bring the two magnets close together and watch how they push apart or pull together.",
          "Flip one magnet's orientation and see how the interaction changes from attract to repel.",
        ]}
        whyItMatters="Magnetism isn't just for fridge magnets — it's what spins the motors in electric cars, focuses the beams in MRI machines, and stores data on hard drives. The same attract-repel rule you're testing here scales all the way up to the magnetic field that shields the entire Earth from solar radiation."
        tryThis={[
          "Position the magnets so they repel, then slowly rotate one until they attract instead. What changed?",
          "Try to make the magnets neither attract nor repel. Is that possible?",
          "Predict the interaction before rotating a magnet, then check whether you were right.",
        ]}
      />
    </Container>
  );
}
