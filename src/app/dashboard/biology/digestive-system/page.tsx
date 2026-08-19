import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { SimulationBackLink } from "@/components/dashboard/simulation-back-link";
import { SimulationLearnMore } from "@/components/dashboard/simulation-learn-more";
import { DigestiveSystem } from "@/features/subjects/biology/digestive-system";

export const metadata: Metadata = {
  title: "Digestive System — Journey of Food & Nutrient Absorption",
  description:
    "Follow a bite of food from mouth to rectum, explore each organ's role, and see how villi in the small intestine absorb nutrients into the blood.",
};

export default function DigestiveSystemPage() {
  return (
    <Container className="py-10">
      <SimulationBackLink
        simulationHref="/dashboard/biology/digestive-system"
        className="mb-4"
      />
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Biology", href: "/dashboard/biology" },
          {
            label: "Human Physiology",
            href: "/dashboard/biology/human-physiology",
          },
        ]}
        className="mb-6"
      />

      <div className="mb-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-biology">
          Biology · Human Physiology
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">
          Digestive System — Journey of Food &amp; Nutrient Absorption
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-soft dark:text-bone-soft">
          Follow a bite of food from mouth to rectum, explore what each organ
          does, and see how villi in the small intestine absorb nutrients into
          the blood.
        </p>
      </div>

      <DigestiveSystem />

      <SimulationLearnMore
        colorToken="biology"
        objectives={[
          "List the main organs food passes through, in order, during digestion.",
          "Explain the difference between mechanical and chemical digestion.",
          "Describe how villi in the small intestine absorb nutrients.",
          "Explain what happens to the waste that isn't absorbed.",
        ]}
        concepts={[
          {
            term: "Mechanical digestion",
            explanation:
              "The physical breakdown of food into smaller pieces — chewing in the mouth and churning in the stomach are both mechanical digestion, increasing the food's surface area without changing it chemically.",
          },
          {
            term: "Chemical digestion",
            explanation:
              "The breakdown of food's molecules using enzymes and acids, starting with saliva in the mouth and continuing with stomach acid and enzymes released in the small intestine.",
          },
          {
            term: "Villi",
            explanation:
              "Tiny, finger-like projections lining the small intestine that dramatically increase its surface area. Digested nutrients pass through the villi directly into the bloodstream, where they're carried to the rest of the body.",
          },
          {
            term: "The large intestine",
            explanation:
              "Absorbs remaining water from what's left after nutrient absorption, and compacts what's left into waste to be eliminated.",
          },
        ]}
        howToUse={[
          "Press Start and follow a bite of food as it enters the mouth.",
          "Watch it travel through the esophagus, stomach, and small intestine.",
          "Pause at the small intestine and look closely at the villi absorbing nutrients into the blood.",
          "Follow what's left into the large intestine and see how it becomes waste.",
        ]}
        whyItMatters="Digestion is how your body converts a sandwich or a bowl of rice into the actual building blocks — sugars, amino acids, fats — that fuel every cell you have. Understanding where each step happens explains everyday things like why chewing thoroughly helps digestion, why stomach acid can cause heartburn, and why the small intestine's huge surface area (thanks to villi) is essential for getting enough nutrients into your blood."
        tryThis={[
          "List each organ food passes through in order, and note whether mechanical or chemical digestion (or both) happens there.",
          "Predict what would happen to nutrient absorption if the small intestine's villi were smooth instead of finger-like.",
          "Think about why the large intestine's main job is absorbing water rather than nutrients.",
        ]}
      />
    </Container>
  );
}
