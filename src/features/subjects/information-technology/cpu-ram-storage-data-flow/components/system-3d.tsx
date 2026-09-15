"use client";

import dynamic from "next/dynamic";
import type { ComponentId, PhysicalComponentId } from "../model";

const System3DScene = dynamic(() => import("./system-3d-scene").then((mod) => mod.System3DScene), {
  ssr: false,
  loading: () => (
    <div className="flex h-[380px] w-full items-center justify-center rounded-card border border-line text-sm text-ink-soft dark:border-line-dark dark:text-bone-soft sm:h-[460px]">
      Loading 3D motherboard lab…
    </div>
  ),
});

export function System3D({
  selected,
  onSelect,
}: {
  selected: ComponentId | PhysicalComponentId | null;
  onSelect: (id: ComponentId | PhysicalComponentId) => void;
}) {
  return <System3DScene selected={selected} onSelect={onSelect} />;
}
