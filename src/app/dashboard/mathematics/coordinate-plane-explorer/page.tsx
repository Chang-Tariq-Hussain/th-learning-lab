import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { getQuizById } from "@/features/quiz-engine/registry";
import { CoordinatePlaneExplorer } from "@/features/subjects/mathematics/coordinate-plane-explorer";

export const metadata: Metadata = {
  title: "Coordinate Plane Explorer",
  description:
    "Drag a point around an interactive Cartesian grid to learn the x-axis, y-axis, origin, coordinates, and the four quadrants.",
};

export default function CoordinatePlaneExplorerPage() {
  const quiz = getQuizById("mathematics-coordinate-geometry");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/coordinate-plane-explorer" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Coordinate Geometry", href: "/dashboard/mathematics/coordinate-geometry" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">
          Mathematics · Coordinate Geometry
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Coordinate Plane Explorer
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Drag the point, hover the grid, and click a quadrant or the origin to learn how coordinates work.
        </p>
      </div>

      <CoordinatePlaneExplorer />

      {quiz && (
        <QuizCta href="/dashboard/mathematics/coordinate-geometry-quiz" colorToken="math" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Identify the x-axis, y-axis, and origin on a coordinate plane.",
          "Read the coordinates of any point on the plane.",
          "Identify which of the four quadrants a point belongs in.",
          "Explain how the signs of a point's coordinates determine its quadrant.",
        ]}
        concepts={[
          {
            term: "Axes and origin",
            explanation:
              "The x-axis runs horizontally, the y-axis runs vertically, and the origin (0, 0) is the point where they cross — every other point on the plane is located relative to that origin.",
          },
          {
            term: "The four quadrants",
            explanation:
              "The two axes divide the plane into four regions, numbered I through IV counterclockwise starting from the upper right. Each quadrant has a distinct combination of positive and negative x and y values.",
          },
          {
            term: "Reading a quadrant from coordinates",
            explanation:
              "Quadrant I has both x and y positive, quadrant II has x negative and y positive, quadrant III has both negative, and quadrant IV has x positive and y negative — the signs alone tell you the quadrant without needing to look at a graph.",
          },
        ]}
        howToUse={[
          "Drag the point around the grid and watch its coordinates update.",
          "Hover over different regions of the grid to see how the coordinates change.",
          "Click a quadrant to see it highlighted, or click the origin to return there.",
          "Try to predict a point's quadrant just from its coordinates before checking the grid.",
        ]}
        whyItMatters="The coordinate plane is the backbone of graphing in math, from plotting simple points here to graphing entire functions later on. It's also how GPS coordinates, spreadsheet cell references, and pixel positions on a screen all work — any system that needs to describe an exact location using two numbers is built on this same idea."
        tryThis={[
          "Predict the quadrant for the point (-3, 7) before dragging the point there to check.",
          "Find a point that sits exactly on the x-axis. What does that tell you about its y-value?",
          "Move the point to each of the four quadrants in turn and describe the sign pattern you see each time.",
        ]}
      />
    </Container>
  );
}
