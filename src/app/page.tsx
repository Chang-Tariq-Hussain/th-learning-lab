import { Hero } from "@/components/landing/hero";
import { FeaturesSection } from "@/components/landing/features-section";
import { SubjectsPreview } from "@/components/landing/subjects-preview";
import { CtaSection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <SubjectsPreview />
      <CtaSection />
    </>
  );
}
