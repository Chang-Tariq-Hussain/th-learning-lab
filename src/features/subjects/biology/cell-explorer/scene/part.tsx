"use client";

import { createContext, type KeyboardEvent, type ReactNode, useContext, useEffect, useRef, useState } from "react";
import { getOrganelle } from "../data/organelles";

export interface SceneState {
  selectedId: string | null;
  /** A structure to draw attention to without naming it (Function activity). */
  targetId: string | null;
  /** When false, parts cannot be clicked or focused (Function activity: the picture is the question). */
  interactive: boolean;
  /** Dim everything except the selection. */
  dimOthers: boolean;
  /** Replace each part's accessible name with a generic one so it does not give the answer away. */
  hideNames: boolean;
  /** Ids to mark with a "plant only" outline (Compare: highlight differences). */
  markedIds: ReadonlySet<string> | null;
  reducedMotion: boolean;
  onPick: (id: string) => void;
}

export const SceneContext = createContext<SceneState>({
  selectedId: null,
  targetId: null,
  interactive: true,
  dimOthers: true,
  hideNames: false,
  markedIds: null,
  reducedMotion: false,
  onPick: () => {},
});

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PartProps {
  id: string;
  /** Only the first instance of a repeated structure (e.g. mitochondria) is a keyboard tab stop. */
  primary?: boolean;
  /** Extra padding around the ring, in scene units. */
  pad?: number;
  /** Corner radius of the ring. */
  ringRadius?: number;
  children: ReactNode;
}

/**
 * One selectable structure. Wraps its drawing in a focusable button-like group that carries the accessible name,
 * highlight (glow + dashed ring), dimming of the others, and a clearly visible keyboard-focus ring.
 */
export function Part({ id, primary = true, pad = 5, ringRadius = 10, children }: PartProps) {
  const scene = useContext(SceneContext);
  const shapeRef = useRef<SVGGElement>(null);
  const [box, setBox] = useState<Box | null>(null);
  const [focused, setFocused] = useState(false);

  const selected = scene.selectedId === id;
  const isTarget = scene.targetId === id;
  const marked = scene.markedIds?.has(id) ?? false;
  const showRing = selected || focused || isTarget || marked;

  useEffect(() => {
    if (!showRing) return;
    const node = shapeRef.current;
    if (!node) return;
    try {
      const b = node.getBBox();
      if (b.width > 0 && b.height > 0) setBox({ x: b.x, y: b.y, width: b.width, height: b.height });
    } catch {
      setBox(null);
    }
  }, [showRing]);

  const def = getOrganelle(id);
  const label = scene.hideNames ? (isTarget ? "Highlighted structure" : "Cell structure") : (def?.name ?? id);
  const dimmed = scene.dimOthers && scene.selectedId !== null && !selected;
  const interactive = scene.interactive;

  const onKeyDown = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scene.onPick(id);
    }
  };

  const ringStroke = selected ? "#0D9488" : isTarget ? "#D97706" : marked ? "#7C3AED" : "#0D9488";

  return (
    <g
      data-part={id}
      data-selected={selected ? "true" : undefined}
      role={interactive && primary ? "button" : !interactive && isTarget ? "img" : undefined}
      aria-label={(interactive && primary) || isTarget ? label : undefined}
      aria-hidden={(interactive && !primary) || (!interactive && !isTarget) ? true : undefined}
      aria-pressed={interactive && primary ? selected : undefined}
      tabIndex={interactive && primary ? 0 : undefined}
      onClick={interactive ? () => scene.onPick(id) : undefined}
      onKeyDown={interactive ? onKeyDown : undefined}
      onFocus={interactive ? () => setFocused(true) : undefined}
      onBlur={interactive ? () => setFocused(false) : undefined}
      style={{
        cursor: interactive ? "pointer" : "default",
        opacity: dimmed ? 0.5 : 1,
        transition: scene.reducedMotion ? "none" : "opacity 200ms ease",
        outline: "none",
        filter: selected ? "url(#ce-glow)" : undefined,
      }}
    >
      <g ref={shapeRef}>{children}</g>
      {showRing && box ? (
        <g pointerEvents="none" aria-hidden="true">
          {focused ? (
            <rect
              x={box.x - pad - 2}
              y={box.y - pad - 2}
              width={box.width + (pad + 2) * 2}
              height={box.height + (pad + 2) * 2}
              rx={ringRadius + 2}
              fill="none"
              stroke="rgb(var(--color-ink))"
              strokeWidth={4.5}
            />
          ) : null}
          <rect
            x={box.x - pad}
            y={box.y - pad}
            width={box.width + pad * 2}
            height={box.height + pad * 2}
            rx={ringRadius}
            fill="none"
            stroke={focused ? "#FFFFFF" : ringStroke}
            strokeWidth={focused ? 2 : marked && !selected ? 2 : 2.5}
            strokeDasharray={selected || focused ? undefined : "6 4"}
          >
            {isTarget && !scene.reducedMotion ? (
              <animate attributeName="stroke-opacity" values="1;0.25;1" dur="1.6s" repeatCount="indefinite" />
            ) : null}
          </rect>
        </g>
      ) : null}
    </g>
  );
}
