"use client";

import { PlaybackControls } from "./playback-controls";
import { SpeedController } from "./speed-controller";
import { ZoomControls } from "./zoom-controls";
import { FullscreenButton } from "./fullscreen-button";
import { ExportScreenshotButton } from "./export-screenshot-button";
import { cn } from "@/lib/utils";
import type { SpeedMultiplier } from "../../types";

export interface ToolbarProps {
  /** Toggle individual control groups off for simulations that don't need them. */
  showSpeed?: boolean;
  showZoom?: boolean;
  showFullscreen?: boolean;
  showExport?: boolean;
  speedOptions?: readonly SpeedMultiplier[];
  exportFilename?: string;
  className?: string;
}

/**
 * The standard control strip for a simulation: transport controls on the
 * left, speed/zoom/fullscreen/export on the right. Wraps onto a second
 * line on narrow viewports rather than overflowing or squeezing controls.
 */
export function Toolbar({
  showSpeed = true,
  showZoom = true,
  showFullscreen = true,
  showExport = true,
  speedOptions,
  exportFilename,
  className,
}: ToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 dark:border-line-dark",
        className
      )}
    >
      <PlaybackControls />

      <div className="flex flex-wrap items-center gap-2">
        {showSpeed ? <SpeedController options={speedOptions} /> : null}
        {showZoom ? <ZoomControls /> : null}
        {(showFullscreen || showExport) && (
          <div className="flex items-center gap-1 rounded-full border border-ink/10 px-1 dark:border-bone/15">
            {showExport ? <ExportScreenshotButton filename={exportFilename} /> : null}
            {showFullscreen ? <FullscreenButton /> : null}
          </div>
        )}
      </div>
    </div>
  );
}
