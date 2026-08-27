import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { EquationPlayground } from "@/features/subjects/mathematics/equation-playground";

import { LearningPathNextTopic } from "@/features/learning-path";
export const metadata: Metadata = {
  title: "Equation Playground",
  description:
    "Slide a number into the missing box and discover whether it makes the equation true — no calculator, no auto-solving.",
};

export default function EquationPlaygroundPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/equation-playground" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Algebra", href: "/dashboard/mathematics/algebra" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">
          Mathematics · Algebra
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Equation Playground
        </h1>
      </div>

      <EquationPlayground />

      <SimulationLearnMore
        colorToken="math"
        objectives={[
          "Explain what it means for a value to make an equation true.",
          "Use trial and error to find the missing number in a simple equation.",
          "Explain why an equation has an equals sign and what it means for both sides to balance.",
          "Check a solution by substituting it back into the original equation.",
        ]}
        concepts={[
          {
            term: "What an equation says",
            explanation:
              "An equation claims that whatever is on the left side has the same value as whatever is on the right side. The equals sign isn't just a command to \"calculate\" — it's a statement that both sides balance.",
          },
          {
            term: "The missing value",
            explanation:
              "A box or blank in an equation stands in for a specific number that makes the whole statement true. Only certain values will make both sides equal — most values will not.",
            formula: "\\square + 3 = 7",
            formulaCaption: "The missing value that makes this true is 4",
          },
          {
            term: "Checking a solution",
            explanation:
              "Once you have a candidate value, substitute it back into the equation in place of the missing box. If both sides come out equal, you've found the right value — if not, try a different number.",
          },
        ]}
        howToUse={[
          "Look at the equation and its missing box.",
          "Slide a number into the box and see whether the equation becomes true or false.",
          "Adjust the number up or down based on which way the equation is unbalanced.",
          "Confirm your answer once both sides match exactly.",
        ]}
        whyItMatters="This slide-and-check process is exactly what solving an equation means, long before you ever learn formal algebra steps. Being comfortable with the idea that a missing number has to make both sides balance is the foundation for everything from solving for x in algebra class to figuring out how many items you can buy with a set budget."
        tryThis={[
          "Before sliding the number, predict what value will make the equation true, then check yourself.",
          "Try a value that's too high and one that's too low — describe what happens to the balance each time.",
          "Once you find the right value, explain in words why it's the only number that works.",
        ]}
      />
      <LearningPathNextTopic className="mt-10" />

      </Container>
  );
}
