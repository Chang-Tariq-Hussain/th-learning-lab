"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Keeps a rotation angle continuous (never jumping by more than 180° in
 * one update), so a CSS `transition: transform` on the element using
 * this angle always animates the *short way round* instead of
 * whip-spinning through a full turn whenever the raw target angle
 * crosses the -180°/180° boundary. Not specific to compasses — reusable
 * for any rotating dial or needle a future visualization might need.
 */
export function useSmoothedAngle(targetDeg: number): number {
  const [angle, setAngle] = useState(targetDeg);
  const previousRef = useRef(targetDeg);

  useEffect(() => {
    const previous = previousRef.current;
    const wrapped = (((targetDeg - previous + 180) % 360) + 360) % 360 - 180;
    const next = previous + wrapped;
    previousRef.current = next;
    setAngle(next);
  }, [targetDeg]);

  return angle;
}
