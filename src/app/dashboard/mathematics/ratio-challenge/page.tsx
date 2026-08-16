import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { RatioChallenge } from "@/features/subjects/mathematics/ratio-challenge";

export const metadata: Metadata = {
  title: "Ratio Challenge",
  description: "Random ratio challenges from beginner to advanced — missing values, simplifying, equivalent ratios, and word problems with instant feedback.",
};

export default function RatioChallengePage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/ratio-challenge" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Ratios", href: "/dashboard/mathematics/ratios" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">
          Mathematics · Ratios
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Ratio Challenge
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Missing values, simplifying, equivalent ratios, and word problems — answer correctly to level up,
          miss one and the difficulty eases back off.
        </p>
      </div>

      <RatioChallenge />
    </Container>
  );
}
