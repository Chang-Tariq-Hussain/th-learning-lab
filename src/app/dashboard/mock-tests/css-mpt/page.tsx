import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { CssMptLanding } from "@/features/mock-tests/components/css-mpt-landing";
import { MPT_MOCKS } from "@/features/mpt-mock/engine";

export const metadata: Metadata = {
  title: "CSS MPT Mock Tests",
  description:
    "CSS MPT full mocks (200 questions, 200 minutes, passing 66/200) and one-section tests for Islamic Studies, Urdu, English, General Abilities and GK / Current Affairs / Pakistan Affairs.",
};

export default function CssMptPage() {
  // only the light definitions go to the client; the question bank stays out of this page's bundle
  const mocks = MPT_MOCKS.map((m) => ({ ...m }));
  return (
    <Container className="py-10">
      <Breadcrumbs
        items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Mock Tests", href: "/dashboard/mock-tests" }, { label: "CSS MPT" }]}
        className="mb-6"
      />
      <h1 className="font-display text-3xl font-medium text-ink dark:text-bone sm:text-4xl">CSS MPT</h1>
      <p className="mt-2 mb-10 max-w-2xl text-base text-ink-soft dark:text-bone-soft">
        FPSC MCQ-Based Preliminary Test practice. Pick a full mock or drill a single section.
      </p>
      <CssMptLanding mocks={mocks} />
    </Container>
  );
}
