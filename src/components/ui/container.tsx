import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * `"wide"` lifts the 72rem content cap to 90rem for pages that host a large simulation. It is a prop rather
   * than a `max-w-*` className because tailwind-merge does not know the custom `max-w-content` token, so an
   * override class would sit beside it and lose on stylesheet order.
   */
  size?: "default" | "wide";
}

export function Container({ className, size = "default", ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-5 sm:px-8", size === "wide" ? "max-w-[90rem]" : "max-w-content", className)}
      {...props}
    />
  );
}
