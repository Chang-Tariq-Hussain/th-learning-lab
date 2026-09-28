"use client";

import { useCallback, useState } from "react";
import { createDefaultHosts, type HostId, type IpHost } from "../model";

/** Shared lab state (host configuration) so it survives tab switches. */
export function useIpLab(initial: () => IpHost[] = createDefaultHosts) {
  const [hosts, setHosts] = useState<IpHost[]>(initial);

  const updateHost = useCallback((id: HostId, patch: Partial<Pick<IpHost, "ip" | "prefix" | "gateway">>) => {
    setHosts((hs) => hs.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetAll = useCallback(() => setHosts(initial()), []);

  return { hosts, updateHost, resetAll, setHosts };
}

export type IpLab = ReturnType<typeof useIpLab>;
