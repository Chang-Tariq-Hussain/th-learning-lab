import { cn } from "@/lib/utils";

export interface LegendItem {
  label: string;
  color: string;
  /** "line" for a chart series, "dot" for a point/object marker. */
  shape?: "line" | "dot";
}

export interface LegendProps {
  items: LegendItem[];
  className?: string;
}

/** Small color-key list explaining what each series/marker in a canvas or chart represents. */
export function Legend({ items, className }: LegendProps) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-2", className)}>
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5 text-xs text-ink-soft dark:text-bone-soft">
          <span
            aria-hidden="true"
            className={cn(
              "inline-block shrink-0",
              item.shape === "line" ? "h-0.5 w-3.5 rounded-full" : "h-2 w-2 rounded-full"
            )}
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
