"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStepPlayer, type StepPlayer } from "../../osi-model-explorer/hooks/use-step-player";
import type { LogEntry } from "../../ethernet-mac-simulator/hooks/use-ethernet-lab";
import type { LogLine } from "../../ethernet-mac-simulator/model";
import {
  buildRun,
  cachesAfterStep,
  cachesForPreset,
  checkDestination,
  clearDynamic,
  cloneCaches,
  createNodes,
  emptyCaches,
  nodeById,
  removeEntry,
  scenarioById,
  summarize,
  upsertEntry,
  type ArpEntry,
  type ArpNode,
  type Caches,
  type DestCheck,
  type NodeId,
  type Run,
  type RunStep,
  type RunSummary,
  type ScenarioId,
  type SourceId,
} from "../model";

export interface ArpLabInit {
  caches: Caches;
  scenario?: ScenarioId;
  destIp?: string;
  srcId?: SourceId;
}

function defaultInit(): ArpLabInit {
  const s = scenarioById("first");
  return { caches: cachesForPreset(s.cache === "keep" ? "empty" : s.cache), scenario: "first", destIp: s.destIp, srcId: "a" };
}

export interface HighlightedEntry {
  node: NodeId;
  ip: string;
}

export interface ArpLab {
  nodes: ArpNode[];
  /** Caches as the student should currently see them (mid-run aware). */
  caches: Caches;
  /** Caches as committed so far — what a finished run and the cache tools have actually saved. */
  savedCaches: Caches;
  scenario: ScenarioId;
  srcId: SourceId;
  destIp: string;
  message: string;
  destCheck: DestCheck;
  run: Run | null;
  step: RunStep | null;
  stepIndex: number;
  player: StepPlayer;
  log: LogEntry[];
  /** The most recent run that reached its last step. */
  lastCompleted: RunSummary | null;
  /** Cache entry that was just added or refreshed at the current step. */
  highlight: HighlightedEntry | null;
  /** Which device's cache the cache panel is showing. */
  inspectId: NodeId;

  setScenario: (id: ScenarioId) => void;
  setSrcId: (id: SourceId) => void;
  setDestIp: (text: string) => void;
  setMessage: (text: string) => void;
  setInspectId: (id: NodeId) => void;
  /** Build a run from the cache as it is now and play it ("auto") or leave it at step 1 ("step"). */
  start: (mode: "auto" | "step") => void;
  /** Abandon the current run; the cache keeps whatever was already committed. */
  cancelRun: () => void;
  /** Restore the selected scenario's starting cache and clear the run. */
  resetScenario: () => void;
  resetAll: () => void;
  clearLog: () => void;

  clearCache: (node: NodeId) => void;
  resetCache: (node: NodeId) => void;
  resetAllCaches: () => void;
  /** Restore a complete starting state (used by "Restart this challenge"). */
  resetToInit: (init: ArpLabInit) => void;
  addStatic: (node: NodeId, ip: string, mac: string) => void;
  removeCacheEntry: (node: NodeId, ip: string) => void;
}

/**
 * Shared state for every tab: the devices' ARP caches, the current run of
 * steps, the event log, and the last completed run (used by interactive
 * challenges to check what the student actually did). Event-driven — the only
 * timer is the shared step player's per-step timeout.
 */
