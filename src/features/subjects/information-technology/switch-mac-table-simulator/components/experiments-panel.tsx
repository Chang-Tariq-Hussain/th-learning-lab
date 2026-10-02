"use client";

import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import type { SwitchLab } from "../hooks/use-switch-lab";
import { AGING_TIMEOUT_SEC, deviceById, formatPort, type DeviceId, type DstChoice } from "../model";

type ExperimentItem =
  | { kind: "send"; src: DeviceId; dst: DstChoice; label: string }
  | { kind: "action"; action: "clear-table" | "skip" | "port-down-2" | "port-up-2"; label: string };

export interface Experiment {
  id: string;
  title: string;
  goal: string;
  /** "fresh" empties the table, brings every port up and clears the log; "keep" leaves the lab as it is. */
  setup: "fresh" | "keep";
  items: ExperimentItem[];
  expect: string[];
}

export const EXPERIMENTS: Experiment[] = [
  {
    id: "first-frame",
    title: "1 · First frame",
    goal: "See what a brand-new switch does with a frame for a device it has never heard from.",
    setup: "fresh",
    items: [{ kind: "send", src: "A", dst: "B", label: "PC-A sends a frame to PC-B" }],
    expect: ["PC-A’s source MAC is learned on Fa0/1.", "PC-B’s MAC is not in the table → destination unknown.", "Unknown unicast: the frame is flooded out Fa0/2–Fa0/5, but not back out Fa0/1."],
  },
  {
    id: "second-frame",
    title: "2 · Second frame",
    goal: "Watch a destination go from unknown to known, and the behaviour change from flooding to single-port forwarding.",
    setup: "fresh",
    items: [
      { kind: "send", src: "A", dst: "B", label: "PC-A sends to PC-B (flooded — B is unknown)" },
      { kind: "send", src: "B", dst: "A", label: "PC-B replies to PC-A (the switch learns PC-B)" },
      { kind: "send", src: "A", dst: "B", label: "PC-A sends to PC-B again" },
    ],
    expect: ["The reply is a known unicast: PC-A was learned in step 1, so it goes out Fa0/1 only.", "Step 3: destination found → forwarded out Fa0/2 only. PC-C, PC-D and PC-E get no copy."],
  },
  {
    id: "broadcast",
    title: "3 · Broadcast",
    goal: "Compare a broadcast with a known unicast. Keeps whatever the switch has already learned.",
    setup: "keep",
    items: [{ kind: "send", src: "A", dst: "broadcast", label: "PC-A sends a broadcast (FF:FF:FF:FF:FF:FF)" }],
    expect: ["Broadcast → flood out every port except Fa0/1; every PC accepts it.", "FF:FF:FF:FF:FF:FF never appears in the table — only source addresses are learned."],
  },
  {
    id: "clear-table",
    title: "4 · Clear the MAC table",
    goal: "Make the switch forget everything and watch it relearn.",
    setup: "fresh",
    items: [
      { kind: "send", src: "A", dst: "B", label: "PC-A sends to PC-B" },
      { kind: "send", src: "B", dst: "A", label: "PC-B replies — two entries now" },
      { kind: "action", action: "clear-table", label: "Clear MAC table" },
      { kind: "send", src: "A", dst: "B", label: "PC-A sends to PC-B again" },
      { kind: "send", src: "B", dst: "A", label: "PC-B replies — both learned again" },
    ],
    expect: ["After clearing, the table is empty.", "Step 4 floods again even though PC-B was known a moment ago, and only PC-A is relearned.", "Step 5: PC-B is learned again — the table is rebuilt purely from traffic."],
  },
  {
    id: "aging",
    title: "5 · MAC aging",
    goal: "Let entries expire and see known unicast turn back into unknown unicast.",
    setup: "fresh",
    items: [
      { kind: "send", src: "A", dst: "B", label: "PC-A sends to PC-B" },
      { kind: "send", src: "B", dst: "A", label: "PC-B replies — both learned" },
      { kind: "action", action: "skip", label: `Fast-forward ${AGING_TIMEOUT_SEC} s` },
      { kind: "send", src: "A", dst: "B", label: "PC-A sends to PC-B again" },
    ],
    expect: [`Both entries pass ${AGING_TIMEOUT_SEC} s with no traffic and expire (see the log and the table notice).`, "Step 4 is unknown unicast → flood, although the same frame was forwarded to one port before.", "Tip: raise the MAC aging speed instead and watch the age bars fill."],
  },
  {
    id: "disconnect",
    title: "6 · Disconnect a port",
    goal: "Unplug PC-B and see how the switch behaves when a destination port is down.",
    setup: "fresh",
    items: [
      { kind: "send", src: "A", dst: "B", label: "PC-A sends to PC-B" },
      { kind: "send", src: "B", dst: "A", label: "PC-B replies — PC-B is learned on Fa0/2" },
      { kind: "action", action: "port-down-2", label: "Disable Fa0/2 (unplug PC-B)" },
      { kind: "send", src: "A", dst: "B", label: "PC-A sends to PC-B again" },
      { kind: "action", action: "port-up-2", label: "Enable Fa0/2 (plug PC-B back in)" },
    ],
    expect: ["Link down: the switch removes PC-B’s entry.", "Step 4: PC-B is unknown again, so the frame is flooded to Fa0/3–Fa0/5 only — never out the dead port — and nobody accepts it.", "After re-plugging, PC-B must send something before the switch relearns it."],
  },
];

