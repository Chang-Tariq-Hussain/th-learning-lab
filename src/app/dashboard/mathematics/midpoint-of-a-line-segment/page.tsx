import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
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

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Define the midpoint of a segment as the point exactly halfway between its endpoints.",
          "Calculate a midpoint's coordinates using the midpoint formula.",
          "Explain why the midpoint formula is just an average of the x-values and an average of the y-values.",
          "Predict how a midpoint moves when one endpoint changes.",
        ]}
        concepts={[
          {
            term: "Midpoint",
            explanation:
              "The single point that sits exactly halfway along a straight segment connecting two endpoints, equally distant from both.",
          },
          {
            term: "The midpoint formula",
            explanation:
              "Average the two x-coordinates to get the midpoint's x-coordinate, and average the two y-coordinates to get its y-coordinate.",
            formula: "M = \\left(\\dfrac{x_1 + x_2}{2}, \\dfrac{y_1 + y_2}{2}\\right)",
            formulaCaption: "Midpoint formula",
          },
          {
            term: "Why averaging works",
            explanation:
              "Averaging two numbers always lands exactly halfway between them on a number line. Applying that same idea separately to the x-values and the y-values is what places the midpoint exactly halfway along the segment in two dimensions.",
          },
        ]}
        howToUse={[
          "Drag point A or point B to new positions on the grid.",
          "Watch the midpoint M update and stay exactly centered between them.",
          "Check the displayed coordinates of A and B against the midpoint formula.",
          "Move just one point and observe how the midpoint shifts in response.",
        ]}
        whyItMatters="The midpoint formula shows up anywhere you need to find a center point — locating the middle of a road on a map, finding the balance point of a design, or splitting a line segment evenly in a geometry proof. It's also a stepping stone toward more advanced coordinate geometry, since many later formulas build on this same idea of averaging coordinates."
        tryThis={[
          "Place A at (0, 0) and B at (8, 4). Calculate the midpoint by hand, then check it against the simulation.",
          "Move only point B and predict which direction the midpoint will shift before checking.",
          "Find two different pairs of points that share the exact same midpoint.",
        ]}
      />
    </Container>
  );
}
