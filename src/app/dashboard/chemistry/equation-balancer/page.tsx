import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { EquationBalancer } from "@/features/subjects/chemistry/equation-balancer";
import { getTopicContent, TopicExperience } from "@/features/learning";

export const metadata: Metadata = {
  title: "Equation Balancer",
  description: "Adjust coefficients — never subscripts — until a chemical equation's atom counts match on both sides.",
};

export default function EquationBalancerPage() {
  const content = getTopicContent("chemistry", "equation-balancer");
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/equation-balancer" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          { label: "Chemical Reactions", href: "/dashboard/chemistry/chemical-reactions" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Chemical Reactions
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Equation Balancer
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Adjust the coefficient in front of each formula until every element&rsquo;s atom count matches on both
          sides — practice across six real reactions, with hints if you get stuck.
        </p>
      </div>

      {content ? <TopicExperience content={content} simulation={<EquationBalancer />} /> : <EquationBalancer />}
    </Container>
  );
}
