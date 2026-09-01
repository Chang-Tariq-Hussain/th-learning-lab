"use client";

import { useEffect, useRef, useState } from "react";
import { MembraneHero } from "./components/membrane-hero";
import { ModeTabs } from "./components/mode-tabs";
import { StatusMessage } from "./components/status-message";
import { TransportControls } from "./components/transport-controls";
import { TransportStage } from "./components/transport-stage";
import {
  ACTIVE_TRANSPORT_PUMP_COUNT,
  ATP_COST_PER_PARTICLE,
  TRANSITION_MS,
  WATER_LEVEL_DONE,
  WATER_LEVEL_IDLE,
  createActivelyTransportedParticles,
  createDiffusedParticles,
  createInitialActiveTransportParticles,
  createInitialDiffusionParticles,
  createInitialWaterParticles,
  createOsmosedWaterParticles,
  createSoluteParticles,
} from "./model";
import type { Mode, Particle, Phase } from "./types";

/**
 * Cell Membrane & Transport — three small, independent activities
 * under one shared membrane visual. Diffusion moves a single kind of
 * particle from crowded to sparse; Osmosis moves water toward the
 * side with more solute while the solute itself stays put; Active
 * Transport pumps particles the *other* direction — from sparse to
 * crowded, against the gradient — while spending a visible "ATP
 * used" count, the one thing diffusion and osmosis never need. Each
 * mode keeps its own particle positions so switching back and forth
 * (or Reset) always returns to a clean starting layout.
 */
export interface MembraneTransportProps {
  /** Which tab is active on first render — defaults to "diffusion" so
   *  every existing caller (Cell Membrane, the standalone simulation
   *  page) is unaffected. The Active Transport topic page passes
   *  "active-transport" so it opens straight into its own tab instead
   *  of making the student click past Diffusion first. */
  initialMode?: Mode;
}

export function MembraneTransport({ initialMode = "diffusion" }: MembraneTransportProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [phase, setPhase] = useState<Phase>("idle");

  const [diffusionParticles, setDiffusionParticles] = useState<Particle[]>(createInitialDiffusionParticles);
  const [waterParticles, setWaterParticles] = useState<Particle[]>(createInitialWaterParticles);
  const [soluteParticles] = useState<Particle[]>(createSoluteParticles);
  const [activeTransportParticles, setActiveTransportParticles] = useState<Particle[]>(createInitialActiveTransportParticles);
  const [atpUsed, setAtpUsed] = useState(0);

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
    setActiveTransportParticles(createInitialActiveTransportParticles());
    setAtpUsed(0);
  };

  const handleStart = () => {
    if (phase !== "idle") return;
    setPhase("running");

    if (mode === "diffusion") {
      setDiffusionParticles((prev) => createDiffusedParticles(prev));
    } else if (mode === "osmosis") {
      setWaterParticles((prev) => createOsmosedWaterParticles(prev));
    } else {
      setActiveTransportParticles((prev) => createActivelyTransportedParticles(prev));
      setAtpUsed(ACTIVE_TRANSPORT_PUMP_COUNT * ATP_COST_PER_PARTICLE);
    }

    timeoutRef.current = setTimeout(() => setPhase("done"), TRANSITION_MS);
  };

  const handleReset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPhase("idle");
    setDiffusionParticles(createInitialDiffusionParticles());
    setWaterParticles(createInitialWaterParticles());
    setActiveTransportParticles(createInitialActiveTransportParticles());
    setAtpUsed(0);
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
        activeTransportParticles={activeTransportParticles}
        atpUsed={atpUsed}
        waterLevels={waterLevels}
      />

      <StatusMessage mode={mode} phase={phase} />

      <TransportControls mode={mode} phase={phase} onStart={handleStart} onReset={handleReset} />
    </div>
  );
}
