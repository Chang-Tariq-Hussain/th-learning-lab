import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { NumberLine } from "@/features/subjects/mathematics/number-line";

export const metadata: Metadata = {
  title: "Interactive Number Line",
  description: "Drag a marker along a number line from -20 to +20 to learn positive numbers, negative numbers, zero, and absolute value.",
};

export default function NumberLinePage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/mathematics/number-line" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mathematics", href: "/dashboard/mathematics" },
          { label: "Number Sense", href: "/dashboard/mathematics/number-sense" },
        ]}
        className="mb-6"
      />

      <div className="mb-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">Mathematics · Number Sense</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Interactive Number Line
        </h1>
      </div>

      <NumberLine />
    </Container>
  );
}
