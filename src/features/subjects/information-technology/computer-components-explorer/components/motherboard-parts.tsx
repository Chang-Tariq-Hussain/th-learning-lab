"use client";

/**
 * Procedural geometry for the "Virtual Computer Hardware Laboratory"
 * motherboard — every part below is built from primitive three.js
 * geometry (boxes, cylinders, rings) rather than an imported model or
 * texture, keeping the scene lightweight. Visual fidelity comes from
 * part count/placement, not polycount or textures.
 *
 * Adapted from the CPU–RAM–Storage Data Flow simulation's
 * `motherboard-parts.tsx` / `camera-rig.tsx` (built there but never
 * wired up into that simulation's UI) — same procedural approach and
 * camera-focus pattern, extended here with a dedicated GPU expansion
 * card and a PSU block, and re-keyed to this topic's own `ComponentId`
 * set so a click always maps onto this simulation's own info panel.
 *
 * `PART_FOCUS` is the single source of truth for where each clickable
 * part sits on/around the board — both the geometry below and
 * `CameraRig`'s focus presets read from it, so a part's visual
 * position and its camera close-up always agree.
 */

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import type { ComponentId } from "../model";

export interface FocusSpec {
  position: [number, number, number];
  target: [number, number, number];
}

export const PCB_TOP_Y = 0.075;

/** Camera close-up for every clickable component. */
export const PART_FOCUS: Record<ComponentId | "overview", FocusSpec> = {
  overview: { position: [3.4, 4.6, 7.4], target: [0, 0, 0] },
  motherboard: { position: [3.4, 4.6, 7.4], target: [0, 0, 0] },
  cpu: { position: [1.5, 1.8, 2.3], target: [1.8, 0.4, 0] },
  cpuCooler: { position: [1.5, 2.4, 2.6], target: [1.8, 0.9, 0] },
  ram: { position: [4.6, 2.0, 2.6], target: [3.6, 0.3, 0] },
  gpu: { position: [-1.0, 2.0, 4.8], target: [-1.0, 0.55, 2.6] },
  storageM2: { position: [-2.0, 1.7, 4.0], target: [-2.5, 0.2, 1.9] },
  storageSata: { position: [-4.0, 1.6, 1.6], target: [-3.9, 0.25, 0.6] },
  chipset: { position: [0.3, 1.6, 3.6], target: [0.3, 0.2, 1.8] },
  pcie: { position: [-1.0, 1.8, 4.6], target: [-1.0, 0.5, 2.6] },
  vrm: { position: [1.8, 1.6, -3.0], target: [1.8, 0.2, -1.6] },
  psu: { position: [-5.4, 2.4, -3.4], target: [-4.6, 0.5, -3.2] },
  rearIo: { position: [-3.6, 1.5, -4.8], target: [-3.9, 0.3, -3.1] },
};

export function getFocus(id: ComponentId | "overview" | null): FocusSpec {
  if (!id) return PART_FOCUS.overview;
  return PART_FOCUS[id] ?? PART_FOCUS.overview;
}

/** Amber accent used for glow marks, decals and copper trace lines. */
const ACCENT = "#B45309";
const ACCENT_BRIGHT = "#F59E0B";

interface PartProps {
  id: ComponentId;
  selected: ComponentId | null;
  hovered: ComponentId | null;
  onSelect: (id: ComponentId) => void;
  onHover: (id: ComponentId | null) => void;
}

/** Shared hover/click wiring + a glowing ground pad under the active part. */
function usePartHandlers(id: ComponentId, onSelect: PartProps["onSelect"], onHover: PartProps["onHover"]) {
  return {
    onClick: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onSelect(id);
    },
    onPointerOver: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onHover(id);
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      onHover(null);
      document.body.style.cursor = "auto";
    },
  };
}

