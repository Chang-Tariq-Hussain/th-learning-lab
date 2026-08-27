import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { getQuizById } from "@/features/quiz-engine/registry";
import { SlopeOfALine } from "@/features/subjects/mathematics/slope-of-a-line";

import { LearningPathNextTopic } from "@/features/learning-path";
export const metadata: Metadata = {
  title: "Slope of a Line",
  description:
    "Drag two points on a coordinate plane and watch rise, run, and the right triangle build the slope of the line between them.",
};

export default function SlopeOfALinePage() {
  const quiz = getQuizById("mathematics-straight-line");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/slope-of-a-line" className="mb-4" />
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
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">Slope of a Line</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Drag point A or B and watch rise, run, and the right triangle build the slope between them.
        </p>
      </div>

      <SlopeOfALine />

      {quiz && (
        <QuizCta href="/dashboard/mathematics/straight-line-quiz" colorToken="math" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Calculate the slope of a line given two points.",
          "Explain slope as a ratio of vertical change to horizontal change.",
          "Identify a line as having positive, negative, zero, or undefined slope just by looking at it.",
          "Predict how a line's steepness and direction change as its slope changes.",
        ]}
        concepts={[
          {
            term: "Rise and run",
            explanation:
              "\"Rise\" is how far you move vertically between two points; \"run\" is how far you move horizontally. Slope is simply rise divided by run.",
          },
          {
            term: "Slope formula",
            explanation: "Given two points, subtract their y-values for the rise and their x-values for the run.",
            formula: "m = \\dfrac{y_2 - y_1}{x_2 - x_1}",
            formulaCaption: "m = slope",
          },
          {
            term: "Reading the sign",
            explanation:
              "Positive slope means the line rises left to right. Negative slope means it falls. Zero slope is a flat, horizontal line. A vertical line has undefined slope, since the run is zero and division by zero isn't defined.",
          },
          {
            term: "Steepness",
            explanation:
              "The larger the absolute value of the slope, the steeper the line. A slope of 5 rises much faster than a slope of 0.5.",
          },
        ]}
        howToUse={[
          "Drag point A or point B anywhere on the grid.",
          "Watch the right triangle appear, showing the rise and run between the two points.",
          "Read the calculated slope value and its type (positive, negative, zero, or undefined) as you move the points.",
          "Try to place the points so the line matches each of the four slope types.",
        ]}
        whyItMatters="Slope shows up everywhere once you start looking — it's the grade of a road, the pitch of a roof, the rate a savings account grows, or how fast a car's speed changes over time. In every one of these, slope is answering the same question: for every step forward, how much does the other quantity change? That's exactly what makes it one of the most reused ideas in math and science."
        tryThis={[
          "Place the two points so the line has a slope of exactly 1. What do you notice about the triangle?",
          "Make the line perfectly vertical. What happens to the slope value, and why?",
          "Pick two points with a negative slope, then move point B so the slope becomes positive without moving point A.",
        ]}
      />
      <LearningPathNextTopic className="mt-10" />

      </Container>
  );
}
