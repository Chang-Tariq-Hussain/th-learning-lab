import type { DhcpLabInit, RunSummary } from "./hooks/use-dhcp-lab";
import { DEFAULT_POOL, ROUTER, configureClients, initialState, poolSize, validatePool, withPoolSize, type LabState } from "./model";

/**
 * Starting states and checkers for the three *interactive* Challenge scenarios (do something in the lab and have the
 * result inspected). The ids must match `challenge.scenarios` in the Learning content. The other DHCP challenges are
 * choice questions and need no lab.
 */
export const DHCP_CHALLENGE_IDS = {
  configureServer: "dhcp-challenge-configure-server",
  fixExhausted: "dhcp-challenge-fix-exhausted",
  fixGateway: "dhcp-challenge-fix-gateway",
} as const;

export type DhcpChallengeId = (typeof DHCP_CHALLENGE_IDS)[keyof typeof DHCP_CHALLENGE_IDS];

export interface DhcpChallengeState {
  saved: LabState;
  lastCompleted: RunSummary | null;
}

export interface DhcpChallengeSetup {
  instructions: string;
  focus: string;
  tools: "pool" | "run-and-pool";
  start: () => DhcpLabInit;
  check: (s: DhcpChallengeState) => boolean;
}

export const DHCP_CHALLENGE_SETUPS: Record<DhcpChallengeId, DhcpChallengeSetup> = {
  [DHCP_CHALLENGE_IDS.configureServer]: {
    instructions: `A new DHCP server has been set up in a hurry. It hands out addresses starting at 192.168.1.1, gives clients the wrong gateway, and has no DNS server. Fix its configuration: the pool must hold at least 10 addresses, must not include the router (${ROUTER.ip}) or the server itself (192.168.1.2), the gateway must be the router, and a DNS server must be set.`,
    focus: "Edit the range, gateway and DNS server, then press Apply. The check reads the configuration the server actually has.",
    tools: "pool",
    start: () => ({ state: initialState({ start: 1, end: 20, leaseMin: 60, dns: "", gateway: "192.168.2.1" }), selected: "pc1" }),
    check: ({ saved }) => validatePool(saved.pool).length === 0 && poolSize(saved.pool) >= 10 && saved.pool.gateway === ROUTER.ip && saved.pool.dns !== "",
  },
  [DHCP_CHALLENGE_IDS.fixExhausted]: {
    instructions: "The server's pool has only three addresses, and PC-01, PC-02 and PC-03 hold all of them. PC-04 and PC-05 have just been plugged in and cannot get an address. Make both of them receive a DHCP address.",
    focus: "Run DHCP for PC-04 and see why it fails. Then free or add an address (enlarge the pool, or release a PC that is no longer in use) and try again.",
    tools: "run-and-pool",
    start: () => ({ state: configureClients(initialState(withPoolSize(3)), ["pc1", "pc2", "pc3"]), selected: "pc4" }),
    check: ({ saved }) => saved.clients.pc4.phase === "bound" && saved.clients.pc5.phase === "bound",
  },
  [DHCP_CHALLENGE_IDS.fixGateway]: {
    instructions: `PC-03 got its address by DHCP, but the server was handing out the wrong gateway (192.168.2.1, which is on a different network). PC-03 cannot reach other networks. Correct the server so it hands out the router (${ROUTER.ip}), and get PC-03 to pick up the corrected setting.`,
    focus: "Changing the server does not change a client that already has a lease. The client learns the new value when it renews, or when it releases its lease and asks again.",
    tools: "run-and-pool",
    start: () => ({ state: configureClients(initialState({ ...DEFAULT_POOL, gateway: "192.168.2.1" }), ["pc3"]), selected: "pc3" }),
    check: ({ saved }) => saved.pool.gateway === ROUTER.ip && saved.clients.pc3.config?.gateway === ROUTER.ip,
  },
};
