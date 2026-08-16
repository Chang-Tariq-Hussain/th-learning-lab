/**
 * Shared `<defs>` for the Bond Builder scene. Follows the same
 * "gumball sphere" recipe as Build an Atom's `AtomDefs` (radial
 * gradient + soft glow filter) so the two chemistry features read as
 * one visual family, but with its own ids/hues since this scene needs
 * a distinct color per element rather than per particle-kind.
 */
export function BondDefs() {
  return (
    <defs>
      <radialGradient id="bond-sodium-gradient" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFC98C" />
        <stop offset="55%" stopColor="#F0A54A" />
        <stop offset="100%" stopColor="#B9781F" />
      </radialGradient>
      <radialGradient id="bond-chlorine-gradient" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#8CE3B0" />
        <stop offset="55%" stopColor="#2E9E5B" />
        <stop offset="100%" stopColor="#1B6E3D" />
      </radialGradient>
      <radialGradient id="bond-hydrogen-gradient" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#9DB0FF" />
        <stop offset="55%" stopColor="#3D5AFE" />
        <stop offset="100%" stopColor="#1F35B0" />
      </radialGradient>
      <radialGradient id="bond-electron-gradient" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="55%" stopColor="#3D5AFE" />
        <stop offset="100%" stopColor="#1F35B0" />
      </radialGradient>

      <filter id="bond-glow-soft" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="2.2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="bond-glow-strong" x="-150%" y="-150%" width="400%" height="400%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}
