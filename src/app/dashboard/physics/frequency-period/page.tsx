import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { FrequencyPeriod } from "@/features/subjects/physics/frequency-period";

export const metadata: Metadata = {
  title: "Frequency & Period",
  description:
    "Watch a reference particle oscillate and discover what frequency and period mean, how they relate through T = 1/f, and how changing frequency changes the wave's motion.",
};

export default function FrequencyPeriodPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/physics/frequency-period" className="mb-4" />
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
          Frequency &amp; Period
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Adjust the frequency and watch the reference particle to see how frequency and period describe the same
          motion from two different angles.
        </p>
      </div>

      <FrequencyPeriod />

      <SimulationLearnMore
        colorToken="physics"
        objectives={[
          "Define frequency as how many oscillations happen per second.",
          "Define period as how long one oscillation takes.",
          "Explain the inverse relationship between frequency and period.",
          "Convert between frequency and period using T = 1/f.",
        ]}
        concepts={[
          {
            term: "Frequency (f)",
            explanation:
              "The number of complete oscillations, or cycles, that happen every second. Measured in hertz (Hz), where 1 Hz means one cycle per second.",
          },
          {
            term: "Period (T)",
            explanation:
              "The time it takes to complete just one full oscillation, measured in seconds. A shorter period means the motion repeats faster.",
          },
          {
            term: "The inverse relationship",
            explanation:
              "Frequency and period describe the same motion from opposite angles: frequency counts cycles per second, period measures seconds per cycle. Because of that, one is always the reciprocal of the other.",
            formula: "T = \\dfrac{1}{f}",
            formulaCaption: "period = 1 ÷ frequency",
          },
        ]}
        howToUse={[
          "Watch the reference particle oscillate back and forth at the default frequency.",
          "Time how long one full oscillation takes — that's the period.",
          "Increase the frequency slider and watch the particle move faster with a shorter period.",
          "Use T = 1/f to check the period shown against the frequency you set.",
        ]}
        whyItMatters="Frequency and period show up together anywhere something repeats — a pendulum swinging, a heartbeat, a radio wave, or the AC electricity powering your home. Musicians rely on frequency to describe pitch, doctors read heart rate as beats per minute (a frequency), and engineers tune circuits using the period of their oscillations. Being able to flip between the two is a skill that carries far beyond physics class."
        tryThis={[
          "Set the frequency to 2 Hz. Before checking, predict what the period should be, then verify with T = 1/f.",
          "Double the frequency and observe what happens to the period — is the relationship linear or inverse?",
          "Think of a real-world example of something with a very high frequency and very short period, and one with a very low frequency and long period.",
        ]}
      />
    </Container>
  );
}
