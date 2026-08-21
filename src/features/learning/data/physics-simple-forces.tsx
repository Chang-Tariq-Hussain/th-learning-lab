import type { TopicContent } from "../types";

/**
 * Learn + Explore only — Predict/Explain/Practice/Challenge haven't
 * been authored for this topic yet. Content below is carried over
 * verbatim from the `SimulationLearnMore` block that used to live on
 * this topic's page (see `app/dashboard/physics/simple-forces`), so
 * nothing is duplicated or reworded — this just moves the same
 * authored material into the generic architecture so its progress is
 * trackable (and so it can anchor a step in the Physics Foundations
 * learning path).
 */
export const physicsSimpleForcesContent: TopicContent = {
  subjectSlug: "physics",
  topicSlug: "simple-forces",
  title: "Simple Forces",
  subjectLabel: "Physics",
  topicLabel: "Newtonian Mechanics",
  colorToken: "physics",
  simulationHref: "/dashboard/physics/simple-forces",

  learn: {
    objectives: [
      "Explain what net force means when two forces act in opposite directions.",
      "Predict which way an object moves given two opposing forces.",
      "Identify when forces are balanced versus unbalanced.",
      "Recognize that balanced forces produce no motion.",
    ],
    concepts: [
      {
        term: "Net force",
        explanation:
          "When two forces pull or push in opposite directions, what actually determines the object's motion is the difference between them.",
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
    ],
    whyItMatters:
      "A tug-of-war is the clearest everyday example of this idea: as long as both teams pull with equal force, nobody moves, no matter how hard they're pulling. The moment one side pulls harder, the whole rope shifts that way. This same idea of balanced versus unbalanced forces is the starting point for everything in mechanics — it's exactly what Newton's First Law describes, just with the numbers made concrete.",
  },

  explore: {
    howToUse: [
      "Set a force value on the left side and a force value on the right side.",
      "Press Start and watch which way the box moves.",
      "Try to find a combination where the box doesn't move at all.",
      "Watch the balanced/unbalanced label update as you change either slider.",
    ],
    tryThis: [
      "Set both forces to the same value. What happens to the box, and why, even though force is still being applied?",
      "Set the left force to the maximum and the right force to the minimum. Predict the outcome before pressing Start.",
      "Find two different force pairs that both result in the box staying still.",
    ],
  },
};
