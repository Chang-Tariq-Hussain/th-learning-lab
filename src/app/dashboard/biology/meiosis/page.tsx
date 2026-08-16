import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { Meiosis } from "@/features/subjects/biology/meiosis";

export const metadata: Metadata = {
  title: "Meiosis",
  description: "Watch one diploid cell divide through meiosis into four haploid cells used in sexual reproduction.",
};

export default function MeiosisPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink simulationHref="/dashboard/biology/meiosis" className="mb-4" />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          { label: "Genetics", href: "/dashboard/biology/genetics" },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">Biology · Genetics</p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Meiosis: How Sex Cells Are Formed
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Press Start and watch a diploid cell move through meiosis, or step through each stage one at a time.
        </p>
      </div>

      <Meiosis />
    </Container>
  );
}
