import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { WaveSpeed } from "@/features/subjects/physics/wave-speed";

export const metadata: Metadata = {
  title: "Wave Speed — v = fλ",
  description:
    "Change frequency and wavelength independently to see how wave speed responds, and discover the relationship v = fλ by interacting with the wave itself.",
};

export default function WaveSpeedPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/physics/wave-speed" className="mb-4" />
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
          Wave Speed — v = fλ
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Adjust frequency and wavelength independently and watch how wave speed responds — the relationship is
          easier to feel than to memorize.
        </p>
      </div>

      <WaveSpeed />
    </Container>
  );
}
