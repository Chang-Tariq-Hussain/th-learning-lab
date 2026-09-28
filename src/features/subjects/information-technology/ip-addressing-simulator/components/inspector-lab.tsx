"use client";

import { useState } from "react";
import { SectionHeading } from "../../osi-model-explorer/components/ui";
import { IP_PRESETS, levelPrefixMessage, parseIPv4, parseMask, prefixLimits, type DetailLevel } from "../model";
import { AddressInspector, TextField } from "./parts";

/** Section 19: inspect any address. */
export function InspectorLab({ level }: { level: DetailLevel }) {
  const [ipText, setIpText] = useState("192.168.1.25");
  const [maskText, setMaskText] = useState("/24");
  const ip = parseIPv4(ipText);
  const mask = parseMask(maskText);
  const lim = prefixLimits(level);
  const outOfLevel = mask.ok && (mask.prefix < lim.min || mask.prefix > lim.max);

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading title="IP address inspector">Type any address and mask to see every property in one place, or start from an example.</SectionHeading>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField id="in-ip" label="IPv4 address" value={ipText} onChange={setIpText} error={ip.ok ? null : ip.reason} />
        <TextField id="in-mask" label="Mask or /prefix" value={maskText} onChange={setMaskText} error={mask.ok ? (outOfLevel ? levelPrefixMessage(level) : null) : mask.reason} />
      </div>
      <div className="flex flex-wrap gap-2">
        {IP_PRESETS.map((p) => (
          <button key={p.label} type="button" onClick={() => { setIpText(p.ip); setMaskText(`/${p.prefix}`); }} className="min-h-[36px] rounded-full border border-line px-3 py-1.5 text-xs text-ink dark:border-line-dark dark:text-bone">{p.label}</button>
        ))}
      </div>
      {ip.ok && mask.ok && !outOfLevel && <AddressInspector ip={ip.value} prefix={mask.prefix} title="Inspector" />}
    </div>
  );
}
