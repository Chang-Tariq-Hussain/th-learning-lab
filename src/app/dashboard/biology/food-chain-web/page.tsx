import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
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
    </Container>
  );
}
