import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-card border border-line bg-white/60 p-3.5 dark:border-line-dark dark:bg-white/[0.03]", className)}>
      {title && <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{title}</p>}
      <div className={title ? "mt-2" : undefined}>{children}</div>
    </div>
  );
}
