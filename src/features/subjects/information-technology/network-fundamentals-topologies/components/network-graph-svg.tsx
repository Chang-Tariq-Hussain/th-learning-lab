"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Device, DeviceType, Link, NetworkState } from "../model";

const DEVICE_SHORT: Record<DeviceType, string> = {
  pc: "PC",
  laptop: "LT",
  phone: "PH",
  server: "SV",
  printer: "PR",
  switch: "SW",
  router: "RT",
  ap: "AP",
  cloud: "NET",
};

function deviceShape(type: DeviceType): "circle" | "rect" | "diamond" {
  if (type === "switch" || type === "router" || type === "ap") return "diamond";
  if (type === "server" || type === "printer" || type === "cloud") return "rect";
  return "circle";
}

export interface NetworkGraphSvgProps {
  state: NetworkState;
  width?: number;
  height?: number;
  selectedDeviceId?: string | null;
  onSelectDevice?: (id: string) => void;
  selectedLinkId?: string | null;
  onSelectLink?: (id: string) => void;
  failedDeviceIds?: Set<string>;
  failedLinkIds?: Set<string>;
  spofDeviceIds?: Set<string>;
  spofLinkIds?: Set<string>;
  pathDeviceIds?: Set<string>;
  pathLinkIds?: Set<string>;
  packetAt?: { x: number; y: number; lost?: boolean } | null;
  draggable?: boolean;
  onMoveDevice?: (id: string, x: number, y: number) => void;
  connectFromId?: string | null;
  ariaLabel?: string;
}

function linkDash(type: Link["type"]): string | undefined {
  if (type === "wireless") return "2 4";
  return undefined;
}

export function NetworkGraphSvg({
  state,
  width = 520,
  height = 300,
  selectedDeviceId,
  onSelectDevice,
  selectedLinkId,
  onSelectLink,
  failedDeviceIds,
  failedLinkIds,
  spofDeviceIds,
  spofLinkIds,
  pathDeviceIds,
  pathLinkIds,
  packetAt,
  draggable,
  onMoveDevice,
  connectFromId,
  ariaLabel = "Network diagram",
}: NetworkGraphSvgProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const positions = new Map(state.devices.map((d) => [d.id, { x: d.x, y: d.y }]));

  function toSvgPoint(clientX: number, clientY: number) {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * width;
    const y = ((clientY - rect.top) / rect.height) * height;
    return { x, y };
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragId || !onMoveDevice) return;
    const p = toSvgPoint(e.clientX, e.clientY);
    onMoveDevice(dragId, Math.max(30, Math.min(width - 30, p.x)), Math.max(30, Math.min(height - 30, p.y)));
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="h-72 w-full touch-none rounded-card border border-line bg-paper dark:border-line-dark dark:bg-chalkboard sm:h-80"
      role="img"
      aria-label={ariaLabel}
      onPointerMove={handlePointerMove}
      onPointerUp={() => setDragId(null)}
      onPointerLeave={() => setDragId(null)}
    >
      {/* Links */}
      {state.links.map((l) => {
        const a = positions.get(l.a);
        const b = positions.get(l.b);
        if (!a || !b) return null;
        const failed = failedLinkIds?.has(l.id);
        const spof = spofLinkIds?.has(l.id);
        const onPath = pathLinkIds?.has(l.id);
        const selected = selectedLinkId === l.id;
        return (
          <g key={l.id}>
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              strokeDasharray={linkDash(l.type)}
              strokeWidth={selected || onPath ? 3.5 : spof ? 3 : 2}
              className={cn(
                "cursor-pointer",
                failed
                  ? "stroke-red-400/60"
                  : onPath
                    ? "stroke-emerald-500"
                    : spof
                      ? "stroke-amber-500"
                      : selected
                        ? "stroke-subject-it"
                        : "stroke-ink/35 dark:stroke-bone/35",
              )}
              onClick={() => onSelectLink?.(l.id)}
            />
            {failed && (
              <line
                x1={a.x + (b.x - a.x) * 0.42}
                y1={a.y + (b.y - a.y) * 0.42 - 8}
                x2={a.x + (b.x - a.x) * 0.58}
                y2={a.y + (b.y - a.y) * 0.58 + 8}
                strokeWidth={3}
                className="stroke-red-500"
              />
            )}
          </g>
        );
      })}

      {/* Packet dot */}
      {packetAt && (
        <circle
          cx={packetAt.x}
          cy={packetAt.y}
          r={6}
          className={packetAt.lost ? "fill-red-500" : "fill-emerald-500"}
        />
      )}

      {/* Devices */}
      {state.devices.map((d) => (
        <DeviceNode
          key={d.id}
          device={d}
          selected={selectedDeviceId === d.id}
          failed={!!failedDeviceIds?.has(d.id)}
          spof={!!spofDeviceIds?.has(d.id)}
          onPath={!!pathDeviceIds?.has(d.id)}
          connecting={connectFromId === d.id}
          onSelect={() => onSelectDevice?.(d.id)}
          onDragStart={draggable ? () => setDragId(d.id) : undefined}
        />
      ))}
    </svg>
  );
}

function DeviceNode({
  device,
  selected,
  failed,
  spof,
  onPath,
  connecting,
  onSelect,
  onDragStart,
}: {
  device: Device;
  selected: boolean;
  failed: boolean;
  spof: boolean;
  onPath: boolean;
  connecting: boolean;
  onSelect: () => void;
  onDragStart?: () => void;
}) {
  const shape = deviceShape(device.type);
  const strokeClass = failed
    ? "stroke-red-500"
    : connecting
      ? "stroke-emerald-500"
      : onPath
        ? "stroke-emerald-500"
        : spof
          ? "stroke-amber-500"
          : selected
            ? "stroke-subject-it"
            : "stroke-ink/60 dark:stroke-bone/60";
  const fillClass = failed ? "fill-red-100 dark:fill-red-500/10" : "fill-subject-it-soft dark:fill-subject-it/15";
  const strokeWidth = selected || spof || connecting ? 2.6 : 1.6;

  return (
    <g
      transform={`translate(${device.x}, ${device.y})`}
      className="cursor-pointer"
      onPointerDown={onDragStart}
      onClick={onSelect}
    >
      {shape === "circle" && <circle r={22} className={cn(fillClass, strokeClass)} strokeWidth={strokeWidth} />}
      {shape === "rect" && <rect x={-24} y={-18} width={48} height={36} rx={6} className={cn(fillClass, strokeClass)} strokeWidth={strokeWidth} />}
      {shape === "diamond" && (
        <rect x={-22} y={-22} width={44} height={44} rx={10} transform="rotate(45)" className={cn(fillClass, strokeClass)} strokeWidth={strokeWidth} />
      )}
      {failed && (
        <text textAnchor="middle" y={5} className="fill-red-600 font-mono text-[14px] font-bold dark:fill-red-400">
          ✕
        </text>
      )}
      {!failed && (
        <text textAnchor="middle" y={4} className="fill-ink font-mono text-[10px] font-medium dark:fill-bone">
          {DEVICE_SHORT[device.type]}
        </text>
      )}
      <text textAnchor="middle" y={38} className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">
        {device.label}
      </text>
    </g>
  );
}
