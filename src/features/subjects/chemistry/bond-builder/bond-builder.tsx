"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BondStage } from "./components/bond-stage";
import { ModeTabs } from "./components/mode-tabs";
import { PairTabs } from "./components/pair-tabs";
import { StatusLine } from "./components/status-line";
import { ExplanationPanel } from "./components/explanation-panel";
import {
  BONDING_DURATION_MS,
  COVALENT_PAIRS,
  COVALENT_PAIR_ORDER,
  IONIC_PAIRS,
  IONIC_PAIR_ORDER,
  type BondMode,
  type BondStage as Stage,
  type CovalentPairConfig,
  type IonicPairConfig,
} from "./bond-model";

interface BondBuilderProps {
  /** Locks the simulation to a single pair and hides the pair selector —
   *  used by the Learn/Predict sections' embedded mini-experiments, where
   *  the point is one specific worked example rather than free choice. */
  lockedIonicPairId?: IonicPairConfig["id"];
  lockedCovalentPairId?: CovalentPairConfig["id"];
}

/**
 * Bond Builder — a small, focused simulation teaching how ionic and
 * covalent bonds form. Owns which bond type, which atom pair within
 * that type, how far the current animation has progressed, and a
 * timer handle for that animation; all of the actual particle
 * rendering/motion lives in `BondStage` and its scene components.
 */
export function BondBuilder({ lockedIonicPairId, lockedCovalentPairId }: BondBuilderProps = {}) {
  const [mode, setMode] = useState<BondMode>("ionic");
  const [ionicPairId, setIonicPairId] = useState<IonicPairConfig["id"]>(lockedIonicPairId ?? "na-cl");
  const [covalentPairId, setCovalentPairId] = useState<CovalentPairConfig["id"]>(
    lockedCovalentPairId ?? "h-h",
  );
  const [stage, setStage] = useState<Stage>("separate");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleModeChange = useCallback((next: BondMode) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMode(next);
    setStage("separate");
  }, []);

  const handleIonicPairChange = useCallback((id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIonicPairId(id as IonicPairConfig["id"]);
    setStage("separate");
  }, []);

  const handleCovalentPairChange = useCallback((id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCovalentPairId(id as CovalentPairConfig["id"]);
    setStage("separate");
  }, []);

  const handleBringTogether = useCallback(() => {
    if (stage !== "separate") return;
    setStage("bonding");
    timeoutRef.current = setTimeout(() => setStage("bonded"), BONDING_DURATION_MS);
  }, [stage]);

  const handleReset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStage("separate");
  }, []);

  const ionicPair = IONIC_PAIRS[ionicPairId];
  const covalentPair = COVALENT_PAIRS[covalentPairId];
  const activePair = mode === "ionic" ? ionicPair : covalentPair;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <ModeTabs mode={mode} onChange={handleModeChange} disabled={stage !== "separate"} />
          {mode === "ionic" && !lockedIonicPairId ? (
            <PairTabs
              options={IONIC_PAIR_ORDER.map((id) => IONIC_PAIRS[id])}
              selectedId={ionicPairId}
              onChange={handleIonicPairChange}
              disabled={stage !== "separate"}
            />
          ) : null}
          {mode === "covalent" && !lockedCovalentPairId ? (
            <PairTabs
              options={COVALENT_PAIR_ORDER.map((id) => COVALENT_PAIRS[id])}
              selectedId={covalentPairId}
              onChange={handleCovalentPairChange}
              disabled={stage !== "separate"}
            />
          ) : null}
        </div>
        <StatusLine stage={stage} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Left: the simulation itself + its controls */}
        <div className="flex flex-col gap-4">
          <div className="relative flex items-center justify-center overflow-hidden rounded-card border border-line bg-white/40 p-4 dark:border-line-dark dark:bg-white/[0.02]">
            <div className="aspect-[7/4] w-full max-w-[640px]">
              <BondStage mode={mode} stage={stage} ionicPair={ionicPair} covalentPair={covalentPair} />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" onClick={handleBringTogether} disabled={stage !== "separate"}>
              <Zap className="h-4 w-4" strokeWidth={1.75} />
              Bring Atoms Together
            </Button>
            <Button variant="secondary" onClick={handleReset} disabled={stage === "separate"}>
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
              Reset
            </Button>
          </div>
        </div>

        {/* Right: short explanation */}
        <div className="flex flex-col gap-4">
          <ExplanationPanel mode={mode} pair={activePair} />
        </div>
      </div>
    </div>
  );
}
