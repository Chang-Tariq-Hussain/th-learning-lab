import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IconChipProps {
  hex: string;
  icon?: LucideIcon;
  size?: "sm" | "md" | "lg";
}

const SIZE_STYLES = {
  sm: { chip: "h-6 w-6", icon: "h-3 w-3" },
  md: { chip: "h-9 w-9 sm:h-10 sm:w-10", icon: "h-4 w-4 sm:h-5 sm:w-5" },
  lg: { chip: "h-12 w-12 sm:h-14 sm:w-14", icon: "h-6 w-6 sm:h-7 sm:w-7" },
} as const;

/**
 * A small glossy "ball" — a colored circle with a soft highlight — used
 * as the illustrated stand-in for one unit of a ratio. With an `icon`
 * it reads as a paint can, a person, a tree; without one (marbles) the
 * plain glossy ball already looks like the thing itself.
 */
export function IconChip({ hex, icon: Icon, size = "md" }: IconChipProps) {
  const { chip, icon } = SIZE_STYLES[size];
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full shadow-sm", chip)}
      style={{
        backgroundImage: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.65), transparent 55%)`,
        backgroundColor: hex,
      }}
    >
      {Icon && <Icon className={cn(icon, "text-white")} strokeWidth={2.25} />}
    </span>
  );
}
