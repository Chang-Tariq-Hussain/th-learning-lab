import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { MeasurementExplorer } from "@/features/subjects/mathematics/measurement-explorer";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { getQuizById } from "@/features/quiz-engine/registry";

import { LearningPathNextTopic } from "@/features/learning-path";
export const metadata: Metadata = {
  title: "Measurement Explorer — Length, Distance & Rulers",
  description:
    "Drag a virtual ruler to measure real objects, learn why the zero point matters, convert between mm/cm/m/km, and estimate before you measure.",
};

export default function MeasurementExplorerPage() {
  const quiz = getQuizById("mathematics-measurement");
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

      <MeasurementExplorer />

      {quiz && (
        <QuizCta href="/dashboard/mathematics/measurement-quiz" colorToken="math" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Explain why a ruler's zero point matters when taking a measurement.",
          "Convert a length between millimeters, centimeters, meters, and kilometers.",
          "Estimate a length before measuring, then compare the two.",
          "Read a ruler measurement accurately, avoiding common alignment mistakes.",
        ]}
        concepts={[
          {
            term: "The zero point",
            explanation:
              "A measurement only works if you line up the ruler's zero mark with one end of the object. Starting from the edge of the ruler instead of the zero mark is a common mistake that throws off the whole reading.",
          },
          {
            term: "Unit conversions",
            explanation:
              "Length can be expressed in different units depending on the scale — millimeters and centimeters for small objects, meters for room-sized distances, kilometers for long distances. Each unit is a fixed multiple of the next.",
            formula: "1\\,m = 100\\,cm = 1000\\,mm, \\quad 1\\,km = 1000\\,m",
            formulaCaption: "Common length conversions",
          },
          {
            term: "Estimating first",
            explanation:
              "Making a rough guess before measuring builds a feel for scale, and comparing your estimate to the real measurement afterward is a fast way to sharpen that sense over time.",
          },
        ]}
        howToUse={[
          "Drag the virtual ruler until its zero point lines up with the start of the object.",
          "Read off the measurement where the object ends.",
          "Switch the display between mm, cm, m, and km and watch the same length expressed differently.",
          "Estimate an object's length before measuring, then compare your guess to the actual result.",
        ]}
        whyItMatters="Accurate measurement is a foundational skill behind construction, sewing, cooking, and just about any hands-on task — and lining up the zero point correctly is exactly the kind of small detail that causes real measuring mistakes. Comfort switching between units also matters the moment you're working from a recipe in one unit system or a blueprint in another."
        tryThis={[
          "Measure an object starting from the ruler's edge instead of its zero point. How far off does your reading end up?",
          "Estimate an object's length in centimeters, then measure it and calculate how close your estimate was.",
          "Convert a measurement in centimeters into millimeters and into meters without a calculator.",
        ]}
      />
      <LearningPathNextTopic className="mt-10" />

      </Container>
  );
}
