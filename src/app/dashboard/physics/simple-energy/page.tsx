import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { SimpleEnergy } from "@/features/subjects/physics/simple-energy";

export const metadata: Metadata = {
  title: "Simple Energy",
  description:
    "Release a ball down a hill and watch potential energy turn into kinetic energy.",
};

export default function SimpleEnergyPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/physics/simple-energy" className="mb-4" />
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
          Simple Energy
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Set how high the ball starts, press Release, and watch potential
          energy turn into kinetic energy as it rolls down.
        </p>
      </div>

      <SimpleEnergy />

      <SimulationLearnMore
        colorToken="physics"
        objectives={[
          "Distinguish between potential energy and kinetic energy.",
          "Explain how height above the ground relates to stored energy.",
          "Describe the law of conservation of energy in your own words.",
          "Predict how a ball's speed changes as it rolls down a hill.",
        ]}
        concepts={[
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
        ]}
        howToUse={[
          "Set how high the ball starts on the hill using the height control.",
          "Press Release and watch the ball roll down.",
          "Track the potential and kinetic energy readouts as the ball moves — one falls while the other rises.",
          "Try a few different starting heights and compare how fast the ball is moving at the bottom.",
        ]}
        whyItMatters="This trade-off between stored and moving energy is what makes roller coasters work, what lets hydroelectric dams generate electricity from falling water, and what determines how far a skier accelerates down a slope. Once you can spot potential energy turning into kinetic energy, you'll start seeing it in nearly every moving system around you."
        tryThis={[
          "Double the starting height. Does the ball's speed at the bottom also double? Test your prediction.",
          "Pause the ball partway down and compare its potential and kinetic energy at that instant — do they add up to the starting total?",
          "Predict which starting height will produce the fastest ball at the bottom, then check it.",
        ]}
      />
    </Container>
  );
}
