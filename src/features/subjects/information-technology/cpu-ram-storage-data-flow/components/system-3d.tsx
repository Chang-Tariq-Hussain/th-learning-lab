"use client";

import dynamic from "next/dynamic";

const System3DScene = dynamic(() => import("./system-3d-scene").then((mod) => mod.System3DScene), {
  ssr: false,
  loading: () => (
    <div className="flex h-[280px] w-full items-center justify-center rounded-card border border-line text-sm text-ink-soft dark:border-line-dark dark:text-bone-soft sm:h-[340px]">
      Loading 3D view…
    </div>
  ),
});

export function System3D() {
  return <System3DScene />;
}
