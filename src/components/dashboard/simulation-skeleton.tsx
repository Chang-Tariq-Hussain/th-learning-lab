import { Loader2 } from "lucide-react";

/**
 * Used as the `loading` fallback for every simulation's dynamic
 * import, so opening a simulation never shows a blank page while its
 * chunk compiles/downloads — just this, in the same footprint the
 * simulation itself will occupy.
 */
export function SimulationSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[320px] w-full flex-col items-center justify-center gap-3 rounded-[1.75rem] border border-line bg-white/50 p-10 text-center shadow-card backdrop-blur dark:border-line-dark dark:bg-white/[0.02]"
    >
      <Loader2 className="h-6 w-6 animate-spin text-ink-soft/60 dark:text-bone-soft/60" strokeWidth={1.75} />
      <p className="text-sm text-ink-soft dark:text-bone-soft">Loading simulation...</p>
    </div>
  );
}
