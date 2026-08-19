import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { ChainRuleExplorer } from "@/features/subjects/mathematics/chain-rule-explorer";

export const metadata: Metadata = {
  title: "Chain Rule Explorer — Differentiating Composite Functions",
  description:
    "Build intuition for the Chain Rule by exploring composite functions: function machines, inner and outer functions, step-by-step differentiation, and Chain Rule vs Power Rule.",
};

export default function ChainRuleExplorerPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/chain-rule-explorer" className="mb-4" />
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
          Chain Rule Explorer — Differentiating Composite Functions
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          A composite function is a function inside another function. See how the output of an inner
          function feeds into an outer function, then learn how the Chain Rule connects their two rates of
          change.
        </p>
      </div>

      <ChainRuleExplorer />

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Identify the inner function and outer function in a composite function.",
          "State the Chain Rule and explain what each part of it represents.",
          "Differentiate a composite function step by step using the Chain Rule.",
          "Distinguish when to use the Chain Rule versus the Power Rule alone.",
        ]}
        concepts={[
          {
            term: "Composite function",
            explanation:
              "A function built by plugging one function into another. In f(g(x)), g is applied first, and its result is fed into f — the inner function's output becomes the outer function's input.",
          },
          {
            term: "Inner and outer functions",
            explanation:
              "In f(g(x)), g(x) is the inner function — the first thing that happens to x. f is the outer function, applied to whatever g(x) produces.",
          },
          {
            term: "The Chain Rule",
            explanation:
              "To differentiate a composite function, take the derivative of the outer function (leaving the inner function alone inside it), then multiply by the derivative of the inner function.",
            formula: "\\dfrac{d}{dx}\\big[f(g(x))\\big] = f'(g(x)) \\cdot g'(x)",
            formulaCaption: "Chain Rule",
          },
        ]}
        howToUse={[
          "Look at the function machine and identify which operation happens first (inner) and which happens second (outer).",
          "Step through the differentiation one piece at a time.",
          "Watch the outer function's derivative get multiplied by the inner function's derivative.",
          "Compare a Chain Rule example to a Power Rule–only example to see when the extra factor is needed.",
        ]}
        whyItMatters="The Chain Rule is essential the moment a function is layered inside another — which happens constantly in real applications, like a cost function that depends on production, which itself depends on time. Anywhere one changing quantity depends on another changing quantity, the Chain Rule is what lets you find the combined rate of change."
        tryThis={[
          "Given a new composite function, identify the inner and outer functions before differentiating.",
          "Try differentiating a function that only needs the Power Rule, then one that needs the Chain Rule. What's different about their structure?",
          "Predict which derivative will have more terms: a simple power function or a composite function of similar complexity.",
        ]}
      />
    </Container>
  );
}
