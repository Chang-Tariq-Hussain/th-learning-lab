"use client";

import type { Device } from "../model";
import { DEVICE_INFO } from "../model";
import { Panel } from "./ui";

export function DeviceInspectorPanel({
  device,
  onRename,
  onRemove,
}: {
  device: Device | null;
  onRename?: (label: string) => void;
  onRemove?: () => void;
}) {
  if (!device) {
    return (
      <Panel title="Device inspector">
        <p className="text-sm text-ink-soft dark:text-bone-soft">Select a device to see what it is and what it does.</p>
      </Panel>
    );
  }
  const info = DEVICE_INFO[device.type];
  return (
    <Panel title="Device inspector">
      <div className="flex items-center justify-between gap-2">
        {onRename ? (
          <input
            value={device.label}
            onChange={(e) => onRename(e.target.value)}
            className="w-full rounded-md border border-line bg-transparent px-2 py-1 text-sm font-medium text-ink dark:border-line-dark dark:text-bone"
            aria-label="Device name"
          />
        ) : (
          <p className="text-sm font-medium text-ink dark:text-bone">{device.label}</p>
        )}
      </div>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-subject-it">
        {info.label} · {info.categoryLabel}
      </p>
      <ul className="mt-2 flex flex-col gap-1 text-sm text-ink-soft dark:text-bone-soft">
        {info.bullets.map((b, i) => (
          <li key={i} className="flex gap-1.5">
            <span aria-hidden>•</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      {onRemove && (
        <button
          onClick={onRemove}
          className="mt-3 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft dark:border-line-dark dark:text-bone-soft"
        >
          Remove device
        </button>
      )}
    </Panel>
  );
}
