import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { MidpointOfALineSegment } from "@/features/subjects/mathematics/midpoint-of-a-line-segment";

export const metadata: Metadata = {
  title: "Midpoint of a Line Segment",
  description:
    "Drag two points on a coordinate plane and watch the midpoint stay exactly halfway between them.",
};

export default function MidpointOfALineSegmentPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/midpoint-of-a-line-segment" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Coordinate Geometry", href: "/dashboard/mathematics/coordinate-geometry" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Mathematics · Coordinate Geometry</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">Midpoint of a Line Segment</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Drag point A or B and watch the midpoint M stay exactly halfway between them.
        </p>
      </div>

      <MidpointOfALineSegment />
    </Container>
  );
}
