"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Callout, Panel, SectionHeading } from "../../osi-model-explorer/components/ui";
import type { DhcpLab } from "../hooks/use-dhcp-lab";
import { CLIENT_META, ROUTER, SUBNET_MASK, dnsLabel, ipAt, type IpConfig } from "../model";
import { ActionButton } from "./parts";

const FLOW = [
  { title: "DHCP", text: "The client asks a DHCP server for configuration." },
  { title: "Client receives IP configuration", text: "Address, subnet mask, default gateway, DNS server, lease." },
  { title: "Client can communicate on the configured network", text: "It now knows its own address and which addresses are local." },
  { title: "ARP may be used", text: "When IPv4 communication needs a MAC address on the local network, ARP resolves it." },
];

interface Destination {
  id: string;
  label: string;
  steps: (cfg: IpConfig) => string[];
}

const DESTS: Destination[] = [
  {
    id: "local",
    label: "Another PC: 192.168.1.101",
    steps: (cfg) => [
      `${cfg.ip} with mask ${cfg.mask} says 192.168.1.101 is on the same network, so the PC sends to it directly.`,
      "An Ethernet frame needs a destination MAC address. If the PC does not know the MAC of 192.168.1.101, ARP asks the LAN for it.",
      "The frame is delivered. DHCP took no part in this step; it only made the address and mask available earlier.",
    ],
  },
  {
    id: "internet",
    label: "A server on the internet: 8.8.8.8",
    steps: (cfg) => [
      `8.8.8.8 is not inside ${cfg.ip}/${cfg.mask}, so the PC hands the packet to its default gateway, ${cfg.gateway || "none configured"}.`,
      cfg.gateway ? `The gateway came from DHCP. To build the Ethernet frame the PC needs the gateway's MAC address, so ARP resolves ${cfg.gateway}.` : "With no gateway configured the PC has nowhere to send traffic for other networks, so this fails.",
      "The router then forwards the packet onward. The frame is addressed to the router's MAC, but the IP packet still carries 8.8.8.8 as its destination.",
    ],
  },
  {
    id: "name",
    label: "A website name: example.com",
    steps: (cfg) => [
      cfg.dns ? `The PC first needs an IP address for the name. It asks the DNS server DHCP told it about: ${dnsLabel(cfg.dns)}.` : "No DNS server was supplied, so the name cannot be turned into an address.",
      cfg.dns ? "That DNS server is on another network, so the request goes through the default gateway, using ARP to find the gateway's MAC address." : "The PC could still reach numeric IP addresses, but not names.",
      "DNS does the resolving. DHCP only handed over the DNS server's address. DNS is a separate protocol and a separate simulation.",
    ],
  },
];

const QUICK: { text: string; answer: "dhcp" | "arp" }[] = [
  { text: "Gives a new PC its IP address, mask, gateway and DNS server.", answer: "dhcp" },
  { text: "Finds the MAC address that belongs to 192.168.1.101.", answer: "arp" },
  { text: "Uses a lease that can be renewed or released.", answer: "dhcp" },
  { text: "Keeps a cache of IP-to-MAC mappings.", answer: "arp" },
  { text: "Runs over UDP, with a server on port 67 and a client on port 68.", answer: "dhcp" },
  { text: "Asks the whole LAN \"who has this IP address?\"", answer: "arp" },
];

