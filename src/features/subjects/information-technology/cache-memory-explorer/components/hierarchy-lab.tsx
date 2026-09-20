"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { DEFAULT_LATENCY, formatHex, levelName, type DetailLevel, type LevelId } from "../model";
import {
  HIERARCHY_NODES,
  L1_SAMPLE,
  L2_EXTRA,
  L3_EXTRA,
  NOT_JUST_FAST_RAM,
  REAL_COMPUTER_NOTES,
  SAMPLE_LOOKUPS,
  TRADEOFFS,
  WHY_CACHE_EXISTS,
  entryExplanation,
  type HierarchyNodeId,
  type SampleEntry,
  type SampleLookup,
} from "../content";
import { HierarchyDiagram, type NodeVisual } from "./hierarchy-diagram";
import { LatencyBars } from "./stats-panel";
import { Callout, LABEL_CLASS, Panel, TONE } from "./ui-bits";

function entriesFor(id: HierarchyNodeId, levelCount: 1 | 3): SampleEntry[] {
  if (levelCount === 1) return id === "l1" ? L1_SAMPLE : [];
  if (id === "l1") return L1_SAMPLE;
  if (id === "l2") return [...L1_SAMPLE, ...L2_EXTRA];
  if (id === "l3") return [...L1_SAMPLE, ...L2_EXTRA, ...L3_EXTRA];
  return [];
}

interface LookupPath {
  visuals: Partial<Record<HierarchyNodeId, NodeVisual>>;
  activeEdges: number;
  summary: string;
  total: number;
}

/** Walks one illustrative lookup down the (sample) hierarchy. */
function walkLookup(lookup: SampleLookup, levelCount: 1 | 3): LookupPath {
  const cacheIds: LevelId[] = levelCount === 1 ? ["l1"] : ["l1", "l2", "l3"];
  const visuals: Partial<Record<HierarchyNodeId, NodeVisual>> = { cpu: "active" };
  const parts: string[] = [];
  const costs: number[] = [];
  let activeEdges = 0;

  for (const id of cacheIds) {
    activeEdges += 1;
    costs.push(DEFAULT_LATENCY[id]);
    if (lookup.answeredBy === id || (levelCount === 1 && lookup.answeredBy !== "ram")) {
      visuals[id] = "hit";
      parts.push(`${levelName(id, levelCount)} has it ✓`);
      return {
        visuals,
        activeEdges,
        total: costs.reduce((a, b) => a + b, 0),
        summary: `${parts.join(" → ")} — ${costs.join(" + ")}${costs.length > 1 ? ` = ${costs.reduce((a, b) => a + b, 0)}` : ""} simulated units.`,
      };
    }
    visuals[id] = "miss";
    parts.push(`${levelName(id, levelCount)} misses ✕`);
  }

  activeEdges += 1;
  costs.push(DEFAULT_LATENCY.ram);
  visuals.ram = "source";
  parts.push("RAM supplies the data");
  const total = costs.reduce((a, b) => a + b, 0);
  return { visuals, activeEdges, total, summary: `${parts.join(" → ")} — ${costs.join(" + ")} = ${total} simulated units.` };
}

