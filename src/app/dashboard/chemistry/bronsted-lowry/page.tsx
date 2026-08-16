import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { BronstedLowry } from "@/features/subjects/chemistry/bronsted-lowry";

export const metadata: Metadata = {
  title: "Brønsted–Lowry Theory",
  description: "Watch a proton move from acid to base and see why Brønsted–Lowry defines acids by what they donate.",
};

export default function BronstedLowryPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/bronsted-lowry" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          { label: "Brønsted–Lowry Theory", href: "/dashboard/chemistry/bronsted-lowry" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Acids &amp; Bases
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Brønsted–Lowry Theory
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Step through a proton transfer and see why the acid is the molecule that gives H⁺ away.
        </p>
      </div>

      <BronstedLowry />
    </Container>
  );
}
