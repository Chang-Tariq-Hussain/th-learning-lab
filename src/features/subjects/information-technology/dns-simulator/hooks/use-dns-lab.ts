"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStepPlayer, type StepPlayer } from "../../osi-model-explorer/hooks/use-step-player";
import {
  LOG_START_SECONDS,
  cacheAtStep,
  cloneCache,
  emptyCache,
  formatClock,
  hasFreshAnswer,
  planLookup,
  type CacheState,
  type Fault,
  type LogKind,
  type LookupResult,
  type Run,
  type RunStep,
  type Scenario,
} from "../model";

export interface LogEntry {
  id: number;
  kind: LogKind;
  text: string;
  detail?: string;
}

/** One TTL "tick" is a minute of lab time and lasts one real second, so a 300 s TTL runs out in five seconds. */
export const TTL_TICK_SECONDS = 60;
const TTL_TICK_MS = 1000;
const START_NOW = 1000;

export interface DnsLab {
  /** The resolver's cache as the student should currently see it (mid-run aware). */
  cache: CacheState;
  /** The cache as committed so far: what finished lookups have actually saved. */
  saved: CacheState;
  now: number;
  domain: string;
  setDomain: (d: string) => void;
  run: Run | null;
  step: RunStep | null;
  stepIndex: number;
  player: StepPlayer;
  log: LogEntry[];
  lastResult: LookupResult | null;
  /** True once the run has reached its last step. */
  runDone: boolean;
  scenarioId: string | null;
  ttlPlaying: boolean;

  resolve: (name: string, mode: "auto" | "step", fault?: Fault) => void;
  /** Replay the current lookup from its first step, with the cache it started with. */
  restartLookup: () => void;
  cancelRun: () => void;
  loadScenario: (s: Scenario) => void;
  flushCache: () => void;
  resetLab: () => void;
  clearLog: () => void;
  advanceTime: (seconds: number) => void;
  skipToExpiry: (name: string) => void;
  toggleTtlPlay: () => void;
}

/**
 * Shared state for every tab: the resolver's cache and clock, the current lookup (a list of planned steps),
 * playback, and the event log. Event-driven: the only timers are the step player's per-step timeout and the
 * optional TTL countdown, which runs only while the student has started it.
 */
