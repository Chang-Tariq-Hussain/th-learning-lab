import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { CategoryCard } from "@/features/mock-tests/components/category-card";
import { MOCK_TEST_CATEGORIES } from "@/features/mock-tests/registry";

export const metadata: Metadata = {
  title: "Mock Tests",
  description: "Timed mock tests with review and weak-area analysis. Start with the CSS MPT.",
};

export default function MockTestsHubPage() {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Mock Tests" }]} className="mb-6" />
      <h1 className="font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">Mock Tests</h1>
      <p className="mt-2 max-w-2xl text-base text-ink-soft dark:text-bone-soft">
        Timed practice with a countdown that cannot be reset, automatic submission, answer review and weak-area analysis. Your progress stays on this device.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {MOCK_TEST_CATEGORIES.map((c) => (
          <CategoryCard key={c.slug} category={c} />
        ))}
      </div>
    </Container>
  );
}
