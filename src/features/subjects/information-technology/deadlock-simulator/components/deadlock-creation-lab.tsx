"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useStepPlayer, type PlaySpeed } from "../hooks/use-step-player";
import {
  allocate,
  findCycle,
  isCycleSufficientForDeadlock,
  makeScenario,
  requestResource,
  runDetectionAlgorithm,
  type RagState,
} from "../model";

interface ScenarioAction {
  label: string;
  apply: (s: RagState) => RagState;
}

interface CreationScenario {
  id: string;
  title: string;
  initial: RagState;
  actions: ScenarioAction[];
}

const TWO_PROCESS: CreationScenario = {
  id: "two-process",
  title: "Scenario 1 — Two processes",
  initial: makeScenario(["P1", "P2"], [{ name: "Printer", instances: 1 }, { name: "Scanner", instances: 1 }]),
  actions: [
    { label: "P1 holds Printer", apply: (s) => allocate(s, "p1", "r1") },
    { label: "P2 holds Scanner", apply: (s) => allocate(s, "p2", "r2") },
    { label: "P1 requests Scanner", apply: (s) => requestResource(s, "p1", "r2") },
    { label: "P2 requests Printer", apply: (s) => requestResource(s, "p2", "r1") },
  ],
};

const THREE_PROCESS: CreationScenario = {
  id: "three-process",
  title: "Scenario 2 — Three processes",
  initial: makeScenario(
    ["P1", "P2", "P3"],
    [{ name: "Printer", instances: 1 }, { name: "Scanner", instances: 1 }, { name: "Plotter", instances: 1 }],
  ),
  actions: [
    { label: "P1 holds Printer", apply: (s) => allocate(s, "p1", "r1") },
    { label: "P2 holds Scanner", apply: (s) => allocate(s, "p2", "r2") },
    { label: "P3 holds Plotter", apply: (s) => allocate(s, "p3", "r3") },
    { label: "P1 requests Scanner", apply: (s) => requestResource(s, "p1", "r2") },
    { label: "P2 requests Plotter", apply: (s) => requestResource(s, "p2", "r3") },
    { label: "P3 requests Printer", apply: (s) => requestResource(s, "p3", "r1") },
  ],
};

const SCENARIOS = [TWO_PROCESS, THREE_PROCESS];

export function DeadlockCreationLab() {
  const [scenarioId, setScenarioId] = useState(TWO_PROCESS.id);
  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;
  const player = useStepPlayer(scenario.actions.length);

  const state = useMemo(() => {
    let s = scenario.initial;
    for (let i = 0; i <= player.stepIndex; i++) s = scenario.actions[i]!.apply(s);
    return s;
  }, [scenario, player.stepIndex]);

  const cycle = useMemo(() => findCycle(state), [state]);
  const sufficient = isCycleSufficientForDeadlock(state, cycle);
  const detection = useMemo(() => (player.isFinished ? runDetectionAlgorithm(state) : null), [state, player.isFinished]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => setScenarioId(s.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium",
              scenarioId === s.id ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
            )}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={player.playPause} className="rounded-full border border-subject-it bg-subject-it-soft px-4 py-1.5 text-sm font-medium text-subject-it dark:bg-subject-it/20">
          {player.playLabel}
        </button>
        <button onClick={player.stepForward} disabled={player.isFinished} className="rounded-full border border-line px-4 py-1.5 text-sm font-medium text-ink disabled:opacity-40 dark:border-line-dark dark:text-bone">
          Step
        </button>
        <button onClick={player.reset} className="rounded-full border border-line px-4 py-1.5 text-sm font-medium text-ink-soft dark:border-line-dark dark:text-bone-soft">
          Reset — try a different order
        </button>
        <div className="flex items-center gap-1.5">
          {([0.5, 1, 1.5, 2] as PlaySpeed[]).map((sp) => (
            <button
              key={sp}
              onClick={() => player.setSpeed(sp)}
              className={cn("rounded-full border px-2 py-1 font-mono text-[10px]", player.speed === sp ? "border-ink dark:border-bone" : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft")}
            >
              {sp}×
            </button>
          ))}
        </div>
      </div>

      <ol className="flex flex-col gap-1.5">
        {scenario.actions.map((a, i) => (
          <li
            key={a.label}
            className={cn(
              "rounded-md border px-3 py-2 font-mono text-xs",
              i <= player.stepIndex
                ? "border-subject-it/50 bg-subject-it-soft text-ink dark:bg-subject-it/10 dark:text-bone"
                : "border-line/50 text-ink-soft/50 dark:border-line-dark/50 dark:text-bone-soft/40",
            )}
          >
            {i + 1}. {a.label}
          </li>
        ))}
      </ol>

      {player.stepIndex >= 0 && (
        <div className="flex flex-wrap gap-4">
          {state.processes.map((p) => {
            const waiting = Object.values(state.request[p.id] ?? {}).some((n) => n > 0);
            return (
              <div key={p.id} className="rounded-card border border-line bg-white/60 px-4 py-2 text-sm dark:border-line-dark dark:bg-white/[0.03]">
                <span className="font-medium text-ink dark:text-bone">{p.name}</span>
                <span className={cn("ml-2 font-mono text-xs", waiting ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400")}>
                  {waiting ? "→ waiting" : "→ running"}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {player.isFinished && detection && (
        <div
          className={cn(
            "rounded-card border p-4",
            detection.deadlockedProcessIds.length > 0
              ? "border-red-400/60 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10"
              : "border-emerald-400/60 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10",
          )}
        >
          <p className={cn("font-mono text-sm font-semibold", detection.deadlockedProcessIds.length > 0 ? "text-red-700 dark:text-red-300" : "text-emerald-700 dark:text-emerald-300")}>
            {detection.deadlockedProcessIds.length > 0 ? "DEADLOCK DETECTED" : "No deadlock — everything can still finish"}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
            {detection.deadlockedProcessIds.length > 0
              ? `${detection.deadlockedProcessIds
                  .map((id) => state.processes.find((p) => p.id === id)?.name)
                  .join(" and ")} form a closed cycle of waiting: each holds a resource the other needs, and neither will ever release it.${
                  cycle.hasCycle && !sufficient ? " Note this system also has a multi-instance resource in play elsewhere — the detection algorithm, not just the cycle, is what confirms this." : ""
                }`
              : "Every process was able to finish, in some order, without needing anything that wasn't eventually available."}
          </p>
        </div>
      )}
    </div>
  );
}
