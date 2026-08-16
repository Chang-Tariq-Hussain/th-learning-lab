import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SymmetryMirror } from "@/features/subjects/mathematics/symmetry-mirror";

export const metadata: Metadata = {
  title: "Symmetry Mirror",
  description: "Click squares on the left and watch them mirror instantly on the right — a hands-on introduction to line symmetry.",
};

export default function SymmetryMirrorPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/symmetry-mirror" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Symmetry", href: "/dashboard/mathematics/symmetry" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">
          Mathematics · Geometry
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Symmetry Mirror
        </h1>
      </div>

      <SymmetryMirror />
    </Container>
  );
}
