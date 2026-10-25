import type { ReactNode } from "react";
import { summaryCls } from "./form-styles";
import { cn } from "@/lib/utils";

/**
 * Two-step confirmation for actions that take something out of use (archive, unpublish, revoke, remove).
 * The first step only opens the panel; nothing is sent until the person presses the confirm button inside it,
 * which is a SubmitButton (pending state, cannot be pressed twice). A disclosure, so it works without JavaScript
 * and keeps keyboard and screen-reader behaviour for free.
 *
 *   <ConfirmAction label="Archive…" summary="Archive this question?">
 *     <form action={…}> …reason field… <SubmitButton variant="danger-solid" pendingLabel="Archiving…">Confirm archive</SubmitButton></form>
 *   </ConfirmAction>
 */
export function ConfirmAction({ label, summary, children, className }: { label: string; summary: string; children: ReactNode; className?: string }) {
  return (
    <details className={cn("inline-block max-w-full text-left", className)}>
      <summary className={cn(summaryCls, "text-sm text-red-800 dark:text-red-300")}>{label}</summary>
      <div role="group" aria-label={summary} className="mt-2 max-w-full space-y-2 rounded-lg border border-red-500/30 p-3 text-sm">
        <p className="font-medium">{summary}</p>
        {children}
      </div>
    </details>
  );
}
