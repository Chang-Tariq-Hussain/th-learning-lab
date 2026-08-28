"use client";

import { createContext, useContext, type ReactNode } from "react";

export type SimulationDensity = "default" | "compact";

const SimulationDensityContext = createContext<SimulationDensity>("default");

/**
 * Whether the nearest `<SimulationContainer>` should render at its
 * normal, comfortable padding ("default" — the large/dedicated
 * presentation, e.g. Explore) or trim its own padding ("compact" —
 * nested a layer or two deep inside another already-padded card,
 * e.g. Predict's "run the experiment" frame or a Challenge). A
 * concrete simulation never reads this itself; only the shared
 * `SimulationContainer` does, so no simulation component needs to
 * know or care which context it's being rendered in.
 */
export function useSimulationDensity(): SimulationDensity {
  return useContext(SimulationDensityContext);
}

export interface SimulationDensityProviderProps {
  density: SimulationDensity;
  children: ReactNode;
}

/**
 * Marks every `<SimulationContainer>` rendered inside `children` as
 * "compact". Wrap a simulation with this wherever it's embedded
 * inside another card rather than given a large dedicated area — see
 * `ExperimentFrame`, which every Predict/Challenge scenario already
 * goes through. This exists so nesting depth is declared once, at the
 * point where a simulation is embedded, rather than requiring every
 * individual simulation to accept and thread a "compact" prop of its
 * own — the same `<PlotAPoint />` element instance is reused across
 * Explore/Predict/Challenge, so it can't take different props per
 * context; a context is the one mechanism that reaches through it.
 */
export function SimulationDensityProvider({ density, children }: SimulationDensityProviderProps) {
  return <SimulationDensityContext.Provider value={density}>{children}</SimulationDensityContext.Provider>;
}