function GlowPad({ active, radius = 1, position }: { active: boolean; radius?: number; position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  return (
    <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]} visible={active}>
      <ringGeometry args={[radius * 0.72, radius, 40]} />
      <meshBasicMaterial color={ACCENT_BRIGHT} transparent opacity={active ? 0.75 : 0} toneMapped={false} />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// PCB base
// ---------------------------------------------------------------------------

export function Pcb({ id, selected, hovered, onSelect, onHover }: PartProps) {
  const handlers = usePartHandlers(id, onSelect, onHover);
  const active = selected === id || hovered === id;
  return (
    <group>
      <mesh position={[0, -0.08, 0]} receiveShadow {...handlers}>
        <boxGeometry args={[9.6, 0.16, 7.2]} />
        <meshStandardMaterial color={active ? "#1d3a2a" : "#152318"} roughness={0.75} metalness={0.1} />
      </mesh>
      {(
        [
          [-4.4, -3.2],
          [4.4, -3.2],
          [-4.4, 3.2],
          [4.4, 3.2],
          [-4.4, 0],
          [4.4, 0],
        ] as [number, number][]
      ).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.08, 0.13, 16]} />
          <meshStandardMaterial color="#3a4a3f" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      <GlowPad active={active} radius={4.9} position={[0, 0.001, 0]} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// CPU socket + package, and a separate tower cooler
// ---------------------------------------------------------------------------

export function CpuAssembly({ cpuProps, coolerProps }: { cpuProps: PartProps; coolerProps: PartProps }) {
  const cpuActive = cpuProps.selected === "cpu" || cpuProps.hovered === "cpu";
  const coolerActive = coolerProps.selected === "cpuCooler" || coolerProps.hovered === "cpuCooler";
  const cpuHandlers = usePartHandlers("cpu", cpuProps.onSelect, cpuProps.onHover);
  const coolerHandlers = usePartHandlers("cpuCooler", coolerProps.onSelect, coolerProps.onHover);

  return (
    <group position={[1.8, 0, 0]}>
      {/* socket frame — part of the CPU click target */}
      <mesh position={[0, 0.04, 0]} castShadow {...cpuHandlers}>
        <boxGeometry args={[1.9, 0.08, 1.9]} />
        <meshStandardMaterial color={cpuActive ? "#8b93a0" : "#5c636e"} metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[1.05, 0.1, -0.85]} rotation={[0, 0.5, 0]} castShadow {...cpuHandlers}>
        <boxGeometry args={[0.9, 0.06, 0.1]} />
        <meshStandardMaterial color="#8a8f98" metalness={0.8} roughness={0.3} />
      </mesh>
      <GlowPad active={cpuActive} radius={1.25} position={[0, 0.005, 0]} />

      {/* CPU package (IHS) */}
      <group position={[0, 0.16, 0]} {...cpuHandlers}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.14, 1.5]} />
          <meshStandardMaterial color={cpuActive ? "#e2e6ea" : "#c7ccd1"} metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.075, 0]}>
          <boxGeometry args={[0.55, 0.01, 0.55]} />
          <meshStandardMaterial color={ACCENT} emissive={ACCENT_BRIGHT} emissiveIntensity={cpuActive ? 1.1 : 0.45} toneMapped={false} />
        </mesh>
        <mesh position={[-0.68, 0.02, -0.68]}>
          <boxGeometry args={[0.14, 0.16, 0.14]} />
          <meshStandardMaterial color="#9aa0a8" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* tower cooler — its own click target */}
      <group position={[0, 0.35, 0]} {...coolerHandlers}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} position={[-0.5 + i * 0.2, 0.35, 0]} castShadow>
            <boxGeometry args={[0.03, 0.7, 1.1]} />
            <meshStandardMaterial color={coolerActive ? "#c3c9d1" : "#9199a3"} metalness={0.6} roughness={0.35} />
          </mesh>
        ))}
        <mesh position={[0, 0.72, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.1, 24]} />
          <meshStandardMaterial color="#20242b" metalness={0.4} roughness={0.5} />
        </mesh>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} position={[0, 0.775, 0]} rotation={[0, (i * Math.PI) / 3, 0]}>
            <boxGeometry args={[0.42, 0.015, 0.09]} />
            <meshStandardMaterial color="#3a3f47" />
          </mesh>
        ))}
        <GlowPad active={coolerActive} radius={0.65} position={[0, -0.348, 0]} />
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// RAM — DIMM slots, two populated
// ---------------------------------------------------------------------------

