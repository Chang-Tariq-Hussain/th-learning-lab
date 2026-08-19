import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { QuizCta } from "@/components/dashboard/quiz-cta";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { getQuizById } from "@/features/quiz-engine/registry";
import { EcosystemExplorer } from "@/features/subjects/biology/ecosystem-explorer";

export const metadata: Metadata = {
  title: "Ecosystem Explorer — Living & Non-Living Components",
  description:
    "Explore a small pond and forest ecosystem, discover biotic and abiotic components, and see how producers, consumers, and decomposers depend on each other.",
};

export default function EcosystemExplorerPage() {
  const quiz = getQuizById("biology-ecosystem");
  return (
    <Container className="py-10">
      <SimulationBackLink
        simulationHref="/dashboard/biology/ecosystem-explorer"
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
          Ecosystem Explorer
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Explore a small pond and forest ecosystem. Click on plants,
          animals, and the environment around them to see how living and
          non-living components interact.
        </p>
      </div>

      <EcosystemExplorer />

      {quiz && (
        <QuizCta href="/dashboard/biology/ecosystem-quiz" colorToken="biology" questionCount={quiz.questions.length} className="mx-auto max-w-2xl" />
      )}

      <SimulationLearnMore
        colorToken="biology"
        objectives={[
          "Distinguish biotic components of an ecosystem from abiotic components.",
          "Define producers, consumers, and decomposers, and give an example of each.",
          "Explain how these roles depend on each other to keep an ecosystem functioning.",
          "Predict what happens to an ecosystem if one role is removed.",
        ]}
        concepts={[
          {
            term: "Biotic components",
            explanation:
              "The living parts of an ecosystem — plants, animals, fungi, and microorganisms. Anything that's alive or was once alive counts as biotic.",
          },
          {
            term: "Abiotic components",
            explanation:
              "The non-living parts of an ecosystem, like sunlight, water, temperature, soil, and air. Abiotic factors shape which living things can survive in a given environment.",
          },
          {
            term: "Producers",
            explanation:
              "Organisms, mostly plants, that make their own food using sunlight through photosynthesis. They form the base that every other living thing in the ecosystem ultimately depends on.",
          },
          {
            term: "Consumers and decomposers",
            explanation:
              "Consumers get their energy by eating other organisms, whether plants or animals. Decomposers break down dead organisms and waste, returning nutrients to the soil so producers can use them again.",
          },
        ]}
        howToUse={[
          "Click on different plants, animals, and environmental features in the pond and forest scene.",
          "Sort what you find into biotic and abiotic categories as you go.",
          "Identify which biotic components are producers, which are consumers, and which are decomposers.",
          "Look for connections — which consumers depend on which producers, and where decomposers fit in.",
        ]}
        whyItMatters="Every real ecosystem, from a backyard pond to a rainforest, runs on this same cycle: producers capture energy, consumers pass it along by eating, and decomposers recycle what's left back into the soil. Understanding these roles is what lets ecologists predict what happens when a species disappears, a habitat is disturbed, or a new species is introduced somewhere it doesn't belong."
        tryThis={[
          "Pick one producer and trace every consumer in the scene that depends on it, directly or indirectly.",
          "Predict what would happen to the ecosystem if all the decomposers disappeared.",
          "Sort five things you clicked on into biotic and abiotic — were any harder to classify than others?",
        ]}
      />
    </Container>
  );
}
