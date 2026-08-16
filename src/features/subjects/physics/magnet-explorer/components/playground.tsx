"use client";

import { useRef } from "react";
import {
  PLAYGROUND_HEIGHT,
  PLAYGROUND_WIDTH,
  angleBetween,
  clampToPlayground,
  pointerToPlaygroundPoint,
  type MagnetId,
  type MagnetState,
} from "../magnet-model";
import type { InteractionStatus } from "../magnet-physics";
import { FieldLines } from "./field-lines";
import { Magnet } from "./magnet";

export interface PlaygroundProps {
  magnets: Record<MagnetId, MagnetState>;
  draggingId: MagnetId | null;
  status: InteractionStatus;
  onDragMove: (id: MagnetId, x: number, y: number) => void;
  onRotate: (id: MagnetId, rotation: number) => void;
  onDragStart: (id: MagnetId) => void;
  onDragEnd: () => void;
}

type DragMode = "move" | "rotate";

/**
 * The large center playground. Owns pointer capture and converts pointer
 * coordinates into playground space; the actual "what does a drag/rotate
 * mean" math lives in `magnet-model.ts` so it can be tested and reused
 * without a DOM.
 */
export function Playground({
  magnets,
  draggingId,
  status,
  onDragMove,
  onRotate,
  onDragStart,
  onDragEnd,
}: PlaygroundProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const modeRef = useRef<DragMode>("move");
  const grabOffsetRef = useRef({ dx: 0, dy: 0 });

  const startDrag = (id: MagnetId, mode: DragMode) => (e: React.PointerEvent) => {
    e.stopPropagation();
    if (!svgRef.current) return;
    (e.target as Element).setPointerCapture(e.pointerId);

    const point = pointerToPlaygroundPoint(e, svgRef.current);
    const magnet = magnets[id];
    grabOffsetRef.current = { dx: point.x - magnet.x, dy: point.y - magnet.y };
    modeRef.current = mode;
    onDragStart(id);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId || !svgRef.current) return;
    const point = pointerToPlaygroundPoint(e, svgRef.current);
    const magnet = magnets[draggingId];

    if (modeRef.current === "rotate") {
      onRotate(draggingId, angleBetween({ x: magnet.x, y: magnet.y }, point));
    } else {
      const { dx, dy } = grabOffsetRef.current;
      const clamped = clampToPlayground(point.x - dx, point.y - dy);
      onDragMove(draggingId, clamped.x, clamped.y);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggingId) return;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    onDragEnd();
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${PLAYGROUND_WIDTH} ${PLAYGROUND_HEIGHT}`}
      className="h-full w-full touch-none select-none rounded-[1.75rem] border border-line bg-white/70 shadow-card dark:border-line-dark dark:bg-white/[0.04]"
      role="application"
      aria-label="Magnet playground — drag the magnets to see how they attract and repel"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {(Object.keys(magnets) as MagnetId[]).map((id) => (
        <FieldLines key={`field-${id}`} magnet={magnets[id]} />
      ))}

      {(Object.keys(magnets) as MagnetId[]).map((id) => (
        <Magnet
          key={id}
          magnet={magnets[id]}
          label={id === "a" ? "Magnet 1" : "Magnet 2"}
          active={draggingId === id}
          glowPole={status.poles ? status.poles[id] : null}
          interactionType={status.type}
          onBodyPointerDown={startDrag(id, "move")}
          onHandlePointerDown={startDrag(id, "rotate")}
        />
      ))}
    </svg>
  );
}
