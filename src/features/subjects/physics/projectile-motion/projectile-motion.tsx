"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SimulationContainer,
  ControlPanel,
  ParameterSlider,
  ParameterDropdownSelector,
  Toolbar,
  InstructionsPanel,
  Legend,
  useSimulation,
} from "@/features/simulation";
import { cn } from "@/lib/utils";
import { projectileSchema, DEFAULT_DRAG_COEFFICIENT } from "./schema";
import {
  resolveGravity,
  simulateTrajectory,
  sampleTrajectory,
  type LaunchParams,
} from "./physics";
import { challenges } from "./challenges";
import {
  ProjectileCanvas,
  type DisplayOptions,
} from "./components/projectile-canvas";
import { LiveDataPanel } from "./components/live-data-panel";
import { FormulaSection } from "./components/formula-section";
import { GraphsSection } from "./components/graphs-section";
import { LearningMode } from "./components/learning-mode";
import { ChallengeMode } from "./components/challenge-mode";
import {
  TeacherControls,
  type DisplaySettings,
} from "./components/teacher-controls";
import { LaserPointerOverlay } from "./components/laser-pointer-overlay";
import {
  AccessibilityBar,
  type AccessibilitySettings,
} from "./components/accessibility-bar";

type Mode = "explore" | "learn" | "challenge";

const MODE_TABS: { id: Mode; label: string }[] = [
  { id: "explore", label: "Explore" },
  { id: "learn", label: "Learn" },
  { id: "challenge", label: "Challenge" },
];

/**
 * Public entry point. Owns only view-level state that has no bearing on
 * the physics itself (which mode tab is active, presentation settings,
 * accessibility preferences) — everything that affects motion lives in
 * the framework's `SimulationProvider`, reached via `projectileSchema`.
 */
export function ProjectileMotion() {
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    largeText: false,
    highContrast: false,
  });

  return (
    <div
      className={cn(
        accessibility.largeText && "text-[1.0625rem] leading-relaxed",
        accessibility.highContrast && "contrast-125 saturate-150",
      )}
    >
      <div className="mb-4 flex flex-wrap justify-end gap-2">
        <AccessibilityBar
          settings={accessibility}
          onChange={setAccessibility}
        />
      </div>
      <SimulationContainer
        label="Projectile motion simulation"
        schema={projectileSchema}
        initialSpeed={1}
        className="relative"
      >
        <ProjectileMotionBody />
      </SimulationContainer>
    </div>
  );
}

