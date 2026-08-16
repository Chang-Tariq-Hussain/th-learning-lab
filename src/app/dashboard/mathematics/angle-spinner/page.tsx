import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { AngleSpinner } from "@/features/subjects/mathematics/angle-spinner";

export const metadata: Metadata = {
  title: "Angle Spinner",
  description: "Drag an arm to explore acute, right, obtuse, straight, and reflex angles.",
};

export default function AngleSpinnerPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/angle-spinner" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Geometry", href: "/dashboard/mathematics/geometry" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">
          Mathematics · Geometry
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Angle Spinner
        </h1>
      </div>

      <AngleSpinner />
    </Container>
  );
}
