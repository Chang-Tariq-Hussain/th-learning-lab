"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { SubmitButton } from "@/components/admin/submit-button";

/** Anything in the admin console that throws while rendering lands here instead of a blank page. */
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Detail stays in the log; the page itself never shows it.
    console.error("[admin] page error:", error);
  }, [error]);

  return (
    <div role="alert" className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-2 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300">
        <AlertTriangle aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} />
      </span>
      <div>
        <p className="font-display text-lg font-medium">This page could not be loaded.</p>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">Nothing was changed. Try again, or go back to the overview.{error.digest ? ` (Reference: ${error.digest})` : ""}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <form action={reset}><SubmitButton variant="primary" pendingLabel="Retrying…">Try again</SubmitButton></form>
        <Link href="/admin" className="inline-flex min-h-11 items-center text-sm underline md:min-h-9">Back to overview</Link>
      </div>
    </div>
  );
}
