/**
 * Simplified Bohr-model shell capacities — deliberately not the real
 * quantum-mechanical filling order (which for potassium/calcium starts
 * the 4th shell before finishing the 3rd). The brief is explicit that
 * this should help students *visualize* shells, not be a scientifically
 * exact orbital diagram, so electrons fill 2, then 8, then 8, then a
 * generous overflow capacity for anything beyond calcium.
 */
export const SHELL_CAPACITIES = [2, 8, 8, 18, 18, 32];

/** Splits a total electron count into per-shell counts, filling each shell before moving to the next. */
export function distributeElectrons(totalElectrons: number): number[] {
  const shells: number[] = [];
  let remaining = totalElectrons;
  for (const capacity of SHELL_CAPACITIES) {
    if (remaining <= 0) break;
    const inThisShell = Math.min(capacity, remaining);
    shells.push(inThisShell);
    remaining -= inThisShell;
  }
  // Anything left after every defined shell (an extreme edge case) still gets a home rather than vanishing.
  if (remaining > 0) shells.push(remaining);
  return shells;
}
