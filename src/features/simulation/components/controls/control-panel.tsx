import { cn } from "@/lib/utils";

export interface ControlPanelProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Generic card used to group related controls (parameters, playback,
 * etc.). Purely presentational — layout only, no simulation state.
 */
export function ControlPanel({ title, className, children }: ControlPanelProps) {
  return (
    <section
      className={cn(
        "rounded-card border border-line bg-white/50 p-4 dark:border-line-dark dark:bg-white/[0.03] sm:p-5",
        className
      )}
    >
      {title ? (
        <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft dark:text-bone-soft">
          {title}
        </h3>
      ) : null}
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}
