import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { CompassExplorer } from "@/features/subjects/physics/compass-explorer";

export const metadata: Metadata = {
  title: "Interactive Compass Explorer",
  description:
    "Drag a magnet and a compass around the same playground to discover that a compass is just a tiny magnet whose needle follows the field.",
};

export default function CompassExplorerPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/physics/compass-explorer" className="mb-4" />
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
          Interactive Compass Explorer
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Drag the magnet and the compass around the playground and watch
          the needle turn to follow the magnet&apos;s field — a compass is
          just a tiny magnet, always finding North.
        </p>
      </div>

      <CompassExplorer />

      <SimulationLearnMore
        colorToken="physics"
        objectives={[
          "Explain why a compass needle turns to point in a particular direction.",
          "Describe a compass needle as a small magnet, not a separate kind of object.",
          "Predict how a compass needle will respond as a nearby magnet moves.",
          "Connect a compass's behavior to the shape of a magnetic field.",
        ]}
        concepts={[
          {
            term: "A compass is a tiny magnet",
            explanation:
              "The needle inside a compass is itself a small, lightweight magnet, free to rotate. It has its own north and south pole, just like a bar magnet — it's just small enough to spin easily in response to outside fields.",
          },
          {
            term: "Following the field",
            explanation:
              "A compass needle lines up with whatever magnetic field surrounds it. Its north pole points along the direction of the field lines at that location.",
          },
          {
            term: "Field direction changes with position",
            explanation:
              "Magnetic field lines loop out from a magnet's north pole and back into its south pole, curving through space. Since the field's direction is different at different points around a magnet, the needle points a different way depending on where the compass sits.",
          },
        ]}
        howToUse={[
          "Place the compass near the magnet and note which way its needle points.",
          "Move the compass to a different position around the same magnet and watch the needle rotate.",
          "Drag the magnet itself and watch the needle track the change in real time.",
          "Try placing the compass directly between the magnet's poles and see how the needle behaves there.",
        ]}
        whyItMatters="This is exactly how a compass has guided travelers for centuries — except instead of a nearby bar magnet, it's responding to Earth's own magnetic field, which behaves like an enormous magnet buried inside the planet. Understanding that a compass needle is simply a small magnet aligning with a field is the same idea behind how MRI machines, electric motors, and magnetic sensors all work."
        tryThis={[
          "Predict which way the needle will point before moving the compass to a new spot, then check yourself.",
          "Find a position where the needle points in a surprising direction. Can you explain why, based on the field lines?",
          "Think about how this relates to Earth acting like a giant magnet — where would Earth's own \"north pole\" magnet actually be?",
        ]}
      />
    </Container>
  );
}
