"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Next.js wraps every route under /dashboard with this automatically
 * (subject pages, topic pages, and every simulation) — one file, no
 * per-page duplication. `reset` retries rendering the segment that
 * threw without a full page reload.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
        <AlertTriangle className="h-6 w-6" strokeWidth={1.75} />
      </span>
      <div>
        <p className="font-display text-lg font-medium text-ink dark:text-bone">
          Something went wrong while loading this page.
        </p>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
          Please try again — if the problem continues, head back to the dashboard.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" size="md" onClick={reset}>
          Try again
        </Button>
        <Button variant="ghost" size="md" href="/dashboard">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
