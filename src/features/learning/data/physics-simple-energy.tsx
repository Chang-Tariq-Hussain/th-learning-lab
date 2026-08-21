import type { TopicContent } from "../types";

/** Learn + Explore only — same rationale as `physics-simple-forces.tsx`. */
export const physicsSimpleEnergyContent: TopicContent = {
  subjectSlug: "physics",
  topicSlug: "simple-energy",
  title: "Simple Energy",
  subjectLabel: "Physics",
  topicLabel: "Newtonian Mechanics",
  colorToken: "physics",
  simulationHref: "/dashboard/physics/simple-energy",

  learn: {
    objectives: [
      "Distinguish between potential energy and kinetic energy.",
      "Explain how height above the ground relates to stored energy.",
      "Describe the law of conservation of energy in your own words.",
      "Predict how a ball's speed changes as it rolls down a hill.",
    ],
    concepts: [
      {
        term: "Potential energy (PE)",
        explanation:
          "Stored energy an object has because of its position. A ball held up high has more potential energy than the same ball sitting on the ground.",
        formula: "PE = mgh",
        formulaCaption: "mass × gravity × height",
      },
      {
        term: "Kinetic energy (KE)",
        explanation:
          "The energy an object has because it's moving. The faster something moves, the more kinetic energy it has — and speed matters a lot, since it's squared in the formula.",
        formula: "KE = \\tfrac{1}{2}mv^2",
        formulaCaption: "½ × mass × velocity²",
      },
      {
        term: "Conservation of energy",
        explanation:
          "Energy isn't created or destroyed, only converted from one form to another. As the ball rolls downhill, the potential energy it loses turns into kinetic energy — ignoring friction, the total stays the same.",
        formula: "PE_i + KE_i = PE_f + KE_f",
        formulaCaption: "Total mechanical energy is conserved",
      },
    ],
    whyItMatters:
      "This trade-off between stored and moving energy is what makes roller coasters work, what lets hydroelectric dams generate electricity from falling water, and what determines how far a skier accelerates down a slope. Once you can spot potential energy turning into kinetic energy, you'll start seeing it in nearly every moving system around you.",
  },

  explore: {
    howToUse: [
      "Set how high the ball starts on the hill using the height control.",
      "Press Release and watch the ball roll down.",
      "Track the potential and kinetic energy readouts as the ball moves — one falls while the other rises.",
      "Try a few different starting heights and compare how fast the ball is moving at the bottom.",
    ],
    tryThis: [
      "Double the starting height. Does the ball's speed at the bottom also double? Test your prediction.",
      "Pause the ball partway down and compare its potential and kinetic energy at that instant — do they add up to the starting total?",
      "Predict which starting height will produce the fastest ball at the bottom, then check it.",
    ],
  },
};
