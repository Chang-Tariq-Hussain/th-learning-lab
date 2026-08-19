import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { MembraneTransport } from "@/features/subjects/biology/membrane-transport";

export const metadata: Metadata = {
  title: "Cell Membrane & Transport",
  description: "Watch particles diffuse and water move by osmosis across a simplified cell membrane.",
};

export default function MembraneTransportPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/biology/membrane-transport" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          { label: "Cell Structure", href: "/dashboard/biology/cell-structure" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
          Biology · Cell Structure
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Cell Membrane & Transport
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Choose Diffusion or Osmosis, press Start, and watch how substances move across the membrane.
        </p>
      </div>

      <MembraneTransport />

      <SimulationLearnMore
        colorToken="biology"
        objectives={[
          "Explain diffusion as movement from high to low concentration.",
          "Define osmosis as the diffusion of water specifically, across a membrane.",
          "Describe why a cell membrane only lets some particles through freely.",
          "Predict which direction water will move given two solutions of different concentration.",
        ]}
        concepts={[
          {
            term: "Diffusion",
            explanation:
              "The natural movement of particles from an area where they're crowded (high concentration) to an area where they're spread out (low concentration), until they're evenly distributed. No energy input is needed — it just happens on its own.",
          },
          {
            term: "Osmosis",
            explanation:
              "A special case of diffusion where it's specifically water molecules moving across a membrane, from the side with more water (less dissolved solute) to the side with less water (more dissolved solute).",
          },
          {
            term: "Selective permeability",
            explanation:
              "A cell membrane doesn't let everything pass through equally — small molecules like water can cross fairly freely, while larger or charged particles need help. This is what lets the cell control what enters and leaves.",
          },
          {
            term: "Concentration gradient",
            explanation:
              "The difference in concentration between two areas. Particles and water both tend to move down their gradient, from more concentrated to less concentrated, until the gradient disappears.",
          },
        ]}
        howToUse={[
          "Choose Diffusion, press Start, and watch particles spread from the crowded side toward the empty side.",
          "Reset and switch to Osmosis, then press Start.",
          "Watch which side gains water and which side loses it.",
          "Compare the two modes: in diffusion the particles themselves move; in osmosis it's the water that moves instead.",
        ]}
        whyItMatters="Diffusion and osmosis explain why a plant wilts without water, why cells swell or shrink in solutions of different concentrations, and why doctors use carefully balanced IV fluids instead of plain water, which would cause blood cells to take on too much water and burst. These two simple movements, driven by nothing but concentration differences, quietly keep every cell in your body in balance."
        tryThis={[
          "Predict which direction water will move if one side of the membrane has more dissolved solute than the other, then check it in Osmosis mode.",
          "Compare diffusion and osmosis: what's actually moving in each case?",
          "Think about what would happen to a cell placed in a very salty solution — which way would water move?",
        ]}
      />
    </Container>
  );
}
