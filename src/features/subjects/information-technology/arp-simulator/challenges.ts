import { cachesForPreset, createNodes, emptyCaches, lookupEntry, nodeById, type Caches, type RunSummary } from "./model";
import type { ArpLabInit } from "./hooks/use-arp-lab";

/**
 * Starting states and checkers for the three *interactive* Challenge scenarios (do something in the lab
 * and have the result inspected). The ids must match `challenge.scenarios` in the Learning content.
 */
export const ARP_CHALLENGE_IDS = {
  resolveLocal: "arp-challenge-resolve-local",
  clearRepeat: "arp-challenge-clear-repeat",
  fixMapping: "arp-challenge-fix-mapping",
} as const;

export type ArpChallengeId = (typeof ARP_CHALLENGE_IDS)[keyof typeof ARP_CHALLENGE_IDS];

export interface ArpChallengeState {
  saved: Caches;
  lastCompleted: RunSummary | null;
}

export interface ArpChallengeSetup {
  instructions: string;
  focus: string;
  start: () => ArpLabInit;
  check: (s: ArpChallengeState) => boolean;
}

const nodes = createNodes();
const A = nodeById(nodes, "a")!;
const B = nodeById(nodes, "b")!;
const C = nodeById(nodes, "c")!;

export const ARP_CHALLENGE_SETUPS: Record<ArpChallengeId, ArpChallengeSetup> = {
  [ARP_CHALLENGE_IDS.resolveLocal]: {
    instructions: `PC-A (${A.ip}) has just started up and its ARP cache is empty. Make PC-A learn the MAC address of PC-C (${C.ip}) using ARP.`,
    focus: "Send data from PC-A to PC-C and let the run finish, then look at PC-A's ARP cache.",
    start: () => ({ caches: emptyCaches(), scenario: "custom", srcId: "a", destIp: C.ip }),
    check: ({ saved }) => lookupEntry(saved.a, C.ip)?.mac === C.mac,
  },
  [ARP_CHALLENGE_IDS.clearRepeat]: {
    instructions: `PC-A already knows PC-B and PC-C, so sending to PC-B (${B.ip}) needs no ARP. Make PC-A ask the network for PC-B's MAC address again.`,
    focus: "Clear PC-A's ARP cache first, then send data to PC-B and let ARP complete.",
    start: () => {
      const caches = emptyCaches();
      caches.a = [
        { ip: B.ip, mac: B.mac, type: "dynamic" },
        { ip: C.ip, mac: C.mac, type: "dynamic" },
      ];
      caches.b = [{ ip: A.ip, mac: A.mac, type: "dynamic" }];
      caches.c = [{ ip: A.ip, mac: A.mac, type: "dynamic" }];
      return { caches, scenario: "custom", srcId: "a", destIp: B.ip };
    },
    check: ({ lastCompleted }) => !!lastCompleted && lastCompleted.srcId === "a" && lastCompleted.destIp === B.ip && lastCompleted.outcome === "resolved",
  },
  [ARP_CHALLENGE_IDS.fixMapping]: {
    instructions: `PC-A's cache says ${B.ip} is at ${C.mac}, but that is PC-C's MAC address. Data for PC-B keeps going to the wrong device. Fix PC-A's cache so it holds PC-B's real MAC address for ${B.ip}.`,
    focus: "Send once to see the problem. Notice that Clear cache does not remove a static entry — remove it by hand, then let ARP resolve the address.",
    start: () => {
      const caches = cachesForPreset("empty");
      caches.a = [{ ip: B.ip, mac: C.mac, type: "static" }];
      return { caches, scenario: "custom", srcId: "a", destIp: B.ip };
    },
    check: ({ saved }) => lookupEntry(saved.a, B.ip)?.mac === B.mac,
  },
};
