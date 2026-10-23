import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <p className="font-mono text-label uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">Error 404</p>
      <h1 className="font-display text-2xl font-medium text-ink dark:text-bone">We couldn&apos;t find that page.</h1>
      <p className="max-w-md text-base text-ink-soft dark:text-bone-soft">The link may be out of date, or the page may have moved.</p>
      <Button variant="primary" size="md" href="/dashboard">Back to Dashboard</Button>
    </Container>
  );
}
