import type { TopicContent } from "../types";

/**
 * Learn + Explore only — same rationale as `physics-simple-forces.tsx`.
 * `practice` is intentionally left unset here: this topic's page links
 * out to the shared `newtonian-mechanics` category quiz via `QuizCta`
 * rather than a topic-scoped quiz, so wiring it into `practice.quizId`
 * would double-count the same quiz across three sibling topics
 * (Simple Forces, Newton's Laws, Simple Energy).
 */
export const physicsNewtonsLawsContent: TopicContent = {
  subjectSlug: "physics",
  topicSlug: "newtons-laws",
  title: "Newton's Laws of Motion",
  subjectLabel: "Physics",
  topicLabel: "Newtonian Mechanics",
  colorToken: "physics",
  simulationHref: "/dashboard/physics/newtons-laws",

  learn: {
    objectives: [
      "State Newton's three laws of motion in your own words.",
      "Explain why an object at rest stays at rest unless a force acts on it.",
      "Use F = ma to relate force, mass, and acceleration.",
      "Recognize action-reaction pairs and explain why they don't cancel each other out.",
    ],
    concepts: [
      {
        term: "Newton's First Law — Inertia",
        explanation:
          "An object at rest stays at rest, and an object in motion stays in motion at a constant velocity, unless acted on by a net force. This resistance to a change in motion is called inertia.",
      },
      {
        term: "Newton's Second Law",
        explanation:
          "The acceleration of an object is directly proportional to the net force acting on it, and inversely proportional to its mass.",
        formula: "F = ma",
        formulaCaption: "F = net force, m = mass, a = acceleration",
      },
      {
        term: "Newton's Third Law — Action-Reaction",
        explanation:
          "For every action force, there's a reaction force equal in size and opposite in direction, acting on a different object. They don't cancel out because they act on two separate things.",
      },
      {
        term: "Mass vs. weight",
        explanation:
          "Mass is how much matter an object has and stays constant everywhere. Weight is the force of gravity on that mass, and changes depending on where the object is.",
      },
    ],
    whyItMatters:
      "Newton's laws aren't just physics-class trivia — they're the reason seatbelts exist (inertia keeps your body moving forward in a crash), why a loaded truck accelerates slower than an empty one at the same engine power (F = ma), and how rockets can push themselves forward in the vacuum of space with nothing to push against but their own exhaust (action-reaction). These three laws are the foundation nearly all of classical mechanics — and modern engineering — is built on.",
  },

  explore: {
    howToUse: [
      "Pick a Law tab — Law 1, Law 2, or Law 3 — each uses its own setup to isolate that law.",
      "Adjust the sliders, then apply a force or run the scenario's action and watch the live data update.",
      'Try Learning Mode for guided "why does this happen?" walkthroughs.',
      "Try Challenge Mode to test your intuition before seeing the result.",
    ],
    tryThis: [
      "In Law 1, try applying a very small force to a heavy object — does it move right away, or does inertia resist it?",
      "In Law 2, double the mass while keeping the force the same. What happens to the acceleration?",
      "In Law 3, push two skaters of very different mass apart. Do they end up moving at the same speed?",
    ],
  },
};
