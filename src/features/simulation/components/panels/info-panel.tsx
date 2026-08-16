import { cn } from "@/lib/utils";

export interface InfoStat {
  label: string;
  value: string | number;
  unit?: string;
}

export interface InfoPanelProps {
  title?: string;
  stats: InfoStat[];
  className?: string;
}

/**
 * A row of labeled readouts — elapsed time, derived quantities, live
 * counters, whatever a simulation wants to surface. Purely presentational;
 * the simulation computes the values (often from its own `onTick`) and
 * passes them in as `stats`.
 */
export function InfoPanel({ title = "Readouts", stats, className }: InfoPanelProps) {
  return (
    <section
      className={cn(
        "rounded-card border border-line bg-white/50 p-4 dark:border-line-dark dark:bg-white/[0.03]",
        className
      )}
    >
      <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">
        {title}
      </h3>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt className="text-xs text-ink-soft dark:text-bone-soft">{stat.label}</dt>
            <dd className="font-mono text-base font-medium text-ink dark:text-bone">
              {typeof stat.value === "number"
                ? stat.value.toLocaleString(undefined, { maximumFractionDigits: 3 })
                : stat.value}
              {stat.unit ? (
                <span className="ml-1 text-xs font-normal text-ink-soft dark:text-bone-soft">
                  {stat.unit}
                </span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
