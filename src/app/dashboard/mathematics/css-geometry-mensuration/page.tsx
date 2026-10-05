import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CssQuantTrainer } from "@/features/subjects/mathematics/css-quant";

const SIMULATION_HREF = "/dashboard/mathematics/css-geometry-mensuration";

export const metadata: Metadata = {
  title: "Geometry & Mensuration Solver",
  description:
    "Competitive-level geometry and mensuration MCQs: triangle angles, Pythagoras, circles, polygons, similar figures, solids, Heron's formula, circle theorems and quadrilaterals, with diagrams and worked solutions.",
};

export default function CssGeometryMensurationPage() {
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
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">Geometry &amp; Mensuration Solver</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Angles, areas, volumes and circle theorems as exam-style questions with diagrams. Every answer comes with the working, a faster route and the common mistake.
        </p>
      </div>

      <CssQuantTrainer module="geometry" />
    </Container>
  );
}
