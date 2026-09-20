"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ADDRESS_MAX,
  MAPPING_LABELS,
  POLICY_DESCRIPTIONS,
  POLICY_LABELS,
  accessSystem,
  atLeast,
  buildTrace,
  formatHex,
  formatRange,
  levelName,
  seededAddresses,
  summarize,
  unitsLabel,
  type AccessResult,
  type CacheConfig,
  type DetailLevel,
  type Mapping,
  type Policy,
  type Servicer,
  type SystemState,
  type TraceStep,
} from "../model";
import { SIMPLIFIED_LOOKUP_NOTE, TIMING_DISCLAIMER, type HierarchyNodeId } from "../content";
import { HierarchyDiagram, type NodeVisual } from "./hierarchy-diagram";
import { CacheTable, NO_FOCUS, focusFor } from "./cache-table";
import { LatencyBars, LatencyBreakdown, StatsPanel } from "./stats-panel";
import { ActionButton, Callout, ChipStrip, LABEL_CLASS, OutcomeBadge, Panel, Segmented } from "./ui-bits";

export interface AccessMachine {
  system: SystemState;
  history: AccessResult[];
}

export interface AccessPrefs {
  l1Lines: number;
  lineSize: number;
  mapping: Mapping;
  policy: Policy;
}

type Speed = "slow" | "normal" | "instant";
const STEP_MS: Record<Exclude<Speed, "instant">, number> = { slow: 1100, normal: 650 };

interface Animation {
  trace: TraceStep[];
  index: number;
  /** Machine as it was *before* this access — shown until the data arrives. */
  before: AccessMachine;
}

const nodeId = (id: TraceStep["node"]): HierarchyNodeId => (id === "cpu" ? "cpu" : id);

function edgePosition(id: Servicer | "cpu", levelCount: 1 | 3): number {
  if (id === "cpu") return 0;
  if (id === "ram") return levelCount + 1;
  return id === "l1" ? 1 : id === "l2" ? 2 : 3;
}

/** Folds the trace up to `index` into per-node visuals and connector state. */
function foldTrace(trace: TraceStep[], index: number, levelCount: 1 | 3) {
  const visuals: Partial<Record<HierarchyNodeId, NodeVisual>> = {};
  let edges = 0;
  let direction: "down" | "up" | null = null;
  for (let i = 0; i <= index && i < trace.length; i++) {
    const step = trace[i]!;
    const id = nodeId(step.node);
    switch (step.phase) {
      case "request":
        visuals.cpu = "active";
        edges = 0;
        direction = null;
        break;
      case "check":
        visuals[id] = "checking";
        edges = edgePosition(step.node, levelCount);
        direction = "down";
        break;
      case "hit":
        visuals[id] = "hit";
        break;
      case "miss":
        visuals[id] = "miss";
        break;
      case "ram":
        visuals.ram = "source";
        edges = edgePosition("ram", levelCount);
        direction = "down";
        break;
      case "fill":
        visuals[id] = "stored";
        edges = edgePosition(step.node, levelCount);
        direction = "up";
        break;
      case "return":
        visuals.cpu = "active";
        direction = "up";
        break;
    }
  }
  return { visuals, edges, direction };
}

function parseAddress(raw: string): { value: number | null; error: string | null } {
  const trimmed = raw.trim();
  if (trimmed === "") return { value: null, error: "Enter a memory address." };
  if (!/^\d+$/.test(trimmed)) return { value: null, error: "Use a whole number, for example 100." };
  const value = Number(trimmed);
  if (value > ADDRESS_MAX) return { value: null, error: `Addresses in this lab run from 0 to ${ADDRESS_MAX}.` };
  return { value, error: null };
}

const CACHE_SIZE_OPTIONS = [2, 4, 8].map((n) => ({ value: n, label: `${n} lines` }));
const LINE_SIZE_OPTIONS = [1, 2, 4, 8].map((n) => ({ value: n, label: n === 1 ? "1 word" : `${n} words` }));

