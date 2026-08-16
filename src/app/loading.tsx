import { Loader2 } from "lucide-react";

/**
 * Root-level fallback, mirroring `dashboard/loading.tsx`'s style, for
 * any route transition outside `/dashboard/*` that isn't already
 * covered by a more specific `loading.tsx`.
 */
export default function RootLoading() {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 py-20" role="status" aria-live="polite">
      <Loader2 className="h-6 w-6 animate-spin text-pine-600 dark:text-pine-400" strokeWidth={1.75} />
      <p className="text-sm text-ink-soft dark:text-bone-soft">Loading...</p>
    </div>
  );
}
