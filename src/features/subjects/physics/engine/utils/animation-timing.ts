/**
 * Tracks a rolling average FPS and frame time from consecutive
 * `sample()` calls (typically once per `requestAnimationFrame`). Feeds
 * `debug-overlay.ts`'s FPS readout, but is otherwise independent —
 * usable anywhere a simulation wants to show its own performance.
 */
export class FpsTracker {
  private lastTimestamp: number | null = null;
  private samples: number[] = [];
  private readonly maxSamples: number;

  constructor(maxSamples = 30) {
    this.maxSamples = maxSamples;
  }

  /** Call once per frame with the current high-resolution timestamp (e.g. from `performance.now()` or the framework's `FrameInfo.time`). */
  sample(timestampMs: number): void {
    if (this.lastTimestamp !== null) {
      const delta = timestampMs - this.lastTimestamp;
      if (delta > 0) {
        this.samples.push(delta);
        if (this.samples.length > this.maxSamples) this.samples.shift();
      }
    }
    this.lastTimestamp = timestampMs;
  }

  get frameTimeMs(): number {
    if (this.samples.length === 0) return 0;
    return this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
  }

  get fps(): number {
    const ft = this.frameTimeMs;
    return ft === 0 ? 0 : 1000 / ft;
  }

  reset(): void {
    this.lastTimestamp = null;
    this.samples = [];
  }
}

/** Fixed-timestep accumulator — steps a simulation in uniform `dt` increments regardless of variable frame rate, the standard "deterministic physics" pattern. */
export class FixedTimestepAccumulator {
  private accumulator = 0;

  constructor(
    public readonly dt: number,
    public readonly maxStepsPerFrame = 5,
  ) {}

  /** Call with the elapsed time since last frame; invokes `stepFn(dt)` zero or more times to catch up. */
  advance(elapsedSeconds: number, stepFn: (dt: number) => void): void {
    this.accumulator += elapsedSeconds;
    let steps = 0;
    while (this.accumulator >= this.dt && steps < this.maxStepsPerFrame) {
      stepFn(this.dt);
      this.accumulator -= this.dt;
      steps++;
    }
  }

  reset(): void {
    this.accumulator = 0;
  }
}
