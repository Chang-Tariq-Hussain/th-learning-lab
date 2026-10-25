import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { Photosynthesis } from "@/features/subjects/biology/photosynthesis";
import { TopicExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/biology/photosynthesis";

export const metadata: Metadata = {
  title: "Photosynthesis",
  description: "Watch a simple plant turn light, water, and carbon dioxide into glucose and oxygen — predict, run, and explain the process.",
};

export default function PhotosynthesisPage() {
  const content = getTopicContent("biology", "photosynthesis");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          { label: "Plant Biology", href: "/dashboard/biology/plant-biology" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-label uppercase tracking-eyebrow text-subject-biology">
          Biology · Plant Biology
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Photosynthesis
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          How a plant turns light, water, and carbon dioxide into glucose and
          oxygen. Predict what will happen, then run the simulation to check
          yourself.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<Photosynthesis />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <Photosynthesis />
      )}
    </Container>
  );
}
