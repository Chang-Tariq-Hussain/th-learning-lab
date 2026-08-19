import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { PlotAPoint } from "@/features/subjects/mathematics/plot-a-point";

export const metadata: Metadata = {
  title: "Plot a Point",
  description: "Given a coordinate, place the point on the Cartesian plane — a short, focused plotting challenge.",
};

export default function PlotAPointPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/plot-a-point" className="mb-4" />
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
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">Plot a Point</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          You&apos;ll be given a coordinate like (4, 3) — tap or click the grid to plot it.
        </p>
      </div>

      <PlotAPoint />

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Read a coordinate pair (x, y) and know which number goes where.",
          "Plot a point on the Cartesian plane given its coordinates.",
          "Explain why the order of the numbers in a coordinate pair matters.",
          "Locate a point relative to the origin using its coordinates.",
        ]}
        concepts={[
          {
            term: "Coordinate pair",
            explanation:
              "A pair of numbers, written (x, y), that pinpoints an exact location on the plane. The x-value always comes first and tells you how far to move horizontally; the y-value comes second and tells you how far to move vertically.",
          },
          {
            term: "Reading (4, 3)",
            explanation:
              "To plot (4, 3), start at the origin, move 4 units to the right along the x-axis, then move 3 units up parallel to the y-axis. That's where the point belongs.",
          },
          {
            term: "Order matters",
            explanation:
              "(4, 3) and (3, 4) are two completely different points. Swapping the x and y values moves you to a different spot on the plane, which is why the order in a coordinate pair is never optional.",
          },
        ]}
        howToUse={[
          "Read the coordinate you're given, like (4, 3).",
          "Count the correct number of units right (or left) along the x-axis first.",
          "Then count the correct number of units up (or down) for the y-value.",
          "Click or tap the grid at that spot to place your point.",
        ]}
        whyItMatters="Plotting coordinates accurately is the entry skill behind graphing lines, reading maps with grid references, and even designing video game levels, where every character and object's position is tracked with exactly this kind of coordinate pair. Getting comfortable with the x-then-y order now makes every future coordinate geometry topic click faster."
        tryThis={[
          "Plot (4, 3) and (3, 4) side by side and see how far apart they land.",
          "Before clicking, predict which quadrant a coordinate like (-2, 5) belongs in.",
          "Try plotting a point where the x-value is negative and the y-value is zero. Where does it land?",
        ]}
      />
    </Container>
  );
}
