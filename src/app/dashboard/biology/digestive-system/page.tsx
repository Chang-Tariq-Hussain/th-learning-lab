import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { DigestiveSystem } from "@/features/subjects/biology/digestive-system";

export const metadata: Metadata = {
  title: "Digestive System — Journey of Food & Nutrient Absorption",
  description:
    "Follow a bite of food from mouth to rectum, explore each organ's role, and see how villi in the small intestine absorb nutrients into the blood.",
};

export default function DigestiveSystemPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink
        simulationHref="/dashboard/biology/digestive-system"
        className="mb-4"
      />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          {
            label: "Human Physiology",
            href: "/dashboard/biology/human-physiology",
          },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
          Biology · Human Physiology
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Digestive System — Journey of Food &amp; Nutrient Absorption
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Follow a bite of food from mouth to rectum, explore what each organ
          does, and see how villi in the small intestine absorb nutrients into
          the blood.
        </p>
      </div>

      <DigestiveSystem />
    </Container>
  );
}
