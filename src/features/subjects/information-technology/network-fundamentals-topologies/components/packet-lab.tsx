"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PACKET_LOSS_OPTIONS_PERCENT, shortestPath, type NetworkState } from "../model";
import { NetworkGraphSvg } from "./network-graph-svg";
import { Callout, Panel, PillButton, SectionHeading } from "./ui";

interface SendLogEntry {
  id: number;
  from: string;
  to: string;
  delivered: boolean;
  lossIndex: number | null;
}

export function PacketLab({ network }: { network: NetworkState }) {
  const [fromId, setFromId] = useState<string | null>(network.devices[0]?.id ?? null);
  const [toId, setToId] = useState<string | null>(network.devices[1]?.id ?? null);
  const [lossRate, setLossRate] = useState(0);
  const [progress, setProgress] = useState<number | null>(null);
  const [lost, setLost] = useState(false);
  const [log, setLog] = useState<SendLogEntry[]>([]);
  const rafRef = useRef<number | null>(null);
  const counterRef = useRef(0);

  useEffect(() => {
    if (!network.devices.find((d) => d.id === fromId)) setFromId(network.devices[0]?.id ?? null);
    if (!network.devices.find((d) => d.id === toId)) setToId(network.devices[1]?.id ?? network.devices[0]?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);

  const fullPath = fromId && toId ? shortestPath(network, fromId, toId) : null;

  function send() {
    if (!fromId || !toId || !fullPath) return;
    let lossHop: number | null = null;
    for (let hop = 1; hop < fullPath.length; hop++) {
      if (Math.random() * 100 < lossRate) {
        lossHop = hop;
        break;
      }
    }
    const travelPath = lossHop ? fullPath.slice(0, lossHop + 1) : fullPath;
    const segments = Math.max(1, travelPath.length - 1);
    setLost(false);
    setProgress(0);
    const start = performance.now();
    const durationMs = 900;
    function step(now: number) {
      const t = Math.min(1, (now - start) / durationMs);
      setProgress(t);
      if (t >= 1) {
        if (lossHop) setLost(true);
        counterRef.current += 1;
        setLog((l) => [{ id: counterRef.current, from: fromId!, to: toId!, delivered: !lossHop, lossIndex: lossHop }, ...l].slice(0, 6));
        rafRef.current = null;
      } else {
        rafRef.current = requestAnimationFrame(step);
      }
    }
    void segments;
    rafRef.current = requestAnimationFrame(step);
  }

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const packetAt = useMemo(() => {
    if (progress === null || !fullPath) return null;
    const lossEntry = log[0];
    const cappedPath = lossEntry && !lossEntry.delivered && lossEntry.lossIndex ? fullPath.slice(0, lossEntry.lossIndex + 1) : fullPath;
    const segments = Math.max(1, cappedPath.length - 1);
    const segFloat = progress * segments;
    const segIndex = Math.min(segments - 1, Math.floor(segFloat));
    const segT = segFloat - segIndex;
    const a = network.devices.find((d) => d.id === cappedPath[segIndex]);
    const b = network.devices.find((d) => d.id === cappedPath[segIndex + 1]);
    if (!a || !b) return null;
    return { x: a.x + (b.x - a.x) * segT, y: a.y + (b.y - a.y) * segT, lost: progress >= 1 && lost };
  }, [progress, fullPath, network.devices, log, lost]);

  const deliveredCount = log.filter((l) => l.delivered).length;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Send data as packets">
        Data doesn&apos;t travel as one solid stream — it&apos;s broken into packets that hop from device to device toward the
        destination. This is an introductory picture only: real packets carry addressing headers and travel
        independently, which later simulations cover.
      </SectionHeading>

      <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
        <div className="flex flex-col gap-3">
          <NetworkGraphSvg
            state={network}
            pathDeviceIds={new Set(fullPath ?? [])}
            packetAt={packetAt}
            ariaLabel="Packet path"
          />
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs text-ink-soft dark:text-bone-soft">
              Source
              <select value={fromId ?? ""} onChange={(e) => setFromId(e.target.value)} className="rounded-md border border-line bg-transparent px-2 py-1 text-ink dark:border-line-dark dark:text-bone">
                {network.devices.map((d) => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-1.5 text-xs text-ink-soft dark:text-bone-soft">
              Destination
              <select value={toId ?? ""} onChange={(e) => setToId(e.target.value)} className="rounded-md border border-line bg-transparent px-2 py-1 text-ink dark:border-line-dark dark:text-bone">
                {network.devices.map((d) => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
            </label>
            <button onClick={send} disabled={!fullPath} className="rounded-full border border-subject-it bg-subject-it-soft px-3 py-1.5 text-xs font-medium text-subject-it disabled:opacity-40 dark:bg-subject-it/20">
              Send data
            </button>
          </div>
          {!fullPath && fromId && toId && (
            <p className="text-xs text-red-600 dark:text-red-400">No path currently connects these two devices.</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Panel title="Packet loss rate">
            <div className="flex flex-wrap gap-2">
              {PACKET_LOSS_OPTIONS_PERCENT.map((v) => (
                <PillButton key={v} active={lossRate === v} onClick={() => setLossRate(v)}>{v}%</PillButton>
              ))}
            </div>
            <p className="mt-2 text-sm text-ink-soft dark:text-bone-soft">
              Packet loss means a transmitted packet may fail to successfully reach its destination — at each hop here,
              there&apos;s a {lossRate}% illustrative chance the packet is dropped. Real networks retransmit lost data
              using higher-layer protocols not modeled in this introductory lab.
            </p>
          </Panel>

          <Panel title="Recent sends">
            {log.length === 0 ? (
              <p className="text-sm text-ink-soft dark:text-bone-soft">Send some data to see results here.</p>
            ) : (
              <>
                <p className="text-xs text-ink-soft dark:text-bone-soft">{deliveredCount}/{log.length} of the last {log.length} delivered</p>
                <ul className="mt-2 flex flex-col gap-1 text-sm">
                  {log.map((entry) => (
                    <li key={entry.id} className={entry.delivered ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
                      {entry.delivered ? "Delivered" : `Lost at hop ${entry.lossIndex}`}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Panel>
        </div>
      </div>

      <Callout tone="neutral" title="Illustrative model">
        The loss percentages here are teaching values you set yourself, not a measurement of any real link — use them
        to build intuition for why unreliable delivery is something networked software has to plan for.
      </Callout>
    </div>
  );
}
