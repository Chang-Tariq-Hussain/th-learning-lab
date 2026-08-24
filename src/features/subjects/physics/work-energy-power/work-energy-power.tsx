"use client";

import { useState } from "react";
import { EnergyPanel } from "./components/energy-panel";
import { PanelTabs, type WepPanel } from "./components/panel-tabs";
import { PowerPanel } from "./components/power-panel";
import { WorkPanel } from "./components/work-panel";

/**
 * Work, Energy & Power — three linked panels (Work / Energy / Power)
 * behind one tab switcher, reusing `PlanSlider` and the card/button
 * styling from Simple Motion and Simple Energy so it feels like the
 * same lab family rather than a new UI pattern. Unlike Simple Energy
 * (deliberately numberless, for the foundations path), every readout
 * here shows a real number with units, since this topic's Practice
 * and Challenge sections ask students to compute with them.
 */
export function WorkEnergyPower() {
  const [panel, setPanel] = useState<WepPanel>("work");

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <PanelTabs active={panel} onChange={setPanel} />
      {panel === "work" ? <WorkPanel /> : null}
      {panel === "energy" ? <EnergyPanel /> : null}
      {panel === "power" ? <PowerPanel /> : null}
    </div>
  );
}
