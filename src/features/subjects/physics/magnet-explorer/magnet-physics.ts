"use client";

/**
 * Interaction logic: the "like poles repel, opposite poles attract"
 * rule, plus a lightweight settle loop that lets the free magnet
 * drift in response. Deliberately not a real physics engine —
 * constants below are tuned by feel, not by units.
 */

import { useEffect, useRef } from "react";
import {
  clampToPlayground,
  getPoles,
  type MagnetId,
  type MagnetState,
  type Point,
} from "./magnet-model";

/** Poles closer than this feel a capped force, so they never fly apart or snap together. */
const MIN_POLE_DISTANCE = 34;
/** Beyond this, magnets are considered "not close" — no force, and the
 * live-feedback panel falls back to "move closer". Shared with
 * `getInteractionStatus` below so the message and the physics always
 * agree on what counts as "close". */
export const INTERACTION_RANGE = 260;
const FORCE_STRENGTH = 850_000;
/** Fraction of velocity kept each frame — lower feels heavier/more damped. */
const DAMPING = 0.86;
const MAX_SPEED = 900; // px/sec, keeps a sudden close-range spike from teleporting a magnet

interface Force {
  fx: number;
  fy: number;
}

function poleForce(from: Point, to: Point, repel: boolean): Force {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const rawDistance = Math.hypot(dx, dy);
  if (rawDistance > INTERACTION_RANGE || rawDistance === 0) return { fx: 0, fy: 0 };

  const distance = Math.max(rawDistance, MIN_POLE_DISTANCE);
  const magnitude = FORCE_STRENGTH / (distance * distance);
  const ux = dx / rawDistance;
  const uy = dy / rawDistance;
  // Repel: force points away from the other pole. Attract: toward it.
  const sign = repel ? -1 : 1;
  return { fx: ux * magnitude * sign, fy: uy * magnitude * sign };
}

/** Net translational force pulling/pushing `target`'s center, from all four pole-to-pole interactions with `other`. */
export function netForceOn(target: MagnetState, other: MagnetState): Force {
  const t = getPoles(target);
  const o = getPoles(other);

  const interactions: Array<[Point, Point, boolean]> = [
    [t.north, o.north, true], // N–N repel
    [t.south, o.south, true], // S–S repel
    [t.north, o.south, false], // N–S attract
    [t.south, o.north, false], // S–N attract
  ];

  let fx = 0;
  let fy = 0;
  for (const [from, to, repel] of interactions) {
    const f = poleForce(from, to, repel);
    fx += f.fx;
    fy += f.fy;
  }
  return { fx, fy };
}

export type PoleLabel = "N" | "S";
export type InteractionType = "attract" | "repel" | "none";

export interface InteractionStatus {
  type: InteractionType;
  /** Distance between the single closest pole pair, in playground units. */
  distance: number;
  /** Which pole on each magnet is the closest pair — null when `type` is "none". */
  poles: { a: PoleLabel; b: PoleLabel } | null;
}

/**
 * Finds the single closest pole-to-pole pair between two magnets and
 * reports whether it attracts or repels. This is the "what should the
 * student be told right now" read of the pair — used to drive the
 * live-feedback message and the pole glow highlight. Deliberately
 * separate from `netForceOn`: that function answers "what force is
 * felt", this one answers "what's the headline right now".
 */
export function getInteractionStatus(a: MagnetState, b: MagnetState): InteractionStatus {
  const poleA = getPoles(a);
  const poleB = getPoles(b);

  const pairs: Array<{ a: PoleLabel; b: PoleLabel; from: Point; to: Point; repel: boolean }> = [
    { a: "N", b: "N", from: poleA.north, to: poleB.north, repel: true },
    { a: "S", b: "S", from: poleA.south, to: poleB.south, repel: true },
    { a: "N", b: "S", from: poleA.north, to: poleB.south, repel: false },
    { a: "S", b: "N", from: poleA.south, to: poleB.north, repel: false },
  ];

  let closest = pairs[0]!;
  let closestDistance = Math.hypot(closest.to.x - closest.from.x, closest.to.y - closest.from.y);
  for (const pair of pairs.slice(1)) {
    const distance = Math.hypot(pair.to.x - pair.from.x, pair.to.y - pair.from.y);
    if (distance < closestDistance) {
      closest = pair;
      closestDistance = distance;
    }
  }

  if (closestDistance > INTERACTION_RANGE) {
    return { type: "none", distance: closestDistance, poles: null };
  }

  return {
    type: closest.repel ? "repel" : "attract",
    distance: closestDistance,
    poles: { a: closest.a, b: closest.b },
  };
}

type Velocities = Record<MagnetId, Point>;

/**
 * Runs a small requestAnimationFrame loop that lets whichever magnet is
 * NOT currently being dragged respond to the other's poles — pushed away
 * on like poles, pulled in on opposite poles — then settle via damping.
 * The magnet the student is actively dragging is always fully under
 * their control; this loop never moves it.
 */
export function useMagnetSettling(
  magnets: Record<MagnetId, MagnetState>,
  draggingId: MagnetId | null,
  setMagnets: (update: (prev: Record<MagnetId, MagnetState>) => Record<MagnetId, MagnetState>) => void,
) {
  const velocities = useRef<Velocities>({ a: { x: 0, y: 0 }, b: { x: 0, y: 0 } });
  const frameRef = useRef<number>();
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const step = (time: number) => {
      const last = lastTimeRef.current;
      lastTimeRef.current = time;
      const dt = last === null ? 0 : Math.min((time - last) / 1000, 1 / 30);

      if (dt > 0) {
        setMagnets((prev) => {
          const ids: MagnetId[] = ["a", "b"];
          const next = { ...prev };
          let changed = false;

          for (const id of ids) {
            if (id === draggingId) {
              velocities.current[id] = { x: 0, y: 0 };
              continue;
            }
            const other = prev[id === "a" ? "b" : "a"];
            const force = netForceOn(prev[id], other);

            const v = velocities.current[id];
            let vx = (v.x + force.fx * dt) * DAMPING;
            let vy = (v.y + force.fy * dt) * DAMPING;
            const speed = Math.hypot(vx, vy);
            if (speed > MAX_SPEED) {
              vx = (vx / speed) * MAX_SPEED;
              vy = (vy / speed) * MAX_SPEED;
            }
            velocities.current[id] = { x: vx, y: vy };

            if (Math.abs(vx) < 0.5 && Math.abs(vy) < 0.5) continue;

            const clamped = clampToPlayground(prev[id].x + vx * dt, prev[id].y + vy * dt);
            next[id] = { ...prev[id], x: clamped.x, y: clamped.y };
            changed = true;
          }

          return changed ? next : prev;
        });
      }

      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      lastTimeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggingId]);
}
