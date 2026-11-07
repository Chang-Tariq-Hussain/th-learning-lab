"use client";

import { type PointerEvent as ReactPointerEvent, type KeyboardEvent as ReactKeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { Scan, ZoomIn, ZoomOut } from "lucide-react";
import { useStageSize } from "@/features/simulation";
import { organellesFor } from "../data/organelles";
import { VIEW_H, VIEW_W, type UseViewportResult } from "../hooks/use-viewport";
import { SceneLabel, type LabelSpec } from "../scene/labels";
import { SceneContext, type SceneState } from "../scene/part";
import { ANIMAL_CENTERS, ANIMAL_LABELS, AnimalScene } from "../scene/animal-scene";
import { PLANT_CENTERS, PLANT_LABELS, PlantScene } from "../scene/plant-scene";
import { SceneDefs } from "../scene/shapes";
import type { CellKind } from "../types";

export const CENTERS: Record<CellKind, Record<string, { x: number; y: number }>> = {
  animal: ANIMAL_CENTERS,
  plant: PLANT_CENTERS,
};

const LABELS: Record<CellKind, LabelSpec[]> = { animal: ANIMAL_LABELS, plant: PLANT_LABELS };

export interface CellStageProps {
  kind: CellKind;
  scene: Omit<SceneState, "reducedMotion">;
  reducedMotion: boolean;
  viewport: UseViewportResult;
  /** Show every structure's name tag. */
  showAllLabels: boolean;
  /** One structure to label even when `showAllLabels` is off (the selected or just-answered structure). */
  focusLabelId: string | null;
}

const DRAG_THRESHOLD = 5;

/**
 * The cell picture: an SVG scene inside a pan/zoom viewport, plus the zoom buttons. Dragging pans once zoomed in;
 * Ctrl/Cmd + wheel or a two-finger pinch zooms; with the stage focused, + / - / 0 and the arrow keys do the same.
 * Pointer capture only starts after a real drag, so ordinary clicks and taps always reach the structure beneath.
 */
export function CellStage({ kind, scene, reducedMotion, viewport, showAllLabels, focusLabelId }: CellStageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ startX: number; startY: number; dragging: boolean; pinchDist: number } | null>(null);
  const suppressClick = useRef(false);
  const [dragging, setDragging] = useState(false);
  const { width, height } = useStageSize();

  const fit = width > 0 && height > 0 ? Math.min(width / VIEW_W, height / VIEW_H) : 1;
  const unit = fit * viewport.scale;

  const sceneValue = useMemo<SceneState>(() => ({ ...scene, reducedMotion }), [scene, reducedMotion]);

  /** Converts a client-pixel delta into scene units. */
  const pxToUnits = () => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return 1;
    return 1 / Math.min(rect.width / VIEW_W, rect.height / VIEW_H);
  };
  const clientToScene = (clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: VIEW_W / 2, y: VIEW_H / 2 };
    const f = Math.min(rect.width / VIEW_W, rect.height / VIEW_H);
    return { x: (clientX - rect.left - (rect.width - VIEW_W * f) / 2) / f, y: (clientY - rect.top - (rect.height - VIEW_H * f) / 2) / f };
  };

  // Ctrl/Cmd + wheel zooms (a plain wheel keeps scrolling the page). Needs a non-passive listener.
  const { zoomAt } = viewport;
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const p = clientToScene(e.clientX, e.clientY);
      zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, p.x, p.y);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) gesture.current = { startX: e.clientX, startY: e.clientY, dragging: false, pinchDist: 0 };
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = { startX: e.clientX, startY: e.clientY, dragging: true, pinchDist: Math.hypot(a!.x - b!.x, a!.y - b!.y) };
      setDragging(true);
    }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    const prev = pointers.current.get(e.pointerId);
    if (!g || !prev || !viewport.isZoomed) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      if (g.pinchDist > 0 && dist > 0) {
        const mid = clientToScene((a!.x + b!.x) / 2, (a!.y + b!.y) / 2);
        viewport.zoomAt(dist / g.pinchDist, mid.x, mid.y);
      }
      g.pinchDist = dist;
      suppressClick.current = true;
      return;
    }
    if (!g.dragging) {
      if (Math.hypot(e.clientX - g.startX, e.clientY - g.startY) < DRAG_THRESHOLD) return;
      g.dragging = true;
      setDragging(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* capture is a nicety; dragging still works without it */
      }
    }
    const k = pxToUnits();
    viewport.panBy((e.clientX - prev.x) * k, (e.clientY - prev.y) * k);
    suppressClick.current = true;
  };

  const endPointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) {
      gesture.current = null;
      setDragging(false);
      // The click that follows a drag must not select whatever the drag ended on.
      if (suppressClick.current) window.setTimeout(() => (suppressClick.current = false), 0);
    }
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const step = 40;
    switch (e.key) {
      case "+":
      case "=":
        e.preventDefault();
        viewport.zoomIn();
        break;
      case "-":
      case "_":
        e.preventDefault();
        viewport.zoomOut();
        break;
      case "0":
        e.preventDefault();
        viewport.reset();
        break;
      case "ArrowLeft":
        if (viewport.isZoomed) (e.preventDefault(), viewport.panBy(step, 0));
        break;
      case "ArrowRight":
        if (viewport.isZoomed) (e.preventDefault(), viewport.panBy(-step, 0));
        break;
      case "ArrowUp":
        if (viewport.isZoomed) (e.preventDefault(), viewport.panBy(0, step));
        break;
      case "ArrowDown":
        if (viewport.isZoomed) (e.preventDefault(), viewport.panBy(0, -step));
        break;
    }
  };

  const labels = LABELS[kind];
  const focusLabel = focusLabelId ? labels.find((l) => l.id === focusLabelId) : undefined;
  const names = organellesFor(kind).map((o) => o.name.toLowerCase()).join(", ");
  const descId = `cell-stage-desc-${kind}`;

  const btn =
    "flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 bg-paper/95 text-ink shadow-sm transition-colors hover:bg-ink/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:pointer-events-none disabled:opacity-40 dark:border-bone/30 dark:bg-chalkboard/95 dark:text-bone dark:hover:bg-bone/[0.08] dark:focus-visible:outline-bone";

  return (
    <div
      ref={wrapRef}
      role="group"
      aria-label={`${kind === "animal" ? "Animal" : "Plant"} cell diagram. Press plus or minus to zoom, zero to reset.`}
      aria-describedby={descId}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onClickCapture={(e) => {
        if (suppressClick.current) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
      className="relative h-full w-full select-none rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink dark:focus-visible:outline-bone"
      style={{ touchAction: viewport.isZoomed ? "none" : "pan-y", cursor: viewport.isZoomed ? (dragging ? "grabbing" : "grab") : undefined }}
      data-testid="cell-stage"
      data-zoom={viewport.scale.toFixed(2)}
    >
      <p id={descId} className="sr-only">
        {kind === "animal" ? "Animal" : "Plant"} cell, drawn as a simplified diagram that is not to scale. Structures shown: {names}. Every structure can also be chosen
        from the list of structures beside the diagram.
      </p>
      <svg ref={svgRef} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" overflow="hidden" aria-hidden={false}>
        <SceneDefs />
        <SceneContext.Provider value={sceneValue}>
          <g style={{ transform: viewport.transform, transformOrigin: "0 0", transition: dragging || reducedMotion ? "none" : "transform 260ms cubic-bezier(0.4, 0, 0.2, 1)" }}>
            <g key={kind}>{kind === "animal" ? <AnimalScene /> : <PlantScene />}</g>
            {showAllLabels
              ? labels
                  .filter((l) => l.id !== focusLabelId)
                  .map((l) => <SceneLabel key={l.id} spec={l} unit={unit} />)
              : null}
            {focusLabel ? <SceneLabel spec={focusLabel} unit={unit} emphasis /> : null}
          </g>
        </SceneContext.Provider>
      </svg>

      <span className="pointer-events-none absolute bottom-1.5 left-2 rounded-full bg-paper/90 px-2 py-0.5 font-mono text-label uppercase tracking-wide text-ink-soft dark:bg-chalkboard/90 dark:text-bone-soft">
        Not to scale
      </span>

      <div role="group" aria-label="Zoom controls" className="absolute bottom-1 right-1 flex flex-col gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
        <button type="button" className={btn} onClick={viewport.zoomIn} disabled={!viewport.canZoomIn} aria-label="Zoom in">
          <ZoomIn className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        </button>
        <button type="button" className={btn} onClick={viewport.zoomOut} disabled={!viewport.canZoomOut} aria-label="Zoom out">
          <ZoomOut className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        </button>
        <button type="button" className={btn} onClick={viewport.reset} disabled={!viewport.isZoomed} aria-label="Reset view">
          <Scan className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