const BTN = "inline-flex min-h-[40px] items-center rounded-full border px-3.5 py-1.5 text-left text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";

export function ExperimentsPanel({ lab, activeId, onStart, onSend }: { lab: SwitchLab; activeId: string | null; onStart: (e: Experiment) => void; onSend: (src: DeviceId, dst: DstChoice) => void }) {
  const { state, inFlight } = lab;

  function runAction(a: Extract<ExperimentItem, { kind: "action" }>["action"]) {
    if (a === "clear-table") lab.clearTable();
    else if (a === "skip") lab.skip(AGING_TIMEOUT_SEC);
    else if (a === "port-down-2") lab.setPort(2, false);
    else lab.setPort(2, true);
  }

  function actionDisabled(a: Extract<ExperimentItem, { kind: "action" }>["action"]): boolean {
    if (inFlight) return true;
    if (a === "clear-table" || a === "skip") return state.table.length === 0;
    if (a === "port-down-2") return state.enabled[2] === false;
    return state.enabled[2] !== false;
  }

  return (
    <Panel title="Guided experiments">
      <p className="mb-3 text-xs text-ink-soft dark:text-bone-soft">Start an experiment, then press its buttons in order. Each one sends a real frame (or changes the lab) so you can watch the result in the diagram, the MAC table and the log.</p>
      <div className="grid gap-3 lg:grid-cols-2">
        {EXPERIMENTS.map((exp) => {
          const active = activeId === exp.id;
          return (
            <section key={exp.id} aria-label={exp.title} className={cn("rounded-xl border p-3", active ? "border-subject-it bg-subject-it-soft/40 dark:bg-subject-it/10" : "border-line dark:border-line-dark")}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="font-display text-base font-medium text-ink dark:text-bone">{exp.title}</h4>
                  <p className="mt-0.5 text-xs text-ink-soft dark:text-bone-soft">{exp.goal}</p>
                </div>
                <button type="button" onClick={() => onStart(exp)} className={cn(BTN, active ? "border-line text-ink dark:border-line-dark dark:text-bone" : "border-subject-it bg-subject-it text-paper hover:opacity-90")}>
                  {active ? "Restart" : exp.setup === "fresh" ? "Start (fresh lab)" : "Start"}
                </button>
              </div>

              {active && (
                <div className="mt-3 flex flex-col gap-3">
                  <ol className="flex flex-col gap-2">
                    {exp.items.map((it, i) => (
                      <li key={`${exp.id}-${i}`} className="flex items-start gap-2">
                        <span className="mt-2 w-5 shrink-0 text-right font-mono text-xs text-ink-soft dark:text-bone-soft">{i + 1}.</span>
                        {it.kind === "send" ? (
                          <button
                            type="button"
                            className={cn(BTN, "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40")}
                            disabled={inFlight || state.enabled[deviceById(it.src).port] === false}
                            onClick={() => onSend(it.src, it.dst)}
                            title={state.enabled[deviceById(it.src).port] === false ? `${formatPort(deviceById(it.src).port)} is down — ${deviceById(it.src).name} can't send` : undefined}
                          >
                            {it.label}
                          </button>
                        ) : (
                          <button type="button" className={cn(BTN, "border-amber-500/70 text-ink hover:border-amber-500 dark:text-bone")} disabled={actionDisabled(it.action)} onClick={() => runAction(it.action)}>
                            {it.label}
                          </button>
                        )}
                      </li>
                    ))}
                  </ol>
                  <div className="rounded-lg border border-line bg-white/60 p-2.5 dark:border-line-dark dark:bg-white/[0.03]">
                    <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">What you should see</p>
                    <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-ink dark:text-bone">
                      {exp.expect.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </Panel>
  );
}
