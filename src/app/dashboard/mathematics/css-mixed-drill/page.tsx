import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { CssQuantTrainer } from "@/features/subjects/mathematics/css-quant";

const SIMULATION_HREF = "/dashboard/mathematics/css-mixed-drill";

export const metadata: Metadata = {
  title: "Mixed Timed Drill",
  description:
    "A timed mixed drill across ratio and proportion, geometry and trigonometry, with per-question countdown, accuracy by topic and a full review of every question you miss.",
};

export default function CssMixedDrillPage() {
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
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">Mixed Timed Drill</h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Train speed and accuracy together. Choose a length and a time per question, then review exactly what went wrong, topic by topic.
        </p>
      </div>

      <CssQuantTrainer module="mixed" />
    </Container>
  );
}
