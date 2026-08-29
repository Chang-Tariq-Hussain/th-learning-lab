import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { MeasurementExplorer } from "@/features/subjects/mathematics/measurement-explorer";
import { TopicExperience, getTopicContent } from "@/features/learning";
import { LearningPathNextTopic } from "@/features/learning-path";

export const metadata: Metadata = {
  title: "Measurement Explorer — Length, Distance & Rulers",
  description:
    "Drag a virtual ruler to measure real objects, learn why the zero point matters, convert between mm/cm/m/km, and estimate before you measure.",
};

export default function MeasurementExplorerPage() {
  const content = getTopicContent("mathematics", "measurement-explorer");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/measurement-explorer" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Measurement", href: "/dashboard/mathematics/measurement" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Mathematics · Measurement</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Measurement Explorer — Length, Distance & Rulers
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Drag a virtual ruler to measure real objects, see why the zero point matters, move between mm, cm, m,
          and km, and compare an estimate against a real measurement.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<MeasurementExplorer />} />
      ) : (
        <MeasurementExplorer />
      )}

      <LearningPathNextTopic className="mt-10" />
    </Container>
  );
}
