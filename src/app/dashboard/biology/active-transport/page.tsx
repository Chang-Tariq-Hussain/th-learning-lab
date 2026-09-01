import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { MembraneTransport } from "@/features/subjects/biology/membrane-transport";
import { TopicExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/biology/active-transport";

export const metadata: Metadata = {
  title: "Active Transport",
  description: "How a cell pumps particles against their concentration gradient, spending energy to do it — predict, run, and explain the process.",
};

export default function ActiveTransportPage() {
  const content = getTopicContent("biology", "active-transport");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          { label: "Cell Structure", href: "/dashboard/biology/cell-structure" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
          Biology · Cell Structure
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Active Transport
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Not every substance can just diffuse where a cell needs it.
          See how a cell pumps particles against their concentration
          gradient — and why that takes energy.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<MembraneTransport initialMode="active-transport" />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <MembraneTransport initialMode="active-transport" />
      )}
    </Container>
  );
}
