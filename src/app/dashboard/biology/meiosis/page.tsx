import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { Meiosis } from "@/features/subjects/biology/meiosis";
import { TopicExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/biology/meiosis";

export const metadata: Metadata = {
  title: "Meiosis",
  description: "Step through meiosis in an interactive chromosome lab: pairing, crossing over, independent assortment and four haploid cells.",
};

export default function MeiosisPage() {
  const content = getTopicContent("biology", "meiosis");

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
        <p className="font-mono text-label uppercase tracking-eyebrow text-subject-biology">
          Biology · Cell Division
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Meiosis: How Sex Cells Are Formed
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Watch chromosomes pair, cross over and separate in a large, step-by-step lab: play the whole division, step through it, explore crossing over, count chromosomes and test yourself.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<Meiosis />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <Meiosis />
      )}
    </Container>
  );
}
