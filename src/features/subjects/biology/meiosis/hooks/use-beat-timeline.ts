"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { BEAT_COUNT } from "../engine/beats";

/** Time a single beat-to-beat move takes at 1x, in ms. */
export const MOVE_MS = 1700;
/** How long autoplay rests on each beat at 1x, in ms. */
export const HOLD_MS = 1500;
export const SPEEDS = [0.5, 0.75, 1, 1.5, 2] as const;
export type Speed = (typeof SPEEDS)[number];

type Listener = () => void;

/**
 * The animation clock. `pos` is a fractional beat position that the stage reads every frame; the React
 * tree around it only re-renders when the rounded beat or the playing flag changes.
 */
export class BeatClock {
  private pos = 0;
  private target = 0;
  private playing = false;
  private hold = 0;
  private speed: Speed = 1;
  private reduced = false;
  private raf = 0;
  private last = 0;
  private stepOnce = false;
  private baseRate = 1 / MOVE_MS;
  private listeners = new Set<Listener>();
  private metaListeners = new Set<Listener>();
  /** Return false to stop autoplay / stepping from entering `beat` (Predict mode). */
  gate: ((beat: number) => boolean) | null = null;
  onBlocked: ((beat: number) => void) | null = null;
  private metaSnapshot = { beat: 0, playing: false, moving: false };

  subscribe = (l: Listener) => {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  };
  subscribeMeta = (l: Listener) => {
    this.metaListeners.add(l);
    return () => this.metaListeners.delete(l);
  };
  getPos = () => this.pos;
  getMeta = () => this.metaSnapshot;
  getTarget = () => this.target;

  private emit() {
    for (const l of this.listeners) l();
    const beat = Math.round(this.pos);
    const moving = Math.abs(this.pos - this.target) > 1e-3;
    const m = this.metaSnapshot;
    if (m.beat !== beat || m.playing !== this.playing || m.moving !== moving) {
      this.metaSnapshot = { beat, playing: this.playing, moving };
      for (const l of this.metaListeners) l();
    }
  }

  setReduced(v: boolean) {
    this.reduced = v;
    if (v && this.pos !== this.target) {
      this.pos = this.target;
      this.emit();
    }
  }
  setSpeed(v: Speed) {
    this.speed = v;
  }

  private setTarget(t: number) {
    this.target = t;
    const d = Math.abs(t - this.pos);
    // Long jumps (stage navigation) take longer than one step, but never more than ~2.4 s at 1x.
    if (d > 1e-3) this.baseRate = d / Math.min(2400, MOVE_MS * Math.pow(d, 0.7));
  }

  private ensureLoop() {
    if (this.raf || typeof window === "undefined") return;
    this.last = 0;
    this.raf = requestAnimationFrame(this.frame);
  }

  private stopLoop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private frame = (now: number) => {
    this.raf = 0;
    const dt = this.last ? Math.min(50, now - this.last) : 16;
    this.last = now;
    const dist = this.target - this.pos;
    if (Math.abs(dist) > 1e-4) {
      const move = Math.min(Math.abs(dist), this.baseRate * this.speed * dt);
      this.pos += Math.sign(dist) * move;
      if (Math.abs(this.target - this.pos) < 1e-3) this.pos = this.target;
      this.hold = 0;
    } else if (this.playing) {
      this.hold += dt;
      const wait = (this.reduced ? HOLD_MS * 1.8 : HOLD_MS) / this.speed;
      if (this.hold >= wait) {
        this.hold = 0;
        this.advance();
      }
    }
    this.emit();
    if (Math.abs(this.target - this.pos) > 1e-4 || this.playing) this.raf = requestAnimationFrame(this.frame);
    else this.last = 0;
  };

  /** Try to move the target one beat on (honours the Predict gate). Returns false if it could not. */
  private advance(): boolean {
    const next = Math.round(this.target) + 1;
    if (next >= BEAT_COUNT) {
      this.playing = false;
      this.stepOnce = false;
      return false;
    }
    if (this.gate && !this.gate(next)) {
      this.playing = false;
      this.stepOnce = false;
      this.onBlocked?.(next);
      return false;
    }
    this.setTarget(next);
    if (this.stepOnce) {
      this.playing = false;
      this.stepOnce = false;
    }
    return true;
  }

  private jump(to: number) {
    this.setTarget(Math.min(BEAT_COUNT - 1, Math.max(0, to)));
    if (this.reduced) this.pos = this.target;
    this.hold = 0;
    this.emit();
    this.ensureLoop();
  }

  play(stepOnly = false) {
    if (Math.round(this.target) >= BEAT_COUNT - 1) return;
    this.playing = true;
    this.stepOnce = stepOnly;
    if (Math.abs(this.target - this.pos) < 1e-3) {
      this.hold = 0;
      if (stepOnly || this.reduced) {
        // start moving right away instead of waiting out the hold
        if (!this.advance()) {
          this.emit();
          return;
        }
        if (this.reduced) this.pos = this.target;
      } else if (!this.advance()) {
        this.emit();
        return;
      }
    }
    this.emit();
    this.ensureLoop();
  }
  pause() {
    this.playing = false;
    this.stepOnce = false;
    this.emit();
  }
  /** Move to an exact beat (stops autoplay). Gated moves are blocked. */
  goTo(beat: number, opts: { ignoreGate?: boolean; immediate?: boolean } = {}) {
    this.playing = false;
    this.stepOnce = false;
    let b = Math.min(BEAT_COUNT - 1, Math.max(0, beat));
    let blocked = false;
    if (!opts.ignoreGate && this.gate) {
      // moving forward must not skip past an unanswered prediction
      for (let k = Math.round(this.target) + 1; k <= b; k++) {
        if (!this.gate(k)) {
          b = k - 1;
          blocked = true;
          this.onBlocked?.(k);
          break;
        }
      }
    }
    if (blocked && b === Math.round(this.target)) {
      this.emit();
      return false;
    }
    this.jump(b);
    if (opts.immediate) {
      this.pos = this.target;
      this.emit();
    }
    return true;
  }
  step(delta: 1 | -1) {
    return this.goTo(Math.round(this.target) + delta);
  }
  dispose() {
    this.stopLoop();
    this.listeners.clear();
    this.metaListeners.clear();
  }
}

export function useBeatClock(reducedMotion: boolean, speed: Speed): BeatClock {
  const ref = useRef<BeatClock | null>(null);
  if (!ref.current) ref.current = new BeatClock();
  const clock = ref.current;
  useEffect(() => clock.setReduced(reducedMotion), [clock, reducedMotion]);
  useEffect(() => clock.setSpeed(speed), [clock, speed]);
  useEffect(() => () => clock.dispose(), [clock]);
  return clock;
}

/** Rounded beat, playing and moving flags — changes rarely, so panels do not re-render every frame. */
export function useClockMeta(clock: BeatClock) {
  return useSyncExternalStore(clock.subscribeMeta, clock.getMeta, clock.getMeta);
}

export function useClockPos(clock: BeatClock): number {
  const sub = useCallback((l: () => void) => clock.subscribe(l), [clock]);
  return useSyncExternalStore(sub, clock.getPos, clock.getPos);
}
