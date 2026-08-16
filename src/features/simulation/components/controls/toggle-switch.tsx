"use client";

import { cn } from "@/lib/utils";

export interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Reusable boolean control, the counterpart to `ParameterSlider` /
 * `DropdownSelector` for on/off settings that don't fit the numeric
 * `ParameterSchema` (show trail, show vectors, air resistance, etc.).
 * Standalone/controlled, like `NumberInput` and `DropdownSelector`, so
 * it can be wired to local component state or a parameter schema.
 */
export function ToggleSwitch({
  label,
  checked,
  onChange,
  description,
  disabled,
  className,
}: ToggleSwitchProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start justify-between gap-3",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <span className="flex flex-col">
        <span className="text-sm font-medium text-ink dark:text-bone">{label}</span>
        {description ? (
          <span className="text-xs text-ink-soft dark:text-bone-soft">{description}</span>
        ) : null}
      </span>
      <span
        role="switch"
        aria-checked={checked}
        aria-label={label}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && onChange(!checked)}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            onChange(!checked);
          }
        }}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-chalkboard",
          checked ? "bg-pine-600 dark:bg-pine-300" : "bg-ink/15 dark:bg-bone/20"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform dark:bg-chalkboard",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </span>
    </label>
  );
}