export function DimmSlots({ id, selected, hovered, onSelect, onHover }: PartProps) {
  const handlers = usePartHandlers(id, onSelect, onHover);
  const active = selected === id || hovered === id;
  const slotZ = [-1.35, -0.45, 0.45, 1.35];
  return (
    <group position={[3.6, 0, 0]} {...handlers}>
      {slotZ.map((z, i) => {
        const populated = i === 1 || i === 2;
        return (
          <group key={i} position={[0, 0, z]}>
            <mesh position={[0, 0.03, 0]} castShadow>
              <boxGeometry args={[0.16, 0.06, 0.62]} />
              <meshStandardMaterial color={active ? "#2b2f36" : "#15171b"} metalness={0.5} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.03, -0.34]}>
              <boxGeometry args={[0.2, 0.08, 0.05]} />
              <meshStandardMaterial color="#3a3f47" />
            </mesh>
            <mesh position={[0, 0.03, 0.34]}>
              <boxGeometry args={[0.2, 0.08, 0.05]} />
              <meshStandardMaterial color="#3a3f47" />
            </mesh>
            {populated && (
              <mesh position={[0, 0.36, 0]} castShadow>
                <boxGeometry args={[0.045, 0.66, 0.58]} />
                <meshStandardMaterial color={active ? "#1f6f43" : "#164d30"} roughness={0.6} metalness={0.15} />
              </mesh>
            )}
            {populated &&
              [-0.18, -0.06, 0.06, 0.18].map((cz, ci) => (
                <mesh key={ci} position={[0.028, 0.44, cz]}>
                  <boxGeometry args={[0.012, 0.16, 0.09]} />
                  <meshStandardMaterial color="#0c0c0e" />
                </mesh>
              ))}
          </group>
        );
      })}
      <GlowPad active={active} radius={1.5} position={[0, 0.001, 0]} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Storage — M.2 NVMe SSD, and a separate SATA drive
// ---------------------------------------------------------------------------

export function M2Storage({ id, selected, hovered, onSelect, onHover }: PartProps) {
  const handlers = usePartHandlers(id, onSelect, onHover);
  const active = selected === id || hovered === id;
  return (
    <group position={[-2.5, 0, 1.9]} {...handlers}>
      <mesh position={[0, 0.03, 0]} castShadow>
        <boxGeometry args={[0.5, 0.045, 1.55]} />
        <meshStandardMaterial color={active ? "#1c1f24" : "#101215"} roughness={0.55} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.06, -0.2]}>
        <boxGeometry args={[0.46, 0.02, 0.9]} />
        <meshStandardMaterial color={active ? "#8b93a0" : "#6b7280"} metalness={0.6} roughness={0.3} />
      </mesh>
      {[-0.5, 0].map((cz, ci) => (
        <mesh key={ci} position={[0.1, 0.06, cz + 0.5]}>
          <boxGeometry args={[0.16, 0.015, 0.2]} />
          <meshStandardMaterial color="#0c0c0e" />
        </mesh>
      ))}
      <mesh position={[0, 0.04, 0.72]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.02, 12]} />
        <meshStandardMaterial color="#9aa0a8" metalness={0.7} />
      </mesh>
      <GlowPad active={active} radius={1} position={[0, 0.001, 0]} />
    </group>
  );
}

/** SATA SSD/HDD, mounted off-board in a drive bay area with a short data cable back to the chipset. */
export function SataStorage({ id, selected, hovered, onSelect, onHover }: PartProps) {
  const handlers = usePartHandlers(id, onSelect, onHover);
  const active = selected === id || hovered === id;
  return (
    <group position={[-3.9, 0.35, 0.6]} {...handlers}>
      <mesh castShadow>
        <boxGeometry args={[1.0, 0.18, 1.4]} />
        <meshStandardMaterial color={active ? "#3a3f47" : "#26292f"} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.1, -0.72]}>
        <boxGeometry args={[0.55, 0.04, 0.06]} />
        <meshStandardMaterial color="#111214" />
      </mesh>
      <Line
        points={[
          new THREE.Vector3(0, 0.1, -0.75),
          new THREE.Vector3(1.0, 0.3, -1.6),
          new THREE.Vector3(0.3, 0.2, -1.8),
        ]}
        color={active ? ACCENT_BRIGHT : "#4a4f57"}
        lineWidth={1.6}
      />
      <GlowPad active={active} radius={1.1} position={[0, -0.18, 0]} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// PCIe expansion slots + GPU card in the primary slot
