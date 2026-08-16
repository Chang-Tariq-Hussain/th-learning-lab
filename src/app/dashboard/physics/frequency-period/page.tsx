import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
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
    </Container>
  );
}
