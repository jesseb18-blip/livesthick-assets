# Penguin Kinder-egg toy: 2D concept sketches

There are three 11×17 in landscape concept sheets. Each sheet covers the **body**, the **energy charge** and the **trigger** for a penguin Kinder-egg toy:
- Concept 1 is a running toy that must travel at least 2.5 m.
- Concept 2 is a walker that must keep walking for at least 5 s.
- Concept 3 is a simple mechanism sketch of a spring toy that swims in place for at least 5 s.

The sheets are drawn in a hand-sketch style with rough.js and annotated with text and arrows.

| File | Concept |
| --- | --- |
| `Concept1_TuxToboggan.png` / `.pdf` | **Tux Toboggan**: a lying, belly-sliding penguin. Pull back to charge. Tapping the beak nods the head, which pulls a cord that lifts the pawl. |
| `Concept2_EmperorWaddler.png` / `.pdf` | **Emperor Waddler**: an upright penguin that walks on two flat feet, with its stiff tail on a roller as a prop. Turn the head to wind a twisted-rubber motor. A flipper crank lifts a lock rod out of the crown gear. Cranks shuffle the feet (they never lift), and a grease damper paces the walk. |
| `Concept3_ClownfishHover.png` / `.pdf` | **Clownfish Hover**: a clownfish on an anemone stand. A printed spiral spring, wound with a nose key, turns a barrel with 21 crown teeth. The tail section hangs on a verge escapement (the clock part), so each tooth lets through one tail wag. A pectoral-fin lever is the trigger. |

The name, signature and date lines in each title block are left blank to be filled in by hand.

## Rebuilding

```
node tools/render.mjs 1   # or 2 or 3; writes src/<name>.html, <name>.png (3400×2200) and <name>.pdf (17×11 in)
```

`src/sketchlib.js` holds the drawing helpers (leaders, dimensions, boxes, gears and ratchets, bands, the title block). `src/concept1.js`, `src/concept2.js` and `src/concept3.js` draw the three sheets. Rendering uses the preinstalled Playwright Chromium.

## Editable version (iPad and other vector apps)

`iPad_edit_kit.zip` contains the three sheets as editable SVGs, the four fonts they use and `HOW-TO-EDIT-ON-IPAD.txt`; the same files are also in `editable/`. Open the SVGs in a vector app such as Affinity Designer, Illustrator or Linearity Curve. Every stroke and label is a separate object, and the text is live.

To rebuild them, install `fonttools` and `brotli` with pip, then run:

```
python3 tools/make-fonts.py   # TTFs + licences in editable/fonts, src/font-coverage.json
node tools/render.mjs         # also writes src/<name>.html, which the export reads
node tools/export-svg.mjs     # editable/<name>.svg
```

The export makes three changes so the SVGs work outside a browser:
- each label is anchored at its measured left edge;
- white text halos become a separate layer underneath the text;
- symbols the handwriting fonts lack (① → ≈ ≥ ✓ λ …) are set in DejaVu Sans, because many vector apps don't substitute fonts character by character.

## Where the numbers come from

- **Concept 1:** taken from the time-step simulation in `../penguin-sim/index.html` (`simulate()`), with front-roller MR52 bearings, two #10 bands on a 2:1 sheave and a 43 cm pull. Results:
  - run 7.7 m;
  - 4.9 m on a dusty floor (rolling-resistance coefficient Crr 0.025);
  - 3.6 m on a dusty floor with only a 35 cm pull;
  - no wheelspin above μ 0.63.