// ---------------------------------------------------------------------------

export function PcieSlots({ id, selected, hovered, onSelect, onHover }: PartProps) {
  const handlers = usePartHandlers(id, onSelect, onHover);
  const active = selected === id || hovered === id;
  return (
    <group position={[-1.0, 0, 2.6]} {...handlers}>
      {[0, 1].map((i) => (
        <mesh key={i} position={[0, 0.03, 0.42 * i]} castShadow>
          <boxGeometry args={[2.6, 0.05, 0.14]} />
          <meshStandardMaterial color={active ? "#2b2f36" : "#15171b"} metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      <GlowPad active={active} radius={1.5} position={[0, 0.001, 0.2]} />
    </group>
  );
}

export function GpuCard({ id, selected, hovered, onSelect, onHover }: PartProps) {
  const handlers = usePartHandlers(id, onSelect, onHover);
  const active = selected === id || hovered === id;
  return (
    <group position={[-1.0, 0.55, 2.6]} {...handlers}>
      <mesh castShadow>
        <boxGeometry args={[2.3, 0.9, 0.16]} />
        <meshStandardMaterial color={active ? "#2f6fb0" : "#1e4a75"} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* fan shrouds */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.05, 24]} />
          <meshStandardMaterial color="#111214" />
        </mesh>
      ))}
      {/* PCIe bracket / display outputs */}
      {[-0.85, -0.65].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.09]}>
          <boxGeometry args={[0.14, 0.28, 0.05]} />
          <meshStandardMaterial color="#0c0c0e" />
        </mesh>
      ))}
      <GlowPad active={active} radius={1.5} position={[0, -0.451, 0.2]} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Chipset + BIOS decal (both map to the "chipset" click target)
// ---------------------------------------------------------------------------

export function Chipset({ id, selected, hovered, onSelect, onHover }: PartProps) {
  const handlers = usePartHandlers(id, onSelect, onHover);
  const active = selected === id || hovered === id;
  return (
    <group>
      <group position={[0.3, 0, 1.8]} {...handlers}>
        <mesh position={[0, 0.06, 0]} castShadow>
          <boxGeometry args={[0.85, 0.12, 0.85]} />
          <meshStandardMaterial color={active ? "#4a5058" : "#33373d"} metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.125, 0]}>
          <boxGeometry args={[0.3, 0.01, 0.12]} />
          <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={active ? 0.9 : 0.3} toneMapped={false} />
        </mesh>
        <GlowPad active={active} radius={0.75} position={[0, 0.001, 0]} />
      </group>
      {/* BIOS/UEFI firmware chip — conceptually part of the same click target */}
      <group position={[0.3, 0, 1.2]} {...handlers}>
        <mesh position={[0, 0.035, 0]} castShadow>
          <boxGeometry args={[0.28, 0.03, 0.28]} />
          <meshStandardMaterial color={active ? "#3d4148" : "#25282d"} metalness={0.4} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// VRM — power delivery, chokes + heatsink
// ---------------------------------------------------------------------------

