export interface NucleonPosition {
  x: number;
  y: number;
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ~137.5°, the classic phyllotaxis angle for dense, even circle packing

/**
 * A "sunflower seed" spiral: each successive particle sits at
 * `radius = k * sqrt(index)`, `angle = index * goldenAngle`. This packs
 * circles densely with no simulation needed, and — usefully — adding
 * one more particle only appends a position near the edge rather than
 * reshuffling everything already placed, so existing protons/neutrons
 * don't visibly jump when a new one is added.
 *
 * Protons and neutrons get independent spirals (rather than one shared
 * sequence) so adding a neutron never changes where an existing proton
 * sits, and vice versa — the two spirals interleave visually since they
 * use different angular offsets, which is a fine approximation for a
 * "does not need to be scientifically perfect" nucleus.
 */
function sunflowerPosition(index: number, angleOffset: number, spacing: number): NucleonPosition {
  const angle = index * GOLDEN_ANGLE + angleOffset;
  const radius = spacing * Math.sqrt(index + 0.5);
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}

export function protonPositions(count: number, spacing = 9): NucleonPosition[] {
  return Array.from({ length: count }, (_, i) => sunflowerPosition(i, 0, spacing));
}

export function neutronPositions(count: number, spacing = 9): NucleonPosition[] {
  return Array.from({ length: count }, (_, i) => sunflowerPosition(i, Math.PI, spacing));
}
