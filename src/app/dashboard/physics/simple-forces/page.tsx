import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { SimpleForces } from "@/features/subjects/physics/simple-forces";

export const metadata: Metadata = {
  title: "Simple Forces",
  description: "Push and pull a box from either side and see which force wins.",
};

export default function SimpleForcesPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/physics/simple-forces" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Physics", href: "/dashboard/physics" },
          {
            label: "Newtonian Mechanics",
            href: "/dashboard/physics/newtonian-mechanics",
          },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
          Physics · Newtonian Mechanics
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Simple Forces
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Set a push on each side of the box and press Start — whichever force
          is bigger decides which way it moves.
        </p>
      </div>

      <SimpleForces />

      <SimulationLearnMore
        colorToken="physics"
        objectives={[
          "Explain what net force means when two forces act in opposite directions.",
          "Predict which way an object moves given two opposing forces.",
          "Identify when forces are balanced versus unbalanced.",
          "Recognize that balanced forces produce no motion.",
        ]}
        concepts={[
          {
            term: "Net force",
            explanation: "When two forces pull or push in opposite directions, what actually determines the object's motion is the difference between them.",
            formula: "F_{net} = F_{right} - F_{left}",
          },
          {
            term: "Balanced forces",
            explanation:
              "When the two opposing forces are equal, the net force is zero — the box stays still, even though two real forces are still being applied to it.",
          },
          {
            term: "Unbalanced forces",
            explanation:
              "When one force is larger than the other, there's a nonzero net force, and the box moves in the direction of the stronger force.",
          },
        ]}
        howToUse={[
          "Set a force value on the left side and a force value on the right side.",
          "Press Start and watch which way the box moves.",
          "Try to find a combination where the box doesn't move at all.",
          "Watch the balanced/unbalanced label update as you change either slider.",
        ]}
        whyItMatters="A tug-of-war is the clearest everyday example of this idea: as long as both teams pull with equal force, nobody moves, no matter how hard they're pulling. The moment one side pulls harder, the whole rope shifts that way. This same idea of balanced versus unbalanced forces is the starting point for everything in mechanics — it's exactly what Newton's First Law describes, just with the numbers made concrete."
        tryThis={[
          "Set both forces to the same value. What happens to the box, and why, even though force is still being applied?",
          "Set the left force to the maximum and the right force to the minimum. Predict the outcome before pressing Start.",
          "Find two different force pairs that both result in the box staying still.",
        ]}
      />
    </Container>
  );
}
