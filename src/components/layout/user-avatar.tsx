import { cn } from "@/lib/utils";

export interface UserAvatarProps {
  initials: string;
  size?: "sm" | "md";
  className?: string;
}

/** Just the initials circle — no interactivity, so it can be reused inside a button, a menu header, or anywhere else. */
export function UserAvatar({ initials, size = "sm", className }: UserAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-pine-600 font-mono font-medium text-paper dark:bg-pine-500 dark:text-chalkboard",
        size === "sm" ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm",
        className,
      )}
    >
      {initials}
    </span>
  );
}
