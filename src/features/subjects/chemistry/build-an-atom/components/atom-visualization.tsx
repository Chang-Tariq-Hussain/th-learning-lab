"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAnimation } from "@/features/simulation/hooks/use-animation";
import { usePrefersReducedMotion } from "@/features/simulation";
import type { AtomState } from "../atom-model";
import { distribute, type ShellModelId } from "../shells";
import { protonPositions, neutronPositions } from "../nucleus-layout";
import { Nucleon } from "./nucleon";
import { Electron } from "./electron";
import { AtomDefs } from "./atom-defs";
import type { ParticleKind } from "../particle-info";

interface AtomVisualizationProps {
  atom: AtomState;
  onSelectParticle: (kind: ParticleKind) => void;
  shellModel?: ShellModelId;
  /** Shell number (1 = innermost) to highlight. */
  selectedShell?: number | null;
  showShellLabels?: boolean;
}

const SIZE = 420;
const CENTER = SIZE / 2;
const SHELL_RADII = [62, 92, 122, 152, 180, 204];
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
export function AtomVisualization({ atom, onSelectParticle, shellModel = "intro", selectedShell = null, showShellLabels = true }: AtomVisualizationProps) {
  const reducedMotion = usePrefersReducedMotion();
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
    if (reducedMotion) {
      animation.pause();
      return;
    }
    animation.play();
    return () => animation.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  const protons = protonPositions(atom.protons);
  const neutrons = neutronPositions(atom.neutrons);
  const shellInfos = distribute(atom.electrons, shellModel).shells;
  const shellCounts = shellInfos.map((x) => x.count);
  const nucleonCount = atom.protons + atom.neutrons;
  // Fit the view to what is on screen (like PhET): a small atom is drawn large, a big one still fits.
  const outerShell = shellCounts.length > 0 ? (SHELL_RADII[shellCounts.length - 1] ?? 204 + (shellCounts.length - 1) * 12) : 0;
  const nucleusExtent = 11 * Math.sqrt(nucleonCount + 0.5) + 12;
  const half = Math.min(CENTER, Math.max(outerShell + 22, nucleusExtent + 22, 90));

  return (
    <svg
      viewBox={`${CENTER - half} ${CENTER - half} ${half * 2} ${half * 2}`}
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
          r={SHELL_RADII[shellIndex] ?? 204 + shellIndex * 12}
          fill="none"
          stroke={selectedShell === shellIndex + 1 ? "#F0A54A" : "currentColor"}
          className={selectedShell === shellIndex + 1 ? undefined : "text-ink/15 dark:text-bone/20"}
          strokeWidth={selectedShell === shellIndex + 1 ? 3 : 1}
          strokeDasharray={selectedShell === shellIndex + 1 ? undefined : RING_DASH}
        />
      ))}

      {/* Shell labels sit on the ring at the upper right, outside the rotating groups so they stay readable. */}
      {showShellLabels
        ? shellInfos.map((info, i) => {
            const r = SHELL_RADII[i] ?? 204 + i * 12;
            const angle = -2.4 + i * 0.62;
            const x = CENTER + r * Math.cos(angle);
            const y = CENTER + r * Math.sin(angle);
            const text = `${info.letter} · ${info.count}/${info.capacity}`;
            return (
              <g key={`label-${i}`} pointerEvents="none">
                <rect x={x - 25} y={y - 8} width={50} height={16} rx={8} className="fill-paper/90 stroke-ink/25 dark:fill-chalkboard/90 dark:stroke-bone/30" strokeWidth={0.75} />
                <text x={x} y={y + 0.5} textAnchor="middle" dominantBaseline="central" className="fill-ink font-mono dark:fill-bone" style={{ fontSize: 10 }}>
                  {text}
                </text>
              </g>
            );
          })
        : null}

      {/* Soft pulsing glow behind the nucleus, suggesting binding energy */}
      {nucleonCount > 0 ? (
        <motion.circle
          cx={CENTER}
          cy={CENTER}
          r={22 + Math.sqrt(nucleonCount) * 5}
          fill="url(#nucleus-glow)"
          animate={reducedMotion ? { opacity: 0.8, scale: 1 } : { opacity: [0.6, 1, 0.6], scale: [0.95, 1.08, 0.95] }}
          transition={reducedMotion ? { duration: 0 } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
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
        const radius = SHELL_RADII[shellIndex] ?? 204 + shellIndex * 12;
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
