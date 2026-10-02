"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Panel } from "../../osi-model-explorer/components/ui";
import type { RoutingLab } from "../hooks/use-routing-lab";
import { SCENARIOS, formatIp, isDefaultRoute, maskText, networkOf, parseIp, routeLabel, routerById, sortRoutes, validateStaticRoute, type Route } from "../model";
import { BTN, BTN_PLAIN, BTN_PRIMARY, FIELD, LABEL } from "./ui";

type RowState = "none" | "match" | "best";

const ROW_STYLE: Record<RowState, string> = {
  none: "",
  match: "bg-amber-100/70 dark:bg-amber-500/15",
  best: "bg-emerald-100 ring-1 ring-inset ring-emerald-500 dark:bg-emerald-500/20",
};

const TYPE_PILL = {
  connected: "bg-sky-500/15 text-sky-800 dark:text-sky-200",
  static: "bg-violet-500/15 text-violet-800 dark:text-violet-200",
  default: "bg-amber-500/20 text-amber-800 dark:text-amber-200",
} as const;

function typeOf(r: Route): keyof typeof TYPE_PILL {
  return r.type === "connected" ? "connected" : isDefaultRoute(r) ? "default" : "static";
}
const TYPE_TEXT = { connected: "Connected", static: "Static", default: "Static · default" } as const;

const NOTICE_TONE = {
  good: "border-emerald-400/60 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200",
  info: "border-line bg-ink/[0.03] text-ink-soft dark:border-line-dark dark:bg-bone/[0.05] dark:text-bone-soft",
  warn: "border-amber-400/60 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200",
} as const;

