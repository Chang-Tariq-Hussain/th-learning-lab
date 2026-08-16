"use client";

import { useRef } from "react";
import {
  FieldLines,
  Magnet,
  PLAYGROUND_HEIGHT,
  PLAYGROUND_WIDTH,
  angleBetween,
  clampToPlayground,
  pointerToPlaygroundPoint,
  type MagnetState,
} from "@/features/subjects/physics/magnet-explorer";
import { getFieldAt } from "../compass-field";
import { clampCompassToPlayground, type CompassState } from "../compass-model";
import { Compass } from "./compass";

export type DraggableId = "magnet" | "compass";
type DragMode = "move" | "rotate";

export interface PlaygroundProps {
  magnet: MagnetState;
  compass: CompassState;
  draggingId: DraggableId | null;
  onMagnetMove: (x: number, y: number) => void;
  onMagnetRotate: (rotation: number) => void;
  onCompassMove: (x: number, y: number) => void;
  onDragStart: (id: DraggableId) => void;
  onDragEnd: () => void;
}

/**
 * The playground for the Compass Explorer: one draggable/rotatable
 * magnet (the exact `Magnet` component from the Magnet Explorer) and
 * one draggable compass. Pointer capture and coordinate conversion
 * mirror that feature's own `Playground` — the "what does a drag/rotate
 * mean" math lives in the shared `magnet-model.ts` either way.
 */
export function Playground({
  magnet,
  compass,
  draggingId,
  onMagnetMove,
  onMagnetRotate,
  onCompassMove,
  onDragStart,
  onDragEnd,
}: PlaygroundProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const modeRef = useRef<DragMode>("move");
  const grabOffsetRef = useRef({ dx: 0, dy: 0 });

  const startMagnetDrag = (mode: DragMode) => (e: React.PointerEvent) => {
    e.stopPropagation();
    if (!svgRef.current) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    const point = pointerToPlaygroundPoint(e, svgRef.current);
    grabOffsetRef.current = { dx: point.x - magnet.x, dy: point.y - magnet.y };
    modeRef.current = mode;
    onDragStart("magnet");
  };

  const startCompassDrag = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (!svgRef.current) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    const point = pointerToPlaygroundPoint(e, svgRef.current);
    grabOffsetRef.current = { dx: point.x - compass.x, dy: point.y - compass.y };
    modeRef.current = "move";
    onDragStart("compass");
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId || !svgRef.current) return;
    const point = pointerToPlaygroundPoint(e, svgRef.current);

    if (draggingId === "magnet") {
      if (modeRef.current === "rotate") {
        onMagnetRotate(angleBetween({ x: magnet.x, y: magnet.y }, point));
      } else {
        const { dx, dy } = grabOffsetRef.current;
        const clamped = clampToPlayground(point.x - dx, point.y - dy);
        onMagnetMove(clamped.x, clamped.y);
      }
    } else {
      const { dx, dy } = grabOffsetRef.current;
      const clamped = clampCompassToPlayground(point.x - dx, point.y - dy);
      onCompassMove(clamped.x, clamped.y);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggingId) return;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    onDragEnd();
  };

  const field = getFieldAt(magnet, { x: compass.x, y: compass.y });

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${PLAYGROUND_WIDTH} ${PLAYGROUND_HEIGHT}`}
      className="h-full w-full touch-none select-none rounded-[1.75rem] border border-line bg-white/70 shadow-card dark:border-line-dark dark:bg-white/[0.04]"
      role="application"
      aria-label="Compass playground — drag the magnet and the compass to see the needle follow the magnetic field"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <FieldLines magnet={magnet} />

      <Magnet
        magnet={magnet}
        label="Magnet"
        active={draggingId === "magnet"}
        onBodyPointerDown={startMagnetDrag("move")}
        onHandlePointerDown={startMagnetDrag("rotate")}
      />

      <Compass
        compass={compass}
        fieldAngleDeg={field.angleDeg}
        fieldStrength={field.strength}
        active={draggingId === "compass"}
        onBodyPointerDown={startCompassDrag}
      />
    </svg>
  );
}
