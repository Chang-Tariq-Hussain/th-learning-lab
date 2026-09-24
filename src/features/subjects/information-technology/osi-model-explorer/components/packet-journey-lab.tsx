"use client";

import { useEffect, useRef, useState } from "react";
import { PACKET_JOURNEY_LINKS, PACKET_JOURNEY_NODES, getLayer, type OsiLayerNumber } from "../model";
import { Callout, Panel, SectionHeading } from "./ui";

/**
 * A deliberately small, fixed network (not the full graph model from
 * Network Fundamentals & Topologies, which models arbitrary devices
 * and layouts) — just enough to show where OSI layers conceptually
 * participate along one simple path. No routing engine: the path is
 * fixed and the only thing that changes is which device is
 * highlighted as a packet "passes through" it.
 */
export function PacketJourneyLab() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  function play() {
    if (timerRef.current) clearTimeout(timerRef.current);
    let i = 0;
    setActiveIndex(0);
    const step = () => {
      i += 1;
      if (i >= PACKET_JOURNEY_NODES.length) {
        timerRef.current = setTimeout(() => setActiveIndex(null), 500);
        return;
      }
      setActiveIndex(i);
      timerRef.current = setTimeout(step, 700);
    };
    timerRef.current = setTimeout(step, 700);
  }

  const activeNode = activeIndex !== null ? PACKET_JOURNEY_NODES[activeIndex] : null;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="A simple packet journey">
        This isn&apos;t a routing engine — it&apos;s a small, fixed path meant only to show which OSI layers
        conceptually do work at each stop between two computers.
      </SectionHeading>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-soft dark:text-bone-soft">Computer A → Switch → Router → Computer B</span>
          <button
            onClick={play}
            disabled={activeIndex !== null}
            className="rounded-full border border-subject-it bg-subject-it-soft px-3 py-1.5 text-xs font-medium text-subject-it disabled:opacity-40 dark:bg-subject-it/20"
          >
            Send packet
          </button>
        </div>

        <svg viewBox="0 0 600 220" className="h-auto w-full" role="img" aria-label="Packet journey from Computer A through a Switch and Router to Computer B">
          {PACKET_JOURNEY_LINKS.map((link) => {
            const a = PACKET_JOURNEY_NODES.find((n) => n.id === link.a)!;
            const b = PACKET_JOURNEY_NODES.find((n) => n.id === link.b)!;
            return (
              <line
                key={`${link.a}-${link.b}`}
                x1={a.x}
                y1={a.y + 70}
                x2={b.x}
                y2={b.y + 70}
                stroke="currentColor"
                strokeWidth={2}
                className="text-line dark:text-line-dark"
              />
            );
          })}

          {PACKET_JOURNEY_NODES.map((node, index) => {
            const isActive = index === activeIndex;
            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y + 70})`}>
                <rect
                  x={-46}
                  y={-28}
                  width={92}
                  height={56}
                  rx={12}
                  className={isActive ? "fill-subject-it-soft stroke-subject-it dark:fill-subject-it/30" : "fill-white stroke-line dark:fill-chalkboard dark:stroke-line-dark"}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                <text textAnchor="middle" y={-4} className="fill-ink text-[13px] font-medium dark:fill-bone">
                  {node.label}
                </text>
                <text textAnchor="middle" y={16} className="fill-ink-soft text-[10px] dark:fill-bone-soft">
                  {node.kind === "host" ? "End host" : node.kind === "switch" ? "Data Link" : "Network"}
                </text>
              </g>
            );
          })}
        </svg>

        {activeNode ? (
          <Panel title={`At: ${activeNode.label}`}>
            <p className="text-sm text-ink dark:text-bone">
              {activeNode.kind === "host"
                ? "An end host participates at every layer — from building the request at the Application layer down to putting bits on the wire."
                : activeNode.kind === "switch"
                  ? "A switch conceptually operates at the Data Link layer — it reads link-layer (MAC) addressing to decide which port to forward the frame out of."
                  : "A router conceptually operates at the Network layer — it reads the logical (IP) address to decide which network to forward the packet toward next."}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {activeNode.layers.map((layerNum: OsiLayerNumber) => (
                <span key={layerNum} className="rounded-full border border-line px-2 py-0.5 text-xs font-mono text-ink dark:border-line-dark dark:text-bone">
                  {getLayer(layerNum).number}. {getLayer(layerNum).name}
                </span>
              ))}
            </div>
          </Panel>
        ) : (
          <Panel title="Tip">
            <p className="text-sm text-ink-soft dark:text-bone-soft">Press &quot;Send packet&quot; and watch which device lights up, then read what happens there.</p>
          </Panel>
        )}
      </div>

      <Callout tone="neutral" title="Conceptual, not literal">
        Modern switches and routers can do more than this simplified picture shows (some switches inspect higher
        layers, for example). The goal here is only the commonly taught association between a device type and the
        layer it primarily operates at.
      </Callout>
    </div>
  );
}
