export interface Point {
  x: number;
  y: number;
}

/**
 * Smooth closed Catmull-Rom spline through `points`, converted to cubic
 * Bezier segments — turns a ring of sample points into an organic,
 * no-sharp-corners closed path. Every irregular shape below (nucleus
 * envelope, mitochondria) is built by sampling points around a
 * circle/ellipse with a wobble applied, then smoothing through them
 * with this function, rather than hand-typed path coordinates — that
 * keeps the shapes correct by construction instead of guessed blind.
 */
export function smoothClosedPath(points: Point[]): string {
  const n = points.length;
  if (n < 3) return "";
  const at = (i: number): Point => points[((i % n) + n) % n]!;

  let d = `M ${points[0]!.x.toFixed(2)} ${points[0]!.y.toFixed(2)} `;
  for (let i = 0; i < n; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += `C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} `;
  }
  return `${d}Z`;
}

export interface BlobOptions {
  pointCount?: number;
  /** Wobble amplitude as a fraction of the radius (0.06 = a gentle 6% ripple). */
  amplitude?: number;
  frequency?: number;
  amplitude2?: number;
  frequency2?: number;
  /** Shifts where the wobble peaks land — vary per instance so repeated blobs don't look identical. */
  phase?: number;
  rx?: number;
  ry?: number;
}

/** An irregular, organic blob — used for the nucleus's inner/outer envelope. */
export function blobPath(cx: number, cy: number, radius: number, options: BlobOptions = {}): string {
  const { pointCount = 22, amplitude = 0.05, frequency = 3, amplitude2 = 0.025, frequency2 = 7, phase = 0, rx, ry } = options;

  const points: Point[] = [];
  for (let i = 0; i < pointCount; i++) {
    const theta = (i / pointCount) * Math.PI * 2;
    const wobble = 1 + amplitude * Math.sin(frequency * theta + phase) + amplitude2 * Math.sin(frequency2 * theta + phase * 1.7);
    const localRx = (rx ?? radius) * wobble;
    const localRy = (ry ?? radius) * wobble;
    points.push({ x: cx + Math.cos(theta) * localRx, y: cy + Math.sin(theta) * localRy });
  }
  return smoothClosedPath(points);
}

/** A kidney/bean silhouette: an ellipse with one side pulled inward by a Gaussian dent — mitochondria's characteristic shape. */
export function beanPath(cx: number, cy: number, rx: number, ry: number, rotateDeg = 0, pointCount = 26): string {
  const dentCenter = Math.PI;
  const dentWidth = 0.85;
  const dentDepth = 0.3;
  const rad = (rotateDeg * Math.PI) / 180;

  const points: Point[] = [];
  for (let i = 0; i < pointCount; i++) {
    const theta = (i / pointCount) * Math.PI * 2;
    let diff = theta - dentCenter;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    const dent = dentDepth * Math.exp(-(diff * diff) / (2 * dentWidth * dentWidth));
    const scale = 1 - dent;

    const localX = Math.cos(theta) * rx * scale;
    const localY = Math.sin(theta) * ry * scale;
    const rotatedX = localX * Math.cos(rad) - localY * Math.sin(rad);
    const rotatedY = localX * Math.sin(rad) + localY * Math.cos(rad);
    points.push({ x: cx + rotatedX, y: cy + rotatedY });
  }
  return smoothClosedPath(points);
}

/** Rotates a point (localX, localY) around (cx, cy) by rotateDeg — used to place cristae/detail marks consistent with a rotated shape. */
export function rotatePoint(cx: number, cy: number, localX: number, localY: number, rotateDeg: number): Point {
  const rad = (rotateDeg * Math.PI) / 180;
  return {
    x: cx + localX * Math.cos(rad) - localY * Math.sin(rad),
    y: cy + localX * Math.sin(rad) + localY * Math.cos(rad),
  };
}

/** A horizontal wavy tube path (in local, unrotated coordinates) — the building block for the ER's folded membrane network. */
export function wavyTubePath(startX: number, y: number, width: number, amplitude: number, waves: number, phase = 0): string {
  const segment = width / waves;
  let d = `M ${startX.toFixed(2)} ${(y + Math.sin(phase) * amplitude).toFixed(2)} `;
  for (let i = 0; i < waves; i++) {
    const controlX = startX + segment * (i + 0.5);
    const controlY = y + (i % 2 === 0 ? -amplitude : amplitude) + Math.sin(phase) * amplitude * 0.3;
    const endX = startX + segment * (i + 1);
    const endY = y + Math.sin(phase + i) * amplitude * 0.2;
    d += `Q ${controlX.toFixed(2)} ${controlY.toFixed(2)}, ${endX.toFixed(2)} ${endY.toFixed(2)} `;
  }
  return d;
}
