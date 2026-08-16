import { forwardRef } from "react";
import type { ButtonHTMLAttributes, MouseEventHandler } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const variantStyles = {
  primary:
    "bg-pine-600 text-paper hover:bg-pine-700 dark:bg-pine-500 dark:text-chalkboard dark:hover:bg-pine-300",
  secondary:
    "bg-transparent text-ink dark:text-bone border border-ink/15 dark:border-bone/20 hover:border-ink/40 dark:hover:border-bone/40 hover:bg-ink/[0.03] dark:hover:bg-bone/[0.06]",
  ghost:
    "bg-transparent text-ink/70 dark:text-bone/70 hover:text-ink dark:hover:text-bone hover:bg-ink/[0.04] dark:hover:bg-bone/[0.06]",
} as const;

const sizeStyles = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  href?: string;
}

/**
 * Shared button primitive. Renders a Next.js <Link> when `href` is
 * provided so it can be used interchangeably for navigation or actions.
 *
 * The `href` branch only forwards a specific, hand-picked set of
 * attributes (rather than spreading the rest of `props` wholesale)
 * because `ButtonHTMLAttributes` and `next/link`'s anchor props are
 * incompatible on a few button-only event handlers (e.g. `onToggle`).
 * Add to this list if a caller needs another DOM attribute forwarded
 * on the link variant.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      href,
      children,
      onClick,
      id,
      title,
      tabIndex,
      "aria-label": ariaLabel,
      "aria-current": ariaCurrent,
      "aria-expanded": ariaExpanded,
      "aria-controls": ariaControls,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      "inline-flex items-center justify-center rounded-full font-medium transition-colors duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-chalkboard",
      "disabled:pointer-events-none disabled:opacity-50",
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    if (href) {
      return (
        <Link
          href={href}
          className={classes}
          onClick={onClick as unknown as MouseEventHandler<HTMLAnchorElement>}
          id={id}
          title={title}
          tabIndex={tabIndex}
          aria-label={ariaLabel}
          aria-current={ariaCurrent}
          aria-expanded={ariaExpanded}
          aria-controls={ariaControls}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        onClick={onClick}
        id={id}
        title={title}
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        aria-current={ariaCurrent}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
