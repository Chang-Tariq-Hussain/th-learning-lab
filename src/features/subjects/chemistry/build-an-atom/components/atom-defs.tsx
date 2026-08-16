/**
 * Shared `<defs>` for the atom scene — radial gradients give each
 * particle a "gumball" sphere look (bright highlight, darker rim)
 * instead of a flat fill, and the glow filters give electrons and the
 * nucleus a soft halo. Defined once and referenced by id from Nucleon/
 * Electron/AtomVisualization, rather than duplicating gradient/filter
 * markup per particle.
 */
export function AtomDefs() {
  return (
    <defs>
      <radialGradient id="proton-gradient" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FF9B93" />
        <stop offset="55%" stopColor="#E0524F" />
        <stop offset="100%" stopColor="#A93330" />
      </radialGradient>
      <radialGradient id="neutron-gradient" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#C7CDD3" />
        <stop offset="55%" stopColor="#8B95A1" />
        <stop offset="100%" stopColor="#5C6570" />
      </radialGradient>
      <radialGradient id="electron-gradient" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#9DB0FF" />
        <stop offset="55%" stopColor="#3D5AFE" />
        <stop offset="100%" stopColor="#1F35B0" />
      </radialGradient>
      <radialGradient id="nucleus-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F0A54A" stopOpacity={0.35} />
        <stop offset="100%" stopColor="#F0A54A" stopOpacity={0} />
      </radialGradient>

      <filter id="glow-soft" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="2.2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="glow-strong" x="-150%" y="-150%" width="400%" height="400%">
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
