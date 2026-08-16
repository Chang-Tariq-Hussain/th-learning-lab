import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ARRHENIUS_CONNECTION } from "../model";

/** A small, deliberately non-tabular bridge back to Arrhenius Theory — the spec explicitly asks to keep this brief. */
export function ArrheniusConnection() {
  return (
    <div className="rounded-card border border-line bg-white/60 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subject-chemistry">Compare with Arrhenius Theory</p>
        <Link
          href="/dashboard/chemistry/arrhenius-theory"
          className="flex items-center gap-1 text-xs font-medium text-subject-chemistry transition-colors hover:text-pine-700 dark:hover:text-pine-300"
        >
          Open Arrhenius Theory
          <ArrowRight className="h-3 w-3" strokeWidth={2} />
        </Link>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{ARRHENIUS_CONNECTION.arrhenius}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{ARRHENIUS_CONNECTION.bronstedLowry}</p>
    </div>
  );
}
