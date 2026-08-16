"use client";

import { useState } from "react";
import { MirrorGrid } from "./components/mirror-grid";
import { SymmetryBanner } from "./components/symmetry-banner";
import { MirrorControls } from "./components/mirror-controls";
import { cellKey } from "./grid-model";

export function SymmetryMirror() {
  const [filledLeft, setFilledLeft] = useState<Set<string>>(new Set());
  // A stack of toggled keys. Toggling is its own inverse, so "undo" is
  // simply "toggle this same key again" — no separate before/after
  // snapshots to store or keep in sync.
  const [history, setHistory] = useState<string[]>([]);
  const [pulseKey, setPulseKey] = useState(0);

  const handleToggleCell = (row: number, col: number) => {
    const key = cellKey(row, col);
    setFilledLeft((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setHistory((prev) => [...prev, key]);
    setPulseKey((k) => k + 1);
  };

  const handleUndo = () => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const lastKey = prev[prev.length - 1]!;
      setFilledLeft((current) => {
        const next = new Set(current);
        if (next.has(lastKey)) next.delete(lastKey);
        else next.add(lastKey);
        return next;
      });
      return prev.slice(0, -1);
    });
  };

  const handleReset = () => {
    setFilledLeft(new Set());
    setHistory([]);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <SymmetryBanner visible={filledLeft.size > 0} pulseKey={pulseKey} />

      <div className="w-full max-w-xl">
        <MirrorGrid filledLeft={filledLeft} onToggleCell={handleToggleCell} />
      </div>

      <MirrorControls onUndo={handleUndo} onReset={handleReset} canUndo={history.length > 0} />
    </div>
  );
}
