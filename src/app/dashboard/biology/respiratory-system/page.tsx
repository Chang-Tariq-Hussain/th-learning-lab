import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CrossSubjectConnections } from "@/components/dashboard/cross-subject-connections";
import { getConnectionsForHref } from "@/features/cross-subject-connections";
import { RespiratorySystem } from "@/features/subjects/biology/respiratory-system";
import { TopicExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/biology/respiratory-system";

export const metadata: Metadata = {
  title: "Respiratory System — Breathing & Gas Exchange",
  description:
    "Watch air move in and out of the lungs, follow the airway from nose to alveoli, and see oxygen and carbon dioxide exchange between the alveoli and blood.",
};

export default function RespiratorySystemPage() {
  const content = getTopicContent("biology", "respiratory-system");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          { label: "Human Physiology", href: "/dashboard/biology/human-physiology" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
          Biology · Human Physiology
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Respiratory System — Breathing &amp; Gas Exchange
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Breathe the lungs in and out, follow the air from nose to alveoli, and watch oxygen and carbon dioxide
          trade places between the alveoli and the blood.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<RespiratorySystem />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <RespiratorySystem />
      )}

      <CrossSubjectConnections connections={getConnectionsForHref(SIMULATION_HREF)} />
    </Container>
  );
}
