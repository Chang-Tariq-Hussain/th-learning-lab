import { SEVERITY_LABEL, type Severity } from "@/lib/content-health";
import { cn } from "@/lib/utils";

const STYLES: Record<Severity, string> = {
  critical: "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300",
  high: "border-orange-500/40 bg-orange-500/10 text-orange-700 dark:text-orange-300",
  medium: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  low: "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  info: "border-ink/15 bg-ink/[0.04] text-ink-soft dark:border-bone/20 dark:bg-bone/[0.06] dark:text-bone-soft",
};

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide", STYLES[severity], className)}>
      {SEVERITY_LABEL[severity]}
    </span>
  );
}
