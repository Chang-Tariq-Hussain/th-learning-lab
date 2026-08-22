import type { ParameterValues } from "@/features/simulation";
import type { Law3ScenarioKey } from "./physics";

export interface LearningScenario {
  id: string;
  question: string;
  explanation: string;
  law: 1 | 2 | 3;
  law3Scenario?: Law3ScenarioKey;
  patch: Partial<ParameterValues>;
  /** What the student should do next, after the scenario has set everything up. */
  instruction: string;
}

export const learningScenarios: LearningScenario[] = [
  {
    id: "heavier-accelerates-less",
    question: "Why do heavier objects accelerate less?",
    explanation:
      "F = ma rearranges to a = F/m — for the same force, acceleration is inversely proportional to mass. This isn't heavier objects being \"harder to move\" in some vague sense; it's a precise, testable ratio. Watch the acceleration readout as mass increases with the force held fixed.",
    law: 2,
    patch: { mass: 3, maxPushForce: 60, frictionEnabled: "off" },
    instruction:
      "Drag the left person toward the box to push, note the acceleration, then raise the Mass slider to 15 kg and drag again with the same lean.",
  },
  {
    id: "friction-changes-motion",
    question: "How does friction change motion?",
    explanation:
      "Without friction, any nonzero net force keeps accelerating an object forever (Law 1's other case — no equilibrium). With friction on, the object accelerates while the applied force exceeds friction, but settles at a constant velocity once you remove the push and friction alone decelerates it to a stop — friction always opposes the direction of motion.",
    law: 1,
    patch: { mass: 5, maxPushForce: 50, surface: "ice", frictionEnabled: "on" },
    instruction:
      "Drag the left person in, let the box move, then let go and watch friction bring it to rest. Try switching Surface to Rubber mat and repeat.",
  },
  {
    id: "equal-force-different-acceleration",
    question: "Why can equal forces produce different accelerations?",
    explanation:
      "Two carts can feel the exact same applied force and still accelerate differently — if their masses differ, or if one surface has more friction than the other (reducing the net force even though the applied force is identical). Acceleration depends on net force, not applied force alone.",
    law: 2,
    patch: {
      mass: 5,
      maxPushForce: 50,
      surface: "wood",
      frictionEnabled: "on",
    },
    instruction:
      "Note the acceleration with Wood + 5 kg at a given lean, then switch Surface to Rubber mat (more friction) with the same lean and mass — acceleration drops even though the push didn't change.",
  },
  {
    id: "action-reaction-no-cancel",
    question: "Why don't action and reaction forces cancel each other?",
    explanation:
      "They're equal and opposite, but they act on two different objects — forces only cancel when they act on the *same* object. A rocket's thrust (pushing exhaust backward) and the exhaust's reaction (pushing the rocket forward) never cancel, because one acts on the exhaust gas and the other acts on the rocket. That's exactly what lets the rocket accelerate.",
    law: 3,
    law3Scenario: "rocket",
    patch: { mass: 2, thrust: 15, surface: "ice" },
    instruction:
      "Switch to the Rocket scenario and toggle thrust on — watch the rocket accelerate forward even though an equal force pushes the exhaust backward.",
  },
  {
    id: "misconception-motion-needs-force",
    question: "Common misconception: does motion always need a force?",
    explanation:
      "A common intuition is that a constant force is needed to keep something moving — true only because everyday friction constantly removes energy. On a genuinely frictionless surface, Law 1 says a moving object keeps moving at constant velocity with zero applied force. Try it: push briefly, let go on ice, and watch the object coast rather than stop.",
    law: 1,
    patch: {
      mass: 5,
      maxPushForce: 50,
      surface: "ice",
      frictionEnabled: "off",
    },
    instruction:
      "Drag the left person in briefly, then let go — with friction off, the box should coast at constant velocity instead of slowing down.",
  },
];
