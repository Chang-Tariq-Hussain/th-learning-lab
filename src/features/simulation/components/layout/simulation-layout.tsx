"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, Circle, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type SimulationRunState = "idle" | "running" | "paused" | "finished";

const STATE_TEXT: Record<SimulationRunState, string> = {
  idle: "Ready",
  running: "Running",
  paused: "Paused",
  finished: "Finished",
};

const STATE_ICON = { idle: Circle, running: Play, paused: Pause, finished: CheckCircle2 } as const;

/**
 * Visible run state (icon + word, never colour alone) that is also the polite live region: screen readers hear
 * "Running" / "Finished. <detail>" when it changes. `detail` is spoken only.
 */
export function SimulationStatus({
  state,
  detail,
  className,
}: {
  state: SimulationRunState;
  detail?: string;
  className?: string;
}) {
  const Icon = STATE_ICON[state];
  return (
    <p
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-sim-status
      data-state={state}
      className={`inline-flex min-h-6 items-center gap-1.5 rounded-full border px-2.5 font-medium uppercase tracking-wide text-label ${
        state === "running"
          ? "border-pine-600 text-pine-700 dark:border-pine-300 dark:text-pine-300"
          : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft"
      } ${className ?? ""}`}
    >
      <Icon aria-hidden="true" className="h-3 w-3" strokeWidth={2} fill={state === "running" ? "currentColor" : "none"} />
      <span>{STATE_TEXT[state]}</span>
      {detail && state === "finished" ? <span className="sr-only">. {detail}</span> : null}
    </p>
  );
}

export interface ReadoutItem {
  id: string;
  label: string;
  value: string;
  unit?: string;
  /** The value the learner is solving for: dashed border (not colour alone). */
  unknown?: boolean;
}

/** Compact results strip that lives with the stage so the numbers are never buried below the controls. */
export function SimulationReadouts({ items, label = "Results" }: { items: ReadoutItem[]; label?: string }) {
  return (
    <dl
      aria-label={label}
      className="grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, minmax(0, 1fr))` }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "min-w-0 rounded-lg border px-1.5 py-1 text-center",
            item.unknown
              ? "border-dashed border-subject-physics bg-subject-physics-soft/60 dark:bg-subject-physics/10"
              : "border-line bg-white/60 dark:border-line-dark dark:bg-white/[0.04]",
          )}
        >
          <dt className="truncate font-mono text-label uppercase text-ink-soft dark:text-bone-soft">
            {item.label}
            {item.unknown ? " ?" : ""}
          </dt>
          <dd className="font-display text-lg font-semibold tabular-nums leading-6 text-ink dark:text-bone">
            {item.value}
            {item.unit ? <span className="ml-0.5 text-helper font-normal text-ink-soft dark:text-bone-soft">{item.unit}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

interface StageSize {
  width: number;
  height: number;
}
const StageSizeContext = createContext<StageSize>({ width: 0, height: 0 });
/** Pixel size of the stage frame, so SVG stages can draw 1 unit = 1 CSS px and keep text readable. */
export function useStageSize(): StageSize {
  return useContext(StageSizeContext);
}

export interface SimulationLayoutProps {
  /** The visual. Fills the frame (`h-full w-full`); use `useStageSize()` for pixel-accurate SVG. */
  stage: ReactNode;
  stageLabel: string;
  /** Width / height of the stage frame. */
  aspect?: number;
  /** Frame upper bound, a CSS length. */
  stageCap?: string;
  /** Omit for simulations with nothing running (static diagrams): no status chip is shown. */
  runState?: SimulationRunState;
  statusDetail?: string;
  /** Compact results, kept next to the stage. */
  readouts?: ReactNode;
  /** Start / Pause / Reset: kept reachable with the stage. */
  actions?: ReactNode;
  /** Sliders and selects: scroll beneath / beside the stage. */
  controls?: ReactNode;
  /** Notes, formulas, explanations. */
  explanation?: ReactNode;
  /** Presentation mode: stage only, full width, no side column. */
  stageOnly?: boolean;
  className?: string;
}

/**
 * Shared simulation shell. Below `lg` the stage block (status, stage, readouts, actions) is sticky under the
 * header while controls scroll; from `lg` (and on short landscape screens) it is a sticky left column. Geometry
 * lives in globals.css (`.sim-*`); `--app-header-h` is the header height.
 */
export function SimulationLayout({
  stage,
  stageLabel,
  aspect = 2.6,
  stageCap = "26rem",
  runState,
  statusDetail,
  readouts,
  actions,
  controls,
  explanation,
  stageOnly = false,
  className,
}: SimulationLayoutProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<StageSize>({ width: 0, height: 0 });
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => setSize({ width: Math.round(el.clientWidth), height: Math.round(el.clientHeight) });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div data-sim-layout data-stage-only={stageOnly ? "true" : undefined} className={cn("sim-layout", className)}>
      <div
        data-sim-stage-col
        data-has-readouts={readouts ? "true" : "false"}
        className="sim-stage-col bg-paper dark:bg-chalkboard"
      >
        <section
          aria-label={stageLabel}
          className="rounded-card border border-line bg-white/80 p-2 shadow-card dark:border-line-dark dark:bg-chalkboard sm:p-3"
        >
          {runState ? (
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <SimulationStatus state={runState} detail={statusDetail} />
            </div>
          ) : null}
          <div
            ref={frameRef}
            data-sim-stage
            className="sim-stage-frame overflow-hidden rounded-xl"
            style={{ ["--sim-aspect" as string]: String(aspect), ["--sim-cap" as string]: stageCap }}
          >
            <StageSizeContext.Provider value={size}>{stage}</StageSizeContext.Provider>
          </div>
          {readouts ? (
            <div data-sim-readouts className="mt-2">
              {readouts}
            </div>
          ) : null}
          {actions ? (
            <div data-sim-actions className="mt-2 flex flex-wrap items-center justify-center gap-2">
              {actions}
            </div>
          ) : null}
        </section>
      </div>
      {stageOnly ? null : (
      <div data-sim-side className="flex min-w-0 flex-col gap-4 lg:gap-6">
        {controls ? <div data-sim-controls className="min-w-0">{controls}</div> : null}
        {explanation ? <div data-sim-explanation className="min-w-0">{explanation}</div> : null}
      </div>
      )}
    </div>
  );
}
