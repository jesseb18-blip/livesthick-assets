# Tux Toboggan Lab

A ray-traced, physically simulated walkthrough of the ENGG*2100 "Tux Toboggan" Kinder-egg penguin (Concept 1: pull-back charge, head-nod trigger) being assembled, charged and run past the 2.5 m line.

- `standalone.html`: open it directly in Chrome, Edge, Firefox or Safari. It needs WebGL2 and uses no external libraries. Google Fonts are optional; the page falls back to system fonts.
- `index.html`: the same page without the `<html>/<head>/<body>` wrapper. This is the version published as a claude.ai artifact. Run `node tools/make-standalone.mjs` to rebuild `standalone.html` after editing it.
- `tools/capture.mjs`: headless screenshot tool, used by the critic agents.

## Using it

| Action | How |
| --- | --- |
| Play / freeze | ▶ button or Space |
| Scrub to any moment | Timeline bar (phases are colour-coded), or ← / → to step one frame at 30 fps |
| Orbit / pan / zoom | Drag / right-drag or Shift-drag / mouse wheel or pinch. The camera starts from the director's current shot |
| Jump to a moment | Kit · Assemble · Charge · Trigger · Launch · Finish buttons in the panel |
| Slow motion | Speed menu (0.05× to 1×) |

While the animation plays, the scene is drawn by a realtime ray marcher. It has soft shadows from the window, the ceiling panels and the sun, SDF ambient occlusion, and reflections of the toy in the floor.

When you freeze it, a progressive path tracer takes over. It adds global illumination from the room and the sunlit floor patch, depth of field from a full-frame lens model with autofocus on the toy's body, and true motion blur from the shutter. Each sample is taken at a jittered time inside the shutter interval. A tracking camera moves within the shutter too, so the toy stays sharp while the background streaks. The sample counter in the top-right shows convergence. You can orbit around the frozen frame while it refines.

## Sliders

**Physics** (changes re-run the simulation and retime the animation): pull-back distance, steel ballast, rubber shear modulus, band cross-section and relaxed length, line-spool radius, O-ring grip, rolling resistance, rear ball-bearing friction, front wheel-bore friction, rubber hysteresis.

**Camera:** director (automatic shots) or manual, follow-the-toy, field of view, lens aperture, auto stop-down for close-ups, handheld drift.

**Render:** resolution scale, path-trace sample cap, light bounces, exposure, window, ceiling-panel and sun levels, shutter, FDM layer-line strength, cutaway, show hand, film grain.

The cutaway slices the shells and the near wheels. It shows the band, the line, the spool, the ratchet and pawl, the trigger rod, the freewheel hubs and the ballast.

## Mechanism

- **Wheels:** 20 mm rear wheels with nitrile O-ring tyres sit in wells in the white belly keel, so only about 3 mm of tyre shows under the belly.
- **Axle:** the wheels ride on a 2 mm steel axle supported by two MR52 ball bearings pressed into the keel walls.
- **Freewheel:** each rear hub has three flexure pawls on a 12-tooth ratchet ring fixed to the axle. The axle can drive the wheels, and the wheels can overrun the axle once the line has paid out.
- **Charge:** a rubber band anchored under the chin pulls a line wound on the axle. Pulling the toy back about 22 cm winds the line and stretches the band. A 12-tooth ratchet and pawl hold the charge.
- **Trigger:** tapping the head forward rotates it 15° about the neck ball. A lever inside the head pulls the trigger rod, which swings the pawl clear of the teeth.

## Physics model (run phase, SI units, 10 µs explicit integration)

- **Band:** natural-rubber loop, neo-Hookean force `F = G·A·(λ − λ⁻²)` and stored energy `E = G·A·L₀·(λ²/2 + 1/λ − 3/2)`. It carries a 1.10 preload stretch and hysteresis loss on unloading. Geometry caps the stretch: the anchor sits 6.2 cm from the knot's closest approach to the spool.
- **Charge:** line winds on the 2 mm axle (1.2 mm effective radius) through 20 mm wheels. Pull past the fully wound point and the wheels skid. When the finger lifts, the axle creeps forward to the next ratchet step, and the creep is subtracted from the stored charge.
- **Mass and centre of mass:** summed from a per-part mass table (`MASS` in `index.html`) plus the steel ballast slider. The rear normal load includes load transfer from acceleration.
- **Drive:** traction follows a Stribeck-type O-ring friction curve with slip between the tyre and the floor. The rear ball bearings carry the resultant of the wheel load and the line tension.
- **Coast:** once the line is unwound, the freewheel hubs overrun the stopped axle. Losses during the coast are rolling resistance, plain PLA bores on the front axle, bearing friction, freewheel pawl drag and air drag.

### Defaults

| Quantity | Value |
| --- | --- |
| Toy mass | 37.8 g |
| Printed PLA share by mass | 80 % (rule: at least 75 %) |
| Centre of mass | 1.77 cm ahead of the rear axle, 67 % of weight on the drive wheels |
| Stored energy | 30.8 mJ at λ 1.91 |
| Band fully wound after | 22.3 cm of pull |
| Ratchet creep after the finger lifts | 3.7 mm |
| Peak speed | 1.11 m/s |
| Run | 2.79 m in 4.98 s |

### Sensitivity

| Change | Run |
| --- | --- |
| Plain PLA rear bores instead of ball bearings | 1.63 m |
| Front bore μ 0.30 | 2.40 m |
| Rolling resistance Crr 0.025 | 2.00 m |
| O-ring grip μ 0.65 | 2.78 m |
| O-ring grip μ 0.60 | wheelspin at launch, 0.67 m |

## Egg size

All parts are sized to come out of the course's Kinder Maxi capsule (about 75 mm × 100 mm, per the supplied `Egg_*_Thickened_F25` CAD). The assembled toy is about 163 mm from tail tip to beak, so it is larger than the egg, as the rules require.
