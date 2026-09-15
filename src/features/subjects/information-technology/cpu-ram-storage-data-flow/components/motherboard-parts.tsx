"use client";

/**
 * Procedural geometry for the 3D "Interactive Computer Architecture
 * Laboratory" motherboard — every part below is built from primitive
 * three.js geometry (boxes, cylinders) rather than an imported model
 * or texture, per the brief's "procedural over asset-heavy" direction.
 * Visual fidelity comes from part count/placement, not polycount.
 *
 * `PART_FOCUS` is the single source of truth for where each clickable
 * part sits on the board — both the geometry below and `CameraRig`'s
 * focus presets read from it, so a part's visual position and its
 * camera close-up always agree.
 */

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import type { ComponentId, PhysicalComponentId } from "../model";

export type SelectableId = ComponentId | PhysicalComponentId;

export interface FocusSpec {
  position: [number, number, number];
  target: [number, number, number];
}

export const PCB_TOP_Y = 0.075;

/** Camera close-up for every clickable id, physical or architectural. */
export const PART_FOCUS: Record<SelectableId | "overview", FocusSpec> = {
  overview: { position: [3.4, 4.6, 7.4], target: [0, 0, 0] },
  motherboard: { position: [3.4, 4.6, 7.4], target: [0, 0, 0] },
  cpuSocket: { position: [1.5, 1.8, 2.3], target: [1.8, 0.4, 0] },
  cpu: { position: [1.5, 1.8, 2.3], target: [1.8, 0.4, 0] },
  ram: { position: [4.6, 2.0, 2.6], target: [3.5, 0.3, 0] },
  storage: { position: [-2.0, 1.7, 4.0], target: [-2.5, 0.2, 1.9] },
  chipset: { position: [0.3, 1.6, 3.6], target: [0.3, 0.2, 1.8] },
  bios: { position: [0.3, 1.3, 3.0], target: [0.3, 0.15, 1.35] },
  pcie: { position: [-1.0, 1.8, 4.6], target: [-1.0, 0.5, 2.6] },
  vrm: { position: [1.8, 1.6, -3.0], target: [1.8, 0.2, -1.6] },
  io: { position: [-3.6, 1.5, -4.8], target: [-3.9, 0.3, -3.1] },
  // Architectural ids not physically placed on the board (registers, ALU,
  // buses, cache) fall back to the CPU close-up — clicking them in the 2D
  // diagram doesn't move the 3D camera at all, this only covers the case
  // where `getFocus` is called defensively.
  l1: { position: [1.5, 1.8, 2.3], target: [1.8, 0.4, 0] },
  l2: { position: [1.5, 1.8, 2.3], target: [1.8, 0.4, 0] },
  l3: { position: [1.5, 1.8, 2.3], target: [1.8, 0.4, 0] },
  pc: { position: [1.5, 1.8, 2.3], target: [1.8, 0.4, 0] },
  ir: { position: [1.5, 1.8, 2.3], target: [1.8, 0.4, 0] },
  controlUnit: { position: [1.5, 1.8, 2.3], target: [1.8, 0.4, 0] },
  r1: { position: [1.5, 1.8, 2.3], target: [1.8, 0.4, 0] },
  r2: { position: [1.5, 1.8, 2.3], target: [1.8, 0.4, 0] },
  alu: { position: [1.5, 1.8, 2.3], target: [1.8, 0.4, 0] },
  addressBus: { position: [3.4, 4.6, 7.4], target: [0, 0, 0] },
  dataBus: { position: [3.4, 4.6, 7.4], target: [0, 0, 0] },
  controlBus: { position: [3.4, 4.6, 7.4], target: [0, 0, 0] },
};

export function getFocus(id: SelectableId | "overview" | null): FocusSpec {
  if (!id) return PART_FOCUS.overview;
  return PART_FOCUS[id] ?? PART_FOCUS.overview;
}

/** Amber accent used for glow marks, decals and copper trace lines. */
const ACCENT = "#B45309";
const ACCENT_BRIGHT = "#F59E0B";

interface PartProps {
  id: SelectableId;
  selected: SelectableId | null;
  hovered: SelectableId | null;
  onSelect: (id: SelectableId) => void;
  onHover: (id: SelectableId | null) => void;
}

