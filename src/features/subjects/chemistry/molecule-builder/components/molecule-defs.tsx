/**
 * Extra gradients this feature needs on top of what `BondDefs` already
 * provides (Hydrogen's gradient and both glow filters are reused as-is
 * from Bond Builder). Kept separate rather than editing `bond-defs.tsx`
 * so Bond Builder itself stays untouched.
 */
export function MoleculeDefs() {
  return (
    <defs>
      <radialGradient id="molecule-oxygen-gradient" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FF8F82" />
        <stop offset="55%" stopColor="#E0524F" />
        <stop offset="100%" stopColor="#A93330" />
      </radialGradient>
      <radialGradient id="molecule-carbon-gradient" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#8B95A1" />
        <stop offset="55%" stopColor="#4B535C" />
        <stop offset="100%" stopColor="#262B30" />
      </radialGradient>
    </defs>
  );
}
