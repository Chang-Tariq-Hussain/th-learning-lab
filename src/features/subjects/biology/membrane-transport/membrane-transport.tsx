"use client";

import { useEffect, useRef, useState } from "react";
import { MembraneHero } from "./components/membrane-hero";
import { ModeTabs } from "./components/mode-tabs";
import { StatusMessage } from "./components/status-message";
import { TransportControls } from "./components/transport-controls";
import { TransportStage } from "./components/transport-stage";
import {
  TRANSITION_MS,
  WATER_LEVEL_DONE,
  WATER_LEVEL_IDLE,
  createDiffusedParticles,
  createInitialDiffusionParticles,
  createInitialWaterParticles,
  createOsmosedWaterParticles,
  createSoluteParticles,
} from "./model";
import type { Mode, Particle, Phase } from "./types";

/**
 * Cell Membrane & Transport — two small, independent activities under
 * one shared membrane visual. Diffusion moves a single kind of
 * particle from crowded to sparse; Osmosis moves water toward the
 * side with more solute while the solute itself stays put. Each mode
 * keeps its own particle positions so switching back and forth (or
 * Reset) always returns to a clean starting layout.
 */
export function MembraneTransport() {
  const [mode, setMode] = useState<Mode>("diffusion");
  const [phase, setPhase] = useState<Phase>("idle");

  const [diffusionParticles, setDiffusionParticles] = useState<Particle[]>(createInitialDiffusionParticles);
  const [waterParticles, setWaterParticles] = useState<Particle[]>(createInitialWaterParticles);
  const [soluteParticles] = useState<Particle[]>(createSoluteParticles);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleModeChange = (nextMode: Mode) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMode(nextMode);
    setPhase("idle");
    setDiffusionParticles(createInitialDiffusionParticles());
    setWaterParticles(createInitialWaterParticles());
  };

  const handleStart = () => {
    if (phase !== "idle") return;
    setPhase("running");

    if (mode === "diffusion") {
      setDiffusionParticles((prev) => createDiffusedParticles(prev));
    } else {
      setWaterParticles((prev) => createOsmosedWaterParticles(prev));
    }

    timeoutRef.current = setTimeout(() => setPhase("done"), TRANSITION_MS);
  };

  const handleReset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPhase("idle");
    setDiffusionParticles(createInitialDiffusionParticles());
    setWaterParticles(createInitialWaterParticles());
  };

  const waterLevels = phase === "done" ? WATER_LEVEL_DONE : WATER_LEVEL_IDLE;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <MembraneHero />

      <ModeTabs value={mode} onChange={handleModeChange} />

      <TransportStage
        mode={mode}
        phase={phase}
        diffusionParticles={diffusionParticles}
        waterParticles={waterParticles}
        soluteParticles={soluteParticles}
        waterLevels={waterLevels}
      />

      <StatusMessage mode={mode} phase={phase} />

      <TransportControls mode={mode} phase={phase} onStart={handleStart} onReset={handleReset} />
    </div>
  );
}
