import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { SymmetryMirror } from "@/features/subjects/mathematics/symmetry-mirror";

export const metadata: Metadata = {
  title: "Symmetry Mirror",
  description: "Click squares on the left and watch them mirror instantly on the right — a hands-on introduction to line symmetry.",
};

export default function SymmetryMirrorPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/symmetry-mirror" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Symmetry", href: "/dashboard/mathematics/symmetry" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">
          Mathematics · Geometry
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Symmetry Mirror
        </h1>
      </div>

      <SymmetryMirror />

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Define line symmetry as a shape that matches its own mirror image.",
          "Locate the line of symmetry in a symmetric figure.",
          "Predict the mirrored position of a point across a line of symmetry.",
          "Recognize shapes or patterns that have no line of symmetry at all.",
        ]}
        concepts={[
          {
            term: "Line of symmetry",
            explanation:
              "An imaginary line that divides a shape into two halves that are exact mirror images of each other. Folding the shape along that line would make both halves match up perfectly.",
          },
          {
            term: "Mirroring a point",
            explanation:
              "A point's mirror image sits the exact same distance from the line of symmetry, but on the opposite side, on a path that crosses the line at a right angle.",
          },
          {
            term: "Symmetric vs. asymmetric",
            explanation:
              "Some shapes have one line of symmetry, some have several, and some — like a scalene triangle or a random scattering of squares — have none at all. Having any symmetry is a special property, not a given.",
          },
        ]}
        howToUse={[
          "Click a square on the left side of the mirror line.",
          "Watch its exact mirror image appear instantly on the right.",
          "Try clicking squares that are different distances from the mirror line and compare how far their reflections land.",
          "Build a pattern on the left and check whether the mirrored result looks the way you expected.",
        ]}
        whyItMatters="Line symmetry is everywhere once you start noticing it — in architecture, logo design, snowflakes, and the human face. Recognizing symmetry (or its absence) is also a practical skill in design and engineering, where symmetric structures are often stronger, more stable, or simply more visually balanced than asymmetric ones."
        tryThis={[
          "Predict where a square's mirror image will land before clicking it, then check yourself.",
          "Build a simple picture on the left side and try to guess what the fully mirrored result will look like.",
          "Think of an object in the real world with no line of symmetry at all. What makes it asymmetric?",
        ]}
      />
    </Container>
  );
}
