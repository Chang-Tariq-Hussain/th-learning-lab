import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { PerimeterAreaExplorer } from "@/features/subjects/mathematics/perimeter-area-explorer";

export const metadata: Metadata = {
  title: "Perimeter & Area Explorer — Measuring 2D Shapes",
  description:
    "Discover perimeter and area visually — count around a boundary, count unit squares, resize a rectangle live, and see why the same perimeter can enclose very different areas.",
};

export default function PerimeterAreaExplorerPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/perimeter-area-explorer" className="mb-4" />
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
          Perimeter & Area Explorer — Measuring 2D Shapes
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Count around a boundary, count unit squares, resize a rectangle live, and discover why shapes with the
          same perimeter can cover very different areas.
        </p>
      </div>

      <PerimeterAreaExplorer />

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Define perimeter as the total distance around a shape's boundary.",
          "Define area as the amount of space a shape covers.",
          "Calculate perimeter and area for a rectangle given its side lengths.",
          "Explain why shapes with the same perimeter can have very different areas.",
        ]}
        concepts={[
          {
            term: "Perimeter",
            explanation:
              "The total distance around the outside edge of a shape. For a rectangle, that means adding up all four sides.",
            formula: "P = 2(l + w)",
            formulaCaption: "perimeter = 2 × (length + width)",
          },
          {
            term: "Area",
            explanation:
              "The amount of surface a shape covers, measured in square units. For a rectangle, it's found by multiplying length by width.",
            formula: "A = l \\times w",
            formulaCaption: "area = length × width",
          },
          {
            term: "Same perimeter, different area",
            explanation:
              "Two rectangles can share the exact same perimeter while covering very different amounts of space — a long, thin rectangle and a closer-to-square rectangle can have identical perimeters but very different areas, with the more square-like shape usually covering more area.",
          },
        ]}
        howToUse={[
          "Count the unit squares along the boundary of a shape to find its perimeter.",
          "Count the unit squares filling the shape to find its area.",
          "Resize the rectangle live and watch both perimeter and area update.",
          "Try to keep the perimeter fixed while changing the shape, and observe how the area changes.",
        ]}
        whyItMatters="Perimeter and area decide practical things like how much fencing you need for a yard (perimeter) versus how much grass seed to buy (area). Builders, farmers, and interior designers rely on this exact distinction daily — knowing which one a problem is actually asking about is often the difference between an easy calculation and an expensive mistake."
        tryThis={[
          "Build two different rectangles with the same perimeter and compare their areas.",
          "Predict which shape — long and thin, or closer to a square — will have the larger area for a fixed perimeter, then test it.",
          "Given a rectangle's length and width, calculate its perimeter and area by hand before checking against the simulation.",
        ]}
      />
    </Container>
  );
}
