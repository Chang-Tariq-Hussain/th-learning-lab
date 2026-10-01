"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStepPlayer, type StepPlayer } from "../../osi-model-explorer/hooks/use-step-player";
import type { LogEntry } from "../../ethernet-mac-simulator/hooks/use-ethernet-lab";
import type { LogKind } from "../../ethernet-mac-simulator/model";
import {
  CLIENT_META,
  LOG_START_SECONDS,
  advanceClock,
  applyPool,
  assembleRun,
  buildBatchDora,
  buildRelease,
  buildRenew,
  canRunDora,
  cloneState,
  finalState,
  formatClock,
  formatDuration,
  initialState,
  setManualConfig,
  stateAfterStep,
  switchMode,
  SERVER,
  type ClientId,
  type ConfigMode,
  type IpConfig,
  type LabState,
  type PoolConfig,
  type Run,
  type RunKind,
  type RunResult,
  type RunStep,
} from "../model";

export interface DhcpLabInit {
  state: LabState;
  selected?: ClientId;
}

function defaultInit(): DhcpLabInit {
  return { state: initialState(), selected: "pc1" };
}

/** What the most recent completed run did. Interactive challenges and experiments read this. */
export interface RunSummary {
  kind: RunKind;
  results: RunResult[];
}

export interface DhcpLab {
  /** The lab as the student should currently see it (mid-run aware). */
  state: LabState;
  /** The lab as committed so far: what a finished run and the direct actions have actually saved. */
  saved: LabState;
  selectedId: ClientId;
  run: Run | null;
  step: RunStep | null;
  stepIndex: number;
  player: StepPlayer;
  log: LogEntry[];
  lastCompleted: RunSummary | null;

  setSelectedId: (id: ClientId) => void;
  /** Build a DORA run for one or more clients and play it ("auto") or leave it at step 1 ("step"). */
  startDora: (ids: ClientId[], mode: "auto" | "step") => void;
  startRenew: (id: ClientId, mode: "auto" | "step") => void;
  startRelease: (id: ClientId, mode: "auto" | "step") => void;
  /** Abandon the current run. Anything the run had not finished committing is discarded. */
  cancelRun: () => void;
  /** Replace the whole lab with a starting state (used by experiments and challenges). */
  load: (init: DhcpLabInit) => void;
  restart: () => void;
  clearLog: () => void;

  applyPoolConfig: (pool: PoolConfig) => void;
  advanceTime: (minutes: number) => void;
  setMode: (id: ClientId, mode: ConfigMode) => void;
  setManual: (id: ClientId, cfg: IpConfig) => void;
}

/**
 * Shared state for every tab: the server's pool and lease table, each client's configuration,
 * the current run of steps, and the event log. Event-driven: the only timer is the shared step
 * player's per-step timeout, plus the diagram's own short packet animation.
 */
