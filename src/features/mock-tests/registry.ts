/**
 * Registry of mock-test categories shown on /dashboard/mock-tests.
 * To add a new subject, append ONE entry here (and build its own /dashboard/mock-tests/<slug> route); the hub picks it up automatically.
 */
export interface MockTestCategory {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  /** short facts shown on the card */
  facts: string[];
  /** false renders the card as "coming soon" without a link */
  available: boolean;
}

export const MOCK_TEST_CATEGORIES: MockTestCategory[] = [
  {
    slug: "css-mpt",
    title: "CSS MPT",
    eyebrow: "FPSC · MCQ-Based Preliminary Test",
    description:
      "Full-length mocks in the real paper order, plus one-section tests for Islamic Studies, Urdu, English, General Abilities and GK / Current Affairs / Pakistan Affairs.",
    href: "/dashboard/mock-tests/css-mpt",
    facts: ["2 full mocks", "200 questions · 200 minutes", "Passing 66 / 200", "10 section tests"],
    available: true,
  },
  {
    slug: "sindh-teacher",
    title: "Sindh Teacher Tests",
    eyebrow: "PST · JEST · JST (Junior Science Teacher)",
    description:
      "Practice mocks, subject / topic / difficulty practice and a question-bank audit for Sindh teacher recruitment tests. The bank is generated practice material; the official pattern is not confirmed.",
    href: "/dashboard/mock-tests/sindh-teacher",
    facts: ["3 exams", "5 mocks each", "Practice modes", "Not past papers"],
    available: true,
  },
];

export function getCategory(slug: string): MockTestCategory | null {
  return MOCK_TEST_CATEGORIES.find((c) => c.slug === slug) ?? null;
}
