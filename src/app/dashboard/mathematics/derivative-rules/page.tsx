import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { DerivativeRules } from "@/features/subjects/mathematics/derivative-rules";

import { LearningPathNextTopic } from "@/features/learning-path";
export const metadata: Metadata = {
  title: "Derivative Rules — Learn Differentiation Step by Step",
  description:
    "Learn the constant, power, constant multiple, sum, difference, product, and quotient rules for differentiation, one visual step at a time.",
};

export default function DerivativeRulesPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/derivative-rules" className="mb-4" />
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
          Derivative Rules — Learn Differentiation Step by Step
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Now that you know what a derivative means, learn how to calculate one: the constant, power,
          constant multiple, sum, difference, product, and quotient rules — each taught visually, one step
          at a time.
        </p>
      </div>

      <DerivativeRules />

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Apply the power rule to differentiate a term like xⁿ.",
          "Apply the sum and difference rules to differentiate a multi-term function.",
          "Explain when the product rule and quotient rule are needed instead of simple term-by-term differentiation.",
          "Choose the correct rule for a given expression before differentiating it.",
        ]}
        concepts={[
          {
            term: "Power rule",
            explanation:
              "To differentiate xⁿ, bring the exponent down as a multiplier and reduce the exponent by one.",
            formula: "\\dfrac{d}{dx}\\big[x^n\\big] = nx^{n-1}",
            formulaCaption: "Power Rule",
          },
          {
            term: "Constant multiple and sum/difference rules",
            explanation:
              "A constant multiplying a term just carries through the derivative unchanged, and a function made of several terms added or subtracted can be differentiated term by term.",
          },
          {
            term: "Product rule",
            explanation:
              "For two functions multiplied together, the derivative isn't just the product of their derivatives — you need the first function times the derivative of the second, plus the second function times the derivative of the first.",
            formula: "\\dfrac{d}{dx}\\big[f(x)g(x)\\big] = f'(x)g(x) + f(x)g'(x)",
            formulaCaption: "Product Rule",
          },
          {
            term: "Quotient rule",
            explanation:
              "For one function divided by another, a similar but slightly longer pattern applies, with the denominator squared at the bottom.",
            formula: "\\dfrac{d}{dx}\\left[\\dfrac{f(x)}{g(x)}\\right] = \\dfrac{f'(x)g(x) - f(x)g'(x)}{[g(x)]^2}",
            formulaCaption: "Quotient Rule",
          },
        ]}
        howToUse={[
          "Pick a rule and watch it applied visually, step by step, to an example expression.",
          "Try to predict the next step before it's revealed.",
          "Move through the rules in order — constant, power, sum/difference, product, quotient.",
          "Compare a product rule example to a case where the terms could just be multiplied out first instead.",
        ]}
        whyItMatters="These rules turn the tangent-line idea from Derivative Explorer into a fast, mechanical process you can apply to almost any function without redrawing a graph each time. Engineers, economists, and scientists use exactly these rules daily to find rates of change in formulas involving multiplied or divided quantities, like cost per unit or force over distance."
        tryThis={[
          "Differentiate a simple polynomial using only the power and sum rules.",
          "Find an expression where you must choose between multiplying out first or using the product rule directly — which is faster?",
          "Explain why the product rule isn't just \"multiply the two derivatives together.\"",
        ]}
      />
      <LearningPathNextTopic className="mt-10" />

      </Container>
  );
}