export function Vrm({ id, selected, hovered, onSelect, onHover }: PartProps) {
  const handlers = usePartHandlers(id, onSelect, onHover);
  const active = selected === id || hovered === id;
  const chokeX = useMemo(() => Array.from({ length: 7 }, (_, i) => 0.4 + i * 0.28), []);
  return (
    <group position={[0.6, 0, -1.7]} {...handlers}>
      {chokeX.map((x, i) => (
        <mesh key={i} position={[x, 0.06, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.12, 12]} />
          <meshStandardMaterial color={active ? "#5a5f66" : "#3f434a"} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[1.2, 0.16, -0.28]} castShadow>
        <boxGeometry args={[2.2, 0.18, 0.32]} />
        <meshStandardMaterial color={active ? "#6b7280" : "#4a4f57"} metalness={0.7} roughness={0.3} />
      </mesh>
      <GlowPad active={active} radius={1.4} position={[1.2, 0.001, 0]} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// PSU — off-board, with a bundle of cables running to the motherboard
// ---------------------------------------------------------------------------

export function Psu({ id, selected, hovered, onSelect, onHover }: PartProps) {
  const handlers = usePartHandlers(id, onSelect, onHover);
  const active = selected === id || hovered === id;
  return (
    <group position={[-4.6, 0.6, -3.2]} {...handlers}>
      <mesh castShadow>
        <boxGeometry args={[1.5, 1.1, 1.5]} />
        <meshStandardMaterial color={active ? "#4a4f57" : "#2c2f34"} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* fan grille */}
      <mesh position={[0, 0, 0.76]}>
        <ringGeometry args={[0.2, 0.55, 24]} />
        <meshStandardMaterial color="#111214" />
      </mesh>
      <Line
        points={[
          new THREE.Vector3(0.75, -0.2, 0.3),
          new THREE.Vector3(2.2, -0.25, 0.5),
          new THREE.Vector3(2.9, -0.1, 0.1),
        ]}
        color={active ? ACCENT_BRIGHT : "#4a4f57"}
        lineWidth={1.6}
      />
      <GlowPad active={active} radius={1.2} position={[0, -0.551, 0]} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Rear I/O panel
// ---------------------------------------------------------------------------

const IO_PORTS: { color: string; z: number; wide?: boolean }[] = [
  { color: "#2563eb", z: -1.0 },
  { color: "#2563eb", z: -0.75 },
  { color: "#65a30d", z: -0.45 },
  { color: "#16a34a", z: -0.15 },
  { color: "#ec4899", z: 0.1 },
  { color: "#0ea5e9", z: 0.35 },
  { color: "#111827", z: 0.7, wide: true },
];

export function RearIo({ id, selected, hovered, onSelect, onHover }: PartProps) {
  const handlers = usePartHandlers(id, onSelect, onHover);
  const active = selected === id || hovered === id;
  return (
    <group position={[-3.9, 0, -3.1]} {...handlers}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.12, 0.7, 2.1]} />
        <meshStandardMaterial color={active ? "#8b93a0" : "#6b7280"} metalness={0.6} roughness={0.35} />
      </mesh>
      {IO_PORTS.map((port, i) => (
        <mesh key={i} position={[0.08, 0.35, port.z]}>
          <boxGeometry args={[0.06, port.wide ? 0.22 : 0.14, port.wide ? 0.3 : 0.16]} />
          <meshStandardMaterial color={port.color} metalness={0.3} roughness={0.4} />
        </mesh>
      ))}
      <GlowPad active={active} radius={1.3} position={[0, 0.001, 0]} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Copper trace lines — the "Connections" layer
// ---------------------------------------------------------------------------

function tracePoints(waypoints: [number, number][]): THREE.Vector3[] {
  return waypoints.map(([x, z]) => new THREE.Vector3(x, PCB_TOP_Y + 0.005, z));
}

export function Traces() {
  const paths = useMemo<[number, number][][]>(
    () => [
      [
        [1.8, 0],
        [2.6, 0],
        [2.6, 0.6],
        [3.6, 0.6],
      ],
      [
        [1.4, 0.6],
        [0.3, 0.6],
        [0.3, 1.6],
      ],
      [
        [0.3, 2.0],
        [0.3, 2.6],
        [-1.4, 2.6],
        [-1.4, 1.9],
        [-2.5, 1.9],
      ],
      [
        [1.4, -0.4],
        [0.8, -0.4],
        [0.8, -1.7],
      ],
      [
        [0.3, 1.4],
        [-2.0, 1.4],
        [-2.0, 2.4],
        [-2.5, 2.4],
      ],
      [
        [-1.0, 2.6],
        [-1.0, 3.1],
      ],
    ],
    []
  );
  return (
    <group>
      {paths.map((wp, i) => (
        <Line key={i} points={tracePoints(wp)} color={ACCENT} lineWidth={1.4} transparent opacity={0.55} />
      ))}
    </group>
  );
}
