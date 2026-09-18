"use client";

import { Fragment, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useStepPlayer } from "../hooks/use-step-player";
import {
  BANKER_SAFE_EXAMPLE,
  computeAvailable,
  computeNeed,
  evaluateRequest,
  runSafetyAlgorithm,
} from "../model";

const DECISION_STYLE: Record<string, { label: string; tone: "safe" | "warn" | "danger" }> = {
  granted: { label: "GRANTED", tone: "safe" },
  "deferred-unsafe": { label: "DEFERRED — would be unsafe", tone: "warn" },
  "denied-exceeds-need": { label: "DENIED — exceeds declared Need", tone: "danger" },
  "denied-exceeds-available": { label: "DENIED — not enough Available", tone: "danger" },
};

/** Sections 6, 7, 8 — Safe vs unsafe states, the Banker's Algorithm
 *  safety check, and the resource request experiment, all against the
 *  one textbook-standard example (5 processes, 3 resource types). */
export function BankersAlgorithmLab() {
  const banker = BANKER_SAFE_EXAMPLE;
  const need = useMemo(() => computeNeed(banker), [banker]);
  const available = useMemo(() => computeAvailable(banker), [banker]);
  const safety = useMemo(() => runSafetyAlgorithm(banker), [banker]);
  const player = useStepPlayer(safety.steps.length);

  const [requestProcessId, setRequestProcessId] = useState(banker.processes[0]!.id);
  const [requestVector, setRequestVector] = useState<Record<string, number>>(
    Object.fromEntries(banker.resources.map((r) => [r.id, 0])),
  );
  const [evaluation, setEvaluation] = useState<ReturnType<typeof evaluateRequest> | null>(null);

  function runRequest() {
    setEvaluation(evaluateRequest(banker, requestProcessId, requestVector));
  }

  function loadClassicExample() {
    setRequestProcessId("p2");
    setRequestVector({ r1: 1, r2: 0, r3: 2 });
    setEvaluation(evaluateRequest(banker, "p2", { r1: 1, r2: 0, r3: 2 }));
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="font-display text-lg font-medium text-ink dark:text-bone">Safe vs unsafe vs deadlocked</h3>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          <StateCard tone="safe" title="Safe state" body="At least one order exists in which every process can finish, one at a time, given enough resources." />
          <StateCard tone="warn" title="Unsafe state" body="No such order can be guaranteed in advance — but an unsafe state has not necessarily deadlocked yet." />
          <StateCard tone="danger" title="Deadlocked state" body="Processes are already stuck in a closed wait cycle — confirmed, not just possible." />
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg font-medium text-ink dark:text-bone">Available · Max · Allocation · Need</h3>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          Need = Maximum − Allocation. Five processes, three resource types (A, B, C).
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-xs">
            <thead>
              <tr className="text-left text-ink-soft dark:text-bone-soft">
                <th className="p-2 font-mono">Process</th>
                {banker.resources.map((r) => (
                  <th key={r.id} colSpan={3} className="p-2 text-center font-mono">{r.name}</th>
                ))}
              </tr>
              <tr className="text-ink-soft/70 dark:text-bone-soft/70">
                <th className="p-2" />
                {banker.resources.map((r) => (
                  <Fragment key={r.id}>
                    <th className="p-1 text-center font-mono font-normal">Alloc</th>
                    <th className="p-1 text-center font-mono font-normal">Max</th>
                    <th className="p-1 text-center font-mono font-normal">Need</th>
                  </Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {banker.processes.map((p) => (
                <tr key={p.id} className="border-t border-line/50 dark:border-line-dark/50">
                  <td className="p-2 font-medium text-ink dark:text-bone">{p.name}</td>
                  {banker.resources.map((r) => (
                    <Fragment key={r.id}>
                      <td className="p-1 text-center font-mono">{banker.allocation[p.id]?.[r.id] ?? 0}</td>
                      <td className="p-1 text-center font-mono">{banker.max[p.id]?.[r.id] ?? 0}</td>
                      <td className="p-1 text-center font-mono font-semibold text-subject-it">{need[p.id]?.[r.id] ?? 0}</td>
                    </Fragment>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-line dark:border-line-dark">
                <td className="p-2 font-medium text-ink dark:text-bone">Available</td>
                {banker.resources.map((r) => (
                  <td key={r.id} colSpan={3} className="p-1 text-center font-mono font-semibold">{available[r.id]}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg font-medium text-ink dark:text-bone">Step through the safety algorithm</h3>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button onClick={player.playPause} className="rounded-full border border-subject-it bg-subject-it-soft px-4 py-1.5 text-sm font-medium text-subject-it dark:bg-subject-it/20">
            {player.playLabel}
          </button>
          <button onClick={player.stepForward} disabled={player.isFinished} className="rounded-full border border-line px-4 py-1.5 text-sm font-medium text-ink disabled:opacity-40 dark:border-line-dark dark:text-bone">
            Step
          </button>
          <button onClick={player.reset} className="rounded-full border border-line px-4 py-1.5 text-sm font-medium text-ink-soft dark:border-line-dark dark:text-bone-soft">
            Reset
          </button>
        </div>

        <ol className="mt-3 flex flex-col gap-1.5">
          {safety.steps.map((step, i) => {
            const pName = banker.processes.find((p) => p.id === step.processId)?.name;
            const active = i <= player.stepIndex;
            return (
              <li key={step.processId} className={cn("rounded-md border px-3 py-2 font-mono text-xs", active ? "border-subject-it/50 bg-subject-it-soft text-ink dark:bg-subject-it/10 dark:text-bone" : "border-line/50 text-ink-soft/50 dark:border-line-dark/50 dark:text-bone-soft/40")}>
                Need({pName}) ≤ Available → finish {pName}, release its allocation → Available becomes [
                {banker.resources.map((r) => step.availableAfter[r.id]).join(", ")}]
              </li>
            );
          })}
        </ol>

        {player.isFinished && (
          <div className="mt-3 rounded-card border border-emerald-400/60 bg-emerald-50 p-3.5 text-sm dark:border-emerald-500/40 dark:bg-emerald-500/10">
            <p className="font-mono font-semibold text-emerald-700 dark:text-emerald-300">Safe sequence found</p>
            <p className="mt-1 text-ink-soft dark:text-bone-soft">
              {safety.sequence.map((id) => banker.processes.find((p) => p.id === id)?.name).join(" → ")}
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-display text-lg font-medium text-ink dark:text-bone">Resource request experiment</h3>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-soft dark:text-bone-soft">
          Pick a process and a request. The algorithm checks Request ≤ Need, then Request ≤ Available, then pretends to grant
          it and re-runs the safety test before actually deciding.
        </p>

        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs">
            <span className="font-mono uppercase tracking-wide text-ink-soft dark:text-bone-soft">Process</span>
            <select
              value={requestProcessId}
              onChange={(e) => setRequestProcessId(e.target.value)}
              className="rounded-md border border-line bg-paper px-2 py-1.5 text-sm dark:border-line-dark dark:bg-chalkboard"
            >
              {banker.processes.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>
          {banker.resources.map((r) => (
            <label key={r.id} className="flex flex-col gap-1 text-xs">
              <span className="font-mono uppercase tracking-wide text-ink-soft dark:text-bone-soft">Request {r.name}</span>
              <input
                type="number"
                min={0}
                max={9}
                value={requestVector[r.id]}
                onChange={(e) => setRequestVector((v) => ({ ...v, [r.id]: Math.max(0, Number(e.target.value) || 0) }))}
                className="w-16 rounded-md border border-line bg-paper px-2 py-1.5 text-sm dark:border-line-dark dark:bg-chalkboard"
              />
            </label>
          ))}
          <button onClick={runRequest} className="rounded-full border border-subject-it bg-subject-it-soft px-4 py-1.5 text-sm font-medium text-subject-it dark:bg-subject-it/20">
            Test request
          </button>
          <button onClick={loadClassicExample} className="rounded-full border border-line px-4 py-1.5 text-xs text-ink-soft dark:border-line-dark dark:text-bone-soft">
            Load classic example (P2 requests 1,0,2)
          </button>
        </div>

        {evaluation && (
          <div className={cn("mt-3 rounded-card border p-4", toneClasses(DECISION_STYLE[evaluation.evaluation.decision]!.tone))}>
            <p className="font-mono text-sm font-semibold">{DECISION_STYLE[evaluation.evaluation.decision]!.label}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft dark:text-bone-soft">{evaluation.evaluation.reason}</p>
            {evaluation.evaluation.resultingSafety && (
              <p className="mt-2 font-mono text-xs text-ink-soft dark:text-bone-soft">
                {evaluation.evaluation.resultingSafety.safe
                  ? `Resulting safe sequence: ${evaluation.evaluation.resultingSafety.sequence.map((id) => banker.processes.find((p) => p.id === id)?.name).join(" → ")}`
                  : "No completion sequence exists for the resulting state."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function toneClasses(tone: "safe" | "warn" | "danger") {
  if (tone === "safe") return "border-emerald-400/60 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300";
  if (tone === "warn") return "border-amber-400/60 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300";
  return "border-red-400/60 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300";
}

function StateCard({ tone, title, body }: { tone: "safe" | "warn" | "danger"; title: string; body: string }) {
  return (
    <div className={cn("rounded-card border p-3.5", toneClasses(tone))}>
      <p className="font-mono text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-ink-soft dark:text-bone-soft">{body}</p>
    </div>
  );
}
