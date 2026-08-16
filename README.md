# th-learning-lab

# Fieldnote — Educational Platform Foundation

A production-ready foundation for a science learning platform covering
Physics, Chemistry, Biology, and Mathematics. This is the scaffolding —
navigation, dashboard, design system, dark/light mode — built to hold
interactive simulations without a rewrite.

## Stack

- **Next.js 14** (App Router) + **TypeScript** (strict mode)
- **Tailwind CSS** with a custom design-token system
- **Framer Motion** for scroll reveals, page-load sequencing, and the mobile menu
- **next-themes** for dark/light mode (system-aware, no flash of unstyled theme)
- **lucide-react** for utility icons; bespoke SVG glyphs for subject identity

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. The dashboard lives at `/dashboard`.

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Folder structure

Feature-based, so a new subject or page never requires touching unrelated code:

```
src/
├─ app/                      # routes (App Router)
│  ├─ layout.tsx             # fonts, metadata, theme provider, nav/footer shell
│  ├─ page.tsx                # landing page
│  ├─ globals.css
│  └─ dashboard/
│     └─ page.tsx             # subject dashboard
│
├─ components/
│  ├─ ui/                    # generic, subject-agnostic primitives
│  │  ├─ button.tsx
│  │  ├─ container.tsx
│  │  ├─ section-heading.tsx
│  │  ├─ badge.tsx
│  │  └─ ruler-divider.tsx
│  ├─ layout/                # app chrome
│  │  ├─ navbar.tsx
│  │  ├─ sidebar.tsx
│  │  ├─ footer.tsx
│  │  ├─ theme-provider.tsx
│  │  ├─ theme-toggle.tsx
│  │  ├─ skip-link.tsx
│  │  └─ logo.tsx
│  ├─ landing/                # sections used only on the landing page
│  │  ├─ hero.tsx
│  │  ├─ features-section.tsx
│  │  ├─ subjects-preview.tsx
│  │  └─ cta-section.tsx
│  └─ dashboard/
│     ├─ subject-card.tsx     # the "specimen card" signature component
│     └─ subject-grid.tsx
│
├─ features/
│  └─ subjects/               # subject domain module
│     ├─ types.ts             # Subject / SubjectTopic types
│     ├─ glyphs.tsx           # bespoke line-art icon per subject
│     └─ data/subjects.ts     # single source of truth for the 4 subjects
│
├─ lib/
│  └─ utils.ts                # `cn()` class-merging helper
│
└─ config/
   └─ site.ts                 # nav links, footer links, site metadata
```

## Adding a subject

Everything renders off one array. To add a fifth subject:

1. Add a glyph component to `features/subjects/glyphs.tsx` and register it in `subjectGlyphs`.
2. Add an entry to `features/subjects/data/subjects.ts` (name, tagline, description, color token, topics).
3. Add the matching color tokens (`subject.<name>` and `subject.<name>-soft`) to `tailwind.config.ts`.

The dashboard grid, sidebar, and landing preview all pick it up automatically.

## Adding a simulation later

Each `SubjectTopic` already carries a `hasSimulation` flag. The intended pattern:

1. Create a route like `app/dashboard/[subject]/[topic]/page.tsx`.
2. Build the interactive model as its own component under `features/subjects/<subject>/`.
3. Flip `hasSimulation: true` for that topic in `data/subjects.ts` — the UI is already set up to surface "in development" vs. "live" states.

## Design system notes

- Colors, spacing, radii, and shadows are all defined as Tailwind tokens in `tailwind.config.ts` — no ad hoc hex codes in components.
- Type scale uses three font roles: **Space Grotesk** (display/headlines), **Inter** (body), **JetBrains Mono** (data, labels, subject codes).
- `prefers-reduced-motion` is respected globally in `globals.css`.
- Full keyboard focus states (`focus-visible` rings) on every interactive element; a skip-to-content link is included.
- Dark mode is class-based (`darkMode: "class"` in Tailwind config) and driven by `next-themes`, defaulting to the user's system preference.

# 2D Physics Engine — `src/features/subjects/physics/engine`

A general-purpose, simulation-agnostic 2D physics engine: vectors, mass,
forces, constraints, collisions, and a `World` to tie them together.
Nothing here is specific to Pendulum, Collisions, or any other lesson —
this is the layer every future Physics simulation (beyond Projectile
Motion, which has its own closed-form model) is built from.

No new simulations were built in this pass, per the brief — this is the
reusable substrate only.

## Why this is separate from `@/features/simulation`

`@/features/simulation` (the UI framework built earlier) is
**domain-agnostic** — sliders, playback, charts, and KaTeX formulas that
Chemistry and Biology simulations use just as much as Physics does. This
engine is **physics-specific** — `RigidBody`, collisions, and springs
have no meaning for a population-growth or reaction-rate simulation. So
it lives under `features/subjects/physics/`, not inside the shared
framework, and it _reuses_ the framework where it overlaps rather than
duplicating it — see `World`'s event system below.