export function AccessLab({
  level,
  config,
  machine,
  prefs,
  onPrefsChange,
  onAccess,
  onReset,
}: {
  level: DetailLevel;
  config: CacheConfig;
  machine: AccessMachine;
  prefs: AccessPrefs;
  onPrefsChange: (patch: Partial<AccessPrefs>) => void;
  onAccess: (next: SystemState, result: AccessResult) => void;
  onReset: () => void;
}) {
  const helpId = useId();
  const [input, setInput] = useState("100");
  const [speed, setSpeed] = useState<Speed>("normal");
  const [anim, setAnim] = useState<Animation | null>(null);

  const levelCount = config.levelCount;
  const parsed = parseAddress(input);

  // A settings change clears the machine upstream; drop any animation of the old one.
  useEffect(() => {
    setAnim(null);
  }, [config]);

  useEffect(() => {
    if (!anim || anim.index >= anim.trace.length - 1 || speed === "instant") return;
    const id = setTimeout(() => {
      setAnim((a) => (a ? { ...a, index: Math.min(a.index + 1, a.trace.length - 1) } : a));
    }, STEP_MS[speed]);
    return () => clearTimeout(id);
  }, [anim, speed]);

  const animating = anim !== null && anim.index < anim.trace.length - 1;
  const shown = anim && animating ? anim.before : machine;
  const lastResult = shown.history[shown.history.length - 1];
  const settled = !animating;
  const summary = useMemo(() => summarize(shown.system.stats), [shown.system.stats]);

  const run = (address: number) => {
    const { next, result } = accessSystem(machine.system, address);
    const trace = buildTrace(result, config);
    onAccess(next, result);
    setInput(String(address));
    setAnim({ trace, index: speed === "instant" ? trace.length - 1 : 0, before: machine });
  };

  const lastAddress = machine.history[machine.history.length - 1]?.address;
  const folded = anim ? foldTrace(anim.trace, anim.index, levelCount) : { visuals: {}, edges: 0, direction: null };
  const caption = anim ? anim.trace[anim.index]?.text : "Enter an address and press Access. The CPU will look for it in the cache first.";

  const subs = useMemo(() => {
    const out: Partial<Record<HierarchyNodeId, string>> = { cpu: "requests data", ram: `${config.latency.ram} units`, storage: "not used here" };
    for (const lvl of machine.system.levels) out[lvl.id] = `${lvl.lines} lines · ${config.latency[lvl.id]} unit${config.latency[lvl.id] === 1 ? "" : "s"}`;
    return out;
  }, [machine.system.levels, config.latency]);

  const evictedNote =
    settled && lastResult && lastResult.fills.some((f) => f.evictedBlock !== null)
      ? "Cache was full in that spot — an existing line had to be replaced."
      : null;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        {level === "beginner"
          ? "Ask the CPU for a memory address. The first request misses and goes to RAM; ask for the same address again and the cache answers."
          : level === "intermediate"
            ? "Request addresses and see which level answers. Nearby addresses arrive together in a cache line, and a full cache must evict."
            : "Same lab, with the mapping and replacement policy under your control. Direct-mapped caches can conflict; policies decide who gets evicted."}
      </p>

      <Panel>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className={LABEL_CLASS}>Memory address (0–{ADDRESS_MAX})</span>
              <input
                type="text"
                inputMode="numeric"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && parsed.value !== null) run(parsed.value);
                }}
                aria-invalid={parsed.error !== null}
                aria-describedby={helpId}
                className="h-11 w-32 rounded-lg border border-line bg-transparent px-3 font-mono text-base text-ink dark:border-line-dark dark:text-bone"
              />
            </label>
            <ActionButton onClick={() => parsed.value !== null && run(parsed.value)} disabled={parsed.value === null}>
              Access memory
            </ActionButton>
            <ActionButton variant="ghost" disabled={lastAddress === undefined} onClick={() => lastAddress !== undefined && run(lastAddress)}>
              Same address again
            </ActionButton>
            <ActionButton variant="ghost" onClick={() => run(Math.min(ADDRESS_MAX, (lastAddress ?? Number(parsed.value ?? 99)) + 1))}>
              Next address
            </ActionButton>
            <ActionButton variant="ghost" onClick={() => run(seededAddresses(machine.system.clock * 31 + 5, 1)[0] ?? 0)}>
              Random address
            </ActionButton>
            <ActionButton
              variant="ghost"
              onClick={() => {
                onReset();
                setAnim(null);
              }}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset cache
            </ActionButton>
          </div>
          <p id={helpId} className={cn("text-xs", parsed.error ? "text-rose-700 dark:text-rose-300" : "text-ink-soft dark:text-bone-soft")}>
            {parsed.error ?? `Address ${parsed.value} is ${formatHex(parsed.value ?? 0)} in hex.`}
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-3 dark:border-line-dark">
            <Segmented label="Cache size" options={CACHE_SIZE_OPTIONS} value={prefs.l1Lines} onChange={(v) => onPrefsChange({ l1Lines: v })} />
            {atLeast(level, "intermediate") ? (
              <Segmented label="Cache line size" options={LINE_SIZE_OPTIONS} value={prefs.lineSize} onChange={(v) => onPrefsChange({ lineSize: v })} />
            ) : null}
            {atLeast(level, "technical") ? (
              <>
                <Segmented
                  label="Mapping"
                  options={(Object.keys(MAPPING_LABELS) as Mapping[]).map((m) => ({ value: m, label: MAPPING_LABELS[m] }))}
                  value={prefs.mapping}
                  onChange={(v) => onPrefsChange({ mapping: v })}
                />
                <Segmented
                  label="Replacement policy"
                  options={(Object.keys(POLICY_LABELS) as Policy[]).map((p) => ({ value: p, label: POLICY_LABELS[p], hint: POLICY_DESCRIPTIONS[p] }))}
                  value={prefs.policy}
                  onChange={(v) => onPrefsChange({ policy: v })}
                />
              </>
            ) : null}
            <Segmented
              label="Animation"
              options={[
                { value: "slow", label: "Slow" },
                { value: "normal", label: "Normal" },
                { value: "instant", label: "Instant" },
              ]}
              value={speed}
              onChange={setSpeed}
            />
          </div>
          <p className="text-[11px] text-ink-soft dark:text-bone-soft">Changing cache settings empties the cache and clears the statistics.</p>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <Panel title="CPU → cache → RAM">
          <HierarchyDiagram levelCount={levelCount} visuals={folded.visuals} subs={subs} activeEdges={folded.edges} edgeDirection={folded.direction} />
          <p className="cme-slide mt-3 min-h-[3rem] rounded-lg bg-ink/[0.04] p-2.5 text-sm text-ink dark:bg-bone/[0.06] dark:text-bone" key={anim ? anim.index : "idle"} aria-live="polite">
            {caption}
          </p>
          <p className="mt-2 text-[11px] text-ink-soft dark:text-bone-soft">{SIMPLIFIED_LOOKUP_NOTE}</p>
        </Panel>

        <div className="flex flex-col gap-5">
          <Panel title="Result of the last access">
            {lastResult && settled ? (
              <div className="flex flex-col gap-3" aria-live="polite">
                <div className="flex flex-wrap items-center gap-2">
                  <OutcomeBadge hit={lastResult.hit} label={lastResult.hit ? "CACHE HIT" : "CACHE MISS"} />
                  <span className="text-sm text-ink dark:text-bone">
                    {lastResult.hit
                      ? lastResult.foundAt === "l1"
                        ? "Access completed from cache."
                        : `${levelName("l1", levelCount)} missed, but ${levelName(lastResult.foundAt, levelCount)} had it.`
                      : "Data returned from RAM and the cache was updated."}
                  </span>
                </div>
                <dl className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                  {[
                    ["Address", `${lastResult.address} (${formatHex(lastResult.address)})`],
                    ["Data", String(lastResult.data)],
                    ["Result", lastResult.hit ? "Hit" : "Miss"],
                    ["Served by", levelName(lastResult.foundAt, levelCount)],
                    ["Simulated latency", unitsLabel(lastResult.latency)],
                    ...(config.lineSize > 1 ? [["Cache line", formatRange(lastResult.block, config.lineSize)]] : []),
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-lg border border-line p-2 dark:border-line-dark">
                      <dt className={LABEL_CLASS}>{k}</dt>
                      <dd className="mt-0.5 font-mono text-sm tabular-nums text-ink dark:text-bone">{v}</dd>
                    </div>
                  ))}
                </dl>
                <LatencyBreakdown parts={lastResult.latencyParts} levelCount={levelCount} />
                {evictedNote ? <Callout tone="miss">{evictedNote}</Callout> : null}
              </div>
            ) : (
              <p className="text-sm text-ink-soft dark:text-bone-soft">{animating ? "Watching the request travel…" : "No access yet. Press “Access memory”."}</p>
            )}
          </Panel>

          <Panel title="Live statistics">
            <StatsPanel summary={summary} stats={shown.system.stats} levelCount={levelCount} showBreakdown={atLeast(level, "intermediate")} showEvictions={atLeast(level, "intermediate")} />
            <p className="mt-2 text-[11px] text-ink-soft dark:text-bone-soft">{TIMING_DISCLAIMER}</p>
          </Panel>
        </div>
      </div>

      <Panel title="Cache contents">
        <div className="flex flex-col gap-4">
          {shown.system.levels.map((lvl, i) => (
            <CacheTable
              key={lvl.id}
              level={lvl}
              lineSize={config.lineSize}
              title={levelName(lvl.id, levelCount)}
              focus={settled ? focusFor(lastResult, lvl.id) : NO_FOCUS}
              variant={i === 0 ? "table" : "grid"}
            />
          ))}
        </div>
        <p className="mt-3 text-[11px] text-ink-soft dark:text-bone-soft">
          Green rows were just loaded or just hit; a struck-through range was evicted to make room. Data values are simulated.
        </p>
      </Panel>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="Recent accesses">
          <ChipStrip items={shown.history.slice(-40).map((r) => ({ label: String(r.address), hit: r.hit }))} emptyText="Accesses will appear here as ✓ hit or ✕ miss." />
        </Panel>
        <Panel title="Cost of each layer">
          <LatencyBars latency={config.latency} levelCount={levelCount} showStorage={false} />
        </Panel>
      </div>
    </div>
  );
}
