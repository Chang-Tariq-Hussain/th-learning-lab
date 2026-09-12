import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { Mitosis } from "@/features/subjects/biology/mitosis";
import { TopicExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/biology/mitosis";

export const metadata: Metadata = {
  title: "Mitosis",
  description: "Watch one parent cell divide into two daughter cells through the stages of mitosis.",
};

export default function MitosisPage() {
  const content = getTopicContent("biology", "mitosis");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          { label: "Cell Division", href: "/dashboard/biology/cell-division" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
          Biology · Cell Division
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Mitosis: How One Cell Becomes Two
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Press Start and watch a cell move through the stages of mitosis, or step through them one at a time.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<Mitosis />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <Mitosis />
      )}
    </Container>
  );
}
