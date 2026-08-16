# Simulation Framework — `src/features/simulation`

A reusable, domain-agnostic framework that every future interactive
simulation (Physics, Chemistry, Biology, Mathematics) builds on top of.
Nothing in this folder knows what a projectile, a reaction, or a cell is —
it only knows about parameters, playback, canvases, charts, and formulas.

No physics/chemistry/biology/math simulation is implemented here. This is
the reusable substrate those simulations will be built from.

## Folder layout

```
src/features/simulation/
├─ index.ts                    # public API barrel — import from here
├─ types/index.ts               # ParameterSchema, FrameInfo, ChartSeries, etc.
├─ engine/
│  └─ animation-engine.ts       # plain (non-React) requestAnimationFrame loop
├─ context/
│  ├─ simulation-context.tsx    # SimulationProvider / useSimulation() — the state manager
│  ├─ canvas-viewport-context.tsx  # shared pan/zoom viewport
│  └─ surface-context.tsx       # fullscreen + screenshot target ref
├─ hooks/
│  ├─ use-animation.ts          # React binding for AnimationEngine
│  ├─ use-canvas.ts             # canvas element + DPR + resize handling
│  ├─ use-pan-zoom.ts           # mouse/touch pan & zoom
│  ├─ use-playback.ts           # keyboard shortcuts (Space/R/Arrows/F)
│  └─ use-simulation-parameters.ts  # schema → validated live state
├─ utils/
│  ├─ canvas-utils.ts           # worldToScreen/screenToWorld, grid/axes drawing
│  └─ event-emitter.ts          # typed pub/sub for simulation-specific events
└─ components/
   ├─ canvas/     — SimulationContainer, SimulationCanvas
   ├─ controls/   — ControlPanel, ParameterSlider, NumberInput, DropdownSelector,
   │                PlaybackControls (Play/Pause, Reset, Step), SpeedController,
   │                ZoomControls, FullscreenButton, ExportScreenshotButton, Toolbar
   ├─ panels/     — InfoPanel, InstructionsPanel, FormulaPanel, Legend
   ├─ charts/     — LineChart, BarChart, ScatterPlot (recharts-backed, memoized)
   └─ formula/    — FormulaCard, FormulaExplanation, VariableTable (KaTeX-backed)
```

## The three layers

1. **Engine** (`AnimationEngine`) — a plain TypeScript class running its own
   `requestAnimationFrame` loop, outside React. Multiple listeners (a
   physics update, a canvas render) can subscribe to the same clock, so
   hundreds of moving objects are driven by ref mutation inside `onTick`
   rather than by 60 React re-renders per second.
2. **State** (`SimulationProvider` / `useSimulation()`) — a React context
   wrapping the engine plus a validated parameter store. Every control
   component reads and writes this context, so a simulation never wires
   up its own play/pause/reset/parameter plumbing.
3. **Components** — presentational or thinly-connected pieces (sliders,
   buttons, panels, charts, formulas) that read from `useSimulation()` /
   `useCanvasViewport()` and render the design system's existing look
   (same `rounded-card`, `border-line`, pine/bone tokens as the rest of
   the app).

## Parameters

A simulation declares its inputs once, declaratively:

```ts
const schema: ParameterSchema = {
  numeric: [
    { key: "gravity", label: "Gravity", min: 0, max: 20, defaultValue: 9.8, unit: "m/s²", step: 0.1 },
    { key: "mass", label: "Mass", min: 0.1, max: 10, defaultValue: 1, unit: "kg" },
  ],
  select: [
    { key: "surface", label: "Surface", defaultValue: "grass",
      options: [{ label: "Grass", value: "grass" }, { label: "Ice", value: "ice" }] },
  ],
};
```

`useSimulationParameters` (used internally by `SimulationProvider`) turns
that into live, clamped state. Dropping a `<ParameterSlider parameter={...} />`
or `<ParameterDropdownSelector parameter={...} />` for each entry
automatically gets a slider, numeric readout, tooltip, unit, and a
reset-to-default button — no per-simulation control code.