/** Shared hover/click wiring + a glowing ground pad under the active part. */
function usePartHandlers(id: SelectableId, onSelect: PartProps["onSelect"], onHover: PartProps["onHover"]) {
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
      {/* mounting standoffs, purely decorative */}
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
// CPU socket + package + simplified cooler
// ---------------------------------------------------------------------------

export function CpuAssembly({
  socketProps,
  cpuProps,
}: {
  socketProps: PartProps;
  cpuProps: PartProps;
}) {
  const socketActive = socketProps.selected === "cpuSocket" || socketProps.hovered === "cpuSocket";
  const cpuActive = cpuProps.selected === "cpu" || cpuProps.hovered === "cpu";
  const socketHandlers = usePartHandlers("cpuSocket", socketProps.onSelect, socketProps.onHover);
  const cpuHandlers = usePartHandlers("cpu", cpuProps.onSelect, cpuProps.onHover);

  return (
    <group position={[1.8, 0, 0]}>
      {/* socket frame */}
      <mesh position={[0, 0.04, 0]} castShadow {...socketHandlers}>
        <boxGeometry args={[1.9, 0.08, 1.9]} />
        <meshStandardMaterial color={socketActive ? "#8b93a0" : "#5c636e"} metalness={0.7} roughness={0.35} />
      </mesh>
      {/* retention lever */}
      <mesh position={[1.05, 0.1, -0.85]} rotation={[0, 0.5, 0]} castShadow {...socketHandlers}>
        <boxGeometry args={[0.9, 0.06, 0.1]} />
        <meshStandardMaterial color="#8a8f98" metalness={0.8} roughness={0.3} />
      </mesh>
      <GlowPad active={socketActive && !cpuActive} radius={1.25} position={[0, 0.005, 0]} />

      {/* CPU package (IHS) */}
      <group position={[0, 0.16, 0]} {...cpuHandlers}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.14, 1.5]} />
          <meshStandardMaterial color={cpuActive ? "#e2e6ea" : "#c7ccd1"} metalness={0.85} roughness={0.2} />
        </mesh>
        {/* die decal */}
        <mesh position={[0, 0.075, 0]}>
          <boxGeometry args={[0.55, 0.01, 0.55]} />
          <meshStandardMaterial
            color={ACCENT}
            emissive={ACCENT_BRIGHT}
            emissiveIntensity={cpuActive ? 1.1 : 0.45}
            toneMapped={false}
          />
        </mesh>
        {/* corner notch, orientation cue */}
        <mesh position={[-0.68, 0.02, -0.68]}>
          <boxGeometry args={[0.14, 0.16, 0.14]} />
          <meshStandardMaterial color="#9aa0a8" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      <GlowPad active={cpuActive} radius={1.05} position={[0, 0.011, 0]} />

      {/* simplified tower cooler, purely decorative — shares the CPU click target */}
      <group position={[0, 0.35, 0]} onClick={cpuHandlers.onClick} onPointerOver={cpuHandlers.onPointerOver} onPointerOut={cpuHandlers.onPointerOut}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} position={[-0.5 + i * 0.2, 0.35, 0]} castShadow>
            <boxGeometry args={[0.03, 0.7, 1.1]} />
            <meshStandardMaterial color="#9199a3" metalness={0.6} roughness={0.35} />
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
            {/* slot connector */}
            <mesh position={[0, 0.03, 0]} castShadow>
              <boxGeometry args={[0.16, 0.06, 0.62]} />
              <meshStandardMaterial color={active ? "#2b2f36" : "#15171b"} metalness={0.5} roughness={0.5} />
            </mesh>
            {/* retention clips */}
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
// Storage — M.2 NVMe SSD
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
      {/* heatsink label plate */}
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
      {/* mounting screw */}
      <mesh position={[0, 0.04, 0.72]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.02, 12]} />
        <meshStandardMaterial color="#9aa0a8" metalness={0.7} />
      </mesh>
      <GlowPad active={active} radius={1} position={[0, 0.001, 0]} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// PCIe expansion slots + one populated card
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
      {/* populated expansion card, standing in the first slot */}
      <group position={[0, 0.55, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.3, 0.9, 0.16]} />
          <meshStandardMaterial color={active ? "#3a3f47" : "#26292f"} metalness={0.5} roughness={0.4} />
        </mesh>
        {[-0.65, 0.65].map((x, i) => (
          <mesh key={i} position={[x, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.05, 24]} />
            <meshStandardMaterial color="#111214" />
          </mesh>
        ))}
      </group>
      <GlowPad active={active} radius={1.5} position={[0, 0.001, 0.2]} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Chipset + BIOS
// ---------------------------------------------------------------------------

export function ChipsetAndBios({ chipsetProps, biosProps }: { chipsetProps: PartProps; biosProps: PartProps }) {
  const chipsetActive = chipsetProps.selected === "chipset" || chipsetProps.hovered === "chipset";
  const biosActive = biosProps.selected === "bios" || biosProps.hovered === "bios";
  const chipsetHandlers = usePartHandlers("chipset", chipsetProps.onSelect, chipsetProps.onHover);
  const biosHandlers = usePartHandlers("bios", biosProps.onSelect, biosProps.onHover);
  return (
    <group>
      <group position={[0.3, 0, 1.8]} {...chipsetHandlers}>
        <mesh position={[0, 0.06, 0]} castShadow>
          <boxGeometry args={[0.85, 0.12, 0.85]} />
          <meshStandardMaterial color={chipsetActive ? "#4a5058" : "#33373d"} metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.125, 0]}>
          <boxGeometry args={[0.3, 0.01, 0.12]} />
          <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={chipsetActive ? 0.9 : 0.3} toneMapped={false} />
        </mesh>
        <GlowPad active={chipsetActive} radius={0.75} position={[0, 0.001, 0]} />
      </group>

      <group position={[0.3, 0, 1.2]} {...biosHandlers}>
        <mesh position={[0, 0.035, 0]} castShadow>
          <boxGeometry args={[0.28, 0.03, 0.28]} />
          <meshStandardMaterial color={biosActive ? "#3d4148" : "#25282d"} metalness={0.4} roughness={0.5} />
        </mesh>
        <GlowPad active={biosActive} radius={0.4} position={[0, 0.001, 0]} />
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
// Rear I/O panel
// ---------------------------------------------------------------------------

const IO_PORTS: { color: string; z: number; wide?: boolean }[] = [
  { color: "#2563eb", z: -1.0 }, // USB
  { color: "#2563eb", z: -0.75 }, // USB
  { color: "#65a30d", z: -0.45 }, // Ethernet
  { color: "#16a34a", z: -0.15 }, // audio (green)
  { color: "#ec4899", z: 0.1 }, // audio (pink)
  { color: "#0ea5e9", z: 0.35 }, // audio (blue)
  { color: "#111827", z: 0.7, wide: true }, // display
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
// Copper trace lines — decorative data-pathway hints on the PCB surface
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