function QuickSort() {
  const [picked, setPicked] = useState<Record<number, "dhcp" | "arp">>({});
  const score = QUICK.filter((q, i) => picked[i] === q.answer).length;
  return (
    <Panel title="DHCP or ARP? Sort the statements">
      <ul className="flex flex-col gap-2">
        {QUICK.map((q, i) => {
          const p = picked[i];
          return (
            <li key={q.text} className="flex flex-col gap-2 rounded-lg border border-line p-2.5 dark:border-line-dark sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-ink dark:text-bone">{q.text}</span>
              <span className="flex shrink-0 gap-2" role="group" aria-label="Which protocol?">
                {(["dhcp", "arp"] as const).map((a) => (
                  <button
                    key={a}
                    onClick={() => setPicked({ ...picked, [i]: a })}
                    aria-pressed={p === a}
                    className={cn(
                      "min-h-[44px] min-w-[64px] rounded-full border px-4 text-sm font-semibold uppercase transition-colors",
                      p === a ? (a === q.answer ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "border-red-400 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300") : "border-line text-ink-soft dark:border-line-dark dark:text-bone-soft",
                    )}
                  >
                    {a}
                  </button>
                ))}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft" aria-live="polite">
        {Object.keys(picked).length === 0 ? "Pick DHCP or ARP for each statement." : `${score} of ${QUICK.length} correct so far.`}
      </p>
    </Panel>
  );
}

/** How DHCP and ARP fit together without being merged: one supplies the configuration, the other resolves addresses. */
export function ArpLab({ lab }: { lab: DhcpLab }) {
  const [dest, setDest] = useState("local");
  const client = lab.saved.clients[lab.selectedId];
  const real = client.config;
  const cfg: IpConfig = real ?? { ip: ipAt(100), mask: SUBNET_MASK, gateway: ROUTER.ip, dns: "8.8.8.8" };
  const d = DESTS.find((x) => x.id === dest)!;

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="What happens after DHCP?">
        DHCP and ARP are two different protocols that meet on the same LAN. DHCP gives a device its IP configuration. ARP resolves an IPv4 address to a MAC address on the local network.
      </SectionHeading>

      <Panel title="What happens next?">
        <ol className="flex flex-col gap-2">
          {FLOW.map((f, i) => (
            <li key={f.title} className="flex flex-col gap-2">
              <div className={cn("rounded-lg border p-3", i === 0 ? "border-subject-it bg-subject-it-soft dark:bg-subject-it/15" : i === 3 ? "border-sky-400/70 bg-sky-50 dark:border-sky-500/40 dark:bg-sky-500/10" : "border-line dark:border-line-dark")}>
                <p className="text-sm font-semibold text-ink dark:text-bone">{f.title}</p>
                <p className="text-xs text-ink-soft dark:text-bone-soft">{f.text}</p>
              </div>
              {i < FLOW.length - 1 && (
                <span className="text-center text-ink-soft/70 dark:text-bone-soft/70" aria-hidden>
                  ↓
                </span>
              )}
            </li>
          ))}
        </ol>
      </Panel>

      <Panel title="Follow one packet">
        <p className="text-xs text-ink-soft dark:text-bone-soft">
          {real ? `Using ${CLIENT_META[lab.selectedId].name}'s real DHCP configuration.` : `${CLIENT_META[lab.selectedId].name} has no configuration yet, so example values are used. Configure it in Get an Address to use its real ones.`}{" "}
          <span className="font-mono">
            {cfg.ip} · {cfg.mask} · gw {cfg.gateway || "none"} · DNS {dnsLabel(cfg.dns)}
          </span>
        </p>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Where is the PC sending to?">
          {DESTS.map((x) => (
            <ActionButton key={x.id} tone={dest === x.id ? "primary" : "plain"} onClick={() => setDest(x.id)}>
              {x.label}
            </ActionButton>
          ))}
        </div>
        <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-sm text-ink dark:text-bone">
          {d.steps(cfg).map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ol>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        <Callout tone="neutral" title="DHCP">
          Supplies IP configuration: address, mask, gateway, DNS server, lease. Runs over UDP (server port 67, client port 68). Answers &quot;what should my settings be?&quot;
        </Callout>
        <Callout tone="neutral" title="ARP">
          Resolves an IPv4 address to a MAC address on the local network. Uses its own ARP frames, not UDP. Answers &quot;which MAC address owns this IP?&quot;
        </Callout>
      </div>

      <Callout tone="warn" title="One place they touch">
        After an ACK, many clients use ARP to check that nobody else already uses the new address. If another device answers, the client reports it with a DHCP Decline and asks again. Even then the two protocols stay separate: DHCP decides the address, ARP only checks it.
      </Callout>

      <QuickSort />

      <p className="text-sm text-ink-soft dark:text-bone-soft">
        Want to see ARP in action? Open the{" "}
        <Link href="/dashboard/information-technology/arp-simulator" className="font-medium text-subject-it underline underline-offset-2">
          ARP Simulator
        </Link>
        .
      </p>
    </div>
  );
}