export function RoutingTablePanel({ lab }: { lab: RoutingLab }) {
  const { state, tables, step, inFlight } = lab;
  const sc = SCENARIOS[state.scenarioId];
  const router = routerById(sc, state.viewRouter);
  const routes = sortRoutes(tables[router.id] ?? []);

  // Which rows the router is currently reasoning about.
  const showing = step && step.router === router.id && step.lookup ? step.lookup : null;
  const bestKey = showing && step && step.kind !== "lookup" && showing.best ? routeLabel(showing.best.route) : null;
  const matchKeys = new Set(showing ? showing.matches.map((m) => routeLabel(m.route)) : []);
  const rowState = (r: Route): RowState => {
    const k = routeLabel(r);
    if (bestKey && k === bestKey) return "best";
    return matchKeys.has(k) ? "match" : "none";
  };

  // Form state
  const [dest, setDest] = useState("");
  const [prefix, setPrefix] = useState("24");
  const [nextHop, setNextHop] = useState("");
  const [iface, setIface] = useState("auto");
  const [error, setError] = useState<string | null>(null);

  const otherLink = sc.routers.filter((r) => r.id !== router.id).flatMap((r) => r.ifaces).find((i) => router.ifaces.some((m) => m.netId === i.netId));
  const hopHint = otherLink ? otherLink.ip : "10.0.0.2";

  function submit() {
    const v = validateStaticRoute(sc, tables, { router: router.id, dest, prefix, nextHop, iface });
    if (!v.ok) {
      setError(v.error);
      return;
    }
    setError(null);
    lab.addRoute(v.seed);
    setDest("");
    setNextHop("");
    setIface("auto");
  }

  const staticCount = routes.filter((r) => r.type === "static").length;

  return (
    <Panel title="Routing table">
      <div className="flex flex-col gap-3">
        {sc.routers.length > 1 && (
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Choose a router">
            {sc.routers.map((r) => {
              const active = r.id === router.id;
              const busy = step?.router === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => lab.viewRouter(r.id)}
                  className={cn("inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-sm font-semibold transition-colors", active ? "border-subject-it bg-subject-it text-paper" : "border-line text-ink hover:border-ink/40 dark:border-line-dark dark:text-bone")}
                >
                  {r.name}
                  {busy && <span className="h-2 w-2 rounded-full bg-amber-400" aria-label="packet is here" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Interfaces create connected routes */}
        <div className="rounded-xl border border-line px-3 py-2 dark:border-line-dark">
          <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">{router.name} interfaces → connected routes</p>
          <ul className="mt-1.5 space-y-1">
            {router.ifaces.map((i) => (
              <li key={i.name} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[11px] text-ink dark:text-bone">
                <span className="font-semibold">{i.name}</span>
                <span>
                  {i.ip}/{i.prefix}
                </span>
                <span aria-hidden className="text-ink-soft dark:text-bone-soft">
                  →
                </span>
                <span className="rounded-md bg-sky-500/15 px-1.5 py-0.5 text-sky-800 dark:text-sky-200">
                  {routeLabel({ dest: connectedDest(i.ip, i.prefix), prefix: i.prefix })} connected
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-1.5 text-[11px] leading-snug text-ink-soft dark:text-bone-soft">Give an interface an address and the router automatically knows that network is directly connected. Nobody types these routes.</p>
        </div>

        {state.notice && (
          <p role="status" className={cn("rounded-xl border px-3 py-2 text-xs leading-relaxed", NOTICE_TONE[state.notice.tone])}>
            {state.notice.text}
          </p>
        )}

        <table className="w-full table-fixed border-collapse text-left font-mono text-[10.5px] sm:text-[11px]">
          <caption className="sr-only">Routing table of {router.name}</caption>
          <thead>
            <tr className="border-b border-line text-[9px] uppercase tracking-wide text-ink-soft dark:border-line-dark dark:text-bone-soft sm:text-[10px]">
              <th scope="col" className="w-[31%] py-1.5 pr-1 font-medium">
                Destination
              </th>
              <th scope="col" className="w-[9%] py-1.5 pr-1 font-medium">
                Mask
              </th>
              <th scope="col" className="w-[21%] py-1.5 pr-1 font-medium">
                Next hop
              </th>
              <th scope="col" className="w-[10%] py-1.5 pr-1 font-medium">
                Iface
              </th>
              <th scope="col" className="w-[20%] py-1.5 pr-1 font-medium">
                Type
              </th>
              <th scope="col" className="w-[9%] py-1.5 font-medium">
                <span className="sr-only">Remove</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => {
              const k = typeOf(r);
              const rs = rowState(r);
              return (
                <tr key={routeLabel(r) + r.type} className={cn("border-b border-line/60 align-middle transition-colors dark:border-line-dark/60", ROW_STYLE[rs])}>
                  <td className="break-words py-2 pr-1 text-ink dark:text-bone">
                    {r.dest}
                    {rs !== "none" && <span className="sr-only">{rs === "best" ? " (selected route)" : " (matches the destination)"}</span>}
                  </td>
                  <td className="py-2 pr-1 text-ink dark:text-bone" title={maskText(r.prefix)}>
                    /{r.prefix}
                  </td>
                  <td className="break-words py-2 pr-1 text-ink dark:text-bone">{r.nextHop ?? "—"}</td>
                  <td className="py-2 pr-1 text-ink dark:text-bone">{r.iface}</td>
                  <td className="py-2 pr-1">
                    <span className={cn("inline-block rounded-md px-1 py-0.5 text-[9.5px] font-semibold leading-tight sm:text-[10px]", TYPE_PILL[k])}>{TYPE_TEXT[k]}</span>
                  </td>
                  <td className="py-1">
                    {r.type === "static" ? (
                      <button
                        type="button"
                        onClick={() => lab.removeRoute(router.id, r.dest, r.prefix)}
                        disabled={inFlight}
                        aria-label={`Remove route ${routeLabel(r)} from ${router.name}`}
                        title="Remove route"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft hover:border-red-400 hover:text-red-600 disabled:opacity-40 dark:border-line-dark dark:text-bone-soft"
                      >
                        <X className="h-4 w-4" strokeWidth={2} aria-hidden />
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-soft dark:text-bone-soft">
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-amber-300 dark:bg-amber-500/60" aria-hidden /> matches the destination
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400 dark:bg-emerald-500/70" aria-hidden /> route selected
          </span>
        </p>

        {/* Add a static route */}
        <form
          className="rounded-xl border border-line p-3 dark:border-line-dark"
          onSubmit={(e) => {
            e.preventDefault();
            if (!inFlight) submit();
          }}
          noValidate
        >
          <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft dark:text-bone-soft">Add a static route to {router.name}</p>
          <div className="mt-2 grid grid-cols-[minmax(0,1fr)_5.5rem] gap-2">
            <div>
              <label htmlFor="route-dest" className={LABEL}>
                Destination network
              </label>
              <input id="route-dest" type="text" inputMode="decimal" autoComplete="off" spellCheck={false} value={dest} onChange={(e) => setDest(e.target.value)} placeholder="192.168.3.0" disabled={inFlight} className={FIELD} />
            </div>
            <div>
              <label htmlFor="route-prefix" className={LABEL}>
                Prefix /n
              </label>
              <input id="route-prefix" type="text" inputMode="numeric" autoComplete="off" value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="24" disabled={inFlight} className={FIELD} />
            </div>
          </div>
          <div className="mt-2 grid gap-2 min-[420px]:grid-cols-2">
            <div>
              <label htmlFor="route-next-hop" className={LABEL}>
                Next hop
              </label>
              <input id="route-next-hop" type="text" inputMode="decimal" autoComplete="off" spellCheck={false} value={nextHop} onChange={(e) => setNextHop(e.target.value)} placeholder={hopHint} disabled={inFlight} className={FIELD} />
            </div>
            <div>
              <label htmlFor="route-iface" className={LABEL}>
                Outgoing interface
              </label>
              <select id="route-iface" value={iface} onChange={(e) => setIface(e.target.value)} disabled={inFlight} className={cn(FIELD, "font-sans")}>
                <option value="auto">Auto (facing the next hop)</option>
                {router.ifaces.map((i) => (
                  <option key={i.name} value={i.name}>
                    {i.name} · {i.ip}/{i.prefix}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {error && (
            <p role="alert" className="mt-2 text-xs leading-relaxed text-red-700 dark:text-red-300">
              {error}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="submit" className={cn(BTN, BTN_PRIMARY)} disabled={inFlight}>
              <Plus className="h-4 w-4" strokeWidth={1.75} /> Add static route
            </button>
            <button
              type="button"
              className={cn(BTN, BTN_PLAIN)}
              disabled={inFlight}
              onClick={() => {
                setDest("0.0.0.0");
                setPrefix("0");
                setError(null);
              }}
              title="Fill the form with 0.0.0.0/0, the IPv4 default route"
            >
              Use default route 0.0.0.0/0
            </button>
            <button type="button" className={cn(BTN, BTN_PLAIN)} disabled={inFlight || staticCount === 0} onClick={() => lab.clearRoutes(router.id)}>
              <Trash2 className="h-4 w-4" strokeWidth={1.75} /> Clear static routes
            </button>
          </div>
          {inFlight ? <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">Routes are locked while a packet is on its way. Let it finish or cancel it to edit the table.</p> : <p className="mt-2 text-xs text-ink-soft dark:text-bone-soft">Use the ✕ button on a static row to remove just that route. Connected routes cannot be removed; they come from the interface addresses.</p>}
        </form>
      </div>
    </Panel>
  );
}

function connectedDest(ip: string, prefix: number): string {
  return formatIp(networkOf(parseIp(ip)!, prefix));
}
