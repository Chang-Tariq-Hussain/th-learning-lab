import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { LewisAcidBase } from "@/features/subjects/chemistry/lewis-acid-base";

export const metadata: Metadata = {
  title: "Lewis Acid–Base Theory",
  description: "Watch an electron pair move from a Lewis base to a Lewis acid and see how a coordinate bond forms.",
};

export default function LewisAcidBasePage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/lewis-acid-base" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          { label: "Lewis Acid–Base Theory", href: "/dashboard/chemistry/lewis-acid-base" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Acids &amp; Bases
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Lewis Acid–Base Theory
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Step through an electron-pair donation and see why the Lewis acid is the species that accepts it.
        </p>
      </div>

      <LewisAcidBase />
    </Container>
  );
}
