import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { FoodChainWeb } from "@/features/subjects/biology/food-chain-web";

export const metadata: Metadata = {
  title: "Food Chain & Food Web — How Energy Moves Through an Ecosystem",
  description:
    "Explore a grassland food chain and food web, follow energy from the Sun through producers and consumers, and see what happens when one organism disappears.",
};

export default function FoodChainWebPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink
        simulationHref="/dashboard/biology/food-chain-web"
        className="mb-4"
      />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          {
            label: "Ecology & Ecosystems",
            href: "/dashboard/biology/ecosystem-explorer",
          },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
          Biology · Ecology & Ecosystems
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Food Chain & Food Web
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Follow energy from the Sun through a grassland food chain, then switch to a food
          web to see how several food chains connect.
        </p>
      </div>

      <FoodChainWeb />

      <SimulationLearnMore
        colorToken="biology"
        objectives={[
          "Trace the direction energy flows through a food chain.",
          "Distinguish a food chain from a food web.",
          "Identify producers, primary consumers, and secondary consumers in a chain.",
          "Predict what happens to a food web if one organism is removed.",
        ]}
        concepts={[
          {
            term: "Food chain",
            explanation:
              "A single path showing who eats whom, starting with a producer and moving through one consumer after another. Energy flows in one direction, from the Sun through each organism in the chain.",
            formula: "\\text{Sun} \\rightarrow \\text{producer} \\rightarrow \\text{consumer} \\rightarrow \\text{consumer}",
            formulaCaption: "Energy flow in a food chain",
          },
          {
            term: "Food web",
            explanation:
              "A network of many overlapping food chains. Most organisms eat more than one thing and get eaten by more than one predator, so a realistic ecosystem looks like a connected web rather than a single line.",
          },
          {
            term: "Primary and secondary consumers",
            explanation:
              "A primary consumer eats producers directly, like a rabbit eating grass. A secondary consumer eats primary consumers, like a fox eating a rabbit — each step up the chain is one level further from the original producer.",
          },
          {
            term: "Removing a link",
            explanation:
              "In a food web, losing one species can ripple outward, since other organisms that depended on it for food (or that it kept in check as a predator) are affected too — this is much harder to predict in a web than in a single food chain.",
          },
        ]}
        howToUse={[
          "Start with the food chain view and trace energy from the Sun through each organism.",
          "Notice the arrow direction — it always points from what's eaten to what eats it.",
          "Switch to the food web view and see how many chains connect to a single organism.",
          "Try removing one organism and observe which connections in the web are affected.",
        ]}
        whyItMatters="Food chains and food webs are how ecologists track energy and predict the ripple effects of change in an ecosystem, from a new predator being introduced to a species going extinct. A real grassland or forest never runs on a single food chain — it's always a food web, which is exactly why removing even one species can have consequences that reach far beyond its most obvious predator or prey."
        tryThis={[
          "Pick a producer and count how many different food chains in the web start with it.",
          "Remove one organism from the web and predict which others will be most affected.",
          "Compare the same organism's role in the food chain view versus the food web view — how many connections does it actually have?",
        ]}
      />
    </Container>
  );
}
