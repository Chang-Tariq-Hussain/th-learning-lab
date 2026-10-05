import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CssQuantTrainer } from "@/features/subjects/mathematics/css-quant";

const SIMULATION_HREF = "/dashboard/mathematics/css-ratio-proportion";

export const metadata: Metadata = {
  title: "Ratio, Proportion & Percentage Solver",
  description:
    "Exam-style multiple-choice practice on sharing in a ratio, proportion, mixtures, percentage change, profit and loss, ages, time and work, and speed, with worked solutions, a fast method and the usual trap for every question.",
};

export default function CssRatioProportionPage() {
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
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">Ratio, Proportion &amp; Percentage Solver</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Competitive-level ratio, proportion and arithmetic problems. Answer, then see the full worked solution, the quick exam method and the trap that catches most candidates.
        </p>
      </div>

      <CssQuantTrainer module="ratio" />
    </Container>
  );
}