- **Concept 2 (walker):** a cadence model in `tools/walker-model.mjs` (`node tools/walker-model.mjs` prints the base case and the worst cases).
  - Motor: torque falls in proportion to the turns left, with 400 J/kg for office rubber (6 strands × 60 mm of #16 band, 28 turns, about 200 mJ).
  - Drive: gear efficiency 0.7, crown 24 T to pinion 12 T, so 2 crank turns per motor turn.
  - Walking load: about 0.22 N·mm average and 0.35 N·mm peak at the crank. This covers the forward-skidding foot, the tray rubbing on the feet and lifting the body for the waddle.
  - Damper: viscous, c = 0.054 N·mm·s, from 30 Pa·s silicone grease with a 1.1 mm gap on each face of a Ø10 rotor.
  - Pace: cadence = (crank torque − load) ÷ 2πc.

  Results:
  - 1.7 strides/s at the start and 1.4 at 5 s, so about 8 strides (7 cm) in the first 5 s;
  - at least 1 stride/s for 13 s and at least 0.5 stride/s for 29 s, about 40 strides (0.36 m) in all;
  - with 250 J/kg, double the load, or double or half the damping, it still walks at least 0.5 stride/s for 18 s or more;
  - with weak rubber and a rough floor together it needs 40 turns to start.

  The 400 J/kg figure and the grease viscosity are assumptions, and a torque-versus-turns test and a damper spin-down test should confirm them.

- **Concept 3 (clownfish):** hand estimates, not a simulation.
  - Spring: a PETG strip 0.45 × 5 mm, about 10 coils (about 360 mm long) in a Ø22 barrel. Wound 3 turns it gives about 4 N·mm and 40 mJ, at about 25 MPa peak stress.
  - Escapement: 21 crown teeth give 21 wags per barrel turn, so about 63 wags, and each wag releases about 0.6 mJ.
  - Wag rate: about 4 per second, from a bang-bang verge model (period ≈ 4·√(2Iθ/τ) with the tail section's inertia I ≈ 3×10⁻⁶ kg·m², a ±20° swing and about 0.6 N·mm at the staff). That gives about 15 s of swimming, and 7.5 s even if it wags twice as fast. The tail's weight sets the rate, so a prototype should be tuned by making the tail heavier or lighter.

## Review history

Each round, a separate "brutal engineering professor" critic agent marked both sheets out of 10. Scale: 0–5 fail, 5–8.5 needs review, above 8.5 pass. The loop ran its limit of 4 rounds without either sheet passing.

| Round | Sheet 1 | Sheet 2 | Main fixes after the round |
| --- | --- | --- | --- |
| 1 | 6.1 | 5.7 | **Sheet 1:** ratchet teeth handed the wrong way, no pawl spring, energy arithmetic. **Sheet 2:** drove backwards, gear collision, trigger could not stay armed. |
| 2 | 6.3 | 6.8 | **Sheet 1:** trigger re-engaged mid-run (now a two-notch head detent), wrong band size, egg packing. **Sheet 2:** redesigned to stand on heel drive wheels plus a tail roller, so the countershaft is gone. |
| 3 | 7.5 | 7.0 | **Sheet 1:** run numbers now from the sim, payout and charge stops, egg clearance. **Sheet 2:** trigger press could tip it, thrust friction, waddle hop loss. |
| 4 | 8.1 | 7.7 | **Sheet 1:** pull-only trigger cord (a rigid rod made the head chatter), tap the beak tip with a moment check, 2:1 sheave with 2 bands for margin, axle section with keel skirts. **Sheet 2:** hook-shaft with MR52 thrust bearing, steady the head when firing, D-shaft keying, egg layout at true 1:4. |

The round-4 fixes are in the files but were not re-scored. After the review, Concept 2 was redesigned from heel wheels to walking feet (the request was "on feet, not wheels, working for at least 5 s"); the trigger and the head-wind motor carried over. The walker version has not been through the critic.

Known weak points to check on a prototype:
- **Concept 1:**
  - its egg packing has 1.7 mm of clearance, so confirm it in CAD;
  - top speed is about 1.6 m/s at full pull.
- **Concept 2:**
  - the claw fins' grip-versus-slide ratio (assumed μ 0.8 back, 0.15 forward) needs testing on the actual floor; TPU fins are the fallback if thin PLA fins are too stiff;
  - the damper grease viscosity sets the pace: change the gap or the grease grade if it walks too fast or too slow;
  - the rubber energy figure needs measuring.
