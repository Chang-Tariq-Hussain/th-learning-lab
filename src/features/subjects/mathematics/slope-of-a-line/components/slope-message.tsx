import { SLOPE_TYPE_INFO, slopeType, type SlopePoint } from "../model";

interface SlopeMessageProps {
  a: SlopePoint;
  b: SlopePoint;
}

/** A short, always-current caption describing the slope's type as points are dragged. */
export function SlopeMessage({ a, b }: SlopeMessageProps) {
  const type = slopeType(a, b);
  const info = SLOPE_TYPE_INFO[type];

  return (
    <p className="text-center text-sm font-medium text-ink dark:text-bone">
      <span className="mr-1.5 text-base">{info.arrow}</span>
      {info.label} — <span className="text-ink-soft dark:text-bone-soft">{info.message}</span>
    </p>
  );
}
