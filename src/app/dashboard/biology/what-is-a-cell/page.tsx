import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CellExplorer } from "@/features/subjects/biology/cell-explorer";
import { TopicExperience, getTopicContent } from "@/features/learning";

const SIMULATION_HREF = "/dashboard/biology/what-is-a-cell";

export const metadata: Metadata = {
  title: "What Is a Cell?",
  description: "The basic unit of life, and the difference between unicellular and multicellular organisms.",
};

export default function WhatIsACellPage() {
  const content = getTopicContent("biology", "what-is-a-cell");

  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          { label: "Cell Structure", href: "/dashboard/biology/cell-structure" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
          Biology · Cell Structure
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          What Is a Cell?
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Every living thing is built from cells — from a single bacterium to
          a blue whale. Start here to learn what a cell actually is, and why
          it counts as the basic unit of life.
        </p>
      </div>

      {content ? (
        <TopicExperience content={content} simulation={<CellExplorer />} />
      ) : (
        // Falls back to the bare simulation if this topic's learning
        // content is ever removed from the registry — keeps the page
        // from 404ing outright.
        <CellExplorer />
      )}
    </Container>
  );
}
