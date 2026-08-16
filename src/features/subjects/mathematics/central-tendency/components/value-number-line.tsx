"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatNumber } from "../central-tendency-model";

export interface NumberLineMarker {
  value: number;
  label: string;
  color: string;
}

export interface RangeArrow {
  from: number;
  to: number;
}

export interface SpreadBand {
  from: number;
  to: number;
  color: string;
  label?: string;
}

export interface ValueNumberLineProps {
  /** The raw data points to plot as dots on the line. */
  values: number[];
  /** Optional labeled markers (e.g. Mean, Median) drawn above the line. */
  markers?: NumberLineMarker[];
  /** Optional min <-> max distance arrow, drawn below the line. */
  rangeArrow?: RangeArrow;
  /** Optional translucent shaded region (e.g. mean +/- one standard deviation). */
  band?: SpreadBand;
  /** Values (by dataset index) to render in a highlight color instead of the default dot color. */
  highlightIndices?: Set<number>;
  highlightColor?: string;
  className?: string;
}

function niceDomain(values: number[]): [number, number] {
  if (values.length === 0) return [0, 10];
  const min = Math.min(...values);
  const max = Math.min(...values) === Math.max(...values) ? min + 1 : Math.max(...values);
  const pad = Math.max(1, Math.round((max - min) * 0.15));
  return [Math.floor(min - pad), Math.ceil(max + pad)];
}

/**
 * Shared horizontal number line for the whole simulation. Plots
 * dataset values as dots, with optional colored markers (mean,
 * median, min/max) floating above and an optional range arrow below.
 * Deliberately plain divs with percentage positioning — no canvas or
 * SVG — since datasets here never exceed a dozen points.
 */
export function ValueNumberLine({
  values,
  markers = [],
  rangeArrow,
  band,
  highlightIndices,
  highlightColor = "#3D5AFE",
  className,
}: ValueNumberLineProps) {
  const domainValues = [
    ...values,
    ...markers.map((m) => m.value),
    ...(rangeArrow ? [rangeArrow.from, rangeArrow.to] : []),
    ...(band ? [band.from, band.to] : []),
  ];
  const [min, max] = niceDomain(domainValues);
  const span = max - min;
  const percentFor = (v: number) => ((v - min) / span) * 100;

  const tickStep = span <= 15 ? 1 : Math.ceil(span / 15);
  const ticks: number[] = [];
  for (let t = Math.ceil(min / tickStep) * tickStep; t <= max; t += tickStep) ticks.push(t);

  return (
    <div className={cn("w-full px-4 pt-14 sm:px-8", band?.label ? "pb-12" : "pb-8", className)}>
      <div className="relative h-1.5 w-full rounded-full bg-ink/10 dark:bg-bone/15">
        {band ? (
          <div
            className="absolute -top-3 bottom-[-0.75rem] rounded-full opacity-15"
            style={{
              left: `${percentFor(Math.min(band.from, band.to))}%`,
              width: `${percentFor(Math.max(band.from, band.to)) - percentFor(Math.min(band.from, band.to))}%`,
              backgroundColor: band.color,
            }}
          />
        ) : null}
        {band?.label ? (
          <p
            className="absolute -bottom-6 whitespace-nowrap text-center font-mono text-[10px] text-ink-soft dark:text-bone-soft"
            style={{
              left: `${percentFor(Math.min(band.from, band.to))}%`,
              width: `${percentFor(Math.max(band.from, band.to)) - percentFor(Math.min(band.from, band.to))}%`,
            }}
          >
            {band.label}
          </p>
        ) : null}

        {ticks.map((t) => (
          <div key={t} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${percentFor(t)}%` }}>
            <div className="h-2.5 w-px bg-ink/25 dark:bg-bone/30" />
            <span className="absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-ink-soft dark:text-bone-soft">
              {t}
            </span>
          </div>
        ))}

        {rangeArrow ? (
          <div
            className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-subject-math/50"
            style={{
              left: `${percentFor(Math.min(rangeArrow.from, rangeArrow.to))}%`,
              width: `${percentFor(Math.max(rangeArrow.from, rangeArrow.to)) - percentFor(Math.min(rangeArrow.from, rangeArrow.to))}%`,
            }}
          />
        ) : null}

        {values.map((v, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm dark:border-chalkboard"
            style={{
              backgroundColor: highlightIndices?.has(i) ? highlightColor : "#8891A8",
              width: highlightIndices?.has(i) ? 16 : 12,
              height: highlightIndices?.has(i) ? 16 : 12,
            }}
            animate={{ left: `${percentFor(v)}%` }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          />
        ))}

        {markers.map((m, i) => (
          <motion.div
            key={m.label + i}
            className="absolute top-1/2 z-20 flex -translate-x-1/2 flex-col items-center"
            animate={{ left: `${percentFor(m.value)}%` }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <span
              className="mb-1.5 -translate-y-full whitespace-nowrap rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold text-white shadow-sm"
              style={{ backgroundColor: m.color }}
            >
              {m.label} = {formatNumber(m.value)}
            </span>
            <div className="h-3.5 w-3.5 -translate-y-1/2 rotate-45 border-2 border-white shadow-sm dark:border-chalkboard" style={{ backgroundColor: m.color }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
