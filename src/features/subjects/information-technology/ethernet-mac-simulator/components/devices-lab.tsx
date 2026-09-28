"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Dices, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import type { EthernetLab } from "../hooks/use-ethernet-lab";
import { DEVICE_TYPE_LABEL, isGroupMac, isLocallyAdministered, type DetailLevel } from "../model";

const inputClass =
  "h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm text-ink dark:border-line-dark dark:bg-chalkboard dark:text-bone";
const btnClass =
  "inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-ink hover:border-ink/40 disabled:opacity-40 dark:border-line-dark dark:text-bone dark:hover:border-bone/40";

const CHAIN = ["Device", "Network interface (NIC)", "MAC address", "Ethernet frame", "Local network"];

export function DevicesLab({ lab, level }: { lab: EthernetLab; level: DetailLevel }) {
  const { devices } = lab;
  const [selectedId, setSelectedId] = useState("a");
  const device = devices.find((d) => d.id === selectedId) ?? devices[0]!;

  const [nameDraft, setNameDraft] = useState(device.name);
  const [nameError, setNameError] = useState<string | null>(null);
  const [macDraft, setMacDraft] = useState("");
  const [macError, setMacError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (device.name !== nameDraft.trim()) setNameDraft(device.name);
    setNameError(null);
    // Resync only when the selected device or its stored name changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device.id, device.name]);

  useEffect(() => {
    setMacDraft("");
    setMacError(null);
  }, [device.id]);

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  function onNameChange(value: string) {
    setNameDraft(value);
    const trimmed = value.trim();
    if (trimmed === "") return setNameError("A device needs a name.");
    if (devices.some((d) => d.id !== device.id && d.name.toLowerCase() === trimmed.toLowerCase())) return setNameError("Another device already uses that name.");
    setNameError(null);
    lab.renameDevice(device.id, trimmed);
  }

  async function copyMac() {
    try {
      await navigator.clipboard.writeText(device.mac);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = device.mac;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* clipboard unavailable — the address is still selectable on screen */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1500);
  }

  function applyCustomMac() {
    const result = lab.setDeviceMac(device.id, macDraft);
    if (result.ok) {
      setMacDraft("");
      setMacError(null);
    } else {
      setMacError(result.reason);
    }
  }

  const octets = device.mac.split(":");
  const unique = new Set(devices.map((d) => d.mac)).size === devices.length;
  const firstOctet = parseInt(octets[0]!, 16);
  const bits = firstOctet.toString(2).padStart(8, "0");

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="Devices, interfaces, and MAC addresses">
        A device does not talk to the network directly — its network interface does. Each interface has its own MAC address, and that is the address
        Ethernet frames use for delivery on the local network.
      </SectionHeading>

      <ol className="flex flex-wrap items-center gap-2 text-xs font-medium text-ink dark:text-bone" aria-label="Concept chain">
        {CHAIN.map((c, i) => (
          <li key={c} className="flex items-center gap-2">
            <span className="rounded-full border border-subject-it bg-subject-it-soft px-3 py-1 text-subject-it dark:bg-subject-it/20">{c}</span>
            {i < CHAIN.length - 1 && <span aria-hidden>→</span>}
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Select a device">
        {devices.map((d) => (
          <button
            key={d.id}
            role="tab"
            aria-selected={d.id === device.id}
            onClick={() => setSelectedId(d.id)}
            className={cn(
              "min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              d.id === device.id ? "border-subject-it bg-subject-it-soft text-subject-it dark:bg-subject-it/20" : "border-line text-ink-soft hover:border-ink/30 dark:border-line-dark dark:text-bone-soft",
            )}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="MAC address inspector">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs text-ink-soft dark:text-bone-soft">MAC address of {device.name}&apos;s interface</p>
              <p className="mt-1 break-all font-mono text-xl font-semibold text-ink dark:text-bone" data-testid="mac-value">
                {device.mac}
              </p>
            </div>

            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              <dt className="text-ink-soft dark:text-bone-soft">Device type</dt>
              <dd className="text-ink dark:text-bone">{DEVICE_TYPE_LABEL[device.type]}</dd>
              <dt className="text-ink-soft dark:text-bone-soft">Network interface</dt>
              <dd className="font-mono text-ink dark:text-bone">{device.interfaceName} (Ethernet)</dd>
              <dt className="text-ink-soft dark:text-bone-soft">Connected to</dt>
              <dd className="text-ink dark:text-bone">Switch Port {device.port}</dd>
            </dl>

            <label className="flex flex-col gap-1 text-xs font-medium text-ink dark:text-bone">
              Device name
              <input
                className={inputClass}
                value={nameDraft}
                maxLength={14}
                onChange={(e) => onNameChange(e.target.value)}
                onBlur={() => {
                  setNameDraft(device.name);
                  setNameError(null);
                }}
                aria-invalid={!!nameError}
              />
              {nameError && <span className="text-xs font-normal text-red-600 dark:text-red-300">{nameError}</span>}
            </label>

            <div className="flex flex-wrap gap-2">
              <button onClick={copyMac} className={btnClass}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy MAC"}
              </button>
              <button onClick={() => lab.randomizeMac(device.id)} className={btnClass}>
                <Dices className="h-4 w-4" />
                Generate new MAC
              </button>
              <button onClick={() => lab.resetDevice(device.id)} className={btnClass}>
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>

            {level === "technical" && (
              <div className="flex flex-col gap-2">
                <label className="flex flex-col gap-1 text-xs font-medium text-ink dark:text-bone">
                  Set a custom MAC (administratively assigned)
                  <div className="flex gap-2">
                    <input className={cn(inputClass, "font-mono")} value={macDraft} onChange={(e) => setMacDraft(e.target.value)} placeholder="02:00:00:AA:BB:CC" aria-invalid={!!macError} />
                    <button onClick={applyCustomMac} disabled={macDraft.trim() === ""} className={btnClass}>
                      Apply
                    </button>
                  </div>
                </label>
                {macError && <p className="text-xs text-red-600 dark:text-red-300">{macError}</p>}
              </div>
            )}
          </div>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel title="Reading a MAC address">
            <div className="flex flex-wrap gap-1.5 font-mono text-sm" aria-label="MAC address octets">
              {octets.map((o, i) => (
                <span
                  key={i}
                  className={cn(
                    "rounded-lg border px-2 py-1",
                    level !== "beginner" && i < 3 ? "border-sky-400/70 bg-sky-50 dark:border-sky-500/40 dark:bg-sky-500/10" : level !== "beginner" ? "border-emerald-400/70 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10" : "border-line dark:border-line-dark",
                  )}
                >
                  {o}
                </span>
              ))}
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-soft dark:text-bone-soft">
              <li>A MAC address is 48 bits — six octets (bytes) written as pairs of hexadecimal digits.</li>
              <li>Each pair (00–FF) is one octet. Hexadecimal uses 0–9 and A–F.</li>
              <li>It identifies a network interface at the link layer, so a device with two interfaces has two MAC addresses.</li>
              <li>Ethernet frames carry a source and a destination MAC address.</li>
            </ul>
            {level !== "beginner" && (
              <p className="mt-3 text-sm text-ink-soft dark:text-bone-soft">
                <span className="font-medium text-sky-700 dark:text-sky-300">First three octets</span>: for factory-assigned addresses these are an organization prefix (OUI).{" "}
                <span className="font-medium text-emerald-700 dark:text-emerald-300">Last three octets</span>: assigned by that organization to each interface. This lab uses the private{" "}
                <span className="font-mono">02</span> prefix, which marks a locally administered address, so there is no vendor prefix to decode.
              </p>
            )}
          </Panel>

          {level === "technical" && (
            <Panel title="Inside the first octet">
              <p className="font-mono text-sm text-ink dark:text-bone" aria-label={`First octet in binary: ${bits}`}>
                0x{octets[0]} = {bits.slice(0, 6)}
                <span className="font-semibold text-amber-600 dark:text-amber-300">{bits[6]}</span>
                <span className="font-semibold text-sky-600 dark:text-sky-300">{bits[7]}</span>
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft dark:text-bone-soft">
                <li>
                  Lowest bit (<span className="font-mono">{bits[7]}</span>) — individual/group: {isGroupMac(device.mac) ? "group address (multicast/broadcast)" : "0 = an individual (unicast) address"}.
                </li>
                <li>
                  Next bit (<span className="font-mono">{bits[6]}</span>) — universal/local: {isLocallyAdministered(device.mac) ? "1 = locally administered (not assigned by the manufacturer)" : "0 = universally administered"}.
                </li>
              </ul>
              <p className="mt-2 text-sm text-ink-soft dark:text-bone-soft">
                MAC addresses are not necessarily fixed for all time. Operating systems and virtual machines can assign or randomize them, and software can change the
                address an interface uses (often called MAC spoofing). Treat a MAC address as an identifier on the local link — not as proof of who is sending.
              </p>
            </Panel>
          )}

          <Callout tone={unique ? "good" : "bad"} title={unique ? `${devices.length} interfaces · ${devices.length} unique MAC addresses` : "Duplicate MAC address detected"}>
            {unique ? "No two interfaces on this LAN share a MAC address — that is what lets a frame name exactly one receiver." : "Frames could not be delivered reliably if two interfaces shared an address."}
          </Callout>
        </div>
      </div>

      <Panel title="All interfaces on this LAN">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-xs">
            <thead>
              <tr className="border-b border-line font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:border-line-dark dark:text-bone-soft">
                <th className="py-1.5 pr-3 font-medium">Device</th>
                <th className="py-1.5 pr-3 font-medium">Interface</th>
                <th className="py-1.5 pr-3 font-medium">MAC address</th>
                <th className="py-1.5 font-medium">Switch port</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d) => (
                <tr key={d.id} className="border-b border-line/60 dark:border-line-dark/60">
                  <td className="whitespace-nowrap py-1.5 pr-3 text-ink dark:text-bone">{d.name}</td>
                  <td className="whitespace-nowrap py-1.5 pr-3 font-mono text-ink-soft dark:text-bone-soft">{d.interfaceName}</td>
                  <td className="whitespace-nowrap py-1.5 pr-3 font-mono text-ink dark:text-bone">{d.mac}</td>
                  <td className="whitespace-nowrap py-1.5 font-mono text-ink-soft dark:text-bone-soft">Port {d.port}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