function ProjectileMotionBody() {
  const { values, time, status, pause } = useSimulation();
  const [mode, setMode] = useState<Mode>("explore");
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(
    null,
  );
  const [teacherSettings, setTeacherSettings] = useState<DisplaySettings>({
    presentationMode: false,
    laserPointer: false,
    highlightVectors: false,
  });
  const [displayOptions, setDisplayOptions] = useState<
    Omit<DisplayOptions, "highlightVectors">
  >({
    showTrail: true,
    showVelocityVector: true,
    showAccelerationVector: true,
    showGrid: true,
    showLabels: true,
  });

  const speed = Number(values.speed);
  const angleDeg = Number(values.angleDeg);
  const gravityPreset = String(values.gravityPreset);
  const customGravity = Number(values.customGravity);
  const mass = Number(values.mass);
  const airResistanceOn = values.airResistance === "on";
  const gravity = resolveGravity(gravityPreset, customGravity);

  const launchParams: LaunchParams = useMemo(
    () => ({
      speed,
      angleDeg,
      gravity,
      mass,
      dragCoefficient: airResistanceOn ? DEFAULT_DRAG_COEFFICIENT : 0,
    }),
    [speed, angleDeg, gravity, mass, airResistanceOn],
  );

  const trajectory = useMemo(
    () => simulateTrajectory(launchParams),
    [launchParams],
  );

  // Auto-pause once the projectile lands, so the "Time" readout and
  // charts settle instead of drifting past the flight's end.
  useEffect(() => {
    if (status === "playing" && time >= trajectory.timeOfFlight) {
      pause();
    }
  }, [status, time, trajectory.timeOfFlight, pause]);

  const clampedTime = Math.min(time, trajectory.timeOfFlight);
  const currentState = sampleTrajectory(trajectory, clampedTime);

  const activeChallenge = challenges.find((c) => c.id === activeChallengeId);
  const target =
    activeChallenge?.targetX !== undefined
      ? {
          x: activeChallenge.targetX,
          toleranceMeters: activeChallenge.toleranceMeters,
          speed: activeChallenge.targetSpeed,
        }
      : null;

  const speedParam = projectileSchema.numeric!.find((p) => p.key === "speed")!;
  const angleParam = projectileSchema.numeric!.find(
    (p) => p.key === "angleDeg",
  )!;
  const customGravityParam = projectileSchema.numeric!.find(
    (p) => p.key === "customGravity",
  )!;
  const massParam = projectileSchema.numeric!.find((p) => p.key === "mass")!;
  const gravitySelect = projectileSchema.select!.find(
    (p) => p.key === "gravityPreset",
  )!;
  const airResistanceSelect = projectileSchema.select!.find(
    (p) => p.key === "airResistance",
  )!;

  const presentation = teacherSettings.presentationMode;

  return (
    <div className="flex flex-col gap-6">
      {teacherSettings.laserPointer ? <LaserPointerOverlay /> : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        {!presentation ? (
          <div
            role="tablist"
            aria-label="Simulation mode"
            className="flex gap-1 rounded-full border border-line p-1 dark:border-line-dark"
          >
            {MODE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={mode === tab.id}
                onClick={() => setMode(tab.id)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  mode === tab.id
                    ? "bg-pine-600 text-paper dark:bg-pine-300 dark:text-chalkboard"
                    : "text-ink-soft hover:text-ink dark:text-bone-soft dark:hover:text-bone",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : (
          <span className="font-mono text-xs uppercase tracking-wide text-ink-soft dark:text-bone-soft">
            Presentation mode
          </span>
        )}
        <TeacherControls
          settings={teacherSettings}
          onChange={setTeacherSettings}
        />
      </div>

      <div
        className={cn(
          "grid gap-6",
          !presentation && "lg:grid-cols-[1fr_360px]",
        )}
      >
        <div className="flex flex-col gap-4">
          <ProjectileCanvas
            trajectory={trajectory}
            gravity={gravity}
            options={{
              ...displayOptions,
              highlightVectors: teacherSettings.highlightVectors,
            }}
            target={target}
          />
          <Toolbar exportFilename="projectile-motion" />
          {!presentation ? (
            <Legend
              items={[
                { label: "Velocity vector", color: "#3D5AFE", shape: "line" },
                {
                  label: "Acceleration vector",
                  color: "#E0524F",
                  shape: "line",
                },
                { label: "Max height", color: "#7C4FE0", shape: "dot" },
                { label: "Landing point", color: "#0D9488", shape: "dot" },
              ]}
            />
          ) : null}
        </div>

        {!presentation ? (
          <div className="flex flex-col gap-4">
            {mode === "explore" ? (
              <ControlPanel title="Launch parameters">
                <ParameterSlider parameter={speedParam} />
                <ParameterSlider parameter={angleParam} />
                <ParameterDropdownSelector parameter={gravitySelect} />
                {gravityPreset === "custom" ? (
                  <ParameterSlider parameter={customGravityParam} />
                ) : null}
                <ParameterSlider parameter={massParam} />
                <ParameterDropdownSelector parameter={airResistanceSelect} />

                <fieldset className="flex flex-col gap-2 border-t border-line pt-3 dark:border-line-dark">
                  <legend className="mb-1 text-sm font-medium text-ink dark:text-bone">
                    Display
                  </legend>
                  {(
                    [
                      ["showTrail", "Show trail"],
                      ["showVelocityVector", "Show velocity vector"],
                      ["showAccelerationVector", "Show acceleration vector"],
                      ["showGrid", "Show grid"],
                      ["showLabels", "Show labels"],
                    ] as const
                  ).map(([key, label]) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 text-sm text-ink-soft dark:text-bone-soft"
                    >
                      <input
                        type="checkbox"
                        checked={displayOptions[key]}
                        onChange={(e) =>
                          setDisplayOptions((prev) => ({
                            ...prev,
                            [key]: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded accent-pine-600 dark:accent-pine-300"
                      />
                      {label}
                    </label>
                  ))}
                </fieldset>
              </ControlPanel>
            ) : null}

            {mode === "learn" ? <LearningMode /> : null}

            {mode === "challenge" ? (
              <ChallengeMode
                trajectory={trajectory}
                activeChallengeId={activeChallengeId}
                onSelectChallenge={setActiveChallengeId}
              />
            ) : null}

            <LiveDataPanel
              state={currentState}
              trajectory={trajectory}
              mass={mass}
              gravity={gravity}
            />
          </div>
        ) : null}
      </div>

      {!presentation ? (
        <>
          <InstructionsPanel
            title="How to use this simulation"
            steps={[
              "Set launch velocity and angle with the sliders, or pick a world for gravity.",
              "Press Play (or Space) to launch — the trajectory, vectors, and live data update in real time.",
              "Switch to Learn for guided what-if questions, or Challenge to try and hit a target.",
              "Use Step (→) to advance frame-by-frame, or slow the animation down with the speed control.",
            ]}
          />
          <FormulaSection params={launchParams} trajectory={trajectory} />
          <GraphsSection
            trajectory={trajectory}
            currentTime={clampedTime}
            mass={mass}
            gravity={gravity}
          />
        </>
      ) : null}
    </div>
  );
}
