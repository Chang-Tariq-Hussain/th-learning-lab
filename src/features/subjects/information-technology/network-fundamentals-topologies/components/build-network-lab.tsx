"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DEVICE_TYPE_ORDER,
  LINK_TYPE_INFO,
  addDevice,
  addLink,
  createEmptyNetwork,
  moveDevice,
  removeDevice,
  removeLink,
  renameDevice,
  type DeviceType,
  type LinkType,
  type NetworkState,
} from "../model";
import { DeviceInspectorPanel } from "./device-inspector-panel";
import { NetworkGraphSvg } from "./network-graph-svg";
import { Panel, PillButton, SectionHeading } from "./ui";

const DEVICE_LABELS: Record<DeviceType, string> = {
  pc: "PC",
  laptop: "Laptop",
  phone: "Phone",
  server: "Server",
  printer: "Printer",
  router: "Router",
  switch: "Switch",
  ap: "Wireless AP",
  cloud: "Internet",
};

const LINK_TYPES: LinkType[] = ["wired", "fiber", "wireless"];

export function BuildNetworkLab({
  network,
  setNetwork,
}: {
  network: NetworkState;
  setNetwork: (updater: (state: NetworkState) => NetworkState) => void;
}) {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [connectFromId, setConnectFromId] = useState<string | null>(null);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [linkType, setLinkType] = useState<LinkType>("wired");

  const selectedDevice = network.devices.find((d) => d.id === selectedDeviceId) ?? null;

  function handleSelectDevice(id: string) {
    setSelectedLinkId(null);
    if (connectFromId && connectFromId !== id) {
      setNetwork((s) => addLink(s, connectFromId, id, linkType));
      setConnectFromId(null);
      setSelectedDeviceId(id);
      return;
    }
    setSelectedDeviceId(id);
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Build your own network">
        Add devices, drag them to arrange the layout, then click one device and another to connect them. Click an
        existing link to select and remove it.
      </SectionHeading>

      <div className="flex flex-wrap gap-2">
        {DEVICE_TYPE_ORDER.map((type) => (
          <button
            key={type}
            onClick={() => setNetwork((s) => addDevice(s, type, 80 + Math.random() * 360, 60 + Math.random() * 180))}
            className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink dark:border-line-dark dark:text-bone"
          >
            + {DEVICE_LABELS[type]}
          </button>
        ))}
        <button
          onClick={() => {
            setNetwork(() => createEmptyNetwork());
            setSelectedDeviceId(null);
            setConnectFromId(null);
            setSelectedLinkId(null);
          }}
          className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft dark:border-line-dark dark:text-bone-soft"
        >
          Reset topology
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr,1fr]">
        <div className="flex flex-col gap-3">
          <NetworkGraphSvg
            state={network}
            selectedDeviceId={selectedDeviceId}
            onSelectDevice={handleSelectDevice}
            selectedLinkId={selectedLinkId}
            onSelectLink={(id) => {
              setSelectedLinkId(id);
              setSelectedDeviceId(null);
            }}
            connectFromId={connectFromId}
            draggable
            onMoveDevice={(id, x, y) => setNetwork((s) => moveDevice(s, id, x, y))}
            ariaLabel="Your network"
          />
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setConnectFromId(selectedDeviceId)}
              disabled={!selectedDeviceId}
              className={cn(
                "rounded-full border px-3 py-1.5 font-medium disabled:opacity-40",
                connectFromId ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : "border-line text-ink dark:border-line-dark dark:text-bone",
              )}
            >
              {connectFromId ? "Click another device to connect…" : "Connect from selected device"}
            </button>
            {connectFromId && (
              <button onClick={() => setConnectFromId(null)} className="text-ink-soft underline decoration-dotted dark:text-bone-soft">
                cancel
              </button>
            )}
            {selectedLinkId && (
              <button
                onClick={() => {
                  setNetwork((s) => removeLink(s, selectedLinkId));
                  setSelectedLinkId(null);
                }}
                className="rounded-full border border-red-400/60 px-3 py-1.5 font-medium text-red-600 dark:text-red-400"
              >
                Remove selected link
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <DeviceInspectorPanel
            device={selectedDevice}
            onRename={(label) => selectedDeviceId && setNetwork((s) => renameDevice(s, selectedDeviceId, label))}
            onRemove={
              selectedDeviceId
                ? () => {
                    setNetwork((s) => removeDevice(s, selectedDeviceId));
                    setSelectedDeviceId(null);
                  }
                : undefined
            }
          />

          <Panel title="Connection type for new links">
            <div className="flex flex-wrap gap-2">
              {LINK_TYPES.map((t) => (
                <PillButton key={t} active={linkType === t} onClick={() => setLinkType(t)}>
                  {LINK_TYPE_INFO[t].label}
                </PillButton>
              ))}
            </div>
            <div className="mt-3 flex flex-col gap-1 text-sm text-ink-soft dark:text-bone-soft">
              <p><span className="font-medium text-ink dark:text-bone">Typical use:</span> {LINK_TYPE_INFO[linkType].use}</p>
              <p><span className="font-medium text-ink dark:text-bone">Characteristics:</span> {LINK_TYPE_INFO[linkType].characteristics}</p>
              <p><span className="font-medium text-ink dark:text-bone">Bandwidth:</span> {LINK_TYPE_INFO[linkType].bandwidth}</p>
              <p><span className="font-medium text-ink dark:text-bone">Latency:</span> {LINK_TYPE_INFO[linkType].latency}</p>
              <p><span className="font-medium text-ink dark:text-bone">Medium:</span> {LINK_TYPE_INFO[linkType].medium}</p>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
