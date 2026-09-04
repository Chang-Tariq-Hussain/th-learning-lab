import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { AcidsBasesBasics } from "@/features/subjects/chemistry/acids-bases-basics";
import { getTopicContent, TopicExperience } from "@/features/learning";

export const metadata: Metadata = {
  title: "Acids & Bases — The Basics",
  description:
    "Explore everyday substances on the pH scale, drag an interactive pH slider, and mix an acid with a base to see neutralization happen.",
};

export default function AcidsBasesBasicsPage() {
  const content = getTopicContent("chemistry", "acids-bases-basics");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/acids-bases-basics" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          { label: "Acids & Bases — The Basics", href: "/dashboard/chemistry/acids-bases-basics" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Acids &amp; Bases
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Acids &amp; Bases — The Basics
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Pick a familiar substance, drag the pH slider, or mix an acid with a base and watch it neutralize —
          no equations yet, just intuition for H⁺, OH⁻, and the pH scale.
        </p>
      </div>

      {content ? <TopicExperience content={content} simulation={<AcidsBasesBasics />} /> : <AcidsBasesBasics />}
    </Container>
  );
}
