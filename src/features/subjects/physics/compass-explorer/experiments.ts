/**
 * Preset magnet + compass arrangements for the "quick experiments"
 * buttons. Pure data + geometry — no React, no field math — mirroring
 * the same spirit as the Magnet Explorer's own `experiments.ts`. The
 * field calculation and needle animation react to these presets on
 * their own, so an experiment only ever decides a starting position.
 */

import { MAGNET_LENGTH, PLAYGROUND_HEIGHT, PLAYGROUND_WIDTH, type MagnetState } from "@/features/subjects/physics/magnet-explorer";
import type { CompassState } from "./compass-model";

export type ExperimentId = "bring-close" | "rotate-magnet" | "near-north" | "near-south";

export interface Experiment {
  id: ExperimentId;
  title: string;
  description: string;
  apply: () => { magnet: MagnetState; compass: CompassState };
}

const HALF_MAGNET = MAGNET_LENGTH / 2;
const CENTER_X = PLAYGROUND_WIDTH * 0.5;
const CENTER_Y = PLAYGROUND_HEIGHT * 0.5;

export const EXPERIMENTS: Experiment[] = [
  {
    id: "bring-close",
    title: "Move the magnet near the compass",
    description: "Watch the needle snap into alignment.",
    apply: () => ({
      magnet: { id: "a", x: CENTER_X - 150, y: CENTER_Y, rotation: 0 },
      compass: { id: "compass", x: CENTER_X + 130, y: CENTER_Y },
    }),
  },
  {
    id: "rotate-magnet",
    title: "Rotate the magnet",
    description: "The needle turns to follow it.",
    apply: () => ({
      magnet: { id: "a", x: CENTER_X - 140, y: CENTER_Y, rotation: 90 },
      compass: { id: "compass", x: CENTER_X + 120, y: CENTER_Y },
    }),
  },
  {
    id: "near-north",
    title: "Compass near the North pole",
    description: "The red end points away from N.",
    apply: () => ({
      magnet: { id: "a", x: CENTER_X - 90, y: CENTER_Y, rotation: 0 },
      compass: { id: "compass", x: CENTER_X - 90 + HALF_MAGNET + 60, y: CENTER_Y },
    }),
  },
  {
    id: "near-south",
    title: "Compass near the South pole",
    description: "The red end points toward S.",
    apply: () => ({
      magnet: { id: "a", x: CENTER_X + 90, y: CENTER_Y, rotation: 0 },
      compass: { id: "compass", x: CENTER_X + 90 - HALF_MAGNET - 60, y: CENTER_Y },
    }),
  },
];
