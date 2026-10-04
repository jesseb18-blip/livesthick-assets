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
| Orbit / pan / zoom | Drag / right-drag or Shift-drag / mouse wheel or pinch |
| Jump to a moment | Kit · Assemble · Charge · Trigger · Launch · Finish buttons in the panel |
| Slow motion | Speed menu (0.05× to 1×) |

While the animation plays, the scene is drawn by a realtime ray marcher: soft shadows from the window and ceiling panels, SDF ambient occlusion, and reflections of the toy in the floor. When you freeze it, a progressive path tracer takes over. It adds global illumination from the room, depth of field from the lens-aperture slider, and true motion blur from the shutter slider (each sample is taken at a jittered time inside the shutter interval). The sample counter in the top-right shows convergence. You can orbit around the frozen frame while it refines.

## Sliders

**Physics** (changes re-run the simulation and retime the animation): pull-back distance, toy mass, rubber shear modulus, band cross-section and relaxed length, line-spool radius, O-ring grip, rolling resistance, axle-bushing friction, rubber hysteresis.

**Camera:** director (automatic shots) or manual, follow-the-toy, field of view, lens aperture.

**Render:** resolution scale, path-trace sample cap, light bounces, exposure, window and ceiling-panel light levels, shutter, FDM layer-line strength, cutaway (slices the shells to show the band, line, spool, ratchet, pawl and trigger rod), show hand, film grain.

## Physics model (run phase, SI units, 10 µs explicit integration)

- **Band:** natural-rubber loop, neo-Hookean force `F = G·A·(λ − λ⁻²)` and stored energy `E = G·A·L₀·(λ²/2 + 1/λ − 3/2)`. It carries a 1.12 preload stretch and hysteresis loss on unloading. Geometry caps the stretch: the anchor sits 8.5 cm from the spool.
- **Charge:** pulling the toy back winds line onto the 3 mm rear axle (effective radius 1.6 mm) through 28 mm wheels. Pull past the fully wound point and the wheels skid.
- **Drive:** line tension times spool radius drives the axle. Traction follows a Stribeck-type O-ring friction curve with slip between the tyre and the floor. Rear normal load includes load transfer from acceleration. The PLA bushings carry the resultant of the wheel load and the line tension, which gives bushing friction torque.
- **Coast:** once the line is unwound, freewheel hubs let the wheels overrun the stopped axle. Losses during the coast are rolling resistance, bushing friction at both axles, pawl drag and air drag.
- **Defaults** (48 g, 38 cm pull-back, μ 0.85, Crr 0.015, bushing μ 0.20) store about 68 mJ. The toy peaks near 1.3 m/s and travels about 2.8 m.

All parts are sized to come out of the course's Kinder Maxi capsule (about 75 mm × 100 mm, per the supplied `Egg_*_Thickened_F25` CAD). The assembled toy is about 163 mm from tail tip to beak, so it is larger than the egg, as the rules require.
