import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { Photosynthesis } from "@/features/subjects/biology/photosynthesis";

export const metadata: Metadata = {
  title: "Photosynthesis",
  description: "Watch a simple plant turn light, water, and carbon dioxide into glucose and oxygen.",
};

export default function PhotosynthesisPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/biology/photosynthesis" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          { label: "Plant Biology", href: "/dashboard/biology/plant-biology" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Biology · Plant Biology</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">Photosynthesis</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Press Start and watch light, water, and carbon dioxide reach the leaf to make glucose and oxygen.
        </p>
      </div>

      <Photosynthesis />

      <SimulationLearnMore
        colorToken="biology"
        objectives={[
          "Name the raw materials a plant needs to carry out photosynthesis.",
          "Name the products photosynthesis creates and what the plant does with each.",
          "Explain the role light and chlorophyll play in the process.",
          "Write and interpret the overall chemical equation for photosynthesis.",
        ]}
        concepts={[
          {
            term: "What goes in",
            explanation:
              "A plant takes in carbon dioxide from the air through tiny pores in its leaves, water from the soil through its roots, and light energy from the sun, captured by chlorophyll in its leaves.",
          },
          {
            term: "What comes out",
            explanation:
              "Photosynthesis produces glucose, a sugar the plant uses for energy and growth, and oxygen, which is released back into the air as a byproduct.",
          },
          {
            term: "The overall reaction",
            explanation:
              "All of this can be summarized in one balanced equation: six molecules of carbon dioxide plus six of water, powered by light, become one molecule of glucose plus six of oxygen.",
            formula: "6CO_2 + 6H_2O + \\text{light} \\rightarrow C_6H_{12}O_6 + 6O_2",
            formulaCaption: "Photosynthesis, balanced equation",
          },
          {
            term: "Chlorophyll",
            explanation:
              "The green pigment in a plant's chloroplasts that absorbs light energy and kicks off the reaction. It's also why most leaves look green — chlorophyll reflects green light while absorbing other colors.",
          },
        ]}
        howToUse={[
          "Press Start and watch light, water, and carbon dioxide travel toward the leaf.",
          "Notice where each raw material enters the plant.",
          "Watch the leaf convert the inputs into glucose and oxygen.",
          "Follow the oxygen as it's released back into the surrounding air.",
        ]}
        whyItMatters="Photosynthesis is the reason there's oxygen to breathe and food to eat almost everywhere on Earth — it's the starting point of nearly every food chain, and the plants doing it produce most of the oxygen in the atmosphere. Every breath you take and nearly every meal you eat can be traced back to this one reaction happening in a leaf."
        tryThis={[
          "Count how many CO₂ and H₂O molecules the equation needs — why do you think it takes six of each?",
          "Predict what would happen to a plant kept in the dark, with no light reaching its leaves.",
          "Compare photosynthesis to breathing: what do you take in, and what do you release? How does that relate to what a plant does?",
        ]}
      />
    </Container>
  );
}
