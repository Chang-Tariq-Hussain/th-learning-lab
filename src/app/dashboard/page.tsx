import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { WelcomeHeading } from "@/components/dashboard/welcome-heading";
import { SubjectGrid } from "@/components/dashboard/subject-grid";
import { RulerDivider } from "@/components/ui/ruler-divider";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Browse Physics, Chemistry, Biology, and Mathematics.",
};

export default function DashboardPage() {
  return (
    <Container className="py-14">
      <WelcomeHeading />

      <RulerDivider className="my-10" />

      <SubjectGrid />

      <Link
        href="/dashboard/mock-tests"
        className="mt-10 block rounded-xl border border-line p-6 transition hover:border-pine-500 dark:border-line-dark"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-math">CSS preparation</p>
        <p className="mt-2 font-display text-2xl text-ink dark:text-bone">Mock Tests · CSS MPT</p>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
          2 full mocks and 10 section tests · 200 questions · 200 minutes · passing 66 / 200
        </p>
      </Link>
    </Container>
  );
}
