"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStepPlayer, type StepPlayer } from "../../osi-model-explorer/hooks/use-step-player";
import {
  STEP_COUNT,
  buildTransmission,
  createDefaultDevices,
  defaultMacFor,
  defaultNameFor,
  fullTable,
  generateMac,
  validateCustomMac,
  type LabDevice,
  type LogLine,
  type MacTable,
  type Transmission,
} from "../model";

export interface LogEntry extends LogLine {
  id: number;
}

export interface SendArgs {
  srcId: string;
  dstId: string | "broadcast";
  message: string;
  etherType?: string;
  corrupt?: boolean;
}

export interface EthernetLab {
  devices: LabDevice[];
  /** Table as the student should currently see it (mid-transmission aware). */
  table: MacTable;
  /** MAC that was just learned, for a highlight. */
  highlightMac: string | null;
  log: LogEntry[];
  tx: Transmission | null;
  /** Result of the last instant (non-animated) send. */
  instant: Transmission | null;
  player: StepPlayer;

  renameDevice: (id: string, name: string) => void;
  setDeviceMac: (id: string, mac: string) => { ok: true } | { ok: false; reason: string };
  randomizeMac: (id: string) => void;
  resetDevice: (id: string) => void;
  clearTable: () => void;
  fillTable: () => void;
  clearLog: () => void;
  send: (args: SendArgs, mode: "auto" | "step") => void;
  sendInstant: (args: SendArgs) => void;
  resetAll: () => void;
}

/**
 * Shared state for every tab: devices, the switch's MAC table, the event
 * log, and the current frame transmission. Kept in the shell so the MAC
 * table and log survive tab switches (learning would be pointless
 * otherwise). Everything is event-driven — the only timer is the shared
 * step player's per-step timeout.
 */
export function useEthernetLab(): EthernetLab {
  const [devices, setDevices] = useState<LabDevice[]>(createDefaultDevices);
  const [committedTable, setCommittedTable] = useState<MacTable>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [tx, setTx] = useState<Transmission | null>(null);
  const [instant, setInstant] = useState<Transmission | null>(null);
  const player = useStepPlayer(STEP_COUNT);

  const logIdRef = useRef(0);
  const reachedRef = useRef(-1);
  const autoStartRef = useRef(false);

  const appendLines = useCallback((lines: LogLine[]) => {
    if (lines.length === 0) return;
    setLog((prev) => [...prev, ...lines.map((l) => ({ ...l, id: ++logIdRef.current }))]);
  }, []);

  // Reveal each step's log lines (and commit learning) exactly once, as the
  // student reaches it. Going Back never removes log lines — a log is history.
  useEffect(() => {
    if (!tx) return;
    const upto = player.stepIndex;
    if (upto <= reachedRef.current) return;
    const lines: LogLine[] = [];
    let learned = false;
    for (let i = reachedRef.current + 1; i <= upto; i++) {
      const step = tx.steps[i];
      if (!step) continue;
      lines.push(...step.log);
      if (i === 5) learned = true;
    }
    reachedRef.current = upto;
    appendLines(lines);
    if (learned) setCommittedTable(tx.decision.tableAfter);
  }, [tx, player.stepIndex, appendLines]);

  // "Send Data" should autoplay; the shared hook only exposes a toggle, so
  // start it once the first step has been reached.
  useEffect(() => {
    if (autoStartRef.current && tx && player.stepIndex === 0 && !player.isPlaying) {
      autoStartRef.current = false;
      player.playPause();
    }
  }, [tx, player]);

  const send = useCallback(
    (args: SendArgs, mode: "auto" | "step") => {
      const t = buildTransmission({ devices, table: committedTable, ...args });
      if (!t) return;
      reachedRef.current = -1;
      autoStartRef.current = mode === "auto";
      setInstant(null);
      setTx(t);
      player.reset();
      player.stepForward();
    },
    [devices, committedTable, player],
  );

  const sendInstant = useCallback(
    (args: SendArgs) => {
      const t = buildTransmission({ devices, table: committedTable, ...args });
      if (!t) return;
      autoStartRef.current = false;
      player.reset();
      setTx(null);
      reachedRef.current = -1;
      setCommittedTable(t.decision.tableAfter);
      appendLines(t.steps.flatMap((s) => s.log));
      setInstant(t);
    },
    [devices, committedTable, player, appendLines],
  );

  const renameDevice = useCallback((id: string, name: string) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, name } : d)));
  }, []);

  const setDeviceMac = useCallback(
    (id: string, mac: string) => {
      const result = validateCustomMac(mac, id, devices);
      if (!result.ok) return result;
      setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, mac: result.mac } : d)));
      return { ok: true } as const;
    },
    [devices],
  );

  const randomizeMac = useCallback(
    (id: string) => {
      const taken = new Set(devices.filter((d) => d.id !== id).map((d) => d.mac));
      const mac = generateMac(taken);
      setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, mac } : d)));
    },
    [devices],
  );

  const resetDevice = useCallback(
    (id: string) => {
      // Reset can only restore the default if no one else has since taken it.
      const def = defaultMacFor(id);
      const clash = devices.some((d) => d.id !== id && d.mac === def);
      const mac = clash ? generateMac(new Set(devices.map((d) => d.mac))) : def;
      setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, mac, name: defaultNameFor(id) || d.name } : d)));
    },
    [devices],
  );

  const clearTable = useCallback(() => {
    setCommittedTable([]);
    setInstant(null);
    if (tx && player.stepIndex >= 0) {
      // Restart cleanly so a half-finished animation cannot re-learn.
      setTx(null);
      player.reset();
      reachedRef.current = -1;
    }
  }, [tx, player]);

  const fillTable = useCallback(() => {
    setCommittedTable(fullTable(devices));
  }, [devices]);

  const clearLog = useCallback(() => setLog([]), []);

  const resetAll = useCallback(() => {
    player.reset();
    autoStartRef.current = false;
    reachedRef.current = -1;
    setTx(null);
    setInstant(null);
    setCommittedTable([]);
    setLog([]);
    setDevices(createDefaultDevices());
  }, [player]);

  // While a transmission is before its "learn" step the student should still
  // see the table as it was; afterwards, the committed table.
  const shownTable = tx && player.stepIndex < 5 ? tx.decision.tableBefore : committedTable;

  const highlightMac =
    tx && player.stepIndex >= 5 && tx.decision.learn && tx.decision.learn.status !== "refreshed"
      ? tx.decision.learn.mac
      : !tx && instant?.decision.learn && instant.decision.learn.status !== "refreshed"
        ? instant.decision.learn.mac
        : null;

  return {
    devices,
    table: shownTable,
    highlightMac,
    log,
    tx,
    instant,
    player,
    renameDevice,
    setDeviceMac,
    randomizeMac,
    resetDevice,
    clearTable,
    fillTable,
    clearLog,
    send,
    sendInstant,
    resetAll,
  };
}
