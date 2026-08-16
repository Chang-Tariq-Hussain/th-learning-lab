# Build an Atom — `src/features/subjects/chemistry/build-an-atom`

An exploratory toy, not a parameter-driven simulation: students drag
particles (or click big +/− buttons) and watch an atom change in real
time. Deliberately built outside the Simulation Framework's
`SimulationContainer`/`ParameterSchema` machinery (playback controls,
KaTeX formula panels, etc. don't fit a "just play with it" interaction),
but still reuses what genuinely applies.

## Folder layout

```
build-an-atom/
├─ build-an-atom.tsx          # two-column layout; all state (atom, hint, zoom, drag, accessibility)
├─ atom-model.ts              # mass number, net charge, charge classification — pure functions
├─ elements.ts                # first 20 elements + graceful fallback beyond
├─ shells.ts                  # Bohr-model shell capacities (2/8/8/18…) + distribution
├─ nucleus-layout.ts          # deterministic "sunflower spiral" packing for protons/neutrons
├─ particle-info.ts           # click-to-explain facts + cycling experiment hints
├─ drag-utils.ts              # cross-device (mouse/touch/pointer) drop-zone hit-testing
└─ components/
   ├─ atom-visualization.tsx  # SVG scene; owns orbit rotation + flowing ring animation
   ├─ atom-defs.tsx           # shared <defs>: particle gradients + glow filters
   ├─ pop-burst.tsx           # reusable expanding/fading ring, layered behind any particle on mount
   ├─ nucleon.tsx             # proton/neutron: gradient, glow, bouncy pop, continuous wobble
   ├─ electron.tsx            # electron: gradient, glow, curved "fly into orbit" entrance
   ├─ particle-tray.tsx       # the draggable box — one colored chip per particle type
   ├─ zoom-controls.tsx       # zoom in / out / reset, with a live percentage readout
   ├─ controls-panel.tsx      # the six large +/− buttons (kept as the keyboard-accessible fallback)
   ├─ info-panel.tsx          # live element/symbol/counts/charge readout
   ├─ particle-detail.tsx     # click-to-explain card
   └─ hint-banner.tsx         # experiment hint after each change
```

## Interactions

- **Drag and drop**: drag any chip from the `ParticleTray` box (protons
  red, neutrons gray, electrons blue — same colors as the atom itself)
  onto the visualization to add one. Each chip always springs back to
  its spot afterward (`dragSnapToOrigin`) — the tray is an infinite
  source, not a depleting supply. Drop detection compares the drag
  gesture's final pointer position against the visualization panel's
  bounding box (`drag-utils.ts`), working identically for mouse, touch,
  and pointer input.
- **Zoom**: `ZoomControls` scales the visualization panel via CSS
  `transform: scale()` inside an `overflow-hidden` wrapper — cheap,
  smooth, and untouched by the SVG's internal coordinate math (orbit
  rotation, particle positions are unaffected by zoom level).
- **+/− buttons** remain the fully keyboard-accessible way to do the
  same thing — drag-and-drop is an enhancement, not a replacement; every
  draggable chip's `aria-label` points keyboard/screen-reader users at
  the equivalent button.

## Animation layers (kept deliberately separate so nothing fights over the same transform)

1. **Continuous, imperative** (`atom-visualization.tsx`): electron
   orbit rotation and each ring's flowing dash-offset, both driven by
   one `useAnimation` clock and written straight to `element.setAttribute(...)`
   every frame — never through React state, so 60 FPS motion never
   re-renders the component.
2. **Mount/unmount** (`nucleon.tsx`, `electron.tsx`, `pop-burst.tsx`):
   Framer Motion `initial`/`animate`/`exit` — a bouncy spring pop for
   nucleons, a curved multi-keyframe "swoop" for electrons flying into
   orbit, and a one-shot expanding `PopBurst` ring layered behind either.
   These fire only when a particle is actually added or removed.
3. **Ambient looping** (`nucleon.tsx`, `atom-visualization.tsx`): a
   small randomized per-nucleon wobble and a pulsing nucleus glow, each
   its own `animate` with `repeat: Infinity` on a *different* element
   than the imperative rotation, so they compose rather than conflict.

## Reused rather than rebuilt

- **`useAnimation`** (`@/features/simulation/hooks/use-animation`) drives
  the electron orbit and ring-flow clock. It's the same
  `requestAnimationFrame` engine every physics/chemistry/math simulation
  uses, and — usefully — it doesn't require `SimulationProvider`, so it
  works standalone here. **Import it from its own module path, not the
  framework's barrel** (`@/features/simulation/hooks/use-animation`, not
  `@/features/simulation`) — the barrel's `export *` chain pulls in
  KaTeX and recharts through unrelated exports, which bloated this
  page's bundle from ~147KB to ~332KB first-load JS before this was
  caught and fixed. Any future lightweight feature that only needs one
  framework hook should import that hook directly for the same reason.
- `Button` from `@/components/ui/button` and Tailwind's existing design
  tokens (`subject.chemistry`, `pine-*`, `bone`/`ink`) — no new design
  system introduced.

## Reusable pieces future chemistry/biology visualizations can lift directly

- **`nucleus-layout.ts`'s sunflower-spiral packing** — any visualization
  that needs to densely pack a growing/shrinking set of circles without
  them jumping around when one is added (a cell's organelles, a
  molecule's electron cloud, a population of particles) can reuse
  `sunflowerPosition`-style layout with zero changes to the underlying
  math, just a different visual meaning.
- **`PopBurst`** — a fully generic "something just appeared here" ring
  effect; any add/remove interaction elsewhere (a periodic-table tile
  lighting up, a cell dividing) can drop it in directly.
- **`drag-utils.ts`'s drop-zone hit-testing** — device-agnostic
  (mouse/touch/pointer) point-in-rect testing, reusable by any future
  "drag an X onto a Y" interaction without rewriting event-normalization
  logic.
- **The imperative-ref + `useAnimation` pattern** for "one continuous
  background animation that shouldn't cause re-renders" — directly
  applicable to anything else that needs to *spin*, *pulse*, or *drift*
  continuously (orbiting electrons here; equally suited to a rotating
  molecule, a beating cell membrane, or a flowing reaction arrow).
- **`ParticleKind`/click-to-explain pattern** (`particle-info.ts` +
  `particle-detail.tsx`) — a small, generic "click a thing, see a fact
  card" interaction that a Biology cell-diagram or a Math geometry
  explorer could reuse verbatim by swapping the info map.

## What was deliberately left out of scope

No Teacher Mode, no Learning/Challenge modes, no KaTeX formulas — the
brief asked for "an educational toy," not a formal lab, and mixing in
the heavier Simulation Framework machinery would have worked against
"keep the interface extremely simple." If a future task asks for guided
lessons or a "predict then test" mode here, the `LearningMode`/
`ChallengeMode` patterns from `projectile-motion/` and `newtons-laws/`
are the reference to follow — but they weren't force-fit into this pass.
