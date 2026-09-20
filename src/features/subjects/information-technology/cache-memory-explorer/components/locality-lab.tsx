"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DEFAULT_CONFIG,
  DEFAULT_LATENCY,
  blockOf,
  formatRange,
  parseSequence,
  runPattern,
  type CacheConfig,
  type LevelState,
  type SequenceToken,
} from "../model";
import { TEMPORAL_SEQUENCES } from "../content";
import { useLocalMachine } from "../hooks/use-local-machine";
import { CacheTable, NO_FOCUS, focusFor } from "./cache-table";
import { PatternRunner } from "./pattern-runner";
import { ActionButton, Callout, LABEL_CLASS, OutcomeBadge, Panel, Segmented } from "./ui-bits";

type View = "temporal" | "spatial" | "lines";

const NOTHING_ACCESSED: Set<number> = new Set();

function cachedBlocks(level: LevelState | undefined): Set<number> {
  const set = new Set<number>();
  level?.sets.forEach((s) => s.forEach((line) => line && set.add(line.block)));
  return set;
}

/** RAM shown as a strip of addresses, banded by cache line. */
function MemoryStrip({
  start,
  count,
  lineSize,
  cached,
  accessed,
  requested,
  flashBlock,
  flashKey,
  onPick,
}: {
  start: number;
  count: number;
  lineSize: number;
  cached: Set<number>;
  accessed: Set<number>;
  requested?: number;
  flashBlock?: number | null;
  flashKey?: number;
  onPick?: (address: number) => void;
}) {
  return (
    <ul className="grid grid-cols-8 gap-1 sm:grid-cols-[repeat(16,minmax(0,1fr))]" aria-label="RAM addresses">
      {Array.from({ length: count }, (_, i) => {
        const address = start + i;
        const block = blockOf(address, lineSize);
        const inCache = cached.has(block);
        const wasAccessed = accessed.has(address);
        const body = (
          <>
            <span className="font-mono text-xs tabular-nums">{address}</span>
            <span className="block text-[9px] font-medium uppercase tracking-wide">
              {wasAccessed ? "used" : inCache ? "cached" : "RAM"}
            </span>
          </>
        );
        const cls = cn(
          "flex min-h-[44px] w-full flex-col items-center justify-center rounded-md border text-center transition-colors",
          block % 2 === 0 ? "bg-ink/[0.04] dark:bg-bone/[0.06]" : "bg-transparent",
          inCache ? "border-emerald-500 text-emerald-800 dark:text-emerald-300" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
          wasAccessed && "bg-emerald-100 font-semibold dark:bg-emerald-500/20",
          requested === address && "ring-2 ring-ink dark:ring-bone",
          flashBlock === block && "cme-flash",
        );
        return (
          <li key={`${address}-${flashBlock === block ? flashKey : ""}`}>
            {onPick ? (
              <button type="button" onClick={() => onPick(address)} className={cls} aria-label={`Request address ${address}`}>
                {body}
              </button>
            ) : (
              <div className={cls}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function reuseNote(tokens: SequenceToken[], index: number): string {
  const current = tokens[index];
  if (!current) return "";
  for (let j = index - 1; j >= 0; j--) {
    if (tokens[j]?.address === current.address) {
      const gap = index - j;
      return `reused ${gap === 1 ? "immediately" : `after ${gap} accesses`}`;
    }
  }
  return "first use";
}

function TemporalView() {
  const [pattern, setPattern] = useState(TEMPORAL_SEQUENCES[0]!.pattern);
  const parsed = useMemo(() => parseSequence(pattern), [pattern]);
  const config: CacheConfig = useMemo(() => ({ ...DEFAULT_CONFIG, l1Lines: 2, lineSize: 1 }), []);
  const run = useMemo(() => runPattern(config, parsed.tokens.map((t) => t.address)), [config, parsed.tokens]);
  const withCache = run.final.stats.totalTime;
  const withoutCache = parsed.tokens.length * DEFAULT_LATENCY.ram;

  return (
    <div className="flex flex-col gap-4">
      <Callout title="Temporal locality">If data is used now, it may be useful again soon. A cache keeps recently used data close, so a repeat use can hit.</Callout>
      <Segmented
        label="CPU accesses (each letter is a block)"
        options={TEMPORAL_SEQUENCES.map((s) => ({ value: s.pattern, label: s.label }))}
        value={TEMPORAL_SEQUENCES.some((s) => s.pattern === pattern) ? pattern : ""}
        onChange={setPattern}
      />
      <p className="text-xs text-ink-soft dark:text-bone-soft">
        {TEMPORAL_SEQUENCES.find((s) => s.pattern === pattern)?.note ?? "Your own sequence."} Cache: 2 lines, 1 word each.
      </p>
      <label className="flex flex-col gap-1">
        <span className={LABEL_CLASS}>Or type your own (letters A–H or numbers)</span>
        <input
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          className="h-11 max-w-md rounded-lg border border-line bg-transparent px-3 font-mono text-sm text-ink dark:border-line-dark dark:text-bone"
        />
      </label>
      {parsed.error ? (
        <p className="text-xs text-rose-700 dark:text-rose-300">{parsed.error}</p>
      ) : (
        <PatternRunner
          key={pattern}
          tokens={parsed.tokens}
          run={run}
          renderExtra={({ count }) => (
            <ol className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft dark:text-bone-soft" aria-label="Reuse of each access">
              {parsed.tokens.slice(0, count).map((t, i) => (
                <li key={i}>
                  <span className="font-mono text-ink dark:text-bone">{t.label}</span> — {reuseNote(parsed.tokens, i)}
                </li>
              ))}
            </ol>
          )}
        />
      )}
      {parsed.tokens.length > 0 && !parsed.error ? (
        <Callout tone="neutral" title="What the cache saved">
          Whole sequence: {withCache} simulated units with the cache versus {withoutCache} if every access went to RAM ({parsed.tokens.length} × {DEFAULT_LATENCY.ram}). Simulation values, not real timings.
        </Callout>
      ) : null}
    </div>
  );
}

const SPATIAL_PATTERNS = [
  { value: "100 101 102 103", label: "100 → 103" },
  { value: "100 101 102 103 104 105 106", label: "100 → 106" },
];

function SpatialView() {
  const [lineSize, setLineSize] = useState(4);
  const [pattern, setPattern] = useState(SPATIAL_PATTERNS[0]!.value);
  const parsed = useMemo(() => parseSequence(pattern), [pattern]);
  const config: CacheConfig = useMemo(() => ({ ...DEFAULT_CONFIG, l1Lines: 4, lineSize }), [lineSize]);
  const run = useMemo(() => runPattern(config, parsed.tokens.map((t) => t.address)), [config, parsed.tokens]);

  return (
    <div className="flex flex-col gap-4">
      <Callout title="Spatial locality">If one memory location is accessed, nearby locations may be accessed soon. Caches exploit this by fetching neighbours together.</Callout>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <Segmented label="CPU reads addresses" options={SPATIAL_PATTERNS} value={pattern} onChange={setPattern} />
        <Segmented
          label="Cache line size"
          options={[1, 2, 4, 8].map((n) => ({ value: n, label: n === 1 ? "1 word" : `${n} words` }))}
          value={lineSize}
          onChange={setLineSize}
        />
      </div>
      <PatternRunner
        key={`${lineSize}-${pattern}`}
        tokens={parsed.tokens}
        run={run}
        renderExtra={({ count, state }) => {
          const accessed = new Set(parsed.tokens.slice(0, count).map((t) => t.address));
          return (
            <div>
              <p className={cn(LABEL_CLASS, "mb-1.5")}>RAM addresses 96–111 · shaded bands are cache lines of {lineSize} word{lineSize === 1 ? "" : "s"}</p>
              <MemoryStrip start={96} count={16} lineSize={lineSize} cached={cachedBlocks(state.levels[0])} accessed={accessed} />
              <p className="mt-1.5 text-[11px] text-ink-soft dark:text-bone-soft">
                “used” = the CPU asked for it. “cached” = it arrived in the cache as a neighbour without being asked for — that is the spatial-locality bet.
              </p>
            </div>
          );
        }}
      />
      <Callout tone="neutral">
        With 1-word lines, no neighbours come along, so every access misses. Try 4 words: one miss brings 100–103 in together, and the next three reads hit.
      </Callout>
    </div>
  );
}

function LinesView() {
  const [lineSize, setLineSize] = useState(4);
  return (
    <div className="flex flex-col gap-4">
      <Callout title="Cache lines (blocks)">
        A cache doesn’t store one address at a time. It stores a whole <strong className="font-medium">line</strong> of neighbouring addresses. Exact line sizes vary by architecture.
      </Callout>
      <Segmented
        label="Cache line size"
        options={[2, 4, 8].map((n) => ({ value: n, label: `${n} words` }))}
        value={lineSize}
        onChange={setLineSize}
      />
      <LinesDemo key={lineSize} lineSize={lineSize} />
    </div>
  );
}

function LinesDemo({ lineSize }: { lineSize: number }) {
  const config: CacheConfig = useMemo(() => ({ ...DEFAULT_CONFIG, l1Lines: 4, lineSize }), [lineSize]);
  const { system, last, access, reset } = useLocalMachine(config);
  const level = system.levels[0]!;
  const loaded = last && !last.hit ? last.block : null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className={cn(LABEL_CLASS, "mb-1.5")}>RAM — tap an address for the CPU to request it</p>
        <MemoryStrip
          start={96}
          count={16}
          lineSize={lineSize}
          cached={cachedBlocks(level)}
          accessed={NOTHING_ACCESSED}
          requested={last?.address}
          flashBlock={loaded}
          flashKey={last?.seq}
          onPick={access}
        />
      </div>

      <div className="rounded-lg border border-dashed border-line p-3 text-center text-sm dark:border-line-dark" aria-live="polite">
        {last ? (
          <>
            <div className="mb-1 flex justify-center">
              <OutcomeBadge hit={last.hit} label={last.hit ? "HIT" : "MISS"} />
            </div>
            {last.hit ? (
              <p className="text-ink dark:text-bone">
                Address {last.address} was already inside the cached line <span className="font-mono">{formatRange(last.block, lineSize)}</span>. No trip to RAM.
              </p>
            ) : (
              <p className="text-ink dark:text-bone">
                RAM block <span className="font-mono">{formatRange(last.block, lineSize)}</span> ↓ copied into one cache line — all {lineSize} addresses arrive together.
              </p>
            )}
          </>
        ) : (
          <p className="text-ink-soft dark:text-bone-soft">Tap an address above. Then tap one of its neighbours.</p>
        )}
      </div>

      <CacheTable level={level} lineSize={lineSize} title="Cache" focus={last ? focusFor(last, "l1") : NO_FOCUS} />
      <div>
        <ActionButton variant="ghost" onClick={reset}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Empty the cache
        </ActionButton>
      </div>
    </div>
  );
}

export function LocalityLab() {
  const [view, setView] = useState<View>("temporal");
  return (
    <div className="flex flex-col gap-5">
      <Segmented
        label="Locality"
        options={[
          { value: "temporal", label: "Temporal locality" },
          { value: "spatial", label: "Spatial locality" },
          { value: "lines", label: "Cache lines" },
        ]}
        value={view}
        onChange={setView}
      />
      <Panel>{view === "temporal" ? <TemporalView /> : view === "spatial" ? <SpatialView /> : <LinesView />}</Panel>
    </div>
  );
}
