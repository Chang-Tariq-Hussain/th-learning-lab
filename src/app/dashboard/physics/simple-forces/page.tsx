import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
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
    </Container>
  );
}