export function useDnsLab(): DnsLab {
  const [committed, setCommitted] = useState<CacheState>(emptyCache);
  const [now, setNow] = useState(START_NOW);
  const [domain, setDomain] = useState("www.example.com");
  const [run, setRun] = useState<Run | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [lastResult, setLastResult] = useState<LookupResult | null>(null);
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [ttlPlaying, setTtlPlaying] = useState(false);
  const player = useStepPlayer(run ? run.steps.length : 0);

  const logIdRef = useRef(0);
  const logSecondsRef = useRef(LOG_START_SECONDS);
  const runIdRef = useRef(1);
  const reachedRef = useRef(-1);
  const committedRef = useRef(false);
  const pendingRef = useRef<"auto" | "step" | null>(null);
  const autoRef = useRef(false);

  const append = useCallback((lines: { kind: LogKind; text: string; detail?: string }[]) => {
    if (lines.length === 0) return;
    const stamp = formatClock(logSecondsRef.current);
    setLog((prev) => [...prev, ...lines.map((l) => ({ kind: l.kind, text: `${stamp}  ${l.text}`, detail: l.detail, id: ++logIdRef.current }))]);
  }, []);

  const stepIndex = player.stepIndex;

  // Reveal each step's log lines as the student reaches them and commit the finished lookup exactly once.
  // Going Back never removes log lines: the log is a record of what happened.
  useEffect(() => {
    if (!run) return;
    if (stepIndex > reachedRef.current) {
      for (let i = reachedRef.current + 1; i <= stepIndex; i++) {
        const s = run.steps[i];
        if (s) {
          append(s.log);
          logSecondsRef.current += 1;
        }
      }
      reachedRef.current = stepIndex;
    }
    if (stepIndex >= run.steps.length - 1 && !committedRef.current) {
      committedRef.current = true;
      setCommitted(cloneCache(run.final));
      setLastResult(run.result);
    }
  }, [run, stepIndex, append]);

  // A new run begins at its first step; "auto" then keeps playing.
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

  // The optional TTL countdown.
  useEffect(() => {
    if (!ttlPlaying) return;
    const id = setInterval(() => setNow((n) => n + TTL_TICK_SECONDS), TTL_TICK_MS);
    return () => clearInterval(id);
  }, [ttlPlaying]);
  useEffect(() => {
    if (ttlPlaying && !hasFreshAnswer(committed, now)) setTtlPlaying(false);
  }, [ttlPlaying, committed, now]);

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
    (next: Run, mode: "auto" | "step") => {
      autoRef.current = false;
      reachedRef.current = -1;
      committedRef.current = false;
      pendingRef.current = mode;
      setTtlPlaying(false);
      player.reset();
      setRun(next);
    },
    [player],
  );

  const resolve = useCallback(
    (name: string, mode: "auto" | "step", fault: Fault = null) => {
      begin(planLookup({ id: runIdRef.current++, rawName: name, cache: committed, now, fault }), mode);
    },
    [begin, committed, now],
  );

  const restartLookup = useCallback(() => {
    if (!run) return;
    setCommitted(cloneCache(run.base));
    append([{ kind: "info", text: `— Lookup restarted: ${run.name} —` }]);
    logSecondsRef.current += 1;
    begin(planLookup({ id: runIdRef.current++, rawName: run.name, cache: run.base, now, fault: run.fault }), "auto");
  }, [run, begin, append, now]);

  const loadScenario = useCallback(
    (s: Scenario) => {
      cancelRun();
      setTtlPlaying(false);
      const init = s.setup();
      setCommitted(cloneCache(init.cache));
      setNow(init.now);
      setDomain(s.domain);
      setLastResult(null);
      setScenarioId(s.id);
      append([{ kind: "info", text: `Scenario ${s.number}: ${s.title}`, detail: s.summary }]);
      logSecondsRef.current += 1;
    },
    [cancelRun, append],
  );

  const flushCache = useCallback(() => {
    cancelRun();
    setTtlPlaying(false);
    setCommitted(emptyCache());
    append([{ kind: "info", text: "Resolver cache flushed", detail: "answers and saved name servers removed" }]);
    logSecondsRef.current += 1;
  }, [cancelRun, append]);

  const resetLab = useCallback(() => {
    cancelRun();
    setTtlPlaying(false);
    setCommitted(emptyCache());
    setNow(START_NOW);
    setLog([]);
    setLastResult(null);
    setScenarioId(null);
    setDomain("www.example.com");
    logSecondsRef.current = LOG_START_SECONDS;
  }, [cancelRun]);

  const clearLog = useCallback(() => setLog([]), []);

  const advanceTime = useCallback(
    (seconds: number) => {
      cancelRun();
      setNow((n) => n + seconds);
      logSecondsRef.current += seconds;
      append([{ kind: "info", text: `Lab clock moves forward ${seconds} s`, detail: "cached TTLs count down" }]);
      logSecondsRef.current += 1;
    },
    [cancelRun, append],
  );

  const skipToExpiry = useCallback(
    (name: string) => {
      const e = committed.answers.find((a) => a.name === name);
      if (!e || e.expiresAt <= now) return;
      advanceTime(e.expiresAt - now);
    },
    [committed, now, advanceTime],
  );

  const toggleTtlPlay = useCallback(() => {
    if (!ttlPlaying) cancelRun();
    setTtlPlaying((p) => !p);
  }, [ttlPlaying, cancelRun]);

  const stepNow = run && stepIndex >= 0 ? (run.steps[Math.min(stepIndex, run.steps.length - 1)] ?? null) : null;
  const shown = run ? (stepIndex >= 0 ? cacheAtStep(run, stepIndex) : run.base) : committed;
  const runDone = !!run && stepIndex >= run.steps.length - 1;

  return {
    cache: shown,
    saved: committed,
    now,
    domain,
    setDomain,
    run,
    step: stepNow,
    stepIndex,
    player,
    log,
    lastResult,
    runDone,
    scenarioId,
    ttlPlaying,
    resolve,
    restartLookup,
    cancelRun,
    loadScenario,
    flushCache,
    resetLab,
    clearLog,
    advanceTime,
    skipToExpiry,
    toggleTtlPlay,
  };
}
