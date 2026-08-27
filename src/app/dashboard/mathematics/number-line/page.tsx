import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { NumberLine } from "@/features/subjects/mathematics/number-line";
import { TopicLearningExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/mathematics/number-line";

export const metadata: Metadata = {
  title: "Interactive Number Line",
  description: "Drag a marker along a number line from -20 to +20 to learn positive numbers, negative numbers, zero, and absolute value.",
};

export default function NumberLinePage() {
  const content = getTopicContent("mathematics", "number-line");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Number Sense", href: "/dashboard/mathematics/number-sense" },
        ]}
        className="mb-6"
      />

      <div className="mb-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Mathematics · Number Sense</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Interactive Number Line
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Drag a marker along the line to see how position and value are the same thing — even among negative numbers.
        </p>
      </div>

      {content ? (
        <TopicLearningExperience content={content} simulation={<NumberLine />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <NumberLine />
      )}
    </Container>
  );
}
