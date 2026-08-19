import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { RespiratorySystem } from "@/features/subjects/biology/respiratory-system";

export const metadata: Metadata = {
  title: "Respiratory System — Breathing & Gas Exchange",
  description:
    "Watch air move in and out of the lungs, follow the airway from nose to alveoli, and see oxygen and carbon dioxide exchange between the alveoli and blood.",
};

export default function RespiratorySystemPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/biology/respiratory-system" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          { label: "Human Physiology", href: "/dashboard/biology/human-physiology" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
          Biology · Human Physiology
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Respiratory System — Breathing &amp; Gas Exchange
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Breathe the lungs in and out, follow the air from nose to alveoli, and watch oxygen and carbon dioxide
          trade places between the alveoli and the blood.
        </p>
      </div>

      <RespiratorySystem />

      <SimulationLearnMore
        colorToken="biology"
        objectives={[
          "Trace the path air travels from the nose to the alveoli.",
          "Explain how the lungs expand and contract during breathing.",
          "Describe gas exchange between the alveoli and the blood.",
          "Explain why the alveoli are shaped the way they are.",
        ]}
        concepts={[
          {
            term: "The airway",
            explanation:
              "Air enters through the nose or mouth, passes down the trachea, and branches into smaller and smaller tubes called bronchi and bronchioles before reaching the alveoli at the very end.",
          },
          {
            term: "Alveoli",
            explanation:
              "Tiny, thin-walled air sacs at the end of the airway, surrounded by blood vessels. Their huge combined surface area and thin walls make them ideal for gas exchange with the blood.",
          },
          {
            term: "Breathing mechanics",
            explanation:
              "The diaphragm and chest muscles expand the chest cavity to pull air in, then relax to let air flow back out — breathing in is an active pull, breathing out is largely a passive release.",
          },
          {
            term: "Gas exchange",
            explanation:
              "In the alveoli, oxygen moves from the air into the blood, while carbon dioxide moves from the blood into the air to be exhaled — the two gases trade places in opposite directions at the same time.",
          },
        ]}
        howToUse={[
          "Watch the lungs expand and contract as air moves in and out.",
          "Follow the air's path from the nose down through the trachea and bronchi to the alveoli.",
          "Zoom in on an alveolus and watch oxygen and carbon dioxide trade places with the blood.",
          "Compare an inhale and an exhale — notice which gas is moving in which direction each time.",
        ]}
        whyItMatters="This same gas exchange happening in your alveoli right now is what keeps every cell in your body supplied with oxygen and clear of carbon dioxide. Conditions like asthma and emphysema directly affect the airway or the alveoli, which is why understanding this pathway also helps explain why those conditions make breathing so much harder."
        tryThis={[
          "Trace one breath of air from the nose all the way to a single alveolus, naming every structure it passes through.",
          "Predict which direction oxygen and carbon dioxide are each moving during an inhale versus an exhale.",
          "Think about why alveoli are shaped like tiny sacs instead of one large open space — how does that affect gas exchange?",
        ]}
      />
    </Container>
  );
}
