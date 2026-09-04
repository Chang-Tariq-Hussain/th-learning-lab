"use client";

import { useState } from "react";
import { Html } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import {
  ELEMENT_COLOR,
  ELEMENT_RADIUS,
  type MoleculeAtomSpec,
} from "../molecule-model";

interface MoleculeAtomMeshProps {
  atom: MoleculeAtomSpec;
  selected: boolean;
  /** True when this atom is one of the two endpoints of the currently
   *  selected bond — a softer ring than `selected`'s, so clicking a
   *  bond visibly answers "which atoms does this connect?" the same
   *  way clicking an atom answers "which bonds touch this?" */
  connectedToSelectedBond: boolean;
  onSelect: (id: string) => void;
}

/**
 * One atom in the 3D scene: a sphere sized/colored by element, a
 * billboarded symbol label (via drei's `Html`, so it's real DOM text —
 * legible at any zoom and still present if WebGL text rendering isn't
 * available), and a thin highlight ring when selected. Hover state
 * swaps the cursor so it's clear atoms are clickable, matching the
 * "select an atom to inspect it" pattern from Bond Builder/Build an
 * Atom, now driven by a raycasted 3D click instead of an SVG one.
 */
export function MoleculeAtomMesh({
  atom,
  selected,
  connectedToSelectedBond,
  onSelect,
}: MoleculeAtomMeshProps) {
  const [hovered, setHovered] = useState(false);
  const radius = ELEMENT_RADIUS[atom.element];
  const color = ELEMENT_COLOR[atom.element];

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(atom.id);
  };

  return (
    <group position={atom.position}>
      <mesh
        onClick={handleClick}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
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
      {!selected && connectedToSelectedBond ? (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius + 0.04, radius + 0.07, 40]} />
          <meshBasicMaterial color="#D9B8FF" toneMapped={false} transparent opacity={0.85} />
        </mesh>
      ) : null}
      <Html
        center
        distanceFactor={5}
        style={{ pointerEvents: "none" }}
        occlude={false}
      >
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
