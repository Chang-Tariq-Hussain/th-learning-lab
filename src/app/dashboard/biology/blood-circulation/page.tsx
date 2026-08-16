import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { BloodCirculation } from "@/features/subjects/biology/blood-circulation";

export const metadata: Metadata = {
  title: "Blood Circulation",
  description:
    "Watch blood flow between the body, heart, and lungs, and explore pulmonary and systemic circulation, the four heart chambers, and how blood picks up oxygen.",
};

export default function BloodCirculationPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/biology/blood-circulation" className="mb-4" />
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
          Blood Circulation
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Watch blood travel from the body to the heart, out to the lungs, and back again — press Trace Blood for a
          guided walk through one full circulation.
        </p>
      </div>

      <BloodCirculation />
    </Container>
  );
}
