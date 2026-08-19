import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { AngleSpinner } from "@/features/subjects/mathematics/angle-spinner";

export const metadata: Metadata = {
  title: "Angle Spinner",
  description: "Drag an arm to explore acute, right, obtuse, straight, and reflex angles.",
};

export default function AngleSpinnerPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/angle-spinner" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Geometry", href: "/dashboard/mathematics/geometry" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">
          Mathematics · Geometry
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Angle Spinner
        </h1>
      </div>

      <AngleSpinner />

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Classify an angle as acute, right, obtuse, straight, or reflex.",
          "Estimate an angle's measure by its appearance before checking the exact value.",
          "Explain what makes 90° and 180° special reference points.",
          "Recognize the range of degrees that falls into each angle category.",
        ]}
        concepts={[
          {
            term: "Acute angle",
            explanation: "An angle measuring less than 90° — smaller and sharper than a right angle.",
          },
          {
            term: "Right angle",
            explanation: "An angle of exactly 90°, forming a perfect corner, like the edge of a square.",
          },
          {
            term: "Obtuse angle",
            explanation: "An angle measuring more than 90° but less than 180° — wider than a right angle but not yet a straight line.",
          },
          {
            term: "Straight and reflex angles",
            explanation:
              "A straight angle measures exactly 180°, forming a straight line. A reflex angle measures more than 180°, sweeping around past a straight line toward a full circle at 360°.",
          },
        ]}
        howToUse={[
          "Drag the arm and watch the angle measure update as you rotate it.",
          "Try to stop at exactly 90° without looking at the number first.",
          "Sweep past 180° and notice how the angle becomes reflex.",
          "Move through each category — acute, right, obtuse, straight, reflex — in order.",
        ]}
        whyItMatters="Recognizing angle types by sight is a skill you'll use constantly in geometry, from classifying triangles by their angles to reading blueprints, adjusting a ramp's incline, or even judging whether a photo is level. Once acute, right, and obtuse angles are instantly recognizable, geometry problems get much faster to reason through."
        tryThis={[
          "Estimate the angle's category before checking the exact degree measure — how close were you?",
          "Find the exact halfway point between a right angle and a straight angle. What category is it in?",
          "Sweep the arm all the way around. At what point does an angle stop being reflex and become a full circle?",
        ]}
      />
    </Container>
  );
}
