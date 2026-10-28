"use client";

import { useEffect, useState } from "react";

/**
 * True when the learner asked the OS/browser for reduced motion. Starts `false` on the server and first render
 * (no hydration mismatch), then follows the media query live. Simulations use it to skip continuous animation:
 * one-shot runs jump to their end state, looping ones start paused.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}
