import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { AtpEnergyRelease } from "@/features/subjects/biology/atp-energy-release";
import { TopicExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/biology/atp-energy-release";

export const metadata: Metadata = {
  title: "ATP & Energy Release",
  description: "ATP structure, hydrolysis, free energy, energy coupling and regeneration: a rotatable molecule lab, step-by-step hydrolysis, the ATP cycle and four cellular-work examples.",
};

export default function AtpEnergyReleasePage() {
  const content = getTopicContent("biology", "atp-energy-release");

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
        <p className="font-mono text-label uppercase tracking-eyebrow text-subject-biology">
          Biology · Cell Structure
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          ATP & Energy Release
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Explore ATP in a rotatable molecule lab, watch hydrolysis release free energy, follow the ATP cycle and see how ATP is coupled to cellular work.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<AtpEnergyRelease />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <AtpEnergyRelease />
      )}
    </Container>
  );
}
