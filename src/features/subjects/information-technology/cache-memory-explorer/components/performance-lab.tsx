"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  DEFAULT_CONFIG,
  NAMED_PATTERNS,
  POLICY_LABELS,
  atLeast,
  averageAccessTime,
  formatUnits,
  parseSequence,
  runPattern,
  summarize,
  type CacheConfig,
  type DetailLevel,
  type Policy,
} from "../model";
import { MODEL_DISCLAIMER, TIMING_DISCLAIMER } from "../content";
import { StatsPanel } from "./stats-panel";
import { Callout, LABEL_CLASS, Panel, Segmented, SelectField, Stat } from "./ui-bits";

type Mode = "whatif" | "pattern";

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (n: number) => void;
}) {
  return (
    <label className="flex min-w-[12rem] flex-1 flex-col gap-1">
      <span className="flex items-baseline justify-between">
        <span className={LABEL_CLASS}>{label}</span>
        <span className="font-mono text-sm tabular-nums text-ink dark:text-bone">
          {value}
          {suffix === " units" && value === 1 ? " unit" : suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-10 w-full cursor-pointer accent-[#B45309]"
      />
    </label>
  );
}

function AmatChart({ hitTime, penalty, hitRate }: { hitTime: number; penalty: number; hitRate: number }) {
  const W = 320;
  const H = 170;
  const pad = { l: 34, r: 10, t: 12, b: 26 };
  const yMax = hitTime + penalty;
  const x = (pct: number) => pad.l + (pct / 100) * (W - pad.l - pad.r);
  const y = (v: number) => H - pad.b - (v / yMax) * (H - pad.t - pad.b);
  const points = Array.from({ length: 21 }, (_, i) => i * 5).map((pct) => `${x(pct)},${y(averageAccessTime(hitTime, 1 - pct / 100, penalty))}`);
  const current = averageAccessTime(hitTime, 1 - hitRate / 100, penalty);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-md" role="img" aria-label={`Average access time falls from ${formatUnits(yMax)} at 0% hit rate to ${formatUnits(hitTime)} at 100% hit rate. At ${hitRate}% it is ${formatUnits(Number(current.toFixed(2)))}.`}>
      <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} className="stroke-ink/40 dark:stroke-bone/40" />
      <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} className="stroke-ink/40 dark:stroke-bone/40" />
      <line x1={pad.l} y1={y(penalty)} x2={W - pad.r} y2={y(penalty)} strokeDasharray="4 3" className="stroke-rose-500/70" />
      <text x={W - pad.r} y={y(penalty) - 3} textAnchor="end" className="fill-rose-700 text-[9px] dark:fill-rose-300">
        no cache: every access = {penalty}
      </text>
      <polyline points={points.join(" ")} fill="none" strokeWidth={2} className="stroke-subject-it" />
      <circle cx={x(hitRate)} cy={y(current)} r={5} className="fill-subject-it stroke-paper dark:stroke-chalkboard" strokeWidth={2} />
      {[0, 50, 100].map((t) => (
        <text key={t} x={x(t)} y={H - 8} textAnchor="middle" className="fill-ink-soft text-[9px] dark:fill-bone-soft">
          {t}%
        </text>
      ))}
      <text x={4} y={pad.t + 6} className="fill-ink-soft text-[9px] dark:fill-bone-soft">
        {formatUnits(yMax)}
      </text>
      <text x={4} y={H - pad.b} className="fill-ink-soft text-[9px] dark:fill-bone-soft">
        0
      </text>
      <text x={(pad.l + W - pad.r) / 2} y={H - 1} textAnchor="middle" className="fill-ink-soft text-[9px] dark:fill-bone-soft">
        hit rate → average access time (simulated units)
      </text>
    </svg>
  );
}

