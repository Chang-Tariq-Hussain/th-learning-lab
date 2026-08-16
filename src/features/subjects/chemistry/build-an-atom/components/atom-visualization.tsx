"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAnimation } from "@/features/simulation/hooks/use-animation";
import type { AtomState } from "../atom-model";
import { distributeElectrons } from "../shells";
import { protonPositions, neutronPositions } from "../nucleus-layout";
import { Nucleon } from "./nucleon";
import { Electron } from "./electron";
import { AtomDefs } from "./atom-defs";
import type { ParticleKind } from "../particle-info";

interface AtomVisualizationProps {
  atom: AtomState;
  onSelectParticle: (kind: ParticleKind) => void;
}

const SIZE = 420;
const CENTER = SIZE / 2;
const SHELL_RADII = [50, 85, 120, 155, 190, 225];
/** Degrees per second, alternating direction shell to shell so it doesn't read as one solid spinning disc. */
const SHELL_SPEEDS = [55, -38, 27, -20, 15, -11];
const RING_DASH = "3 5";

/**
 * Owns the two pieces of genuinely continuous animation in this feature
 * — electron orbit rotation and each ring's "flowing" dash pattern —
 * via the simulation framework's `useAnimation` hook (the same
 * `requestAnimationFrame` engine every physics/chemistry/math
 * simulation uses), reused here standalone without a
 * `SimulationProvider` since `useAnimation` doesn't require one.
 * Both are applied imperatively via refs on every frame — never through
 * React state — so 60 FPS motion never re-renders this component; only
 * adding/removing a particle re-renders, which is exactly when Framer
 * Motion's pop/shrink/fly-in animations should run.
 */
export function AtomVisualization({ atom, onSelectParticle }: AtomVisualizationProps) {
  const shellRefs = useRef<(SVGGElement | null)[]>([]);
  const ringRefs = useRef<(SVGCircleElement | null)[]>([]);
  const rotationRef = useRef<number[]>(SHELL_SPEEDS.map(() => 0));

  const animation = useAnimation({
    onTick: (frame) => {
      SHELL_SPEEDS.forEach((speed, i) => {
        rotationRef.current[i] = ((rotationRef.current[i] ?? 0) + speed * frame.deltaTime) % 360;

        const shellEl = shellRefs.current[i];
        if (shellEl) shellEl.setAttribute("transform", `translate(${CENTER} ${CENTER}) rotate(${rotationRef.current[i]})`);

        // The ring's dash pattern drifts in the same direction as its
        // electrons orbit, reading as a faint current flowing around the shell.
        const ringEl = ringRefs.current[i];
        if (ringEl) ringEl.setAttribute("stroke-dashoffset", `${-rotationRef.current[i] * 0.6}`);
      });
    },
    displaySyncIntervalMs: 0,
  });

  useEffect(() => {
    animation.play();
    return () => animation.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const protons = protonPositions(atom.protons);
  const neutrons = neutronPositions(atom.neutrons);
  const shellCounts = distributeElectrons(atom.electrons);
  const nucleonCount = atom.protons + atom.neutrons;

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="h-full w-full"
      role="img"
      aria-label={`Atom diagram with ${atom.protons} protons, ${atom.neutrons} neutrons, and ${atom.electrons} electrons across ${shellCounts.length} shells`}
    >
      <AtomDefs />

      {/* Orbit ring guides, with a flowing dash pattern driven by the same clock as the electrons */}
      {shellCounts.map((_, shellIndex) => (
        <circle
          key={`ring-${shellIndex}`}
          ref={(el) => {
            ringRefs.current[shellIndex] = el;
          }}
          cx={CENTER}
          cy={CENTER}
          r={SHELL_RADII[shellIndex] ?? 190 + shellIndex * 35}
          fill="none"
          stroke="currentColor"
          className="text-ink/15 dark:text-bone/20"
          strokeWidth={1}
          strokeDasharray={RING_DASH}
        />
      ))}

      {/* Soft pulsing glow behind the nucleus, suggesting binding energy */}
      {nucleonCount > 0 ? (
        <motion.circle
          cx={CENTER}
          cy={CENTER}
          r={18 + Math.sqrt(nucleonCount) * 4}
          fill="url(#nucleus-glow)"
          animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.08, 0.95] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
        />
      ) : null}

      {/* Nucleus */}
      <g transform={`translate(${CENTER} ${CENTER})`}>
        <AnimatePresence>
          {protons.map((p, i) => (
            <Nucleon key={`proton-${i}`} kind="proton" x={p.x} y={p.y} onSelect={onSelectParticle} />
          ))}
          {neutrons.map((n, i) => (
            <Nucleon key={`neutron-${i}`} kind="neutron" x={n.x} y={n.y} onSelect={onSelectParticle} />
          ))}
        </AnimatePresence>
      </g>

      {/* Electron shells — each in its own rotating group */}
      {shellCounts.map((countInShell, shellIndex) => {
        const radius = SHELL_RADII[shellIndex] ?? 190 + shellIndex * 35;
        return (
          <g
            key={`shell-${shellIndex}`}
            ref={(el) => {
              shellRefs.current[shellIndex] = el;
            }}
            transform={`translate(${CENTER} ${CENTER})`}
          >
            <AnimatePresence>
              {Array.from({ length: countInShell }, (_, i) => {
                const angle = (i / countInShell) * Math.PI * 2;
                return (
                  <Electron
                    key={`electron-${shellIndex}-${i}`}
                    x={Math.cos(angle) * radius}
                    y={Math.sin(angle) * radius}
                    onSelect={onSelectParticle}
                  />
                );
              })}
            </AnimatePresence>
          </g>
        );
      })}
    </svg>
  );
}
