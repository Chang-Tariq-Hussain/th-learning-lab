import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { StrongWeakAcidsBases } from "@/features/subjects/chemistry/strong-weak-acids-bases";

export const metadata: Metadata = {
  title: "Strong vs Weak Acids and Bases",
  description: "Compare how strong and weak acids and bases ionize in water, and see why strength isn't the same as concentration.",
};

export default function StrongWeakAcidsBasesPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/chemistry/strong-weak-acids-bases" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Chemistry", href: "/dashboard/chemistry" },
          { label: "Strong vs Weak Acids and Bases", href: "/dashboard/chemistry/strong-weak-acids-bases" },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">
          Chemistry · Acids &amp; Bases
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Strong vs Weak Acids and Bases
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-soft dark:text-bone-soft">
          Watch how much of each acid or base actually separates into ions in water — and why that&apos;s different from concentration.
        </p>
      </div>

      <StrongWeakAcidsBases />
    </Container>
  );
}
