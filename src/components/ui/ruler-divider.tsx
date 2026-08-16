import { cn } from "@/lib/utils";

/**
 * A thin ruled divider with tick marks, echoing graph-paper /
 * lab-notebook measurement lines. Used between major sections.
 */
export function RulerDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative h-px w-full bg-line dark:bg-line-dark",
        className
      )}
    >
      <div
        className="absolute inset-x-0 -top-1 h-2 opacity-70 [background-image:repeating-linear-gradient(to_right,currentColor_0,currentColor_1px,transparent_1px,transparent_24px)] text-ink/20 dark:text-bone/20"
        style={{ backgroundPosition: "0 0" }}
      />
    </div>
  );
}
