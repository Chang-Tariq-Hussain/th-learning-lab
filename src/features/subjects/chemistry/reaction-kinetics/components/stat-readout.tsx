import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: string | number;
  accent?: string;
}

/** A row of small stat pills — reused across every level that shows chamber counts. */
export function StatReadout({ items, className }: { items: StatItem[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-2 sm:grid-cols-4", className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-card border border-line bg-white/60 px-3 py-2 text-center dark:border-line-dark dark:bg-white/[0.03]"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft/70 dark:text-bone-soft/60">
            {item.label}
          </p>
          <p
            className={cn("mt-0.5 font-display text-lg font-medium", !item.accent && "text-ink dark:text-bone")}
            style={item.accent ? { color: item.accent } : undefined}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
