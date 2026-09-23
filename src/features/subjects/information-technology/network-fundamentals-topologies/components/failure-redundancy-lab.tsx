"use client";

import { useMemo, useState } from "react";
import {
  addLink,
  connectedComponents,
  findSinglePointsOfFailure,
  type LinkType,
  type NetworkState,
} from "../model";
import { NetworkGraphSvg } from "./network-graph-svg";
import { Callout, Panel, PillButton, SectionHeading } from "./ui";

type FailureTarget = { kind: "device"; id: string } | { kind: "link"; id: string } | null;

export function FailureRedundancyLab({
  network,
  setNetwork,
}: {
  network: NetworkState;
  setNetwork: (updater: (state: NetworkState) => NetworkState) => void;
}) {
  const [failure, setFailure] = useState<FailureTarget>(null);
  const [showSpof, setShowSpof] = useState(true);
  const [connectFromId, setConnectFromId] = useState<string | null>(null);

  const spof = useMemo(() => findSinglePointsOfFailure(network), [network]);

  const before = useMemo(() => connectedComponents(network), [network]);
  const after = useMemo(() => {
    if (!failure) return before;
    return connectedComponents(network, {
      excludeDeviceId: failure.kind === "device" ? failure.id : undefined,
      excludeLinkId: failure.kind === "link" ? failure.id : undefined,
    });
  }, [network, failure, before]);

  const failedDeviceIds = new Set(failure?.kind === "device" ? [failure.id] : []);
  const failedLinkIds = new Set(failure?.kind === "link" ? [failure.id] : []);
  const remainingDeviceCount = network.devices.length - (failure?.kind === "device" ? 1 : 0);
  const disconnected = failure && after.length > 1 && remainingDeviceCount > 0;

  function handleSelectDevice(id: string) {
    if (connectFromId && connectFromId !== id) {
      setNetwork((s) => addLink(s, connectFromId, id, "wired" as LinkType));
      setConnectFromId(null);
      return;
    }
    setFailure((f) => (f?.kind === "device" && f.id === id ? null : { kind: "device", id }));
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading title="Failure & redundancy experiment">
        Click a device or a link to simulate it failing, and watch which parts of the network lose connectivity. This
        uses a simplified model — a link is either fully up or fully down, and connectivity means &quot;a path exists&quot;,
        nothing about real-world timing or automatic failover.
      </SectionHeading>

      <div className="flex flex-wrap items-center gap-2">
        <PillButton active={showSpof} onClick={() => setShowSpof((v) => !v)}>
          {showSpof ? "Hide" : "Show"} single points of failure
        </PillButton>
        {failure && (
          <button onClick={() => setFailure(null)} className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink dark:border-line-dark dark:text-bone">
            Restore failed {failure.kind}
          </button>
        )}
        <button
          onClick={() => setConnectFromId((v) => (v ? null : "pick"))}
          className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink dark:border-line-dark dark:text-bone"
        >
          {connectFromId ? "Cancel add redundancy" : "Add a redundant link"}
        </button>
      </div>
      {connectFromId && (
        <p className="text-xs text-ink-soft dark:text-bone-soft">
          Click a device, then click a second device to add a redundant link between them.
        </p>
      )}

      <NetworkGraphSvg
        state={network}
        onSelectDevice={(id) => {
          if (connectFromId === "pick") {
            setConnectFromId(id);
            return;
          }
          handleSelectDevice(id);
        }}
        onSelectLink={(id) => setFailure((f) => (f?.kind === "link" && f.id === id ? null : { kind: "link", id }))}
        failedDeviceIds={failedDeviceIds}
        failedLinkIds={failedLinkIds}
        spofDeviceIds={showSpof ? new Set(spof.deviceIds) : undefined}
        spofLinkIds={showSpof ? new Set(spof.linkIds) : undefined}
        connectFromId={connectFromId && connectFromId !== "pick" ? connectFromId : null}
        ariaLabel="Network with failure experiment"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Panel title="Before failure">
          <p className="text-sm text-ink-soft dark:text-bone-soft">
            {before.length === 1 ? "Every device can reach every other device." : `The network is already split into ${before.length} separate groups.`}
          </p>
        </Panel>
        <Panel title="After failure">
          {!failure ? (
            <p className="text-sm text-ink-soft dark:text-bone-soft">Click a device or link above to run the experiment.</p>
          ) : disconnected ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              The network is now split into {after.length} groups — some devices lost connectivity to each other.
            </p>
          ) : (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              Every remaining device can still reach every other remaining device.
            </p>
          )}
        </Panel>
      </div>

      <Callout tone="warn" title="Single point of failure">
        A device or link highlighted in amber is a single point of failure: removing it disconnects part of the
        network. Try adding a redundant link (an extra path) between two devices on either side of a highlighted link,
        then fail that link again — the amber highlighting should disappear once a second path exists.
      </Callout>
    </div>
  );
}