export function useDhcpLab(init: () => DhcpLabInit = defaultInit): DhcpLab {
  const [initial] = useState(init);
  const [committed, setCommitted] = useState<LabState>(() => cloneState(initial.state));
  const [selectedId, setSelectedId] = useState<ClientId>(initial.selected ?? "pc1");
  const [run, setRun] = useState<Run | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [lastCompleted, setLastCompleted] = useState<RunSummary | null>(null);
  const player = useStepPlayer(run ? run.steps.length : 0);

  const logIdRef = useRef(0);
  const secondsRef = useRef(LOG_START_SECONDS);
  const seqRef = useRef(1);
  const reachedRef = useRef(-1);
  const committedRef = useRef(false);
  const pendingRef = useRef<"auto" | "step" | null>(null);
  const autoRef = useRef(false);

  const append = useCallback((lines: { kind: LogKind; text: string; detail?: string }[]) => {
    if (lines.length === 0) return;
    const stamp = formatClock(secondsRef.current);
    setLog((prev) => [...prev, ...lines.map((l) => ({ kind: l.kind, text: `${stamp}  ${l.text}`, detail: l.detail, id: ++logIdRef.current }))]);
  }, []);

  const stepIndex = player.stepIndex;

  // Reveal each step's log lines and commit the finished run exactly once, as the student reaches them.
  // Going Back never removes log lines: the log is a record of what happened.
  useEffect(() => {
    if (!run) return;
    const upto = stepIndex;
    if (upto > reachedRef.current) {
      for (let i = reachedRef.current + 1; i <= upto; i++) {
        const s = run.steps[i];
        if (s) {
          append(s.log);
          secondsRef.current += 1;
        }
      }
      reachedRef.current = upto;
    }
    if (upto >= run.steps.length - 1 && !committedRef.current) {
      committedRef.current = true;
      setCommitted(finalState(run));
      setLastCompleted({ kind: run.kind, results: run.results });
    }
  }, [run, stepIndex, append]);

  // A new run always begins at its first step; "Auto" then keeps going.
  useEffect(() => {
    if (!run || !pendingRef.current) return;
    if (pendingRef.current === "auto") autoRef.current = true;
    pendingRef.current = null;
    player.stepForward();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  useEffect(() => {
    if (autoRef.current && run && player.stepIndex === 0 && !player.isPlaying) {
      autoRef.current = false;
      player.playPause();
    }
  });

  const cancelRun = useCallback(() => {
    pendingRef.current = null;
    autoRef.current = false;
    reachedRef.current = -1;
    committedRef.current = false;
    player.reset();
    setRun(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.reset]);

  const begin = useCallback(
    (next: Run | null, mode: "auto" | "step") => {
      if (!next) return;
      autoRef.current = false;
      reachedRef.current = -1;
      committedRef.current = false;
      pendingRef.current = mode;
      player.reset();
      setRun(next);
    },
    [player],
  );

  const startDora = useCallback(
    (ids: ClientId[], mode: "auto" | "step") => {
      const eligible = ids.filter((id) => canRunDora(committed, id));
      if (eligible.length === 0) return;
      const seq = seqRef.current;
      seqRef.current += eligible.length;
      begin(buildBatchDora(committed, eligible, seq), mode);
    },
    [committed, begin],
  );

  const startRenew = useCallback(
    (id: ClientId, mode: "auto" | "step") => {
      const seq = seqRef.current++;
      const part = buildRenew(committed, id, seq);
      if (part) begin(assembleRun(seq, "renew", committed, [part]), mode);
    },
    [committed, begin],
  );

  const startRelease = useCallback(
    (id: ClientId, mode: "auto" | "step") => {
      const seq = seqRef.current++;
      const part = buildRelease(committed, id, seq);
      if (part) begin(assembleRun(seq, "release", committed, [part]), mode);
    },
    [committed, begin],
  );

  const resetLogClock = useCallback(() => {
    secondsRef.current = LOG_START_SECONDS;
  }, []);

  const load = useCallback(
    (i: DhcpLabInit) => {
      cancelRun();
      setCommitted(cloneState(i.state));
      setSelectedId(i.selected ?? "pc1");
      setLog([]);
      setLastCompleted(null);
      resetLogClock();
    },
    [cancelRun, resetLogClock],
  );

  const restart = useCallback(() => load(defaultInit()), [load]);
  const clearLog = useCallback(() => setLog([]), []);

  // ---- Direct actions (any of them abandons a run in progress) -------------
  const applyPoolConfig = useCallback(
    (pool: PoolConfig) => {
      cancelRun();
      setCommitted((s) => applyPool(s, pool));
      append([
        {
          kind: "switch",
          text: `${SERVER.name}: pool set to .${pool.start} – .${pool.end}`,
          detail: `gateway ${pool.gateway} · DNS ${pool.dns || "none"} · lease ${formatDuration(pool.leaseMin)}`,
        },
      ]);
      secondsRef.current += 1;
    },
    [cancelRun, append],
  );

  const advanceTime = useCallback(
    (minutes: number) => {
      cancelRun();
      const { state: next, expired } = advanceClock(committed, minutes);
      setCommitted(next);
      secondsRef.current += minutes * 60;
      const lines: { kind: LogKind; text: string; detail?: string }[] = [{ kind: "info", text: `Lab clock moves forward ${formatDuration(minutes)}` }];
      for (const e of expired) lines.push({ kind: "discard", text: `${SERVER.name}: lease for ${e.ip} expired`, detail: `${CLIENT_META[e.clientId].name} loses its configuration and the address is available again` });
      append(lines);
      secondsRef.current += 1;
    },
    [committed, cancelRun, append],
  );

  const setMode = useCallback(
    (id: ClientId, mode: ConfigMode) => {
      cancelRun();
      const { state: next, releasedIp } = switchMode(committed, id, mode);
      setCommitted(next);
      const name = CLIENT_META[id].name;
      const lines: { kind: LogKind; text: string; detail?: string }[] = [];
      if (releasedIp) lines.push({ kind: "frame", text: `${name} → DHCP Release`, detail: `leaving DHCP; gives back ${releasedIp}` });
      lines.push({ kind: "info", text: mode === "manual" ? `${name} switched to manual (static) configuration` : `${name} switched to DHCP configuration` });
      append(lines);
      secondsRef.current += 1;
    },
    [committed, cancelRun, append],
  );

  const setManual = useCallback(
    (id: ClientId, cfg: IpConfig) => {
      cancelRun();
      setCommitted(setManualConfig(committed, id, cfg));
      append([{ kind: "info", text: `${CLIENT_META[id].name}: manual settings saved`, detail: `${cfg.ip} · ${cfg.mask} · gateway ${cfg.gateway || "none"} · DNS ${cfg.dns || "none"}` }]);
      secondsRef.current += 1;
    },
    [committed, cancelRun, append],
  );

  // ---- Derived view -----------------------------------------------------------
  const step = run && stepIndex >= 0 ? (run.steps[Math.min(stepIndex, run.steps.length - 1)] ?? null) : null;
  const shown = run ? (stepIndex >= 0 ? stateAfterStep(run, stepIndex) : run.base) : committed;

  return {
    state: shown,
    saved: committed,
    selectedId,
    run,
    step,
    stepIndex,
    player,
    log,
    lastCompleted,
    setSelectedId,
    startDora,
    startRenew,
    startRelease,
    cancelRun,
    load,
    restart,
    clearLog,
    applyPoolConfig,
    advanceTime,
    setMode,
    setManual,
  };
}
