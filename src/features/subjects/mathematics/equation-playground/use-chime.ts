"use client";

import { useCallback, useRef } from "react";

/**
 * A three-note "ta-da" arpeggio synthesized with the Web Audio API —
 * no `.mp3`/`.wav` asset to ship, and it degrades silently (celebration
 * stays purely visual) if `AudioContext` is unavailable or blocked.
 */
export function useChime() {
  const contextRef = useRef<AudioContext | null>(null);

  return useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!contextRef.current) contextRef.current = new AudioContextClass();
      const ctx = contextRef.current;
      if (ctx.state === "suspended") void ctx.resume();

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

      notes.forEach((frequency, i) => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        const start = now + i * 0.09;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        oscillator.connect(gain).connect(ctx.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.4);
      });
    } catch {
      // Audio isn't available or was blocked — the celebration stays purely visual.
    }
  }, []);
}
