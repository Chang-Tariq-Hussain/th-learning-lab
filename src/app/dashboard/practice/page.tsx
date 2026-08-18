import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/sidebar";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { RulerDivider } from "@/components/ui/ruler-divider";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { PracticeMode } from "@/features/practice-mode";

export const metadata: Metadata = {
  title: "Practice Mode",
  description: "Practice any subject or topic with a randomized set of questions from the question bank.",
};

/**
 * A static route, so it takes precedence over `[subject]/page.tsx` at
 * the same depth — the same static-beats-dynamic precedent every
 * `/dashboard/<subject>/<visualization>` page already relies on (see
 * `features/subjects/types.ts`'s note on the `Topic.slug` convention).
 * "practice" isn't a registered subject slug, so there's no collision
 * to begin with.
 */
export default function PracticePage() {
  return (
    <div className="lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <Sidebar className="h-[calc(100vh-7rem)]" />
        </div>
      </aside>

      <div className="min-w-0">
        <Container className="py-14">
          <Breadcrumbs
            items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Practice" }]}
            className="mb-6"
          />

          <SectionHeading
            eyebrow="Practice Mode"
            title="Practice what you're learning"
            description="Pick a subject and topic, choose a difficulty, and practice with a randomized set of questions from the question bank."
          />

          <RulerDivider className="my-10" />

          <div className="py-4">
            <PracticeMode />
          </div>
        </Container>
      </div>
    </div>
  );
}