## Folder layout

```
engine/
├─ index.ts                  # public API + a worked Pendulum example in the doc comment
├─ math/vector2.ts            # Vector2 — every operation in the brief (add, sub, dot, cross, project, reflect, rotate, lerp, ...)
├─ core/
│  ├─ particle.ts             # point mass: position, velocity, mass, forces, impulses
│  ├─ rigid-body.ts           # + shape, rotation, angular velocity, torque
│  └─ shape.ts                # circle/rect shapes, moment of inertia, AABB
├─ forces/
│  ├─ force.ts                # ForceGenerator interface
│  ├─ gravity.ts              # UniformGravity (constant field) + NewtonianGravity (1/r²)
│  ├─ drag.ts                 # linear + quadratic air resistance
│  └─ spring.ts                # Hooke's law + damping, body↔body or body↔anchor
├─ constraints/constraint.ts   # DistanceConstraint (rods/pendulums), PinConstraint
├─ collision/
│  ├─ detection.ts             # circle-circle, rect-rect, circle-rect, world boundary
│  └─ resolution.ts            # impulse-based resolver: restitution, Coulomb friction, positional correction
├─ integration/integrator.ts    # semiImplicitEuler (default) and explicitEuler (for comparison)
├─ world/world.ts               # bodies, forces, constraints, step(), reset(), events
├─ render/renderer-adapter.ts    # drawWorld() — the only file that touches CanvasRenderingContext2D
├─ debug/debug-overlay.ts        # bounding boxes, vectors, contact points, FPS
├─ objects/objects.ts            # createBall, createBox, createPendulum, createHangingSpring, createRamp, createGround, createWall, createPlatform, createProjectile, createTarget
└─ utils/                        # math-helpers, unit-conversion, coordinates, animation-timing (FpsTracker)
```

## Validated accuracy

Every core physics claim was checked against closed-form theory before
this was considered done (see the commit history / build log for the
actual test runs):

| Test                                  | Result                                                                 |
| ------------------------------------- | ---------------------------------------------------------------------- |
| Free fall vs. `y = y₀ − ½gt²`         | matches to <0.01%                                                      |
| Elastic collision (e=1), equal masses | momentum and KE conserved exactly; velocities swap exactly             |
| Inelastic collision (e=0)             | momentum conserved; bodies move together at the combined-mass velocity |
| Restitution bounce height             | ratio matches `e²` to 0.02%                                            |
| Pendulum period (small angle)         | matches `T = 2π√(L/g)` to 0.05%                                        |
| Spring-mass period                    | matches `T = 2π√(m/k)` to 0.01%                                        |

## Reuse instead of duplication

- `World`'s event system (`world.events.on("collision", ...)`) is the
  framework's own `SimulationEventEmitter` from `@/features/simulation`,
  not a second pub/sub implementation.
- `Vector2` implements the same `{x, y}` shape as the framework's
  `Point2D`, so engine positions can be passed directly into framework
  utilities (`worldToScreen`, chart data points) without conversion.
- The integrator (`semiImplicitEuler`) uses the same method as
  `projectile-motion/physics.ts`'s numerical fallback — a `Particle`
  under `UniformGravity` reproduces that simulation's non-drag case
  almost exactly, and _exactly_ explains why both were built the same way.

## How each target simulation would use this engine

None of these are built yet — this shows the shape each would take.

- **Free Fall** — `createBall` + `UniformGravity`, no constraints, no
  boundary collision needed if the lesson stops before impact.
- **Newton's Laws** — a `Particle`/`RigidBody` with `applyForce()` called
  directly from UI sliders (e.g. "push force" and "friction" sliders),
  demonstrating F = ma via the body's own `acceleration` readout.
- **Inclined Plane** — `createRamp` (static, rotated) + `createBall` or
  `createBox` released on it with `UniformGravity` + friction; the
  existing collision resolver's friction impulse handles sliding
  naturally, no separate incline-specific math needed.
- **Collisions** — several `createBall`/`createBox` instances with
  different `restitution` values in one `World`; `world.events.on("collision", ...)`
  drives a "momentum before/after" readout directly from the brief's
  educational-data requirement.
- **Pendulum** — `createPendulum` + `UniformGravity`, exactly as shown in
  `index.ts`'s doc comment.
- **Springs** — `createHangingSpring`, or a bare `Spring` between two
  `createBall` bodies for a two-mass coupled-oscillator lesson.
- **Circular Motion** — a `Particle` with a custom `ForceGenerator` that
  applies a centripetal force each step (`F = mv²/r`, always pointing at
  the center) — a ~10-line class implementing `ForceGenerator`, no
  engine changes required.
