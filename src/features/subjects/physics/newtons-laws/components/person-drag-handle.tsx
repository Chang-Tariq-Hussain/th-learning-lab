"use client";

import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

export type PersonSide = "left" | "right";

export interface PersonDragHandleProps {
  side: PersonSide;
  /** 0 (resting, not touching the box) to 1 (fully leaned in). Controlled. */
  lean: number;
  onLeanChange: (lean: number) => void;
  /** e.g. "42 N" — announced to screen readers and shown on hover/focus. */
  forceLabel: string;
  color: string;
  isDark: boolean;
  disabled?: boolean;
}

// Rest (lean=0) and fully-engaged (lean=1) horizontal position, as a
// percentage of the simulation surface's width, mirrored for the right
// side. Percentages — not pixel math tied to the canvas's own camera —
// keep this fully independent of `createProjection` in canvas-helpers.ts:
// that projection always centers the box at 50% of the canvas width, so
// a person anchored a fixed percentage in from the edge always reads as
// flanking the box, regardless of the box's actual world position. This
// is also what keeps the box, floor, and background visually fixed —
// the "camera" already follows the box, so nothing here needs to.
const REST_PCT = 26;
const ENGAGE_PCT = 38;
// Pixels of pointer travel that span lean 0→1 — deliberately independent
// of container width, so the drag *feels* the same on a phone and a
// monitor rather than requiring a bigger swipe on a wider screen.
const DRAG_RANGE_PX = 90;
// Matches canvas-helpers.ts's GROUND_MARGIN so feet land on the drawn
// ground line rather than floating above or sinking below it.
const GROUND_OFFSET_PX = 30;
const LEAN_STEP = 0.08;

export function PersonDragHandle({
  side,
  lean,
  onLeanChange,
  forceLabel,
  color,
  isDark,
  disabled,
}: PersonDragHandleProps) {
  const dragStart = useRef<{ x: number; lean: number } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      dragStart.current = { x: e.clientX, lean };
      e.preventDefault();
    },
    [disabled, lean],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragStart.current) return;
      const dx = e.clientX - dragStart.current.x;
      // Dragging toward the box increases lean: rightward for the left
      // person, leftward for the right person — "drag toward the box to
      // push harder," matching the plain-language instruction shown
      // above the experiment.
      const towardBox = side === "left" ? dx : -dx;
      const next = dragStart.current.lean + towardBox / DRAG_RANGE_PX;
      onLeanChange(Math.max(0, Math.min(1, next)));
      e.preventDefault();
    },
    [onLeanChange, side],
  );

  const endDrag = useCallback((e: React.PointerEvent) => {
    dragStart.current = null;
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      // Stop these from also reaching the simulation container's own
      // Arrow-key "step time" shortcut — this figure owns arrow keys
      // while it has focus.
      if (
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowDown" ||
        e.key === "Home" ||
        e.key === "End"
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        onLeanChange(Math.min(1, lean + LEAN_STEP));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        onLeanChange(Math.max(0, lean - LEAN_STEP));
      } else if (e.key === "Home") {
        onLeanChange(0);
      } else if (e.key === "End") {
        onLeanChange(1);
      }
    },
    [disabled, lean, onLeanChange],
  );

  const pct = REST_PCT + lean * (ENGAGE_PCT - REST_PCT);
  const positionStyle: React.CSSProperties =
    side === "left"
      ? { left: `${pct}%`, bottom: GROUND_OFFSET_PX }
      : { right: `${pct}%`, bottom: GROUND_OFFSET_PX };

  // A lean forward, arm extended toward the box — mirrored for the
  // right side so both figures visibly face and push into the box
  // rather than floating beside it.
  const facingRight = side === "left";
  const skin = isDark ? "#D9B99B" : "#C8996F";
  const hair = isDark ? "#3A2A1E" : "#2B1E14";
  const pants = isDark ? "#33413C" : "#26332E";

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={`${side === "left" ? "Left" : "Right"} person — drag toward the box, or use arrow keys, to change how hard they push. Currently applying ${forceLabel}.`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(lean * 100)}
      aria-orientation="horizontal"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
      className={cn(
        "group absolute z-10 flex w-16 -translate-x-1/2 touch-none select-none flex-col items-center outline-none",
        side === "right" && "translate-x-1/2",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-grab active:cursor-grabbing",
      )}
      style={positionStyle}
    >
      {/* "Drag to push" hint — visible on hover/focus only, so it never clutters the default view. */}
      <span
        className={cn(
          "pointer-events-none mb-1 whitespace-nowrap rounded-full bg-ink px-2 py-0.5 text-[10px] font-medium text-paper opacity-0 shadow-sm transition-opacity dark:bg-bone dark:text-chalkboard",
          "group-hover:opacity-100 group-focus-visible:opacity-100",
        )}
      >
        Drag to push · {forceLabel}
      </span>

      <svg
        viewBox="0 0 60 90"
        width={56}
        height={84}
        role="img"
        aria-hidden="true"
        className="drop-shadow-sm transition-transform"
        style={{
          transform: `scaleX(${facingRight ? 1 : -1}) rotate(${-6 - lean * 9}deg)`,
          transformOrigin: "50% 85%",
        }}
      >
        {/* Back leg */}
        <line x1={26} y1={78} x2={16} y2={88} stroke={pants} strokeWidth={7} strokeLinecap="round" />
        {/* Front leg, lunging toward the push */}
        <line x1={30} y1={78} x2={46} y2={86} stroke={pants} strokeWidth={7} strokeLinecap="round" />
        {/* Torso */}
        <rect x={16} y={38} width={22} height={38} rx={9} fill={color} />
        {/* Head */}
        <circle cx={30} cy={24} r={11} fill={skin} />
        <path d="M19 22a11 11 0 0 1 22 0v-2a11 9 0 0 0-22 0z" fill={hair} />
        {/* Extended arm, hand toward the box */}
        <line x1={34} y1={46} x2={54} y2={40} stroke={skin} strokeWidth={7} strokeLinecap="round" />
        {/* Back arm, tucked */}
        <line x1={20} y1={48} x2={12} y2={62} stroke={skin} strokeWidth={6} strokeLinecap="round" />
      </svg>
    </div>
  );
}
