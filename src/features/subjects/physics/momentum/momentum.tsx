"use client";

import {
  InstructionsPanel,
  Legend,
  SimulationContainer,
  Toolbar,
  useSimulation,
} from "@/features/simulation";
import { useEffect, useRef } from "react";
import { Law3DataPanel } from "@/features/subjects/physics/newtons-laws/components/data-panel";
import { Law3Canvas } from "@/features/subjects/physics/newtons-laws/components/law3-canvas";
import { Law3Panel } from "@/features/subjects/physics/newtons-laws/components/law3-panel";
import {
  useLaw3Engine,
  useLaw3Snapshot,
} from "@/features/subjects/physics/newtons-laws/law3-engine";
import { newtonsLawsSchema } from "@/features/subjects/physics/newtons-laws/schema";

/**
 * Momentum's Explore simulation. There is no separate physics rig or
 * canvas here — inspecting the existing codebase first (per this
 * batch's instructions) turned up Newton's Laws' "Law 3" rig
 * (`useLaw3Engine`, `Law3Canvas`, `Law3Panel` in the `newtons-laws`
 * feature), which already models exactly what this topic needs:
 * skaters pushing apart, a two-ball collision with an adjustable
 * restitution (elastic ↔ inelastic), a rocket/balloon, and a spring
 * launch — every one of them computing and displaying `momentumA`,
 * `momentumB`, and `totalMomentum` (`computeLaw3Readouts` in
 * `newtons-laws/law3-engine.ts`), with real physical motion driven by
 * the shared `World`/`RigidBody` engine rather than arrows alone.
 *
 * Rebuilding that from scratch for Momentum would be a duplicate
 * physics engine and a duplicate collision simulation for no
 * educational benefit — the doc's own "do not duplicate physics
 * engines" instruction points here directly. So this component is
 * just a Momentum-flavored shell: its own `SimulationContainer` (so
 * this topic's playback/parameter state is independent of the
 * Newton's Laws page), the same schema (it already declares every
 * field these scenarios use — massA/massB/speedA/restitution/thrust/
 * springStiffness/compression — since Law 3 originally introduced
 * them), and the same three display components, opened on
 * "collision" by default since that's the scenario most directly
 * about momentum conservation and elastic vs. inelastic collisions.
 */
export function Momentum() {
  return (
    <SimulationContainer
      label="Momentum laboratory"
      schema={newtonsLawsSchema}
      initialSpeed={1}
      className="relative"
    >
      <MomentumBody />
    </SimulationContainer>
  );
}

function MomentumBody() {
  const { values, frameCount } = useSimulation();
  const engine = useLaw3Engine(true, "collision");
  const readouts = useLaw3Snapshot(engine, values);

  // Mirrors the same reset-on-Toolbar-Reset fix Newton's Laws uses —
  // the framework's Reset button only knows about time/parameter
  // state, not this rig's own `World`, so without this a "reset"
  // would leave the skaters/balls wherever they'd drifted to.
  const prevFrameCountRef = useRef(frameCount);
  useEffect(() => {
    if (frameCount === 0 && prevFrameCountRef.current > 0) {
      engine.reset();
    }
    prevFrameCountRef.current = frameCount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          <Law3Canvas engine={engine} readouts={readouts} highlightVectors={false} />
          <p className="text-sm text-ink-soft dark:text-bone-soft">
            Pick a scenario, set masses and (for Collision) launch speed and
            restitution, then run it — every scenario here tracks momentum
            for each object and the total, live.
          </p>
          <Toolbar exportFilename="momentum" />
          <Legend
            items={[
              { label: "Applied / action", color: "#3D5AFE", shape: "line" },
              { label: "Friction / reaction", color: "#E0524F", shape: "line" },
              { label: "Velocity", color: "#2E9E5B", shape: "line" },
            ]}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Law3Panel engine={engine} />
          <Law3DataPanel readouts={readouts} />
        </div>
      </div>

      <InstructionsPanel
        title="How to use this lab"
        defaultOpen={false}
        steps={[
          "Collision (default): set Mass A/B and launch speed, then Launch — watch total momentum before and after the impact.",
          "Restitution controls the collision type: 1 = perfectly elastic (momentum and kinetic energy both conserved), 0 = perfectly inelastic (the balls stick together and move as one).",
          "Skaters: set each skater's mass, then Push apart — the lighter skater always ends up moving faster, since equal-and-opposite forces produce different accelerations on different masses.",
          "Rocket, Balloon, and Spring launch show the same idea (equal-and-opposite forces → conserved momentum) in three more everyday settings.",
        ]}
      />
    </div>
  );
}
