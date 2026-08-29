import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { EvenOddExplorer } from "@/features/subjects/mathematics/even-odd-explorer";
import { TopicExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/mathematics/even-odd-explorer";

export const metadata: Metadata = {
  title: "Even & Odd Explorer",
  description:
    "Build addition and subtraction expressions with two number pickers, watch each number's paired-dot pattern, and discover the even/odd rules for yourself.",
};

export default function EvenOddExplorerPage() {
  const content = getTopicContent("mathematics", "even-odd");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Number Sense", href: "/dashboard/mathematics/number-sense" },
        ]}
        className="mb-6"
      />

      <div className="mb-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Mathematics · Number Sense</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Even &amp; Odd Explorer
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Every number can be split into pairs — build an equation and watch the leftover dot decide even or odd.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<EvenOddExplorer />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <EvenOddExplorer />
      )}
    </Container>
  );
}
