"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const VARIANT = {
  primary: "bg-pine-600 font-medium text-paper hover:bg-pine-700 dark:bg-pine-500 dark:text-chalkboard dark:hover:bg-pine-300",
  secondary: "border border-ink/15 text-ink hover:border-pine-500 dark:border-bone/20 dark:text-bone",
  danger: "border border-red-500/40 text-red-800 hover:border-red-600 dark:text-red-300",
  "danger-solid": "bg-red-600 font-medium text-white hover:bg-red-700",
} as const;

interface SubmitButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children"> {
  children: ReactNode;
  /** Shown while the action runs, e.g. "Saving…". */
  pendingLabel: string | ((form: FormData | null) => string);
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
  const pendingText = typeof pendingLabel === "function" ? pendingLabel(data ?? null) : pendingLabel;
  return (
    <button
      {...rest}
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors md:min-h-9",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-chalkboard",
        "disabled:cursor-not-allowed disabled:opacity-60",
        VARIANT[variant],
        className,
      )}
    >
      {pending ? <Spinner /> : null}
      <span>{pending ? pendingText : children}</span>
      <span role="status" className="sr-only">{pending ? pendingText : ""}</span>
    </button>
  );
}
