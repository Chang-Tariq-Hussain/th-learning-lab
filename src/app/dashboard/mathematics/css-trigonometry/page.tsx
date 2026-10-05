import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CssQuantTrainer } from "@/features/subjects/mathematics/css-quant";

const SIMULATION_HREF = "/dashboard/mathematics/css-trigonometry";

export const metadata: Metadata = {
  title: "Trigonometry Solver",
  description:
    "Trigonometry practice for competitive exams: exact values, special triangles, SOH-CAH-TOA, identities, heights and distances, radians and arcs, complementary angles and quadrant signs, plus an interactive trig explorer.",
};

export default function CssTrigonometryPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref={SIMULATION_HREF} className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "CSS Quantitative Ability", href: "/dashboard/mathematics/css-quantitative-ability" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Mathematics · CSS Quantitative Ability</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">Trigonometry Solver</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          From exact values to heights and distances. Use the explorer to see where sin, cos and tan come from, then practise exam-style questions with worked solutions.
        </p>
      </div>

      <CssQuantTrainer module="trigonometry" />
    </Container>
  );
}
