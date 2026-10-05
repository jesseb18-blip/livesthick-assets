# Penguin Kinder-egg toy: 2D concept sketches

There are two 11×17 in landscape concept sheets. Each sheet covers the **body**, the **energy charge** and the **trigger** for a penguin running toy that must travel at least 2.5 m. They are drawn in a hand-sketch style with rough.js and annotated with text and arrows.

| File | Concept |
| --- | --- |
| `Concept1_TuxToboggan.png` / `.pdf` | **Tux Toboggan**: a lying, belly-sliding penguin. Pull back to charge. Tapping the beak nods the head, which pulls a cord that lifts the pawl. |
| `Concept2_EmperorWaddler.png` / `.pdf` | **Emperor Waddler**: an upright penguin that stands on its heels and tail. Turn the head to wind a twisted-rubber motor. A flipper crank lifts a lock rod out of the crown gear. |

The name, signature and date lines in each title block are left blank to be filled in by hand.

## Rebuilding

```
node tools/render.mjs 1   # or 2; writes src/<name>.html, <name>.png (3400×2200) and <name>.pdf (17×11 in)
```

`src/sketchlib.js` holds the drawing helpers (leaders, dimensions, boxes, gears and ratchets, bands, the title block). `src/concept1.js` and `src/concept2.js` draw the two sheets. Rendering uses the preinstalled Playwright Chromium.

## Editable version (iPad and other vector apps)

`iPad_edit_kit.zip` contains the two sheets as editable SVGs, the four fonts they use and `HOW-TO-EDIT-ON-IPAD.txt`; the same files are also in `editable/`. Open the SVGs in a vector app such as Affinity Designer, Illustrator or Linearity Curve. Every stroke and label is a separate object, and the text is live.

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
- **Concept 2:** a separate time-step model that assumes:
  - motor torque falls in proportion to the turns left;
  - 400 J/kg energy density for office rubber;
  - gear efficiency 0.72;
  - Crr 0.015;
  - a waddle hop loss above 0.55 m/s.

  It gives a 4.6 m run, and 3.1 m in the worst case (250 J/kg). The 400 J/kg figure is an assumption, and a torque-versus-turns test should confirm it.

## Review history

Each round, a separate "brutal engineering professor" critic agent marked both sheets out of 10. Scale: 0–5 fail, 5–8.5 needs review, above 8.5 pass. The loop ran its limit of 4 rounds without either sheet passing.

| Round | Sheet 1 | Sheet 2 | Main fixes after the round |
| --- | --- | --- | --- |
| 1 | 6.1 | 5.7 | **Sheet 1:** ratchet teeth handed the wrong way, no pawl spring, energy arithmetic. **Sheet 2:** drove backwards, gear collision, trigger could not stay armed. |
| 2 | 6.3 | 6.8 | **Sheet 1:** trigger re-engaged mid-run (now a two-notch head detent), wrong band size, egg packing. **Sheet 2:** redesigned to stand on heel drive wheels plus a tail roller, so the countershaft is gone. |
| 3 | 7.5 | 7.0 | **Sheet 1:** run numbers now from the sim, payout and charge stops, egg clearance. **Sheet 2:** trigger press could tip it, thrust friction, waddle hop loss. |
| 4 | 8.1 | 7.7 | **Sheet 1:** pull-only trigger cord (a rigid rod made the head chatter), tap the beak tip with a moment check, 2:1 sheave with 2 bands for margin, axle section with keel skirts. **Sheet 2:** hook-shaft with MR52 thrust bearing, steady the head when firing, D-shaft keying, egg layout at true 1:4. |

The round-4 fixes are in the files but were not re-scored.

Known weak points to check on a prototype:
- **Concept 1:**
  - its egg packing has 1.7 mm of clearance, so confirm it in CAD;
  - top speed is about 1.6 m/s at full pull.
- **Concept 2:**
  - the waddle shows only below about 0.55 m/s, at the start and over the last metre;
  - the rubber energy figure needs measuring.
