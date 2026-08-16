import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { ReactionKinetics } from "@/features/subjects/chemistry/reaction-kinetics";

export const metadata: Metadata = {
  title: "Reaction Kinetics — Understanding Reaction Rates",
  description:
    "Watch reactant particles collide, see which collisions succeed, and explore how concentration, temperature, surface area, and catalysts change reaction rate.",
};

export default function ReactionKineticsPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/reaction-kinetics" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          { label: "Reaction Kinetics", href: "/dashboard/chemistry/reaction-kinetics" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Reaction Kinetics
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Reaction Kinetics — Understanding Reaction Rates
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Watch particles collide, see why only some collisions succeed, and explore how concentration,
          temperature, surface area, and catalysts each change how fast a reaction runs.
        </p>
      </div>

      <ReactionKinetics />
    </Container>
  );
}
