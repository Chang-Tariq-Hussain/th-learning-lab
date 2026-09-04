"use client";

import { useState } from "react";
import { Html } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { ELEMENT_COLOR, ELEMENT_RADIUS, type BuildAtomInstance } from "../../build-model";

interface BuildAtomMeshProps {
  atom: BuildAtomInstance;
  selected: boolean;
  onDragStart: (id: string, event: ThreeEvent<PointerEvent>) => void;
}

/**
 * One draggable atom in the free-build scene. Visually the same
 * sphere-plus-label convention as Explore mode's `MoleculeAtomMesh`
 * (same element colors/radii, same selected ring), but every pointer
 * interaction starts through `onDragStart` — the drag manager in
 * `build-canvas.tsx` is what decides whether a given press-and-release
 * counts as a click (select) or a drag (reposition), based on how far
 * the pointer actually moved, so there's only one source of truth for
 * that distinction rather than two competing handlers here.
 */
export function BuildAtomMesh({ atom, selected, onDragStart }: BuildAtomMeshProps) {
  const [hovered, setHovered] = useState(false);
  const radius = ELEMENT_RADIUS[atom.element];
  const color = ELEMENT_COLOR[atom.element];

  return (
    <group position={atom.position}>
      <mesh
        onPointerDown={(event) => {
          event.stopPropagation();
          onDragStart(atom.id, event);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "grab";
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        scale={hovered && !selected ? 1.06 : 1}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.35}
          metalness={0.1}
          emissive={color}
          emissiveIntensity={selected ? 0.35 : hovered ? 0.15 : 0}
        />
      </mesh>
      {selected ? (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius + 0.05, radius + 0.09, 40]} />
          <meshBasicMaterial color="#F4C95D" toneMapped={false} />
        </mesh>
      ) : null}
      <Html center distanceFactor={5} style={{ pointerEvents: "none" }} occlude={false}>
        <span
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "13px",
            fontWeight: 600,
            color: "#0B0F14",
            background: "rgba(255,255,255,0.85)",
            borderRadius: "9999px",
            padding: "1px 6px",
            userSelect: "none",
          }}
        >
          {atom.element}
        </span>
      </Html>
    </group>
  );
}
