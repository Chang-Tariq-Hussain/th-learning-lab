import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { PhotosynthesisVsRespiration } from "@/features/subjects/biology/photosynthesis-vs-respiration";
import { TopicExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/biology/photosynthesis-vs-respiration";

export const metadata: Metadata = {
  title: "Photosynthesis vs Cellular Respiration",
  description: "Compare photosynthesis and cellular respiration side by side, and see how their inputs and outputs connect.",
};

export default function PhotosynthesisVsRespirationPage() {
  const content = getTopicContent("biology", "photosynthesis-vs-respiration");

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
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
          Biology · Plant Biology
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Photosynthesis vs Cellular Respiration
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Two connected processes, side by side: what each one uses,
          what each one produces, and how they feed into each other.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<PhotosynthesisVsRespiration />} />
      ) : (
        // Falls back to the bare comparison component if this topic's
        // learning content is ever removed from the registry — keeps
        // the page from 404ing outright.
        <PhotosynthesisVsRespiration />
      )}
    </Container>
  );
}
