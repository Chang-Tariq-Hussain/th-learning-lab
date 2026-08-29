import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimpleEnergy } from "@/features/subjects/physics/simple-energy";
import { TopicExperience, getTopicContent } from "@/features/learning";

export const metadata: Metadata = {
  title: "Simple Energy",
  description:
    "Release a ball down a hill and watch potential energy turn into kinetic energy.",
};

export default function SimpleEnergyPage() {
  const content = getTopicContent("physics", "simple-energy");

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

      {content ? (
        <TopicExperience content={content} simulation={<SimpleEnergy />} />
      ) : (
        <SimpleEnergy />
      )}
    </Container>
  );
}
