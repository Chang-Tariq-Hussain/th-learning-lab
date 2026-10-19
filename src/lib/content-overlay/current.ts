import raw from "@/content/overlay.json";
import type { ContentOverlay } from "./types";

/** The overlay committed by the last `npm run content:publish` (empty until the first publish). */
export const overlay = raw as unknown as ContentOverlay;
