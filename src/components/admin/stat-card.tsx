import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, hint, href, tone }: { label: string; value: ReactNode; hint?: ReactNode; href?: string; tone?: "alert" }) {
  const body = (
    <div className={cn("h-full rounded-xl border border-ink/10 bg-paper p-4 dark:border-bone/15 dark:bg-chalkboard", tone === "alert" && "border-red-500/40", href && "transition-colors hover:border-pine-500")}>
      <p className="font-mono text-label uppercase tracking-wide text-ink-soft dark:text-bone-soft">{label}</p>
      <p className="mt-1 font-display text-2xl font-medium tabular-nums text-ink dark:text-bone">{value}</p>
      {hint ? <p className="mt-1 text-helper text-ink-soft dark:text-bone-soft">{hint}</p> : null}
    </div>
  );
  return href ? <Link href={href} className="block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-pine-500">{body}</Link> : body;
}
