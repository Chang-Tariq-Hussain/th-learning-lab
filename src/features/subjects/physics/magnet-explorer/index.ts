"use client";

import { createElement } from "react";
import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/dashboard/simulation-skeleton";

/**
 * Code-split so this simulation's (often large, browser-only) code
 * only downloads when a student actually opens it — the topic and
 * subject list pages never pay for it. `ssr: false` skips server
 * rendering for the same reason: nothing here needs to appear in the
 * initial HTML, and it avoids paying server render cost for a canvas/
 * animation-heavy component. The skeleton below is shown the instant
 * navigation starts, so there's no blank page while it loads.
 */
export const MagnetExplorer = dynamic(() => import("./magnet-explorer").then((mod) => mod.MagnetExplorer), {
  ssr: false,
  loading: () => createElement(SimulationSkeleton),
});

// ---------------------------------------------------------------------------
// Reusable pieces — exported so other physics visualizations (e.g. the
// Compass Explorer) can reuse the same bar-magnet geometry, physics, and
// rendering instead of duplicating it. Nothing here changes this
// feature's own behavior; it's purely additive.
// ---------------------------------------------------------------------------
export { Magnet } from "./components/magnet";
export type { MagnetProps } from "./components/magnet";
export { FieldLines } from "./components/field-lines";
export type { FieldLinesProps } from "./components/field-lines";

export {
  MAGNET_LENGTH,
  MAGNET_WIDTH,
  PLAYGROUND_HEIGHT,
  PLAYGROUND_WIDTH,
  ROTATE_HANDLE_OFFSET,
  angleBetween,
  clampToPlayground,
  getPoles,
  pointerToPlaygroundPoint,
  toRadians,
} from "./magnet-model";
export type { MagnetId, MagnetState, Point } from "./magnet-model";

export { getInteractionStatus, INTERACTION_RANGE } from "./magnet-physics";
export type { InteractionStatus, InteractionType, PoleLabel } from "./magnet-physics";
