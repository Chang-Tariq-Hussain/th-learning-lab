import { compareNetworks, createDefaultHosts, evaluateSend, findDuplicates, hostAddressIssue, hostById, parseIPv4, type IpHost } from "./model";

/**
 * Starting states and checkers for the three *interactive* Challenge scenarios
 * (configure a real network and have the result inspected). The scenario ids
 * must match `challenge.scenarios` in the Learning content.
 */
export const IP_CHALLENGE_IDS = {
  sameNetwork: "ip-addressing-challenge-same-network",
  gateway: "ip-addressing-challenge-gateway",
  duplicate: "ip-addressing-challenge-duplicate",
  routed: "ip-addressing-challenge-two-networks",
} as const;

export type IpChallengeId = (typeof IP_CHALLENGE_IDS)[keyof typeof IP_CHALLENGE_IDS];

export interface IpChallengeSetup {
  instructions: string;
  focus: string;
  start: () => IpHost[];
  check: (hosts: IpHost[]) => boolean;
}

function patch(hosts: IpHost[], id: string, p: Partial<IpHost>): IpHost[] {
  return hosts.map((h) => (h.id === id ? { ...h, ...p } : h));
}

function validHost(h: IpHost): boolean {
  const ip = parseIPv4(h.ip);
  return ip.ok && hostAddressIssue(ip.value, h.prefix) === null;
}

export const IP_CHALLENGE_SETUPS: Record<IpChallengeId, IpChallengeSetup> = {
  [IP_CHALLENGE_IDS.sameNetwork]: {
    instructions: "PC-A is 192.168.1.10/24 and PC-B is 10.0.0.5/24. Give PC-B an address (and keep /24) so both PCs are on the same IP network, with no duplicate address.",
    focus: "Use the IP Configuration form below, select PC-B, then Apply.",
    start: () => patch(createDefaultHosts(), "b", { ip: "10.0.0.5", gateway: "10.0.0.1" }),
    check: (hosts) => {
      const a = hostById(hosts, "a");
      const b = hostById(hosts, "b");
      if (!a || !b || !validHost(a) || !validHost(b)) return false;
      const pa = parseIPv4(a.ip);
      const pb = parseIPv4(b.ip);
      if (!pa.ok || !pb.ok || pa.value === pb.value) return false;
      return compareNetworks(pa.value, a.prefix, pb.value, b.prefix).same && findDuplicates(hosts).length === 0;
    },
  },
  [IP_CHALLENGE_IDS.gateway]: {
    instructions: "PC-A (192.168.1.10/24) cannot reach PC-C on the other network because its default gateway is wrong. Set PC-A's default gateway so PC-A can exchange data with PC-C through the router.",
    focus: "The gateway must be the router's address on PC-A's own network.",
    start: () => patch(createDefaultHosts(), "a", { gateway: "192.168.2.1" }),
    check: (hosts) => evaluateSend("a", "c", hosts)?.ok === true,
  },
  [IP_CHALLENGE_IDS.duplicate]: {
    instructions: "PC-A and PC-B both use 192.168.1.10/24. Fix the duplicate: give one PC a different unused address that stays on the same network, so PC-A and PC-B can still talk directly.",
    focus: "Choose a host address between 192.168.1.2 and 192.168.1.254 that is not already used (the router is 192.168.1.1).",
    start: () => patch(createDefaultHosts(), "b", { ip: "192.168.1.10" }),
    check: (hosts) => findDuplicates(hosts).length === 0 && evaluateSend("a", "b", hosts)?.ok === true,
  },
  [IP_CHALLENGE_IDS.routed]: {
    instructions: "PC-C is cabled to LAN 2 (behind the second switch) but was configured as 192.168.1.50/24, and PC-A has no gateway. Configure both so PC-A and PC-C can exchange data through the router. LAN 2 uses 192.168.2.0/24 and the router's LAN 2 address is 192.168.2.1.",
    focus: "Two networks means two different network addresses, and each host needs the gateway on its own side.",
    start: () => patch(patch(createDefaultHosts(), "a", { gateway: "" }), "c", { ip: "192.168.1.50", gateway: "192.168.1.1" }),
    check: (hosts) => {
      const r = evaluateSend("a", "c", hosts);
      return r?.ok === true && r.forward.scope === "remote";
    },
  },
};
