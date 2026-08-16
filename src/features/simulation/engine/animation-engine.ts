import type { FrameInfo, PlaybackStatus } from "../types";

export interface AnimationEngineOptions {
  /** Called on every tick with frame timing info already scaled by speed. */
  onTick: (frame: FrameInfo) => void;
  /** Optional cap so a single dropped-frame stutter can't skip huge chunks of sim time. */
  maxDeltaSeconds?: number;
}

/**
 * A plain (non-React) requestAnimationFrame loop.
 *
 * Kept outside of React so the tick rate isn't tied to component
 * re-renders — a simulation can run hundreds of moving objects by
 * mutating its own refs/canvas inside `onTick` without React re-rendering
 * on every frame. React only needs to re-render for UI chrome (play
 * button state, displayed time, chart snapshots, etc.).
 *
 * Supports multiple independent subscribers (e.g. a physics update and a
 * canvas render callback) sharing a single rAF loop rather than each
 * driving their own — this keeps everything on the same clock and avoids
 * redundant `requestAnimationFrame` calls.
 *
 * Wrapped by `useAnimation` for idiomatic use inside components.
 */
export class AnimationEngine {
  private rafId: number | null = null;
  private lastTimestamp: number | null = null;
  private status: PlaybackStatus = "idle";
  private speed = 1;
  private time = 0;
  private frameCount = 0;
  private readonly listeners = new Set<(frame: FrameInfo) => void>();
  private readonly maxDeltaSeconds: number;

  constructor(options: AnimationEngineOptions) {
    this.listeners.add(options.onTick);
    this.maxDeltaSeconds = options.maxDeltaSeconds ?? 0.1;
  }

  /**
   * Register an additional per-frame listener (e.g. a canvas render
   * callback). Returns an unsubscribe function. Safe to call from
   * outside React's render cycle.
   */
  subscribe(listener: (frame: FrameInfo) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getStatus(): PlaybackStatus {
    return this.status;
  }

  getTime(): number {
    return this.time;
  }

  getFrameCount(): number {
    return this.frameCount;
  }

  setSpeed(multiplier: number): void {
    this.speed = multiplier;
  }

  play(): void {
    if (this.status === "playing") return;
    this.status = "playing";
    this.lastTimestamp = null;
    this.loop();
  }

  pause(): void {
    this.status = "paused";
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  reset(): void {
    this.pause();
    this.status = "idle";
    this.time = 0;
    this.frameCount = 0;
    this.lastTimestamp = null;
  }

  /** Advance exactly one frame at a fixed 1/60s step, useful for the Step control. */
  step(stepSeconds = 1 / 60): void {
    const frame: FrameInfo = {
      time: (this.time += stepSeconds * this.speed),
      deltaTime: stepSeconds * this.speed,
      frameCount: ++this.frameCount,
    };
    this.listeners.forEach((listener) => listener(frame));
  }

  destroy(): void {
    this.pause();
    this.listeners.clear();
  }

  private loop = (timestamp?: number): void => {
    if (this.status !== "playing") return;

    const now = timestamp ?? performance.now();
    if (this.lastTimestamp === null) {
      this.lastTimestamp = now;
    }

    const rawDelta = (now - this.lastTimestamp) / 1000;
    const cappedDelta = Math.min(rawDelta, this.maxDeltaSeconds);
    const scaledDelta = cappedDelta * this.speed;

    this.lastTimestamp = now;
    this.time += scaledDelta;
    this.frameCount += 1;

    const frame: FrameInfo = {
      time: this.time,
      deltaTime: scaledDelta,
      frameCount: this.frameCount,
    };
    this.listeners.forEach((listener) => listener(frame));

    this.rafId = requestAnimationFrame(this.loop);
  };
}
