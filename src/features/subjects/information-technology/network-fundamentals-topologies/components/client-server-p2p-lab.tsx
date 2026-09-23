"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildClientServerNetwork, buildPeerToPeerNetwork, shortestPath, type NetworkState } from "../model";
import { NetworkGraphSvg } from "./network-graph-svg";
import { Panel, PillButton, SectionHeading } from "./ui";

type Model = "client-server" | "p2p";

const STAGES = ["Client", "Request", "Network", "Server", "Response", "Client"];

export function ClientServerP2pLab() {
  const [model, setModel] = useState<Model>("client-server");
  const clientServerNet = useMemo(() => buildClientServerNetwork(3), []);
  const p2pNet = useMemo(() => buildPeerToPeerNetwork(), []);
  const network: NetworkState = model === "client-server" ? clientServerNet : p2pNet;

  const [fromId, setFromId] = useState<string | null>(null);
  const [toId, setToId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setFromId(network.devices[0]?.id ?? null);
    setToId(model === "client-server" ? network.devices.find((d) => d.type === "server")?.id ?? null : network.devices[1]?.id ?? null);
    setProgress(null);
  }, [model, network]);

  const path = fromId && toId ? shortestPath(network, fromId, toId) : null;

  function send() {
    if (!path) return;
    setStageIndex(0);
    setProgress(0);
    const start = performance.now();
    const durationMs = 1400;
    function step(now: number) {
      const t = Math.min(1, (now - start) / durationMs);
      setProgress(t);
      setStageIndex(Math.min(STAGES.length - 1, Math.floor(t * STAGES.length)));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    }
    rafRef.current = requestAnimationFrame(step);
  }

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const packetAt = useMemo(() => {
    if (!path || progress === null) return null;
    const positions = network.devices;
    const segments = path.length - 1;
    if (segments <= 0) return null;
    const segFloat = progress * segments;
    const segIndex = Math.min(segments - 1, Math.floor(segFloat));
    const segT = segFloat - segIndex;
    const a = positions.find((d) => d.id === path[segIndex]);
    const b = positions.find((d) => d.id === path[segIndex + 1]);
    if (!a || !b) return null;
    return { x: a.x + (b.x - a.x) * segT, y: a.y + (b.y - a.y) * segT };
  }, [path, progress, network.devices]);

  const pathDeviceIds = new Set(path ?? []);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Client–server vs. peer-to-peer">
        Two different ways to organize who provides data and who requests it — same underlying network, different
        architecture.
      </SectionHeading>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Architecture model">
        <PillButton active={model === "client-server"} onClick={() => setModel("client-server")}>Client–Server</PillButton>
        <PillButton active={model === "p2p"} onClick={() => setModel("p2p")}>Peer-to-Peer</PillButton>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
        <div className="flex flex-col gap-3">
          <NetworkGraphSvg state={network} pathDeviceIds={pathDeviceIds} packetAt={packetAt} ariaLabel={`${model} architecture`} />
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs text-ink-soft dark:text-bone-soft">
              From
              <select
                value={fromId ?? ""}
                onChange={(e) => setFromId(e.target.value)}
                className="rounded-md border border-line bg-transparent px-2 py-1 text-ink dark:border-line-dark dark:text-bone"
              >
                {network.devices.map((d) => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-1.5 text-xs text-ink-soft dark:text-bone-soft">
              To
              <select
                value={toId ?? ""}
                onChange={(e) => setToId(e.target.value)}
                className="rounded-md border border-line bg-transparent px-2 py-1 text-ink dark:border-line-dark dark:text-bone"
              >
                {network.devices.map((d) => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
            </label>
            <button onClick={send} className="rounded-full border border-subject-it bg-subject-it-soft px-3 py-1.5 text-xs font-medium text-subject-it dark:bg-subject-it/20">
              Send request
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Panel title="Request/response sequence">
            <ol className="flex flex-col gap-1 text-sm">
              {STAGES.map((s, i) => (
                <li key={i} className={i === stageIndex && progress !== null && progress < 1 ? "font-medium text-subject-it" : "text-ink-soft dark:text-bone-soft"}>
                  {i + 1}. {s}
                </li>
              ))}
            </ol>
          </Panel>
          {model === "client-server" ? (
            <Panel title="Client–Server">
              <p className="text-sm text-ink-soft dark:text-bone-soft">
                One or more clients send requests to a central server, which provides the response. The server is the
                dedicated provider; clients don&apos;t usually serve each other directly. Easy to secure and manage
                centrally, but the server is a natural bottleneck and single point of failure unless it&apos;s made
                redundant.
              </p>
            </Panel>
          ) : (
            <Panel title="Peer-to-Peer">
              <p className="text-sm text-ink-soft dark:text-bone-soft">
                Every device can act as both a client and a provider to the others — there&apos;s no single dedicated
                server. This can spread load and avoid one central bottleneck, but makes management and security more
                distributed and harder to centralize.
              </p>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
