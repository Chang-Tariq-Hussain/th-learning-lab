"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  allocate,
  availableInstances,
  findCycle,
  grantRequest,
  heldCount,
  isCycleSufficientForDeadlock,
  makeScenario,
  release,
  requestResource,
  requestedCount,
  type RagState,
} from "../model";

const MAX_PROCESSES = 4;
const MAX_RESOURCES = 4;
const PROCESS_NAMES = ["P1", "P2", "P3", "P4"];
const RESOURCE_NAMES = ["R1", "R2", "R3", "R4"];

function initialGraph(): RagState {
  return makeScenario(
    ["P1", "P2"],
    [{ name: "R1", instances: 1 }, { name: "R2", instances: 1 }],
  );
}

/** Section 4 — a small, genuinely interactive Resource Allocation
 *  Graph: add/remove processes and resources (up to four of each,
 *  which is plenty to build a cycle), request/allocate/release
 *  resources, and see the graph and its cycle status update live. */
export function ResourceGraphLab() {
  const [state, setState] = useState<RagState>(initialGraph);

  const cycle = useMemo(() => findCycle(state), [state]);
  const sufficientForDeadlock = useMemo(() => isCycleSufficientForDeadlock(state, cycle), [state, cycle]);
  const multiInstanceOnCycle = cycle.hasCycle && !sufficientForDeadlock;

  function addProcess() {
    if (state.processes.length >= MAX_PROCESSES) return;
    const id = `p${state.processes.length + 1}`;
    const name = PROCESS_NAMES[state.processes.length] ?? id.toUpperCase();
    setState((s) => ({ ...s, processes: [...s.processes, { id, name }] }));
  }

  function addResource() {
    if (state.resources.length >= MAX_RESOURCES) return;
    const id = `r${state.resources.length + 1}`;
    const name = RESOURCE_NAMES[state.resources.length] ?? id.toUpperCase();
    setState((s) => ({ ...s, resources: [...s.resources, { id, name, instances: 1 }] }));
  }

  function setInstances(resourceId: string, instances: number) {
    setState((s) => ({
      ...s,
      resources: s.resources.map((r) => (r.id === resourceId ? { ...r, instances: Math.max(1, Math.min(3, instances)) } : r)),
    }));
  }

  function resetGraph() {
    setState(initialGraph());
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={addProcess}
          disabled={state.processes.length >= MAX_PROCESSES}
          className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink disabled:opacity-40 dark:border-line-dark dark:text-bone"
        >
          + Add process
        </button>
        <button
          onClick={addResource}
          disabled={state.resources.length >= MAX_RESOURCES}
          className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink disabled:opacity-40 dark:border-line-dark dark:text-bone"
        >
          + Add resource
        </button>
        <button onClick={resetGraph} className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft dark:border-line-dark dark:text-bone-soft">
          Reset graph
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
        <GraphSvg state={state} cycle={cycle} sufficientForDeadlock={sufficientForDeadlock} />

        <div className="flex flex-col gap-4">
          <div className="rounded-card border border-line bg-white/60 p-3.5 dark:border-line-dark dark:bg-white/[0.03]">
            <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Resources</p>
            <div className="mt-2 flex flex-col gap-2">
              {state.resources.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-medium text-ink dark:text-bone">{r.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-ink-soft dark:text-bone-soft">Instances</span>
                    <button
                      onClick={() => setInstances(r.id, r.instances - 1)}
                      className="h-6 w-6 rounded-full border border-line text-xs dark:border-line-dark"
                    >
                      −
                    </button>
                    <span className="w-4 text-center font-mono text-xs">{r.instances}</span>
                    <button
                      onClick={() => setInstances(r.id, r.instances + 1)}
                      className="h-6 w-6 rounded-full border border-line text-xs dark:border-line-dark"
                    >
                      +
                    </button>
                    <span className="ml-1 text-xs text-ink-soft dark:text-bone-soft">({availableInstances(state, r.id)} free)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-line bg-white/60 p-3.5 dark:border-line-dark dark:bg-white/[0.03]">
            <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Actions</p>
            <div className="mt-2 flex flex-col gap-3">
              {state.processes.map((p) => (
                <div key={p.id} className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-ink dark:text-bone">{p.name}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {state.resources.map((r) => {
                      const held = heldCount(state, p.id, r.id);
                      const requested = requestedCount(state, p.id, r.id);
                      const free = availableInstances(state, r.id);
                      return (
                        <div key={r.id} className="flex items-center gap-1 rounded-full border border-line px-2 py-1 text-xs dark:border-line-dark">
                          <span className="font-mono text-ink-soft dark:text-bone-soft">{r.name}</span>
                          {held > 0 && (
                            <button onClick={() => setState((s) => release(s, p.id, r.id))} className="text-ink underline decoration-dotted dark:text-bone">
                              release ({held})
                            </button>
                          )}
                          {requested > 0 && (
                            <button onClick={() => setState((s) => grantRequest(s, p.id, r.id))} className="text-emerald-600 underline decoration-dotted dark:text-emerald-400">
                              grant
                            </button>
                          )}
                          {held === 0 && requested === 0 && free > 0 && (
                            <button onClick={() => setState((s) => allocate(s, p.id, r.id))} className="text-ink underline decoration-dotted dark:text-bone">
                              allocate
                            </button>
                          )}
                          {held === 0 && requested === 0 && (
                            <button onClick={() => setState((s) => requestResource(s, p.id, r.id))} className="text-amber-700 underline decoration-dotted dark:text-amber-400">
                              request
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <StatusPanel cycle={cycle} sufficientForDeadlock={sufficientForDeadlock} multiInstanceOnCycle={multiInstanceOnCycle} />
    </div>
  );
}

function StatusPanel({
  cycle,
  sufficientForDeadlock,
  multiInstanceOnCycle,
}: {
  cycle: ReturnType<typeof findCycle>;
  sufficientForDeadlock: boolean;
  multiInstanceOnCycle: boolean;
}) {
  if (!cycle.hasCycle) {
    return (
      <div className="rounded-card border border-emerald-400/60 bg-emerald-50 p-4 text-sm dark:border-emerald-500/40 dark:bg-emerald-500/10">
        <p className="font-mono font-semibold text-emerald-700 dark:text-emerald-300">No cycle in the graph</p>
        <p className="mt-1 text-ink-soft dark:text-bone-soft">Every request can, in principle, still be granted — nothing is waiting in a closed loop.</p>
      </div>
    );
  }
  if (sufficientForDeadlock) {
    return (
      <div className="rounded-card border border-red-400/60 bg-red-50 p-4 text-sm dark:border-red-500/40 dark:bg-red-500/10">
        <p className="font-mono font-semibold text-red-700 dark:text-red-300">Cycle detected — every resource on it is single-instance</p>
        <p className="mt-1 text-ink-soft dark:text-bone-soft">
          With single-instance resources, a cycle is sufficient proof of deadlock: none of the waiting processes on the cycle
          can ever be released.
        </p>
      </div>
    );
  }
  return (
    <div className="rounded-card border border-amber-400/60 bg-amber-50 p-4 text-sm dark:border-amber-500/40 dark:bg-amber-500/10">
      <p className="font-mono font-semibold text-amber-700 dark:text-amber-300">Cycle detected — but a multi-instance resource is on it</p>
      <p className="mt-1 text-ink-soft dark:text-bone-soft">
        {multiInstanceOnCycle
          ? "A cycle alone does not prove deadlock when a resource type has more than one instance — another process not on the cycle may still release an instance that breaks the wait. Run the Detection tab to check for certain."
          : ""}
      </p>
    </div>
  );
}

function GraphSvg({
  state,
  cycle,
  sufficientForDeadlock,
}: {
  state: RagState;
  cycle: ReturnType<typeof findCycle>;
  sufficientForDeadlock: boolean;
}) {
  const width = 340;
  const height = 260;
  const procX = 60;
  const resX = width - 60;

  const procY = (i: number) => 40 + i * ((height - 80) / Math.max(1, state.processes.length - 1 || 1));
  const resY = (i: number) => 40 + i * ((height - 80) / Math.max(1, state.resources.length - 1 || 1));

  const procPos = new Map(state.processes.map((p, i) => [p.id, { x: procX, y: state.processes.length === 1 ? height / 2 : procY(i) }]));
  const resPos = new Map(state.resources.map((r, i) => [r.id, { x: resX, y: state.resources.length === 1 ? height / 2 : resY(i) }]));

  const onCycle = (id: string) => cycle.cycleNodes.includes(id);
  const edgeColor = sufficientForDeadlock ? "stroke-red-500" : "stroke-amber-500";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full rounded-card border border-line bg-paper dark:border-line-dark dark:bg-chalkboard" role="img" aria-label="Resource Allocation Graph">
      <defs>
        <marker id="rag-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="fill-ink/50 dark:fill-bone/50" />
        </marker>
        <marker id="rag-arrow-cycle" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className={sufficientForDeadlock ? "fill-red-500" : "fill-amber-500"} />
        </marker>
      </defs>

      {/* Edges: allocation R->P (solid), request P->R (dashed) */}
      {state.processes.map((p) =>
        state.resources.map((r) => {
          const held = heldCount(state, p.id, r.id);
          const requested = requestedCount(state, p.id, r.id);
          const pp = procPos.get(p.id)!;
          const rp = resPos.get(r.id)!;
          const edgeOnCycle = onCycle(p.id) && onCycle(r.id);
          return (
            <g key={`${p.id}-${r.id}`}>
              {held > 0 && (
                <line
                  x1={rp.x - 24}
                  y1={rp.y}
                  x2={pp.x + 22}
                  y2={pp.y}
                  strokeWidth={edgeOnCycle ? 2.4 : 1.4}
                  className={edgeOnCycle ? edgeColor : "stroke-emerald-600/70"}
                  markerEnd={edgeOnCycle ? "url(#rag-arrow-cycle)" : "url(#rag-arrow)"}
                />
              )}
              {requested > 0 && (
                <line
                  x1={pp.x + 22}
                  y1={pp.y}
                  x2={rp.x - 24}
                  y2={rp.y}
                  strokeDasharray="4 3"
                  strokeWidth={edgeOnCycle ? 2.4 : 1.4}
                  className={edgeOnCycle ? edgeColor : "stroke-ink/40 dark:stroke-bone/40"}
                  markerEnd={edgeOnCycle ? "url(#rag-arrow-cycle)" : "url(#rag-arrow)"}
                />
              )}
            </g>
          );
        }),
      )}

      {/* Process nodes */}
      {state.processes.map((p) => {
        const pos = procPos.get(p.id)!;
        return (
          <g key={p.id}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r="22"
              className={cn(
                "fill-subject-it-soft dark:fill-subject-it/15",
                onCycle(p.id) ? (sufficientForDeadlock ? "stroke-red-500" : "stroke-amber-500") : "stroke-subject-it",
              )}
              strokeWidth={onCycle(p.id) ? 2.4 : 1.5}
            />
            <text x={pos.x} y={pos.y + 4} textAnchor="middle" className="fill-ink font-mono text-[10px] font-medium dark:fill-bone">
              {p.name}
            </text>
          </g>
        );
      })}

      {/* Resource nodes */}
      {state.resources.map((r) => {
        const pos = resPos.get(r.id)!;
        return (
          <g key={r.id}>
            <rect
              x={pos.x - 26}
              y={pos.y - 18}
              width="52"
              height="36"
              rx="6"
              className={cn(
                "fill-none",
                onCycle(r.id) ? (sufficientForDeadlock ? "stroke-red-500" : "stroke-amber-500") : "stroke-ink/60 dark:stroke-bone/60",
              )}
              strokeWidth={onCycle(r.id) ? 2.4 : 1.5}
            />
            <text x={pos.x} y={pos.y - 2} textAnchor="middle" className="fill-ink font-mono text-[9px] dark:fill-bone">
              {r.name}
            </text>
            <text x={pos.x} y={pos.y + 11} textAnchor="middle" className="fill-ink-soft font-mono text-[7.5px] dark:fill-bone-soft">
              ×{r.instances}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