export function useArpLab(init: () => ArpLabInit = defaultInit): ArpLab {
  const nodes = useMemo(createNodes, []);
  const [initial] = useState(init);
  const [committed, setCommitted] = useState<Caches>(() => cloneCaches(initial.caches));
  const [scenario, setScenarioState] = useState<ScenarioId>(initial.scenario ?? "first");
  const [srcId, setSrcIdState] = useState<SourceId>(initial.srcId ?? "a");
  const [destIp, setDestIpState] = useState(initial.destIp ?? scenarioById("first").destIp);
  const [message, setMessageState] = useState("Hello");
  const [run, setRun] = useState<Run | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [lastCompleted, setLastCompleted] = useState<RunSummary | null>(null);
  const [inspectId, setInspectId] = useState<NodeId>(initial.srcId ?? "a");
  const player = useStepPlayer(run ? run.steps.length : 0);

  const logIdRef = useRef(0);
  const reachedRef = useRef(-1);
  const committedRef = useRef(false);
  const pendingRef = useRef<"auto" | "step" | null>(null);
  const autoRef = useRef(false);

  const appendLines = useCallback((lines: LogLine[]) => {
    if (lines.length === 0) return;
    setLog((prev) => [...prev, ...lines.map((l) => ({ ...l, id: ++logIdRef.current }))]);
  }, []);

  const stepIndex = player.stepIndex;

  // Reveal each step's log lines and commit the finished run's cache changes
  // exactly once, as the student reaches them. Going Back never removes log lines.
  useEffect(() => {
    if (!run) return;
    const upto = stepIndex;
    if (upto > reachedRef.current) {
      const lines: LogLine[] = [];
      for (let i = reachedRef.current + 1; i <= upto; i++) {
        const s = run.steps[i];
        if (s) lines.push(...s.log);
      }
      reachedRef.current = upto;
      appendLines(lines);
    }
    if (upto >= run.steps.length - 1 && !committedRef.current) {
      committedRef.current = true;
      setCommitted(cachesAfterStep(run, run.steps.length - 1));
      setLastCompleted(summarize(run));
    }
  }, [run, stepIndex, appendLines]);

  // A new run always begins at its first step; "Play" then keeps going.
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

  const src = nodeById(nodes, srcId)!;
  const destCheck = useMemo(() => checkDestination(destIp, src), [destIp, src]);

  const setScenario = useCallback(
    (id: ScenarioId) => {
      const preset = scenarioById(id);
      cancelRun();
      setScenarioState(id);
      if (id !== "custom") {
        setSrcIdState("a");
        setDestIpState(preset.destIp);
        setInspectId("a");
      }
      if (preset.cache !== "keep") setCommitted(cachesForPreset(preset.cache));
    },
    [cancelRun],
  );

  const setSrcId = useCallback(
    (id: SourceId) => {
      cancelRun();
      setSrcIdState(id);
      setInspectId(id);
    },
    [cancelRun],
  );

  const setDestIp = useCallback(
    (text: string) => {
      cancelRun();
      setDestIpState(text);
      setScenarioState("custom");
    },
    [cancelRun],
  );

  const start = useCallback(
    (mode: "auto" | "step") => {
      const check = checkDestination(destIp, src);
      if (!check.ok) return;
      const next = buildRun({ nodes, caches: committed, srcId, destIp: check.ip, message });
      if (!next) return;
      autoRef.current = false;
      reachedRef.current = -1;
      committedRef.current = false;
      pendingRef.current = mode;
      player.reset();
      setRun(next);
    },
    [destIp, src, nodes, committed, srcId, message, player],
  );

  const resetScenario = useCallback(() => {
    setScenario(scenario);
  }, [setScenario, scenario]);

  const resetAll = useCallback(() => {
    cancelRun();
    const s = scenarioById("first");
    setCommitted(cachesForPreset("empty"));
    setLog([]);
    setLastCompleted(null);
    setScenarioState("first");
    setSrcIdState("a");
    setDestIpState(s.destIp);
    setMessageState("Hello");
    setInspectId("a");
  }, [cancelRun]);

  const clearLog = useCallback(() => setLog([]), []);

  // ---- Cache management (any edit abandons a run in progress) -------------
  const editCache = useCallback(
    (node: NodeId, fn: (list: ArpEntry[]) => ArpEntry[]) => {
      cancelRun();
      setCommitted((c) => ({ ...c, [node]: fn(c[node]) }));
    },
    [cancelRun],
  );
  const clearCache = useCallback((node: NodeId) => editCache(node, clearDynamic), [editCache]);
  const resetCache = useCallback((node: NodeId) => editCache(node, () => []), [editCache]);
  const resetAllCaches = useCallback(() => {
    cancelRun();
    setCommitted(emptyCaches());
  }, [cancelRun]);
  const resetToInit = useCallback(
    (i: ArpLabInit) => {
      cancelRun();
      setCommitted(cloneCaches(i.caches));
      setLog([]);
      setLastCompleted(null);
      setScenarioState(i.scenario ?? "first");
      setSrcIdState(i.srcId ?? "a");
      setDestIpState(i.destIp ?? scenarioById("first").destIp);
      setInspectId(i.srcId ?? "a");
    },
    [cancelRun],
  );
  const addStatic = useCallback((node: NodeId, ip: string, mac: string) => editCache(node, (l) => upsertEntry(removeEntry(l, ip), { ip, mac, type: "static" })), [editCache]);
  const removeCacheEntry = useCallback((node: NodeId, ip: string) => editCache(node, (l) => removeEntry(l, ip)), [editCache]);

  // ---- Derived view --------------------------------------------------------
  const step = run && stepIndex >= 0 ? (run.steps[Math.min(stepIndex, run.steps.length - 1)] ?? null) : null;
  const shownCaches = run && stepIndex >= 0 ? cachesAfterStep(run, stepIndex) : committed;
  const op = step?.cacheOps[0];
  const highlight: HighlightedEntry | null = op ? { node: op.node, ip: op.entry.ip } : null;

  return {
    nodes,
    caches: shownCaches,
    savedCaches: committed,
    scenario,
    srcId,
    destIp,
    message,
    destCheck,
    run,
    step,
    stepIndex,
    player,
    log,
    lastCompleted,
    highlight,
    inspectId,
    setScenario,
    setSrcId,
    setDestIp,
    setMessage: setMessageState,
    setInspectId,
    start,
    cancelRun,
    resetScenario,
    resetAll,
    clearLog,
    clearCache,
    resetCache,
    resetAllCaches,
    resetToInit,
    addStatic,
    removeCacheEntry,
  };
}
