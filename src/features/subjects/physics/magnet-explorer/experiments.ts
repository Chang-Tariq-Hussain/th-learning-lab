/**
 * Preset magnet arrangements for the "quick experiments" buttons. Pure
 * data + geometry, same spirit as `magnet-model.ts` — no React, no
 * force rules, just "where do the magnets start". The existing
 * attract/repel settle loop in `magnet-physics.ts` takes over the
 * instant a preset is applied, so an experiment never animates
 * anything itself — it only ever decides a starting position.
 */

import { PLAYGROUND_HEIGHT, PLAYGROUND_WIDTH, type MagnetId, type MagnetState } from "./magnet-model";

export type ExperimentId = "opposite" | "like" | "rotate" | "separate";

export interface Experiment {
  id: ExperimentId;
  title: string;
  description: string;
  apply: () => Record<MagnetId, MagnetState>;
}

const CENTER_Y = PLAYGROUND_HEIGHT * 0.5;

export const EXPERIMENTS: Experiment[] = [
  {
    id: "opposite",
    title: "Opposite poles together",
    description: "Bring N face to face with S.",
    apply: () => ({
      a: { id: "a", x: PLAYGROUND_WIDTH * 0.365, y: CENTER_Y, rotation: 0 },
      b: { id: "b", x: PLAYGROUND_WIDTH * 0.635, y: CENTER_Y, rotation: 0 },
    }),
  },
  {
    id: "like",
    title: "Like poles together",
    description: "Bring N face to face with N.",
    apply: () => ({
      a: { id: "a", x: PLAYGROUND_WIDTH * 0.365, y: CENTER_Y, rotation: 0 },
      b: { id: "b", x: PLAYGROUND_WIDTH * 0.635, y: CENTER_Y, rotation: 180 },
    }),
  },
  {
    id: "rotate",
    title: "Rotate one magnet",
    description: "Watch the field lines turn with it.",
    apply: () => ({
      a: { id: "a", x: PLAYGROUND_WIDTH * 0.325, y: CENTER_Y, rotation: 0 },
      b: { id: "b", x: PLAYGROUND_WIDTH * 0.7, y: CENTER_Y, rotation: 90 },
    }),
  },
  {
    id: "separate",
    title: "Separate the magnets",
    description: "Move them out of range.",
    apply: () => ({
      a: { id: "a", x: PLAYGROUND_WIDTH * 0.14, y: CENTER_Y, rotation: 0 },
      b: { id: "b", x: PLAYGROUND_WIDTH * 0.86, y: CENTER_Y, rotation: 0 },
    }),
  },
];
