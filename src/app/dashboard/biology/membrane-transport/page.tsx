import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { MembraneTransport } from "@/features/subjects/biology/membrane-transport";

export const metadata: Metadata = {
  title: "Cell Membrane & Transport",
  description: "Watch particles diffuse and water move by osmosis across a simplified cell membrane.",
};

export default function MembraneTransportPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/biology/membrane-transport" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          { label: "Cell Structure", href: "/dashboard/biology/cell-structure" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
          Biology · Cell Structure
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Cell Membrane & Transport
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Choose Diffusion or Osmosis, press Start, and watch how substances move across the membrane.
        </p>
      </div>

      <MembraneTransport />
    </Container>
  );
}
