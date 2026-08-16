import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { Photosynthesis } from "@/features/subjects/biology/photosynthesis";

export const metadata: Metadata = {
  title: "Photosynthesis",
  description: "Watch a simple plant turn light, water, and carbon dioxide into glucose and oxygen.",
};

export default function PhotosynthesisPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/biology/photosynthesis" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          { label: "Plant Biology", href: "/dashboard/biology/plant-biology" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Biology · Plant Biology</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">Photosynthesis</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Press Start and watch light, water, and carbon dioxide reach the leaf to make glucose and oxygen.
        </p>
      </div>

      <Photosynthesis />
    </Container>
  );
}
