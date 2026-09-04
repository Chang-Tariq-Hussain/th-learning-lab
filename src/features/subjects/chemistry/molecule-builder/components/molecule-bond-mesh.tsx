"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

interface MoleculeBondMeshProps {
  id: string;
  from: readonly [number, number, number];
  to: readonly [number, number, number];
  order: 1 | 2 | 3;
  /** True when this bond is adjacent to the currently selected atom
   *  (or bond) — a soft highlight that answers "which bonds touch
   *  this atom?" without implying the bond itself was clicked. */
  highlighted: boolean;
  /** True when this exact bond was clicked and its detail panel is
   *  open — a stronger emphasis than `highlighted`. */
  selected: boolean;
  onSelect: (id: string) => void;
}

const BOND_RADIUS = 0.05;
/** Invisible, fatter cylinder layered over each strand purely to make
 *  bonds easy to click/tap — the visible cylinders are thin by design
 *  (that's what reads as "a bond" rather than "a rod"), which would
 *  otherwise make them a frustratingly small hit target in 3D. */
const HIT_RADIUS = 0.16;
const STRAND_GAP = 0.13;
const GROW_DURATION_S = 0.4;

/**
 * A single covalent bond between two atom centers, rendered as one,
 * two, or three parallel cylinders depending on bond order — the same
 * "obviously more than one bond" convention as a standard skeletal
 * formula, just extended into 3D so it reads correctly from any
 * rotation rather than only face-on. Each strand is offset along a
 * vector that's perpendicular to the bond axis and (as much as
 * possible) to world-up, so double/triple bonds fan out sideways
 * rather than stacking front-to-back where they'd overlap visually.
 *
 * Also owns the bond's own click target (so bonds are selectable
 * exactly like atoms — see `onSelect`) and a subtle "grow in from the
 * middle" scale-in on mount, so switching molecules reads as bonds
 * *forming* between the atoms rather than just appearing — the
 * animation the brief asks for (atom -> interaction -> bond), kept
 * deliberately understated rather than a flashy effect.
 */
export function MoleculeBondMesh({
  id,
  from,
  to,
  order,
  highlighted,
  selected,
  onSelect,
}: MoleculeBondMeshProps) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const growElapsed = useRef(0);

  const strands = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

    const up = new THREE.Vector3(0, 1, 0);
    let perpendicular = new THREE.Vector3()
      .crossVectors(direction, up)
      .normalize();
    if (perpendicular.lengthSq() < 1e-6) {
      // Bond is parallel to world-up — fall back to another axis.
      perpendicular = new THREE.Vector3()
        .crossVectors(direction, new THREE.Vector3(1, 0, 0))
        .normalize();
    }

    const offsets =
      order === 1 ? [0] : order === 2 ? [-STRAND_GAP / 2, STRAND_GAP / 2] : [-STRAND_GAP, 0, STRAND_GAP];

    return offsets.map((offset) => {
      const position = mid
        .clone()
        .add(perpendicular.clone().multiplyScalar(offset));
      return { position: position.toArray() as [number, number, number], length };
    });
  }, [from, to, order]);

  // Recompute quaternion once (shared by every strand of this bond).
  const quaternion = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const direction = new THREE.Vector3().subVectors(end, start).normalize();
    return new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction,
    );
  }, [from, to]);

  // Subtle grow-in: scale the whole bond group up from the middle
  // over GROW_DURATION_S whenever this bond mounts (a molecule switch
  // remounts the canvas — see `molecule-canvas.tsx` — so this replays
  // for every new molecule, which is the point: it's meant to read as
  // "these bonds are forming," not a one-off page-load flourish).
  useFrame((_, delta) => {
    if (growElapsed.current >= GROW_DURATION_S || !groupRef.current) return;
    growElapsed.current = Math.min(GROW_DURATION_S, growElapsed.current + delta);
    const t = growElapsed.current / GROW_DURATION_S;
    const eased = 1 - Math.pow(1 - t, 3);
    groupRef.current.scale.setScalar(0.15 + eased * 0.85);
  });

  const color = selected ? "#F4C95D" : highlighted ? "#D9B8FF" : "#B8C0CC";

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(id);
  };

  return (
    <group ref={groupRef} scale={0.15}>
      {strands.map((strand, index) => (
        <group key={index} position={strand.position} quaternion={quaternion}>
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
          >
            <cylinderGeometry args={[HIT_RADIUS, HIT_RADIUS, strand.length, 8]} />
            <meshBasicMaterial visible={false} />
          </mesh>
          <mesh raycast={() => null}>
            <cylinderGeometry args={[BOND_RADIUS, BOND_RADIUS, strand.length, 12]} />
            <meshStandardMaterial
              color={color}
              roughness={0.5}
              metalness={0.05}
              emissive={color}
              emissiveIntensity={selected ? 0.5 : hovered ? 0.2 : 0}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
