"use client";

import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import type { PushPullMode } from "../physics";

export type PersonSide = "left" | "right";

export interface PersonDragHandleProps {
  side: PersonSide;
  /** 0 (resting, not touching the box) to 1 (fully engaged). Controlled. */
  lean: number;
  onLeanChange: (lean: number) => void;
  mode: PushPullMode;
  onModeChange: (mode: PushPullMode) => void;
  /** Percent from the container's *left* edge (0–100), computed by
   * `cart-canvas.tsx` from the box's actual projected screen position
   * plus a small stand-off that closes as `lean` increases — so this
   * figure always stays attached to the edge of the box it's
   * push/pulling, instead of a fixed station the box can slide past. */
  leftPercent: number;
  /** e.g. "42 N" — announced to screen readers and shown on hover/focus. */
  forceLabel: string;
  color: string;
  isDark: boolean;
  disabled?: boolean;
}

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
  mode,
  onModeChange,
  leftPercent,
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
      // Pushing: drag toward the box (rightward for the left person,
      // leftward for the right person) to push harder. Pulling flips
      // that — drag *away* from the box, like leaning back on a rope —
      // since a pull only gets stronger the further back you lean.
      const towardBox = side === "left" ? dx : -dx;
      const engageDirection = mode === "push" ? towardBox : -towardBox;
      const next = dragStart.current.lean + engageDirection / DRAG_RANGE_PX;
      onLeanChange(Math.max(0, Math.min(1, next)));
      e.preventDefault();
    },
    [mode, onLeanChange, side],
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

  const positionStyle: React.CSSProperties = {
    left: `${leftPercent}%`,
    bottom: GROUND_OFFSET_PX,
    transition: "left 0.1s linear",
  };

  // Pushing: lean forward into the box. Pulling: lean back away from
  // it, like taking up slack on a rope — same rig, mirrored tilt.
  const facingRight = side === "left";
  const leanDeg = mode === "push" ? -6 - lean * 9 : 6 + lean * 9;
  const skin = isDark ? "#D9B99B" : "#C8996F";
  const hair = isDark ? "#3A2A1E" : "#2B1E14";
  const pants = isDark ? "#33413C" : "#26332E";

  return (
    <div
      className={cn(
        "absolute z-10 flex w-16 -translate-x-1/2 flex-col items-center",
      )}
      style={positionStyle}
    >
      {/* Push/pull toggle — always visible (not just on hover), since
          which mode a person is in changes what dragging them does. */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onModeChange(mode === "push" ? "pull" : "push")}
        className={cn(
          "mb-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm transition-colors",
          mode === "push"
            ? "border-transparent bg-ink text-paper dark:bg-bone dark:text-chalkboard"
            : "border-ink/30 bg-white/90 text-ink dark:border-bone/30 dark:bg-chalkboard/90 dark:text-bone",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        )}
        aria-label={`${side === "left" ? "Left" : "Right"} person is ${mode === "push" ? "pushing" : "pulling"} the box. Click to switch to ${mode === "push" ? "pulling" : "pushing"}.`}
      >
        {mode === "push" ? "Push" : "Pull"}
      </button>

      <div
        role="slider"
        tabIndex={0}
        aria-label={`${side === "left" ? "Left" : "Right"} person — drag ${mode === "push" ? "toward" : "away from"} the box, or use arrow keys, to change how hard they ${mode}. Currently applying ${forceLabel}.`}
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
          "group flex touch-none select-none flex-col items-center outline-none",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-grab active:cursor-grabbing",
        )}
      >
        {/* "Drag to push/pull" hint — visible on hover/focus only, so it never clutters the default view. */}
        <span
          className={cn(
            "pointer-events-none mb-1 whitespace-nowrap rounded-full bg-ink px-2 py-0.5 text-[10px] font-medium text-paper opacity-0 shadow-sm transition-opacity dark:bg-bone dark:text-chalkboard",
            "group-hover:opacity-100 group-focus-visible:opacity-100",
          )}
        >
          Drag to {mode} · {forceLabel}
        </span>

        <svg
          viewBox="0 0 60 90"
          width={56}
          height={84}
          role="img"
          aria-hidden="true"
          className="drop-shadow-sm transition-transform"
          style={{
            transform: `scaleX(${facingRight ? 1 : -1}) rotate(${leanDeg}deg)`,
            transformOrigin: "50% 85%",
          }}
        >
          {/* Back leg */}
          <line x1={26} y1={78} x2={16} y2={88} stroke={pants} strokeWidth={7} strokeLinecap="round" />
          {/* Front leg, lunging toward the push/pull */}
          <line x1={30} y1={78} x2={46} y2={86} stroke={pants} strokeWidth={7} strokeLinecap="round" />
          {/* Torso */}
          <rect x={16} y={38} width={22} height={38} rx={9} fill={color} />
          {/* Head */}
          <circle cx={30} cy={24} r={11} fill={skin} />
          <path d="M19 22a11 11 0 0 1 22 0v-2a11 9 0 0 0-22 0z" fill={hair} />
          {/* Extended arm, hand on the box either way (pushing or gripping to pull) */}
          <line x1={34} y1={46} x2={54} y2={40} stroke={skin} strokeWidth={7} strokeLinecap="round" />
          {/* Back arm, tucked */}
          <line x1={20} y1={48} x2={12} y2={62} stroke={skin} strokeWidth={6} strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
