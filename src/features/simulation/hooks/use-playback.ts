"use client";

import { useCallback } from "react";
import { useSimulation } from "../context/simulation-context";

export interface UsePlaybackOptions {
  /** Called when the "F" shortcut is pressed; wire this to a fullscreen toggle. */
  onToggleFullscreen?: () => void;
  /** Turn keyboard shortcuts off, e.g. while a text input inside the panel has focus. */
  enableShortcuts?: boolean;
}

export interface UsePlaybackResult {
  status: ReturnType<typeof useSimulation>["status"];
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
  step: () => void;
  speed: ReturnType<typeof useSimulation>["speed"];
  setSpeed: ReturnType<typeof useSimulation>["setSpeed"];
  /**
   * Spread onto the focusable container that should own keyboard
   * shortcuts, e.g. `<SimulationContainer {...keyboardProps}>`.
   * Requires the element to be focusable (`tabIndex={0}`), which
   * `SimulationContainer` already sets.
   */
  keyboardProps: {
    onKeyDown: (event: React.KeyboardEvent) => void;
  };
}

/**
 * A convenience layer over `useSimulation()` that adds the standard,
 * accessible keyboard shortcuts every simulation should share:
 *
 * - Space → play / pause
 * - R → reset
 * - Arrow Right → step forward one frame
 * - Arrow Left → pause (a safe, predictable "step back" stand-in, since
 *   most simulations can't cheaply rewind arbitrary physics state)
 * - F → toggle fullscreen (via `onToggleFullscreen`)
 */
export function usePlayback({
  onToggleFullscreen,
  enableShortcuts = true,
}: UsePlaybackOptions = {}): UsePlaybackResult {
  const sim = useSimulation();

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!enableShortcuts) return;

      switch (event.key) {
        case " ":
        case "Spacebar":
          event.preventDefault();
          sim.toggle();
          break;
        case "r":
        case "R":
          event.preventDefault();
          sim.resetAll();
          break;
        case "ArrowRight":
          event.preventDefault();
          sim.step();
          break;
        case "ArrowLeft":
          event.preventDefault();
          sim.pause();
          break;
        case "f":
        case "F":
          event.preventDefault();
          onToggleFullscreen?.();
          break;
        default:
          break;
      }
    },
    [enableShortcuts, sim, onToggleFullscreen]
  );

  return {
    status: sim.status,
    isPlaying: sim.status === "playing",
    play: sim.play,
    pause: sim.pause,
    toggle: sim.toggle,
    reset: sim.resetAll,
    step: sim.step,
    speed: sim.speed,
    setSpeed: sim.setSpeed,
    keyboardProps: { onKeyDown },
  };
}
