/**
 * A simplified phospholipid bilayer: two rows of round "heads" with a
 * short tail pointing into a shared hydrophobic core band, echoing the
 * reference image without drawing every molecule in detail.
 *
 * `vertical` draws the same idea rotated 90° in real coordinates (not
 * a CSS transform) so it renders crisply as the membrane divider
 * inside the Diffusion/Osmosis stage at any container size.
 */
export interface MembraneBandProps {
  vertical?: boolean;
  className?: string;
}

const LOLLIPOP_COUNT = 12;

export function MembraneBand({ vertical = false, className }: MembraneBandProps) {
  const long = 480;
  const short = 84;
  const headRadius = 8;
  const nearEdge = 16;
  const coreNear = 26;
  const coreFar = short - 26;

  const positions = Array.from({ length: LOLLIPOP_COUNT }, (_, i) => {
    const margin = 22;
    const step = (long - margin * 2) / (LOLLIPOP_COUNT - 1);
    return margin + i * step;
  });

  const width = vertical ? short : long;
  const height = vertical ? long : short;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      role="img"
      aria-label="Simplified cell membrane, a double layer of phospholipids"
    >
      {/* Hydrophobic interior */}
      {vertical ? (
        <rect x={coreNear} y={0} width={coreFar - coreNear} height={long} rx={6} className="fill-subject-biology/15" />
      ) : (
        <rect x={0} y={coreNear} width={long} height={coreFar - coreNear} rx={6} className="fill-subject-biology/15" />
      )}

      {positions.map((pos, i) => {
        if (vertical) {
          const nearHeadX = nearEdge;
          const farHeadX = short - nearEdge;
          return (
            <g key={i}>
              <line x1={nearHeadX + headRadius} y1={pos} x2={coreNear - 3} y2={pos} className="stroke-amber-500" strokeWidth={3} strokeLinecap="round" />
              <circle cx={nearHeadX} cy={pos} r={headRadius} className="fill-subject-biology" />
              <line x1={farHeadX - headRadius} y1={pos} x2={coreFar + 3} y2={pos} className="stroke-amber-500" strokeWidth={3} strokeLinecap="round" />
              <circle cx={farHeadX} cy={pos} r={headRadius} className="fill-subject-biology" />
            </g>
          );
        }
        const nearHeadY = nearEdge;
        const farHeadY = short - nearEdge;
        return (
          <g key={i}>
            <line x1={pos} y1={nearHeadY + headRadius} x2={pos} y2={coreNear - 3} className="stroke-amber-500" strokeWidth={3} strokeLinecap="round" />
            <circle cx={pos} cy={nearHeadY} r={headRadius} className="fill-subject-biology" />
            <line x1={pos} y1={farHeadY - headRadius} x2={pos} y2={coreFar + 3} className="stroke-amber-500" strokeWidth={3} strokeLinecap="round" />
            <circle cx={pos} cy={farHeadY} r={headRadius} className="fill-subject-biology" />
          </g>
        );
      })}
    </svg>
  );
}
