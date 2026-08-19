import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { getQuizById } from "@/features/quiz-engine/registry";
import { CalculusFoundations } from "@/features/subjects/mathematics/calculus-foundations";

export const metadata: Metadata = {
  title: "Calculus Foundations — Functions, Graphs & Limits",
  description:
    "Build intuition for functions, graphs, limits, and continuity — the visual foundations calculus is built on.",
};

export default function CalculusFoundationsPage() {
  const quiz = getQuizById("mathematics-calculus");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/calculus-foundations" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Calculus", href: "/dashboard/mathematics/calculus" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Mathematics · Calculus</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Calculus Foundations — Functions, Graphs & Limits
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          See how calculus is built before you see the formulas: functions, graphs, approaching a value, limits,
          and continuity — one idea at a time.
        </p>
      </div>

      <CalculusFoundations />

      {quiz && (
        <QuizCta href="/dashboard/mathematics/calculus-quiz" colorToken="math" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Explain what a limit describes as a value that a function approaches.",
          "Distinguish between a function's value at a point and its limit at that point.",
          "Define continuity in terms of a function having no breaks or jumps.",
          "Read a graph to determine whether a limit exists at a given point.",
        ]}
        concepts={[
          {
            term: "Approaching a value",
            explanation:
              "As the input to a function gets closer and closer to some number, the output often settles toward a specific value too — that settled-toward value is what a limit describes.",
          },
          {
            term: "Limit",
            explanation:
              "The value a function's output approaches as the input approaches a given point, whether or not the function is actually defined at that exact point.",
            formula: "\\lim_{x \\to a} f(x) = L",
            formulaCaption: "The limit of f(x) as x approaches a is L",
          },
          {
            term: "Continuity",
            explanation:
              "A function is continuous at a point if you can draw through that point without lifting your pencil — no holes, jumps, or breaks. That happens exactly when the limit at that point matches the function's actual value there.",
          },
        ]}
        howToUse={[
          "Explore the function graph and pick a point of interest.",
          "Watch the input value approach that point from both sides.",
          "Observe what value the output settles toward — that's the limit.",
          "Compare the limit to the function's actual value at that point to check for continuity.",
        ]}
        whyItMatters="Limits are the idea that makes the rest of calculus possible — they're how you can talk precisely about instantaneous speed, the exact slope of a curve at one point, or the area under a curve, all without dividing by zero. Every derivative and integral you'll learn later is built directly on top of this one concept."
        tryThis={[
          "Find a point where the function's limit exists but doesn't match the function's actual value there. What does that look like on the graph?",
          "Approach a chosen point from the left and from the right separately — do both sides settle toward the same value?",
          "Explain in your own words the difference between a function being defined at a point and having a limit at that point.",
        ]}
      />
    </Container>
  );
}