export function PerformanceLab({ level }: { level: DetailLevel }) {
  const technical = atLeast(level, "technical");
  const [mode, setMode] = useState<Mode>("whatif");
  const [hitTime, setHitTime] = useState(1);
  const [penalty, setPenalty] = useState(50);
  const [hitRatePct, setHitRatePct] = useState(90);

  const [patternId, setPatternId] = useState("fits");
  const [custom, setCustom] = useState("1 2 3 4 1 2 3 4");
  const [lines, setLines] = useState(4);
  const [lineSize, setLineSize] = useState(4);
  const [policy, setPolicy] = useState<Policy>("lru");

  const missRate = 1 - hitRatePct / 100;
  const amat = averageAccessTime(hitTime, missRate, penalty);

  const parsedCustom = useMemo(() => parseSequence(custom), [custom]);
  const addresses = useMemo(
    () => (patternId === "custom" ? parsedCustom.tokens.map((t) => t.address) : (NAMED_PATTERNS.find((p) => p.id === patternId)?.addresses ?? [])),
    [patternId, parsedCustom.tokens],
  );
  const config: CacheConfig = useMemo(
    () => ({
      ...DEFAULT_CONFIG,
      levelCount: 1,
      l1Lines: lines,
      lineSize,
      policy: technical ? policy : "lru",
      latency: { ...DEFAULT_CONFIG.latency, l1: hitTime, ram: penalty },
    }),
    [lines, lineSize, policy, technical, hitTime, penalty],
  );
  const run = useMemo(() => runPattern(config, addresses), [config, addresses]);
  const summary = summarize(run.final.stats);
  const formula = averageAccessTime(hitTime, summary.missRate, penalty);
  const noCacheTotal = summary.total * penalty;
  const speedup = summary.totalTime > 0 ? noCacheTotal / summary.totalTime : 0;

  return (
    <div className="flex flex-col gap-5">
      <Callout title="Why hit rate matters so much">
        A hit costs the cache’s (small) hit time. A miss costs that <em>plus</em> a trip to RAM. So even a small drop in hit rate raises the average access time a lot, because the miss penalty is so much larger than the hit time.
      </Callout>

      <Panel title="Simulated latencies">
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <Slider label="Cache hit time" value={hitTime} min={1} max={10} suffix=" units" onChange={setHitTime} />
          <Slider label="Miss penalty (extra time to reach RAM)" value={penalty} min={10} max={200} step={5} suffix=" units" onChange={setPenalty} />
        </div>
        <p className="mt-2 text-[11px] text-ink-soft dark:text-bone-soft">{TIMING_DISCLAIMER}</p>
      </Panel>

      <Segmented
        label="Explore"
        options={[
          { value: "whatif", label: "Set a hit rate" },
          { value: "pattern", label: "Run an access pattern" },
        ]}
        value={mode}
        onChange={setMode}
      />

      {mode === "whatif" ? (
        <Panel title="What if the hit rate were…?">
          <Slider label="Cache hit rate" value={hitRatePct} min={0} max={100} suffix="%" onChange={setHitRatePct} />
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Hit rate" value={`${hitRatePct}%`} tone="hit" />
            <Stat label="Miss rate" value={`${100 - hitRatePct}%`} tone="miss" />
            <Stat label="Average access time" value={formatUnits(Number(amat.toFixed(2)))} sub="simulated units" />
            <Stat label="Speed-up vs no cache" value={`${(penalty / amat).toFixed(1)}×`} sub="vs always using RAM" />
          </div>
          <p className="mt-3 font-mono text-xs text-ink dark:text-bone">
            {hitTime} + {(missRate).toFixed(2)} × {penalty} = {formatUnits(Number(amat.toFixed(2)))}
          </p>
          <div className="mt-4">
            <AmatChart hitTime={hitTime} penalty={penalty} hitRate={hitRatePct} />
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[300px] text-left text-xs">
              <thead>
                <tr className="border-b border-line dark:border-line-dark">
                  <th scope="col" className="px-2 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                    Hit rate
                  </th>
                  {[50, 80, 90, 95, 99].map((p) => (
                    <th key={p} scope="col" className="px-2 py-1.5 font-mono tabular-nums text-ink dark:text-bone">
                      {p}%
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" className="px-2 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                    Avg. time
                  </th>
                  {[50, 80, 90, 95, 99].map((p) => (
                    <td key={p} className="px-2 py-1.5 font-mono tabular-nums">
                      {formatUnits(Number(averageAccessTime(hitTime, 1 - p / 100, penalty).toFixed(2)))}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Panel>
      ) : (
        <Panel title="Measure a real run">
          <div className="flex flex-wrap items-end gap-3">
            <SelectField
              label="Access pattern"
              value={patternId}
              options={[...NAMED_PATTERNS.map((p) => ({ value: p.id, label: p.label })), { value: "custom", label: "Custom…" }]}
              onChange={setPatternId}
            />
            <SelectField label="Cache size" value={lines} options={[2, 4, 8, 16].map((n) => ({ value: n, label: `${n} lines` }))} onChange={(v) => setLines(Number(v))} />
            <SelectField label="Line size" value={lineSize} options={[1, 2, 4, 8].map((n) => ({ value: n, label: n === 1 ? "1 word" : `${n} words` }))} onChange={(v) => setLineSize(Number(v))} />
            {technical ? (
              <SelectField label="Replacement" value={policy} options={(Object.keys(POLICY_LABELS) as Policy[]).map((p) => ({ value: p, label: POLICY_LABELS[p] }))} onChange={(v) => setPolicy(v as Policy)} />
            ) : null}
          </div>
          <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">
            {patternId === "custom" ? "" : NAMED_PATTERNS.find((p) => p.id === patternId)?.description}
          </p>
          {patternId === "custom" ? (
            <label className="mt-2 flex flex-col gap-1">
              <span className={LABEL_CLASS}>Your access pattern</span>
              <input value={custom} onChange={(e) => setCustom(e.target.value)} className="h-11 max-w-md rounded-lg border border-line bg-transparent px-3 font-mono text-sm text-ink dark:border-line-dark dark:text-bone" />
              {parsedCustom.error ? <span className="text-xs text-rose-700 dark:text-rose-300">{parsedCustom.error}</span> : null}
            </label>
          ) : null}

          <div className="mt-4">
            <StatsPanel summary={summary} levelCount={1} />
          </div>

          <div className={cn("mt-4 rounded-lg border border-line p-3 dark:border-line-dark")}>
            {technical ? (
              <>
                <p className={LABEL_CLASS}>Average access time (simplified two-level model)</p>
                <p className="mt-1 font-mono text-sm text-ink dark:text-bone">average access time ≈ hit time + miss rate × miss penalty</p>
                <p className="mt-1 font-mono text-sm tabular-nums text-ink dark:text-bone">
                  = {hitTime} + {summary.missRate.toFixed(3)} × {penalty} = {formatUnits(Number(formula.toFixed(2)))}
                </p>
                <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">
                  Measured from the run: {formatUnits(summary.totalTime)} total ÷ {summary.total} accesses = {formatUnits(Number(summary.averageTime.toFixed(2)))}
                  {summary.total > 0 && Math.abs(formula - summary.averageTime) < 1e-9 ? " ✓ matches the formula." : "."} This is a simplified model: real systems have several levels and overlap their work.
                </p>
              </>
            ) : (
              <p className="text-sm text-ink dark:text-bone">
                Average access time = total simulated time ÷ accesses = {formatUnits(summary.totalTime)} ÷ {summary.total} = <strong>{formatUnits(Number(summary.averageTime.toFixed(2)))}</strong> units.
              </p>
            )}
            {summary.total > 0 ? (
              <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">
                With no cache, every access would cost {penalty}, for {formatUnits(noCacheTotal)} in total — this cache is {speedup.toFixed(1)}× faster on this pattern.
              </p>
            ) : null}
          </div>
          <p className="mt-3 text-[11px] text-ink-soft dark:text-bone-soft">
            {MODEL_DISCLAIMER} Each miss costs the hit time plus the miss penalty.
          </p>
        </Panel>
      )}
    </div>
  );
}
