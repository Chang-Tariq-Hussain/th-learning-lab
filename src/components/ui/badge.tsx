import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-2.5 py-1 font-mono text-label uppercase tracking-wide text-ink-soft dark:border-bone/15 dark:text-bone-soft",
        className
      )}
      {...props}
    />
  );
}
