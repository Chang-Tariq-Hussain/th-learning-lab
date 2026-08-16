"use client";

import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import { FunctionGraph } from "../../calculus-foundations/components/function-graph";
import { StateChain } from "./state-chain";
import { buildColoredSegments, buildSignChart, criticalMarkers, getAppFunction, SIGN_COPY } from "../applications-model";

const fn = getAppFunction("cubic");
const intervals = buildSignChart(fn);

/**
 * Level 8 — Sign Chart. Turns the same three intervals used by the
 * Critical Point Finder into a compact +/- chart, then connects that
 * directly to the graph's shape via a five-link `StateChain`
 * (Increasing -> Maximum -> Decreasing -> Minimum -> Increasing).
 */
export function SignChartPanel() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
      <BlockMath math={fn.latex} />

      <div className="grid w-full max-w-md grid-cols-3 gap-2">
        {intervals.map((interval, i) => {
          const copy = SIGN_COPY[interval.sign];
          return (
            <div
              key={i}
              className="flex flex-col items-center gap-1.5 rounded-card border px-2 py-3 text-center"
              style={{ borderColor: `${copy.color}55`, backgroundColor: `${copy.color}14` }}
            >
              <span className="font-mono text-[11px] text-ink-soft dark:text-bone-soft">{interval.label}</span>
              <span className="font-display text-xl font-bold" style={{ color: copy.color }}>
                {interval.sign === "negative" ? "−" : "+"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="aspect-square w-full max-w-md">
        <FunctionGraph
          segments={buildColoredSegments(fn)}
          markers={criticalMarkers(fn)}
          ariaLabel="The graph of f(x) = x cubed minus 3x, colored to match its sign chart."
        />
      </div>

      <StateChain
        links={[
          { label: "Increasing", tone: "positive" },
          { label: "Maximum", tone: "neutral" },
          { label: "Decreasing", tone: "negative" },
          { label: "Minimum", tone: "neutral" },
          { label: "Increasing", tone: "positive" },
        ]}
      />

      <p className={cn("max-w-md text-center text-sm leading-relaxed text-ink-soft dark:text-bone-soft")}>
        The sign of f&apos;(x) in each interval tells you exactly how the graph behaves there.
      </p>
    </div>
  );
}
