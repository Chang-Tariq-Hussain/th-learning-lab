"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Fallback for any page outside /dashboard and /admin (which have their own): a clear message and a way out. */
export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300">
        <AlertTriangle aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} />
      </span>
      <div>
        <p className="font-display text-lg font-medium text-ink dark:text-bone">Something went wrong while loading this page.</p>
        <p className="mt-1 text-sm text-ink-soft dark:text-bone-soft">
          Please try again. If it keeps happening, go back to the home page.{error.digest ? ` (Reference: ${error.digest})` : ""}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" size="md" onClick={reset}>Try again</Button>
        <Link href="/" className="inline-flex min-h-11 items-center text-sm underline">Home</Link>
      </div>
    </div>
  );
}