export function HierarchyLab({ level }: { level: DetailLevel }) {
  const levelCount: 1 | 3 = level === "beginner" ? 1 : 3;
  const [selectedRaw, setSelected] = useState<HierarchyNodeId>("l1");
  const [entry, setEntry] = useState<SampleEntry | null>(null);
  const [lookup, setLookup] = useState<SampleLookup | null>(null);

  const visibleIds: HierarchyNodeId[] = levelCount === 1 ? ["cpu", "l1", "ram", "storage"] : ["cpu", "l1", "l2", "l3", "ram", "storage"];
  const selected = visibleIds.includes(selectedRaw) ? selectedRaw : "l1";
  const node = HIERARCHY_NODES[selected];
  const isCache = selected === "l1" || selected === "l2" || selected === "l3";
  const holder = isCache ? levelName(selected, levelCount) : node.name;
  const entries = entriesFor(selected, levelCount);

  const lookups = levelCount === 1 ? SAMPLE_LOOKUPS.filter((l) => l.answeredBy === "l1" || l.answeredBy === "ram") : SAMPLE_LOOKUPS;
  const path = useMemo(() => (lookup ? walkLookup(lookup, levelCount) : null), [lookup, levelCount]);

  const subs = useMemo(() => {
    const subFor = (id: HierarchyNodeId) => {
      const info = HIERARCHY_NODES[id];
      const latency = info.simLatency !== null ? ` · ${info.simLatency} unit${info.simLatency === 1 ? "" : "s"}` : "";
      return `${info.size}${latency}`;
    };
    return Object.fromEntries(visibleIds.map((id) => [id, subFor(id)])) as Partial<Record<HierarchyNodeId, string>>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelCount]);

  const visuals = path ? path.visuals : {};

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Callout title="Why cache exists">{WHY_CACHE_EXISTS}</Callout>
        <Callout tone="neutral" title="Not just “faster RAM”">
          {NOT_JUST_FAST_RAM}
        </Callout>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Panel title="The memory hierarchy" aside={<span className={LABEL_CLASS}>Tap a layer</span>}>
            <HierarchyDiagram
              levelCount={levelCount}
              visuals={visuals}
              subs={subs}
              selected={selected}
              onSelect={(id) => {
                setSelected(id);
                setEntry(null);
              }}
              activeEdges={path ? path.activeEdges : 0}
              edgeDirection={path ? "down" : null}
            />
            <p className="mt-3 text-[11px] text-ink-soft dark:text-bone-soft">
              Widths hint at capacity. Latencies are <strong className="font-medium">simulation values</strong>, not real hardware figures.
            </p>
          </Panel>

          <Panel title="Try a lookup">
            <p className="mb-2 text-sm text-ink-soft dark:text-bone-soft">
              Ask the CPU for an address and watch which layer answers. These are illustrative, hand-picked contents.
            </p>
            <div className="flex flex-wrap gap-2">
              {lookups.map((l) => {
                const active = lookup?.address === l.address;
                return (
                  <button
                    key={l.address}
                    type="button"
                    onClick={() => setLookup(active ? null : l)}
                    aria-pressed={active}
                    className={cn(
                      "min-h-[44px] rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
                      active ? TONE.info : "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40",
                    )}
                  >
                    Request {formatHex(l.address)}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 min-h-[2.5rem] text-sm text-ink dark:text-bone" aria-live="polite">
              {path ? path.summary : "Pick an address above."}
            </p>
            {path ? (
              <p className="text-[11px] text-ink-soft dark:text-bone-soft">
                Each level that is checked adds its own lookup time — a simplified model.
              </p>
            ) : null}
          </Panel>
        </div>

        <div className="flex flex-col gap-4">
          <Panel title={node.name} aside={<span className={LABEL_CLASS}>{node.id === "cpu" ? "processor" : node.id === "storage" ? "below RAM" : "layer"}</span>}>
            <p className="text-sm font-medium text-ink dark:text-bone">{node.blurb}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{node.detail}</p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-line p-2 dark:border-line-dark">
                <dt className={LABEL_CLASS}>Capacity</dt>
                <dd className="mt-0.5 text-ink dark:text-bone">{node.size}</dd>
              </div>
              <div className="rounded-lg border border-line p-2 dark:border-line-dark">
                <dt className={LABEL_CLASS}>Speed</dt>
                <dd className="mt-0.5 text-ink dark:text-bone">{node.speed}</dd>
              </div>
            </dl>
            <p className="mt-2 text-[11px] text-ink-soft dark:text-bone-soft">{node.latencyNote}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink dark:text-bone">
              {node.keyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>

            {isCache && entries.length > 0 ? (
              <div className="mt-4">
                <p className={cn(LABEL_CLASS, "mb-1.5")}>Sample contents — simulated values, not from any real CPU</p>
                <div className="overflow-x-auto rounded-lg border border-line dark:border-line-dark">
                  <table className="w-full min-w-[220px] text-left text-xs">
                    <thead>
                      <tr className="border-b border-line bg-ink/[0.03] dark:border-line-dark dark:bg-bone/[0.04]">
                        <th scope="col" className="px-2.5 py-2 font-mono text-[10px] font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                          Address
                        </th>
                        <th scope="col" className="px-2.5 py-2 font-mono text-[10px] font-medium uppercase tracking-wide text-ink-soft dark:text-bone-soft">
                          Data
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((e) => {
                        const active = entry?.address === e.address;
                        return (
                          <tr key={e.address} className={cn("border-b border-line/70 last:border-b-0 dark:border-line-dark/70", active && "bg-subject-it-soft dark:bg-subject-it/20")}>
                            <td className="p-0">
                              <button type="button" onClick={() => setEntry(active ? null : e)} aria-pressed={active} className="min-h-[40px] w-full px-2.5 py-2 text-left font-mono tabular-nums text-ink dark:text-bone">
                                {formatHex(e.address)}
                              </button>
                            </td>
                            <td className="px-2.5 py-2 font-mono tabular-nums text-ink dark:text-bone">{e.data}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 min-h-[2.5rem] text-sm text-ink-soft dark:text-bone-soft" aria-live="polite">
                  {entry ? entryExplanation(entry, holder) : "Tap an address to see what a cache entry means."}
                </p>
              </div>
            ) : null}
          </Panel>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="Why the layers trade speed for size">
          <ul className="flex flex-col gap-2.5">
            {TRADEOFFS.map((t) => (
              <li key={t.title} className="text-sm">
                <p className="font-medium text-ink dark:text-bone">{t.title}</p>
                <p className="text-ink-soft dark:text-bone-soft">{t.body}</p>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="How long each layer takes">
          <LatencyBars latency={DEFAULT_LATENCY} levelCount={levelCount} />
          <p className="mt-3 text-[11px] text-ink-soft dark:text-bone-soft">
            Illustrative values that make the ratios easy to see. Real latencies depend on the processor and are usually quoted in nanoseconds or clock cycles.
          </p>
        </Panel>
      </div>

      <details className="rounded-card border border-line p-4 dark:border-line-dark">
        <summary className="cursor-pointer font-display text-base font-medium text-ink dark:text-bone">Real computers differ</summary>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink dark:text-bone">
          {REAL_COMPUTER_NOTES.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
