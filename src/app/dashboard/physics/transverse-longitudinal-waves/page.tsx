import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { TransverseLongitudinalWaves } from "@/features/subjects/physics/transverse-longitudinal-waves";

export const metadata: Metadata = {
  title: "Transverse vs Longitudinal Waves",
  description:
    "Watch particles move to discover the difference between transverse waves, where particles move perpendicular to wave travel, and longitudinal waves, where particles move parallel to it.",
};

export default function TransverseLongitudinalWavesPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/physics/transverse-longitudinal-waves" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Physics", href: "/dashboard/physics" },
          { label: "Wave Motion", href: "/dashboard/physics/wave-motion" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-physics">
          Physics · Wave Motion
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Transverse vs Longitudinal Waves
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Toggle between the two wave types and watch how particles move to understand the key difference between
          them.
        </p>
      </div>

      <TransverseLongitudinalWaves />

      <SimulationLearnMore
        colorToken="physics"
        objectives={[
          "Distinguish transverse waves from longitudinal waves by particle motion.",
          "Identify crests and troughs in a transverse wave.",
          "Identify compressions and rarefactions in a longitudinal wave.",
          "Give a real-world example of each wave type.",
        ]}
        concepts={[
          {
            term: "Transverse waves",
            explanation:
              "Waves where the particles of the medium move perpendicular to the direction the wave travels — up and down while the wave itself moves sideways. Light and water ripples behave this way.",
          },
          {
            term: "Longitudinal waves",
            explanation:
              "Waves where the particles of the medium move parallel to the direction the wave travels — back and forth along the same line the wave is moving. Sound waves behave this way.",
          },
          {
            term: "Crest and trough",
            explanation:
              "In a transverse wave, the crest is the highest point and the trough is the lowest point that a particle reaches as it oscillates.",
          },
          {
            term: "Compression and rarefaction",
            explanation:
              "In a longitudinal wave, a compression is where particles bunch close together, and a rarefaction is where they spread farther apart. These take the place of crests and troughs.",
          },
        ]}
        howToUse={[
          "Start with the transverse wave and track a single particle as the wave passes through.",
          "Notice the particle only moves up and down, never sideways with the wave.",
          "Switch to the longitudinal wave and track a particle again.",
          "Notice this time the particle moves back and forth along the same direction the wave travels, forming compressions and rarefactions.",
        ]}
        whyItMatters="Whether a wave is transverse or longitudinal changes what it can travel through and how it behaves. Sound is longitudinal, which is why it needs a medium like air to compress and expand — it can't travel through a vacuum. Light is transverse, and unlike sound, it can travel through empty space, which is exactly how sunlight reaches Earth across millions of miles of vacuum."
        tryThis={[
          "Pause each wave and describe, in one sentence, which direction the tracked particle is moving relative to the wave itself.",
          "Predict whether sound could travel through outer space, using what you now know about longitudinal waves and mediums.",
          "Try to name one more real-world example of a transverse wave and one more of a longitudinal wave.",
        ]}
      />
    </Container>
  );
}
