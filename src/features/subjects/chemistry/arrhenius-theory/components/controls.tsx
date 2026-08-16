"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Droplets, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ION_COLOR } from "../arrhenius-model";

export type LastAction = "acid" | "base" | null;

interface ControlsProps {
  acidDose: number;
  baseDose: number;
  maxDose: number;
  lastAction: LastAction;
  onAddAcid: () => void;
  onAddBase: () => void;
  onReset: () => void;
}

const STATUS_TEXT: Record<Exclude<LastAction, null>, string> = {
  acid: "H⁺ concentration increased",
  base: "OH⁻ concentration increased",
};

/** Minimal controls, exactly as the spec asks: Add Acid, Add Base, Reset — no sliders, no numeric input. */
export function Controls({ acidDose, baseDose, maxDose, lastAction, onAddAcid, onAddBase, onReset }: ControlsProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="secondary" size="md" onClick={onAddAcid} disabled={acidDose >= maxDose} style={{ borderColor: `${ION_COLOR["h-plus"]}55` }}>
          <Droplets className="h-4 w-4" strokeWidth={1.75} style={{ color: ION_COLOR["h-plus"] }} />
          Add Acid
        </Button>
        <Button variant="secondary" size="md" onClick={onAddBase} disabled={baseDose >= maxDose} style={{ borderColor: `${ION_COLOR["oh-minus"]}55` }}>
          <Droplets className="h-4 w-4" strokeWidth={1.75} style={{ color: ION_COLOR["oh-minus"] }} />
          Add Base
        </Button>
        <Button variant="ghost" size="md" onClick={onReset}>
          <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
          Reset
        </Button>
      </div>

      <div className="h-5">
        <AnimatePresence mode="wait">
          {lastAction ? (
            <motion.p
              key={`${lastAction}-${lastAction === "acid" ? acidDose : baseDose}`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-xs font-medium"
              style={{ color: ION_COLOR[lastAction === "acid" ? "h-plus" : "oh-minus"] }}
            >
              {STATUS_TEXT[lastAction]}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