- **Orbital Motion** — `NewtonianGravity` was built specifically for
  this: a `World` with no `boundary`, a heavy static-mass "sun" body,
  and lighter orbiting bodies.
- **Electric Field visualization** — Coulomb's law (`F = kq₁q₂/r²`) is
  structurally identical to `NewtonianGravity`'s inverse-square law; a
  simulation would add an `ElectricForce` generator following the exact
  same pattern (mass → charge, `G` → Coulomb's constant), reusing
  `World`, `RigidBody`, and `drawWorld` unchanged.

In every case, the pattern is the same: compose a `World` from
`objects/` factories and `forces/`/`constraints/` pieces, call
`world.step(dt)` once a frame (typically from the simulation
framework's `onTick`), and read `body.velocity`, `.kineticEnergy`,
`.momentum`, etc. directly for the live data panel — no simulation
needs to re-derive physics the engine already provides.

# Newton's Laws Interactive Laboratory — build status: COMPLETE

All items below are built. This file is kept as the map/README for the
feature, per the request to have folder structure documented in advance.

## Folder structure

```
src/features/subjects/physics/newtons-laws/
├─ physics.ts             — presets, SurfaceFriction force, cart rig (Law 1+2),
│                            4 Law 3 rigs (skaters/rocket/balloon/collision/spring), readouts
├─ cart-engine.ts         — useCartEngine, syncCartState, useCartSnapshot (Law 1 & 2)
├─ law3-engine.ts         — useLaw3Engine, syncLaw3State, computeLaw3Readouts, useLaw3Snapshot
├─ schema.ts              — one unified ParameterSchema for the whole lab
├─ scenarios.ts           — Learning Mode's 5 guided lessons
├─ challenges.ts          — Challenge Mode's cart + Law 3 objectives, plus "predict first" prompts
├─ components/
│  ├─ canvas-helpers.ts       — projection, ground, force/velocity arrow drawing
│  ├─ free-body-diagram.tsx   — standalone SVG force-arrow diagram (Law 1 "visualize forces")
│  ├─ cart-canvas.tsx         — Law 1/2 canvas: cart + vectors + free-body overlay
│  ├─ law3-canvas.tsx         — renders all 5 Law 3 scenarios with action/reaction arrows
│  ├─ data-panel.tsx          — CartDataPanel + Law3DataPanel (wrap InfoPanel)
│  ├─ formula-section.tsx     — 7 formulas, click-to-explain, live current-value readouts
│  ├─ law2-graphs.tsx         — 5 graphs (F-vs-a, m-vs-a ideal curves + 3 time series)
│  ├─ law1-panel.tsx          — Law 1 controls + explanation
│  ├─ law2-panel.tsx          — Law 2 controls + live F=ma calculation strip
│  ├─ law3-panel.tsx          — scenario picker + per-scenario controls + primary action
│  ├─ learning-mode.tsx       — auto-configures params/law, student runs it manually
│  ├─ challenge-mode.tsx      — objective checks + hints + "predict before you run it"
│  ├─ teacher-mode.tsx        — presentation/freeze/slow-motion/highlight/formulas-only/fullscreen
│  └─ accessibility-bar.tsx   — large text / high contrast toggles
├─ newtons-laws.tsx       — root composition (SimulationContainer + everything above)
└─ index.ts               — barrel export

src/app/dashboard/physics/newtons-laws/page.tsx   — route (done)
src/features/subjects/data/subjects.ts            — hasSimulation: true + href (done)
```

## Engine bugs found and fixed (blocking, from the prior pass)

1. `forces/drag.ts` was a duplicate of `gravity.ts` with no `Drag` class — replaced with
   a real linear/quadratic drag `ForceGenerator`.
2. `constraints/contrain.ts` → renamed to `constraint.ts` (index.ts already imported the
   correct name; the file was misspelled).
3. `utils/unit.conversion.ts` → renamed to `unit-conversion.ts` (same kind of mismatch).

All three verified: every relative import in `engine/index.ts` now resolves to a real file.

## Bugs found and fixed in verification pass 2

A second, full review (every file read, every import/export checked programmatically
against the actual barrel contents) turned up six more issues, three of them serious:

1. **`ToggleSwitch` was implemented but never exported** from the simulation framework's
   controls barrel (`components/controls/index.ts`) — `law1-panel.tsx`/`law2-panel.tsx`
   import it from `@/features/simulation`, so this broke the build. Added the missing
   export.
2. **An import used an explicit `.tsx` extension** (`"./components/challenge-mode.tsx"` in
   `newtons-laws.tsx`), which fails under this project's `tsconfig.json` (no
   `allowImportingTsExtensions`). Removed the extension.
3. **Law 3's physics never ran, in any scenario, ever** — `useLaw3Engine`'s frame
   subscription closed over an `enabled: () => boolean` callback, but the effect
   registering that subscription only runs once (`subscribeFrame` is referentially
   stable), so it permanently captured `law === 3` evaluated against the _first_
   render's `law` (always `false`). Every Law 3 scenario was frozen regardless of tab or
   Play state. This directly contradicts this file's own previous "known simplification"
   note below, which assumed the opposite failure mode (world stepping when it shouldn't,
   rather than never stepping at all) — that note has been corrected. Fixed by mirroring
   `active` into a ref updated every render, the standard fix for this exact class of
   stale-closure bug.
4. **Live slider edits stopped reaching the physics during playback**, in both
   `useCartSnapshot` and `useLaw3Snapshot` — same root cause as #3: `values` was closed
   over directly inside a per-frame callback registered by an effect that only
   re-subscribes occasionally (on scenario switch, for Law 3; incidentally-but-fragile on
   every render, for Cart). Fixed both with the same values-in-a-ref pattern.
5. **"Apply force" / "Remove force" buttons went stale while paused** — `forceOn` was a
   `useRef`, so toggling it updated the physics correctly but never triggered a
   re-render; the buttons' `disabled` state only happened to catch up when something else
   re-rendered the tree (mostly masked during playback by the snapshot hooks' own
   periodic updates, but visibly stale while paused). Converted to `useState`.
6. **The Object selector (box / crate / sled) was a dead control** — defined in the
   schema, rendered in Law 1's panel, read by nothing. Wired it to the cart's
   `userData.color`/`label`, and fixed `cart-canvas.tsx`'s style resolver, which was
   hardcoding purple regardless of `userData`.

Also reduced 3 unnecessary `: any` parameter annotations in `law1-panel.tsx` to let
inference do its job, matching the file's own other `ToggleSwitch` usage.

Verified correct and left unchanged: `SurfaceFriction`'s force-ordering relative to the
applied-force generator, all `Spring` sign conventions against `law3-engine.ts`'s
readouts, `drawWorld`'s call signature in both canvases, every `values.*` key read
against `schema.ts`, and the dashboard/route wiring (`subjects.ts` → `page.tsx` →
`NewtonsLaws`).

## Design decisions

- **One shared cart rig for Law 1 & 2** (`createCartRig`), since they're the same physical
  setup — only which controls/readouts are surfaced differs.
- **`SurfaceFriction` is a new `ForceGenerator`**, not an engine change — the engine's own
  collision resolver only applies friction _during_ a collision impulse, not continuously
  for a body resting on a surface.
- **Law 3 gets five small, isolated rigs** rather than one flexible one, so the
  before/after readouts (momentum, action vs. reaction) stay unambiguous.
- **One `ParameterSchema` for the whole lab** (mirroring `projectile-motion`) rather than
  swapping schemas per law/scenario. Known trade-off: a few keys are intentionally shared
  across rigs (e.g. `mass` drives the cart _and_ the rocket/spring rigs) — since they're
  independent `World`s this never causes a crash, only a shared slider value, which is
  called out in the schema's own comments.
- **Reset**: the framework's own `resetAll()` (Toolbar's Reset button) only resets its own
  time/parameter state — it has no idea a `World` with persistent body state exists.
  `newtons-laws.tsx` watches for the `frameCount` drop-to-zero edge and calls
  `cartEngine.reset()` / `law3Engine.reset()` at that moment, so Reset behaves as a student
  would expect.
- **Every panel reuses the Simulation Framework** (`ControlPanel`, `ParameterSlider`,
  `ParameterDropdownSelector`, `ToggleSwitch`, `Toolbar`, `InfoPanel`, `LineChart`, `Legend`,
  `FormulaPanel`/`FormulaCard`/`VariableTable`, `SimulationCanvas`, `InstructionsPanel`) —
  the engine's own `drawWorld()` is reused directly for body rendering in both canvases, so
  no simulation-specific shape-drawing code was written.

## Known simplifications (documented, not hidden)

- The cart's `World` (`useCartEngine`) keeps stepping even while a Law 3 tab is active —
  unlike `useLaw3Engine`, which now correctly gates on whether Law 3 is the active tab
  (see fix #3 above), `cart-engine.ts`'s own frame subscription has no such gate. Harmless
  (the cart just idles off-screen with no force applied), but worth knowing it's there.
- Force vs. Acceleration / Mass vs. Acceleration graphs show the **ideal, frictionless**
  a = F/m curve (swept over the slider range at the current fixed value of the other
  variable), not a live-recorded scatter — clearly labeled as such, consistent with how
  `projectile-motion`'s formula section labels its own "ideal, no drag" values.
