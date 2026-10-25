"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { primaryButtonColors } from "@/components/ui/button-styles";

const VARIANT = {
  primary: `font-medium ${primaryButtonColors}`,
  secondary: "border border-ink/15 text-ink hover:border-pine-500 dark:border-bone/20 dark:text-bone",
  danger: "border border-red-500/40 text-red-800 hover:border-red-600 dark:text-red-300",
  "danger-solid": "bg-red-600 font-medium text-white hover:bg-red-700",
} as const;

/**
 * What to show while the action runs. Must be serializable: SubmitButton is a Client Component and most pages
 * that use it are Server Components, so a function here crashes the whole page in production.
 *  - a string: always that text ("Saving…")
 *  - { field, labels, fallback }: pick the text from the value of a form field at submit time, e.g.
 *    { field: "status", labels: { published: "Publishing…" }, fallback: "Applying…" }
 */
export type PendingLabel = string | { field: string; labels: Record<string, string>; fallback: string };

function resolveLabel(label: PendingLabel, data: FormData | null): string {
  if (typeof label === "string") return label;
  const value = data?.get(label.field);
  return (typeof value === "string" ? label.labels[value] : undefined) ?? label.fallback;
}

interface SubmitButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children"> {
  children: ReactNode;
  pendingLabel: PendingLabel;
  variant?: keyof typeof VARIANT;
}

/**
 * Submit button for a server-action form. While that form's action is running it shows a spinner and the
 * pending label and is disabled, so a double-click or Enter cannot send the change twice. It follows the
 * server's answer: the state ends when the action returns or the redirect lands, including on failure.
 * Only this form's button is affected — the rest of the page stays usable.
 */
export function SubmitButton({ children, pendingLabel, variant = "secondary", className, disabled, ...rest }: SubmitButtonProps) {
  const { pending, data } = useFormStatus();
  const pendingText = resolveLabel(pendingLabel, data ?? null);
  return (
    <>
    <button
      {...rest}
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors lg:min-h-9",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-chalkboard",
        "disabled:cursor-not-allowed disabled:opacity-60",
        VARIANT[variant],
        className,
      )}
    >
      {pending ? <Spinner /> : null}
      <span>{pending ? pendingText : children}</span>
    </button>
    {/* Outside the button on purpose: a button's children are presentational, so a live region inside is not announced. */}
    <span role="status" aria-live="polite" className="sr-only">{pending ? pendingText : ""}</span>
    </>
  );
}
