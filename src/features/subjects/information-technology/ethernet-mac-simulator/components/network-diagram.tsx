"use client";

import { cn } from "@/lib/utils";
import { DEVICE_POS, SWITCH_POS, type ForwardKind, type LabDevice, type Transmission } from "../model";

const VIEW_W = 400;
const VIEW_H = 360;
const CARD_W = 104;
const CARD_H = 50;

function lerp(a: { x: number; y: number }, b: { x: number; y: number }, t: number) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

const TOKEN_TONE: Record<ForwardKind | "pending", string> = {
  pending: "fill-sky-500",
  "known-unicast": "fill-sky-500",
  "unknown-unicast": "fill-violet-500",
  broadcast: "fill-amber-500",
  filtered: "fill-red-500",
};

const KIND_CAPTION: Record<ForwardKind, string> = {
  "known-unicast": "Known → forward to 1 port",
  "unknown-unicast": "Unknown → flood",
  broadcast: "Broadcast → flood",
  filtered: "Filtered",
};

/**
 * 2D LAN diagram: five devices in a star around one switch. The frame
 * "token" is positioned purely as a function of the current step index and
 * moves with a CSS transition — no animation loop, no requestAnimationFrame.
 */
export function NetworkDiagram({
  devices,
  tx,
  stepIndex,
  selectedDeviceId,
  onSelectDevice,
  ariaLabel = "Local network: five devices connected to one switch",
}: {
  devices: LabDevice[];
  tx: Transmission | null;
  stepIndex: number;
  selectedDeviceId?: string | null;
  onSelectDevice?: (id: string) => void;
  ariaLabel?: string;
}) {
  const active = tx && stepIndex >= 0 ? tx : null;
  const step = active ? active.steps[Math.min(stepIndex, active.steps.length - 1)]! : null;
  const kind: ForwardKind | "pending" = active && stepIndex >= 6 ? active.decision.kind : "pending";
  const srcPos = active ? DEVICE_POS[active.srcId]! : null;

  // Main token: source -> switch.
  let mainPos = srcPos ? lerp(srcPos, SWITCH_POS, 0.3) : SWITCH_POS;
  if (active && srcPos) {
    if (stepIndex >= 5) mainPos = { x: SWITCH_POS.x, y: SWITCH_POS.y - 34 };
    else if (stepIndex === 4) mainPos = lerp(srcPos, SWITCH_POS, 0.68);
  }
  const mainVisible = !!active && stepIndex <= 5;
  const mainLabel = stepIndex === 0 ? "Data" : "Frame";

  const sendLinkOn = !!active && stepIndex >= 4;
  const egressIds = active ? active.deliveries.map((d) => d.deviceId) : [];

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="mx-auto h-auto w-full max-w-[560px] rounded-card border border-line bg-paper dark:border-line-dark dark:bg-chalkboard"
      role="img"
      aria-label={ariaLabel}
    >
      {/* Links + port labels */}
      {devices.map((d) => {
        const p = DEVICE_POS[d.id]!;
        const isSrcLink = !!active && d.id === active.srcId && sendLinkOn;
        const isEgress = !!active && stepIndex >= 7 && egressIds.includes(d.id);
        const portLabel = lerp(SWITCH_POS, p, 0.34);
        return (
          <g key={`link-${d.id}`}>
            <line
              x1={p.x}
              y1={p.y}
              x2={SWITCH_POS.x}
              y2={SWITCH_POS.y}
              strokeWidth={isSrcLink || isEgress ? 3.2 : 2}
              className={cn(isSrcLink ? "stroke-sky-500" : isEgress ? (kind === "broadcast" ? "stroke-amber-500" : kind === "unknown-unicast" ? "stroke-violet-500" : "stroke-emerald-500") : "stroke-ink/30 dark:stroke-bone/30")}
            />
            <g transform={`translate(${portLabel.x}, ${portLabel.y})`}>
              <rect x={-16} y={-7} width={32} height={14} rx={7} className="fill-paper stroke-ink/25 dark:fill-chalkboard dark:stroke-bone/25" strokeWidth={1} />
              <text textAnchor="middle" y={3} className="fill-ink-soft font-mono text-[8px] dark:fill-bone-soft">
                Port {d.port}
              </text>
            </g>
          </g>
        );
      })}

      {/* Switch */}
      <g transform={`translate(${SWITCH_POS.x}, ${SWITCH_POS.y})`}>
        <rect x={-48} y={-22} width={96} height={44} rx={9} className={cn("fill-subject-it-soft dark:fill-subject-it/15", step?.location === "switch" ? "stroke-subject-it" : "stroke-ink/60 dark:stroke-bone/60")} strokeWidth={step?.location === "switch" ? 2.8 : 1.6} />
        {[-30, -15, 0, 15, 30].map((x) => (
          <rect key={x} x={x - 4} y={9} width={8} height={6} rx={1.5} className="fill-ink/50 dark:fill-bone/50" />
        ))}
        <text textAnchor="middle" y={-3} className="fill-ink font-mono text-[11px] font-medium dark:fill-bone">
          Switch
        </text>
      </g>
      {active && stepIndex >= 6 && (
        <text x={SWITCH_POS.x} y={SWITCH_POS.y - 52} textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">
          {KIND_CAPTION[active.decision.kind]}
        </text>
      )}

      {/* Devices */}
      {devices.map((d) => {
        const p = DEVICE_POS[d.id]!;
        const isSource = !!active && d.id === active.srcId;
        const delivery = active?.deliveries.find((x) => x.deviceId === d.id);
        const isIntended = !!active && !active.isBroadcast && d.id === active.dstId;
        const processed = !!active && stepIndex >= 9;
        const received = !!active && stepIndex >= 8 && !!delivery;
        const selected = selectedDeviceId === d.id;

        let status = "";
        let statusTone = "fill-ink-soft dark:fill-bone-soft";
        if (active) {
          if (isSource) {
            status = "sender";
            statusTone = "fill-sky-600 dark:fill-sky-300";
          } else if (processed && delivery) {
            status = delivery.accepted ? "accepted ✓" : delivery.fcsOk ? "ignored ✕" : "bad FCS ✕";
            statusTone = delivery.accepted ? "fill-emerald-600 dark:fill-emerald-300" : "fill-red-600 dark:fill-red-300";
          } else if (received) {
            status = "got a copy";
            statusTone = "fill-amber-600 dark:fill-amber-300";
          } else if (isIntended) {
            status = "intended receiver";
            statusTone = "fill-emerald-600 dark:fill-emerald-300";
          } else if (active.isBroadcast && stepIndex >= 3) {
            status = "everyone";
          }
        }

        const stroke = isSource
          ? "stroke-sky-500"
          : processed && delivery?.accepted
            ? "stroke-emerald-500"
            : processed && delivery
              ? "stroke-red-400"
              : isIntended
                ? "stroke-emerald-500"
                : selected
                  ? "stroke-subject-it"
                  : "stroke-ink/50 dark:stroke-bone/50";

        return (
          <g
            key={d.id}
            transform={`translate(${p.x - CARD_W / 2}, ${p.y - CARD_H / 2})`}
            className={onSelectDevice ? "cursor-pointer" : undefined}
            onClick={() => onSelectDevice?.(d.id)}
          >
            <rect width={CARD_W} height={CARD_H} rx={8} className={cn("fill-white dark:fill-white/[0.04]", stroke)} strokeWidth={isSource || isIntended || selected || (processed && !!delivery) ? 2.4 : 1.4} />
            <text x={CARD_W / 2} y={16} textAnchor="middle" className="fill-ink font-mono text-[11px] font-semibold dark:fill-bone">
              {d.name}
            </text>
            <text x={CARD_W / 2} y={30} textAnchor="middle" className="fill-ink-soft font-mono text-[8.5px] dark:fill-bone-soft">
              {d.mac}
            </text>
            <text x={CARD_W / 2} y={43} textAnchor="middle" className={cn("font-mono text-[8.5px] font-medium", statusTone)}>
              {status || `${d.interfaceName} · Port ${d.port}`}
            </text>
          </g>
        );
      })}

      {/* Main frame token (source → switch) */}
      {active && (
        <g
          className="transition-[transform,opacity] duration-700 ease-in-out motion-reduce:transition-none"
          style={{ transform: `translate(${mainPos.x}px, ${mainPos.y}px)`, opacity: mainVisible ? 1 : 0 }}
        >
          <rect x={-22} y={-9} width={44} height={18} rx={5} className={TOKEN_TONE.pending} />
          <text textAnchor="middle" y={4} className="fill-white font-mono text-[9px] font-semibold">
            {mainLabel}
          </text>
        </g>
      )}

      {/* Egress tokens (switch → each output port's device) */}
      {active &&
        active.deliveries.map((d) => {
          const devPos = DEVICE_POS[d.deviceId]!;
          const pos = stepIndex >= 8 ? lerp(SWITCH_POS, devPos, 0.78) : stepIndex === 7 ? lerp(SWITCH_POS, devPos, 0.5) : { x: SWITCH_POS.x, y: SWITCH_POS.y - 34 };
          const visible = stepIndex >= 6;
          return (
            <g
              key={`tok-${d.deviceId}`}
              className="transition-[transform,opacity] duration-700 ease-in-out motion-reduce:transition-none"
              style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, opacity: visible ? 1 : 0 }}
            >
              <rect x={-22} y={-9} width={44} height={18} rx={5} className={TOKEN_TONE[kind]} />
              <text textAnchor="middle" y={4} className="fill-white font-mono text-[9px] font-semibold">
                Frame
              </text>
            </g>
          );
        })}

      {/* Nothing forwarded */}
      {active && stepIndex >= 7 && active.decision.egressPorts.length === 0 && (
        <text x={SWITCH_POS.x} y={SWITCH_POS.y + 44} textAnchor="middle" className="fill-red-600 font-mono text-[9px] dark:fill-red-300">
          frame dropped
        </text>
      )}

      {/* Legend hint when idle */}
      {!active && (
        <text x={VIEW_W / 2} y={SWITCH_POS.y + 44} textAnchor="middle" className="fill-ink-soft font-mono text-[9px] dark:fill-bone-soft">
          Send a frame to watch it travel
        </text>
      )}
    </svg>
  );
}