## Accessibility & performance, already handled

- Keyboard shortcuts (Space/R/→/F) are wired once in `SimulationContainer`
  via `usePlayback`, not re-implemented per simulation.
- Every interactive element has `aria-*` attributes and visible focus
  rings; the canvas region is `role="img"` with a required `ariaLabel`.
- Charts are `React.memo`-wrapped; parameter lookups use `useMemo`;
  handlers use `useCallback`, so passing a new `values` object each
  render doesn't cascade into unnecessary re-renders of controls that
  don't depend on the changed key.
- `ExportScreenshotButton` dynamically `import()`s `html2canvas` only when
  clicked, and `FormulaCard`/`VariableTable` only pull in KaTeX's CSS
  where formulas actually render — a physics simulation with no chart
  never pays for `recharts`, and vice versa, since each component is its
  own module.
- The canvas render loop is decoupled from React state updates
  (`displaySyncIntervalMs` in `useAnimation`), so a simulation can run at
  a full 60 FPS while the visible clock/frame-counter UI updates on a
  gentler interval.

## How a future simulation would use this (walkthrough, not implemented)

Take **Projectile Motion** as the example the framework should make easy.
None of the following files exist yet — this is the intended shape:

```
src/features/subjects/physics/projectile-motion/
├─ schema.ts        # ParameterSchema: gravity, launchAngle, launchSpeed, mass
├─ physics.ts        # pure functions: position(t), velocity(t) — no React, no framework imports
├─ projectile-motion.tsx   # the simulation component
└─ page.tsx (or wired into app/dashboard/[subject]/[topic]/page.tsx)
```

1. **Define the schema** in `schema.ts` using `ParameterSchema` from
   `@/features/simulation` — gravity, launch angle, launch speed, initial
   height.
2. **Write pure physics** in `physics.ts`: given `(t, params)`, return the
   projectile's `{x, y}` position and velocity. No framework types needed
   here beyond plain numbers — this file is trivially testable on its own.
3. **Compose the component**:
   ```tsx
   <SimulationContainer label="Projectile motion simulation" schema={schema} onTick={(frame, params) => {
     // mutate a ref holding trajectory points using physics.ts — no setState here
   }}>
     <SimulationCanvas
       ariaLabel="Projectile trajectory"
       showAxes
       render={(ctx, { values }) => {
         // draw the projectile + trajectory path using worldToScreen()
       }}
     />
     <Toolbar exportFilename="projectile-motion" />
     <ControlPanel title="Parameters">
       <ParameterSlider parameter={schema.numeric[0]} /> {/* gravity */}
       <ParameterSlider parameter={schema.numeric[1]} /> {/* launch angle */}
     </ControlPanel>
     <FormulaPanel>
       <FormulaExplanation
         formula="y = v_0 \sin\theta \cdot t - \tfrac{1}{2} g t^2"
         explanation="Vertical position over time under constant gravity."
         variables={[{ symbol: "v_0", meaning: "Launch speed", unit: "m/s" }, { symbol: "g", meaning: "Gravity", unit: "m/s²" }]}
       />
     </FormulaPanel>
     <InstructionsPanel steps={["Set a launch angle and speed.", "Press Play to fire.", "Watch the range readout update."]} />
   </SimulationContainer>
   ```
4. **Nothing else changes.** Play/pause/reset, speed control, zoom, pan,
   fullscreen, screenshot export, and keyboard shortcuts all come from
   the framework for free. The only physics-specific code written is the
   schema, the pure motion functions, and the `render` callback — the
   same shape a Chemistry reaction-rate simulation or a Biology
   population-growth simulation would follow, swapping in their own
   schema and update function.

This is exactly why the framework is split the way it is: `physics.ts`
never imports React or canvas code, and the framework never imports
anything about projectiles — the two meet only inside the one component
file that composes them.
