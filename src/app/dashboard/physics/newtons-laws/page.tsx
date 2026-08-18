import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { NewtonsLaws } from "@/features/subjects/physics/newtons-laws";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newton's Laws of Motion",
  description:
    "An interactive laboratory for Newton's Three Laws of Motion — inertia, F = ma, and action-reaction, explored through experimentation rather than memorization.",
};

export default function NewtonsLawsPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/physics/newtons-laws" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Physics", href: "/dashboard/physics" },
          { label: "Newtonian Mechanics", href: "/dashboard/physics/newtonian-mechanics" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
          Physics · Newtonian Mechanics
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Newton&apos;s Laws of Motion
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Inertia, F = ma, and action-reaction — pushed, pulled, and collided
          with in real time. Three laws, one shared physics engine, built to be
          experimented with rather than memorized.
        </p>
      </div>

      <NewtonsLaws />

      <SimulationLearnMore
        colorToken="physics"
        objectives={[
          "State Newton's three laws of motion in your own words.",
          "Explain why an object at rest stays at rest unless a force acts on it.",
          "Use F = ma to relate force, mass, and acceleration.",
          "Recognize action-reaction pairs and explain why they don't cancel each other out.",
        ]}
        concepts={[
          {
            term: "Newton's First Law — Inertia",
            explanation:
              "An object at rest stays at rest, and an object in motion stays in motion at a constant velocity, unless acted on by a net force. This resistance to a change in motion is called inertia.",
          },
          {
            term: "Newton's Second Law",
            explanation: "The acceleration of an object is directly proportional to the net force acting on it, and inversely proportional to its mass.",
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
        ]}
        howToUse={[
          "Pick a Law tab — Law 1, Law 2, or Law 3 — each uses its own setup to isolate that law.",
          "Adjust the sliders, then apply a force or run the scenario's action and watch the live data update.",
          "Try Learning Mode for guided \"why does this happen?\" walkthroughs.",
          "Try Challenge Mode to test your intuition before seeing the result.",
        ]}
        whyItMatters="Newton's laws aren't just physics-class trivia — they're the reason seatbelts exist (inertia keeps your body moving forward in a crash), why a loaded truck accelerates slower than an empty one at the same engine power (F = ma), and how rockets can push themselves forward in the vacuum of space with nothing to push against but their own exhaust (action-reaction). These three laws are the foundation nearly all of classical mechanics — and modern engineering — is built on."
        tryThis={[
          "In Law 1, try applying a very small force to a heavy object — does it move right away, or does inertia resist it?",
          "In Law 2, double the mass while keeping the force the same. What happens to the acceleration?",
          "In Law 3, push two skaters of very different mass apart. Do they end up moving at the same speed?",
        ]}
      />
    </Container>
  );
}
