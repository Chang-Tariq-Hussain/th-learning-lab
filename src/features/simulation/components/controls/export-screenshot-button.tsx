"use client";

import { useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { useSimulationSurface } from "../../context/surface-context";
import { cn } from "@/lib/utils";

export interface ExportScreenshotButtonProps {
  /** Base filename (without extension) for the downloaded PNG. */
  filename?: string;
  className?: string;
}

/**
 * Captures the simulation's whole surface (canvas + visible panels) as a
 * PNG download. Uses `html2canvas` via a dynamic import so the ~180KB
 * dependency is only fetched when someone actually clicks the button,
 * instead of bloating every simulation's initial bundle.
 */
export function ExportScreenshotButton({
  filename = "simulation",
  className,
}: ExportScreenshotButtonProps) {
  const { containerRef } = useSimulationSurface();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const node = containerRef.current;
    if (!node || isExporting) return;

    setIsExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(node, {
        backgroundColor: null,
        useCORS: true,
        scale: Math.min(window.devicePixelRatio || 1, 2),
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${filename}-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error("Screenshot export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      aria-label="Export screenshot"
      title="Export screenshot"
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-ink/[0.04] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500 disabled:opacity-50 dark:text-bone-soft dark:hover:bg-bone/[0.06] dark:hover:text-bone",
        className
      )}
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
      ) : (
        <Camera className="h-4 w-4" strokeWidth={1.75} />
      )}
    </button>
  );
}
