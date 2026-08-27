import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { DistanceBetweenTwoPoints } from "@/features/subjects/mathematics/distance-between-two-points";

import { LearningPathNextTopic } from "@/features/learning-path";
export const metadata: Metadata = {
  title: "Distance Between Two Points",
  description:
    "Drag two points on a coordinate plane and watch the right triangle between them reveal the distance formula.",
};

export default function DistanceBetweenTwoPointsPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/distance-between-two-points" className="mb-4" />
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
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">Distance Between Two Points</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Drag point A or B and watch Δx, Δy, and the right triangle build the distance between them.
        </p>
      </div>

      <DistanceBetweenTwoPoints />

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Find the horizontal and vertical distance between two points.",
          "Explain how the distance formula connects to the Pythagorean theorem.",
          "Calculate the straight-line distance between two coordinate points.",
          "Predict how moving a point changes the distance between two points.",
        ]}
        concepts={[
          {
            term: "Δx and Δy",
            explanation:
              "Δx is the horizontal distance between two points, and Δy is the vertical distance between them. Together they form the two legs of a right triangle connecting the points.",
            formula: "\\Delta x = x_2 - x_1, \\quad \\Delta y = y_2 - y_1",
            formulaCaption: "Horizontal and vertical differences",
          },
          {
            term: "The right triangle",
            explanation:
              "Drawing a horizontal segment of length Δx and a vertical segment of length Δy between two points always forms a right angle where they meet, creating a right triangle with the straight-line distance as its hypotenuse.",
          },
          {
            term: "The distance formula",
            explanation:
              "Since the triangle formed is a right triangle, the Pythagorean theorem gives the straight-line distance directly from Δx and Δy.",
            formula: "d = \\sqrt{(\\Delta x)^2 + (\\Delta y)^2}",
            formulaCaption: "Distance between two points",
          },
        ]}
        howToUse={[
          "Drag point A or point B to new positions on the grid.",
          "Watch the right triangle form between the two points, showing Δx and Δy.",
          "Check the computed distance shown against the triangle's hypotenuse.",
          "Move the points closer together or farther apart and watch the distance update.",
        ]}
        whyItMatters="This formula is just the Pythagorean theorem wearing a different hat — instead of measuring the sides of a triangle drawn on paper, you're measuring the gap between two locations on a coordinate grid. It's the exact calculation GPS systems and mapping apps use to report how far apart two points are, and it's the foundation for far more advanced geometry and physics problems later on."
        tryThis={[
          "Place point A at the origin and point B at (3, 4). Calculate the distance by hand, then check it against the simulation.",
          "Move point B so that Δx and Δy are equal. What does that tell you about the triangle formed?",
          "Predict what happens to the distance if you double both Δx and Δy.",
        ]}
      />
      <LearningPathNextTopic className="mt-10" />

      </Container>
  );
}
