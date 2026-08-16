import { Loader2 } from "lucide-react";

/**
 * Next.js renders this automatically for any /dashboard/* navigation
 * whose page is still compiling/loading — this is what replaces the
 * "frozen page during Compiling..." experience in dev, and doubles as
 * the loading state for slow data/navigation in production.
 */
export default function DashboardLoading() {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 py-20" role="status" aria-live="polite">
      <Loader2 className="h-6 w-6 animate-spin text-pine-600 dark:text-pine-400" strokeWidth={1.75} />
      <p className="text-sm text-ink-soft dark:text-bone-soft">Loading...</p>
    </div>
  );
}
