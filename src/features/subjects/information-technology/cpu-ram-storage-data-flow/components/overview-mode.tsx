"use client";

import { useState } from "react";
import { Box } from "lucide-react";
import { cn } from "@/lib/utils";
import { ARCHITECTURE_DISCLAIMER, type ComponentId, type PhysicalComponentId } from "../model";
import { SystemDiagram } from "./system-diagram";
import { InspectPanel } from "./inspect-panel";
import { System3D } from "./system-3d";

export function OverviewMode() {
  const [inspected, setInspected] = useState<ComponentId | PhysicalComponentId | null>(null);
  const [show3D, setShow3D] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-ink-soft dark:text-bone-soft">
        This is the full architecture the other modes explore in depth. Click any component to read what it does, then
        use the mode tabs above to watch data actually move through it.
      </p>

      <div className="rounded-card border border-line bg-paper p-2 dark:border-line-dark dark:bg-chalkboard sm:p-4">
        <SystemDiagram
          activeComponents={[]}
          stepKey="overview-idle"
          inspectedId={inspected as ComponentId | null}
          onInspect={setInspected}
        />
      </div>

      <button
        onClick={() => setShow3D((s) => !s)}
        className={cn(
          "inline-flex h-11 w-fit items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors",
          show3D
            ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20"
            : "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40"
        )}
      >
        <Box className="h-4 w-4" />
        {show3D ? "Hide 3D motherboard lab" : "Show 3D motherboard lab"}
      </button>

      {show3D && (
        <div className="flex flex-col gap-2">
          <System3D selected={inspected} onSelect={setInspected} />
          <p className="text-xs text-ink-soft dark:text-bone-soft">
            A physical computer architecture lab — rotate, pan, zoom, or click any part (socket, CPU, RAM slots, SSD,
            PCIe, chipset, VRM, rear I/O) to see what it does. The step-by-step data flow itself is still taught in 2D
            in the other modes, where it&apos;s clearer to follow.
          </p>
        </div>
      )}

      <InspectPanel id={inspected} />

      <p className="text-xs text-ink-soft dark:text-bone-soft">{ARCHITECTURE_DISCLAIMER}</p>
    </div>
  );
}
