/* Concept 3 - "Clownfish Hover": a clownfish on an anemone stand that swims in place.
   Printed PETG spiral spring in a barrel -> 21 crown teeth on the barrel's back face -> verge escapement whose staff is
   the vertical joint pin of the tail section, so every tooth lets through one tail wag (the tail is the foliot).
   Toy coordinates in mm: x forward (nose), y up, z to the fish's right. Joint / verge staff at x = 1.5.
   Barrel Ø22 at x 6..16 on the body axis; nose key + arbor + ratchet along y = 0; stand post at x 7. */
'use strict';
const MECH = '#6a3fb0', MECH_L = '#cbb8ec', PINK = '#c2457e', PINK_L = '#f3c6dc';
const V = (x0, y0, s) => ({ X: (x) => x0 + x * s, Y: (y) => y0 - y * s, s });
const mo = (o = {}) => dashed(Object.assign({ stroke: MECH, strokeWidth: 1.5 }, o));
const deg = Math.PI / 180;
const FISH = { fill: C.orange, fillStyle: 'hachure', hachureGap: 3.2, hachureAngle: -35, fillWeight: 1.2, stroke: INK, strokeWidth: 2 };
const STRIPE = { fill: '#ffffff', fillStyle: 'solid', stroke: INK, strokeWidth: 2.2 };

SHEET_BORDER();
TXT(48, 62, 'CLOWNFISH HOVER – HOW IT WORKS', { font: 'PH', size: 26 });
TXT(48, 86, 'spring → crown wheel → verge → the tail wags in place · purple = mechanism', { size: 13, color: GREY });

/* ================= SIDE VIEW (cut-away, from the fish's right) ================= */
const s = V(440, 340, 5.5);
const P = (x, y) => [s.X(x), s.Y(y)];
TXT(48, 112, 'SIDE VIEW – cut away · from the fish’s right · scale 1.4 : 1', { size: 13, color: GREY });
// anemone stand: base, tentacles, keyed post
FLOOR(s.X(-40), s.X(46), s.Y(-50));
for (const x0 of [-19, -14, -9, -4, 1, 13, 18, 23, 28, 33]) {
  const h = 13 + ((x0 * 7) % 5 + 5) % 5;
  const pts = []; for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push(P(x0 + 1.6 * Math.sin(t * 5 + x0), -45 + h * t)); }
  CURVE(pts, { stroke: PINK, strokeWidth: 3.2, roughness: 0.6 });
  CIRC(...pts[8], 2.8 * s.s, { fill: PINK_L, fillStyle: 'solid', stroke: PINK, strokeWidth: 1.2 });
}
POLY([P(-22, -50), P(36, -50), P(36, -46.5), P(33, -45), P(-19, -45), P(-22, -46.5)], { fill: PINK_L, fillStyle: 'solid', stroke: PINK, strokeWidth: 1.8 });
RECT(s.X(4.6), s.Y(-17.5), 4.8 * s.s, 27.5 * s.s, { fill: PINK_L, fillStyle: 'solid', stroke: PINK, strokeWidth: 1.6 });
L(s.X(8.3), s.Y(-18), s.X(8.3), s.Y(-44), { stroke: PINK, strokeWidth: 1, strokeLineDash: [4, 3] });
// fins behind the body: dorsal (spiny + soft), anal, pelvic, tail
POLY([P(17, 17.5), P(15, 24), P(12, 21), P(9, 25), P(6, 22), P(3, 25.5), P(0, 22.5), P(-3, 24.5), P(-5, 19.5), P(-8, 26), P(-16, 28.5), P(-24, 25), P(-31, 14), P(-31, 11), P(-20, 16.5), P(-8, 19), P(6, 19.5)], FISH);
POLY([P(-14, -16.5), P(-18, -25), P(-26, -24), P(-32, -12), P(-31, -10.5), P(-20, -15)], FISH);
POLY([P(16, -16), P(12, -25), P(8, -25.5), P(9, -17.5)], FISH);
POLY([P(-37, 7.5), P(-46, 14), P(-56, 19), P(-63, 16), P(-66, 8), P(-66.5, 0), P(-66, -8), P(-63, -16), P(-56, -19), P(-46, -14), P(-37, -7.5)], FISH);
for (const a of [-14, -6, 2, 10]) L(...P(-40, a * 0.4), ...P(-63, a * 1.15), { stroke: '#9a4a06', strokeWidth: 1, roughness: 0.4 });
// body
POLY([P(38, -1), P(36, 5), P(30, 12), P(20, 17.5), P(6, 19.5), P(-8, 19), P(-20, 16.5), P(-31, 11), P(-38, 7), P(-38, -7), P(-31, -10.5), P(-20, -15), P(-6, -18), P(8, -18), P(20, -15), P(30, -10), P(36, -5), P(38, -2.5)], FISH);
// white bands, black edges (the middle band hides the joint)
POLY([P(23.5, 16), P(21.5, 6), P(21.3, -4), P(23, -13.4), P(27.5, -11.8), P(26, -3), P(26.2, 6), P(28.3, 13.1)], STRIPE);
POLY([P(-2, 19.2), P(-0.5, 8), P(-0.5, -6), P(-2.5, -17.6), P(3.5, -18), P(4.5, -6), P(4.5, 8), P(3, 19.6)], STRIPE);
POLY([P(-33, 10), P(-34, 0), P(-33.5, -9.6), P(-37.4, -7.3), P(-37.8, 0), P(-37.4, 7.3)], STRIPE);
// cut-away: ghost the head so the mechanism shows through
const win = POLY([P(-3, 17), P(6, 17.4), P(20, 15.2), P(29, 10), P(33, 4), P(33, -5), P(28, -9.3), P(20, -12.8), P(8, -15.8), P(-3, -15.8)], { fill: '#fdfcf8', fillStyle: 'solid', stroke: GREY, strokeWidth: 1, strokeLineDash: [5, 4] });
win.setAttribute('opacity', '0.86');
// mechanism: nose key + arbor + ratchet (one part), click, barrel with spiral spring and crown teeth
L(...P(6, 0), ...P(38.5, 0), { stroke: MECH, strokeWidth: 2.6 });
RECT(s.X(38.5), s.Y(4.5), 5.5 * s.s, 9 * s.s, { stroke: MECH, strokeWidth: 1.6, fill: MECH_L, fillStyle: 'solid' });
for (const x of [40, 41.5, 43]) L(...P(x, 4), ...P(x, -4), { stroke: MECH, strokeWidth: 1 });
RECT(s.X(21), s.Y(6), 2 * s.s, 12 * s.s, { stroke: MECH, strokeWidth: 1.5, fill: MECH_L, fillStyle: 'solid' });
CURVE([P(15.5, 14.6), P(18.5, 10.5), P(21.6, 6.4)], { stroke: INK, strokeWidth: 1.8 });
RECT(s.X(6), s.Y(11), 10 * s.s, 22 * s.s, { stroke: MECH, strokeWidth: 1.8, fill: '#efe8fb', fillStyle: 'solid' });
for (let i = 0; i <= 11; i++) { const y = -8.8 + i * 1.6; L(...P(8, y), ...P(14, y), { stroke: MECH, strokeWidth: 1, roughness: 0.3 }); }
const zz = []; for (let i = 0; i <= 20; i++) zz.push(P(i % 2 ? 3.7 : 6, -10.5 + i * 1.05)); PL(zz, { stroke: MECH, strokeWidth: 1.4, roughness: 0.3 });
// verge staff = joint pin of the tail section, with the two pallets (top solid, bottom angled away)
L(...P(1.5, -16), ...P(1.5, 16), { stroke: MECH, strokeWidth: 3.2 });
for (const y of [-16, 16]) CIRC(...P(1.5, y), 2.2 * s.s, { fill: MECH, fillStyle: 'solid', stroke: MECH, strokeWidth: 0.8 });
POLY([P(1.5, 7.6), P(4.8, 8.4), P(4.8, 10.2), P(1.5, 9.8)], { stroke: MECH, strokeWidth: 1.4, fill: MECH, fillStyle: 'solid' });
POLY([P(1.5, -7.6), P(4.8, -8.4), P(4.8, -10.2), P(1.5, -9.8)], mo({ fill: MECH_L, fillStyle: 'solid' }));
// trigger: pectoral fin lever; inner finger sits in a notch under the barrel (fin UP = locked)
const piv = [21, -13], fing = [11, -9.4];
RECT(s.X(10.3), s.Y(-10.9), 1.4 * s.s, 1.5 * s.s, { stroke: MECH, strokeWidth: 1, fill: '#fdfcf8', fillStyle: 'solid' });
L(...P(...piv), ...P(...fing), mo({ strokeWidth: 2.6, strokeLineDash: [7, 3] }));
RECT(s.X(4.5), s.Y(-12), 5 * s.s, 6 * s.s, dashed({ stroke: PINK, strokeWidth: 1.2 }));
const fa = 200 * deg;
POLY(ellPts(s.X(piv[0] + 5.6 * Math.cos(fa)), s.Y(piv[1] + 5.6 * Math.sin(fa)), 6 * s.s, 2.5 * s.s, -200), { fill: C.orange, fillStyle: 'solid', stroke: INK, strokeWidth: 1.6 });
CIRC(...P(...piv), 2.4 * s.s, { fill: MECH, fillStyle: 'solid', stroke: MECH });
ARC_ARROW(s.X(piv[0]), s.Y(piv[1]), 14 * s.s, -207 * deg, -240 * deg, { stroke: RED, strokeWidth: 2.4, head: 10 });
// eye + mouth on top
CIRC(...P(32, 6), 5.6 * s.s, { fill: '#111', fillStyle: 'solid', stroke: INK, strokeWidth: 1.2 });
CIRC(...P(32.9, 7), 1.4 * s.s, { fill: '#fff', fillStyle: 'solid', stroke: 'none' });
CURVE([P(36.2, -3.6), P(37.4, -2.8), P(38, -1.6)], { strokeWidth: 1.4 });
ARC_ARROW(s.X(41.2), s.Y(0), 8 * s.s, -2.3, -0.9, { stroke: RED, strokeWidth: 2.4, head: 10 });

// callouts
CALL(...P(-36, 13), 60, 150, 'TAIL SECTION = rear body\n+ tail + verge: ONE part', { start: true, size: 13.5 });
CALL(...P(1.5, 13.5), 286, 150, 'VERGE = the joint pin\n(under the white band),\nwith 2 pallets', { start: true, size: 13.5 });
CALL(...P(5, 3), 486, 150, 'CROWN TEETH (21) on\nthe barrel’s back face', { start: true, size: 13.5 });
CALL(...P(13, 5.5), 712, 228, 'SPIRAL SPRING (PETG)\ninside the barrel', { start: true, size: 13.5 });
CALL(...P(43.5, 4.5), 712, 296, 'NOSE KEY: wind\n3 turns ↻', { start: true, size: 13.5, color: RED });
CALL(...P(22, 6), 712, 360, 'RATCHET + CLICK\nhold the wind', { start: true, size: 13.5 });
CALL(...P(13, -18), 712, 436, 'PECTORAL FIN =\nTRIGGER. Up: its\nfinger sits in a\nbarrel notch.\nPush DOWN → swims', { start: true, size: 13.5 });
CALL(...P(9.4, -30), 712, 548, 'ANEMONE STAND:\nD-shaped post, so\nthe head can’t twist', { start: true, size: 13.5, lc: PINK });
TXT(60, 506, '(the tail wags in and\nout of the page –\nsee the top view)', { size: 13, color: GREY });
DIM(s.X(-66.5), s.Y(-50), s.X(43.5), s.Y(-50), '110 long', 34);
DIM(s.X(46), s.Y(-50), s.X(46), s.Y(28.5), '79 tall', 0);

/* ================= TOP VIEW: the tail section swings on the verge pin ================= */
BOX(930, 40, 730, 290, 'TOP VIEW – THE TAIL WAGS ±20°');
{
  const t = V(1330, 195, 4.4), T = (x, z) => [t.X(x), t.Y(-z)];   // page down = fish's right
  const w = (x) => 13.5 * Math.sqrt(Math.max(0, 1 - ((x + 1) / 39) ** 2));
  const rot = (p, a) => { const dx = p[0] - 1.5, c = Math.cos(a), sn = Math.sin(a); return [1.5 + dx * c - p[1] * sn, dx * sn + p[1] * c]; };
  const rear = []; for (let x = 1.5; x >= -38; x -= 2.5) rear.push([x, w(x)]);
  rear.push([-38, 1.3], [-65.8, 0.8], [-66.8, 0], [-65.8, -0.8], [-38, -1.3]);
  for (let x = -38; x <= 1.5; x += 2.5) rear.push([x, -w(x)]);
  rear.push([1.5, -w(1.5)], [3.2, 0]);
  const rearAt = (a) => rear.map((p) => T(...rot(p, a)));
  for (const a of [20, -20]) POLY(rearAt(a * deg), { stroke: GREY, strokeWidth: 1.2, strokeLineDash: [6, 4] });
  POLY(rearAt(0), FISH);
  POLY([T(-0.5, 12.5), T(1.5, 13), T(1.5, -13), T(-0.5, -12.5)], STRIPE);
  POLY([T(-33.5, 4.6), T(-37.5, 4.1), T(-37.5, -4.1), T(-33.5, -4.6)], STRIPE);
  L(...T(-31, 0), ...T(0, 0), { stroke: INK, strokeWidth: 2.4 });
  // head (fixed), pectoral fins, nose key
  const head = []; for (let x = 1.5; x <= 38; x += 2) head.push(T(x, w(x))); head.push(T(38, 0)); for (let x = 37.5; x >= 1.5; x -= 2) head.push(T(x, -w(x)));
  for (const sg of [1, -1]) POLY([T(22, sg * 12), T(13, sg * 21), T(10, sg * 20), T(16, sg * 12.5)], FISH);
  POLY(head, FISH);
  POLY([T(1.5, 13), T(4.5, 12.9), T(4.5, -12.9), T(1.5, -13)], STRIPE);
  POLY([T(21.5, 11.5), T(27, 10.4), T(27, -10.4), T(21.5, -11.5)], STRIPE);
  L(...T(2, 0), ...T(17, 0), { stroke: INK, strokeWidth: 2.4 });
  RECT(t.X(38.5), t.Y(4.5), 5.5 * t.s, 9 * t.s, { stroke: MECH, strokeWidth: 1.4, fill: MECH_L, fillStyle: 'solid' });
  for (const sg of [1, -1]) CIRC(...T(31, sg * 6.2), 3.4 * t.s, { fill: '#111', fillStyle: 'solid', strokeWidth: 0.8 });
  RECT(t.X(6), t.Y(11), 10 * t.s, 22 * t.s, mo());
  CIRC(...T(7, 0), 4.8 * t.s, dashed({ stroke: PINK, strokeWidth: 1.2 }));
  CIRC(...T(1.5, 0), 2.6 * t.s, { fill: MECH, fillStyle: 'solid', stroke: MECH });
  const R = 68.3 * t.s;
  ARC_ARROW(t.X(1.5), t.Y(0), R, Math.PI + 0.02, Math.PI + 0.33, { stroke: C.green, strokeWidth: 2.2, head: 10 });
  ARC_ARROW(t.X(1.5), t.Y(0), R, Math.PI - 0.02, Math.PI - 0.33, { stroke: C.green, strokeWidth: 2.2, head: 10 });
  TXT(t.X(-66) - 64, t.Y(0) + 6, '±20°', { size: 16, color: C.green });
  CALL(...T(1.5, 0), 1035, 312, 'tail section swings on the verge pin', { start: true, size: 12.5 });
  CALL(...T(30, -9), 1450, 290, 'head stays still\non the stand', { start: true, size: 12.5 });
  CALL(...T(14, 19), 1450, 110, 'trigger fin\n(fish’s right)', { start: true, size: 12.5 });
  TXT(1500, 160, 'seen from above', { size: 12, color: GREY });
}

/* ================= THE TRICK: verge escapement ================= */
BOX(930, 340, 730, 432, 'THE TRICK – A VERGE ESCAPEMENT (as in the first clocks)');
{
  // (a) spring barrel, seen from the nose
  const bx = 1045, by = 538, k = 7.4, R = 12.8 * k;
  CIRC(bx, by, 2 * 11 * k, { stroke: MECH, strokeWidth: 2.2, fill: '#f3eefc', fillStyle: 'solid' });
  const sp = []; for (let i = 0; i <= 200; i++) { const a = i / 200 * Math.PI * 2 * 6, r = 2 + 7.2 * i / 200; sp.push([bx + r * k * Math.cos(a), by + r * k * Math.sin(a)]); }
  CURVE(sp, { stroke: MECH, strokeWidth: 1.6, roughness: 0.4 });
  CIRC(bx, by, 3.2 * k, { fill: MECH, fillStyle: 'solid', stroke: MECH });
  RECT(bx + 8.6 * k, by - 6, 10, 12, { fill: MECH, fillStyle: 'solid', stroke: MECH });
  ARC_ARROW(bx, by, R, -2.45, -0.7, { stroke: RED, strokeWidth: 2.2, head: 9 });
  ARC_ARROW(bx, by, R, 0.7, 2.45, { stroke: C.green, strokeWidth: 2.2, head: 9 });
  TXT(bx, by - R - 12, 'wind ↻ (nose key)', { size: 12.5, color: RED, anchor: 'middle' });
  TXT(bx, by + R + 22, 'the spring pulls the barrel ↻,\nbut only one tooth per wag', { size: 12, color: C.green, anchor: 'middle' });
  TXT(944, 400, 'a  SPIRAL SPRING + BARREL', { font: 'PH', size: 15 });

  // (b),(c) verge seen from above: teeth rows, staff, two pallets, tail
  function verge(cx, cy, psi, upper) {
    const S = 15, Q = (x, y) => [cx + x * S, cy + y * S];
    const yb = -5.1, yt = -2.7;
    for (let i = -2; i <= 1; i++) {      // top teeth (solid) move right; bottom teeth (dashed) move left, half a pitch apart
      const x0 = i * 3; PL([Q(x0, yb), Q(x0 + 2.6, yt), Q(x0 + 2.6, yb)], { stroke: MECH, strokeWidth: 1.6, roughness: 0.3 });
      const x1 = i * 3 + 1.5; PL([Q(x1 + 3, yb), Q(x1 + 0.4, yt), Q(x1 + 0.4, yb)], mo({ stroke: '#a58bd6', strokeWidth: 1.2, strokeLineDash: [4, 3] }));
    }
    L(...Q(-6.5, yb), ...Q(6.5, yb), { stroke: MECH, strokeWidth: 1.4 });
    ARROW(...Q(3.4, -5.9), ...Q(6.2, -5.9), { stroke: MECH, strokeWidth: 1.6, head: 7 });
    ARROW(...Q(-3.4, -5.9), ...Q(-6.2, -5.9), mo({ strokeWidth: 1.4, head: 7, strokeLineDash: [4, 3] }));
    // tail (schematic, shortened), staff, pallets 95° apart
    const ta = (90 + psi) * deg, pa = ta - Math.PI / 2;
    const TP = (r, h) => [cx + S * (r * Math.cos(ta) + h * Math.cos(pa)), cy + S * (r * Math.sin(ta) + h * Math.sin(pa))];
    POLY([TP(0.6, 1.6), TP(5, 1.1), TP(5.6, 0.4), TP(7.6, 1.2), TP(7.8, 0), TP(7.6, -1.2), TP(5.6, -0.4), TP(5, -1.1), TP(0.6, -1.6)], FISH);
    CIRC(cx, cy, 2.4 * S, { fill: MECH_L, fillStyle: 'solid', stroke: MECH, strokeWidth: 1.5 });
    const up = (-42.5 + psi) * deg, lo = (-137.5 + psi) * deg;
    const tipU = Q(3.6 * Math.cos(up), 3.6 * Math.sin(up)), tipL = Q(3.6 * Math.cos(lo), 3.6 * Math.sin(lo));
    L(cx, cy, ...tipU, { stroke: MECH, strokeWidth: 5, roughness: 0.3 });
    L(cx, cy, ...tipL, mo({ strokeWidth: 3.6, strokeLineDash: [6, 3] }));
    const tip = upper ? tipU : tipL, sg = upper ? -1 : 1;
    ARROW(tip[0] + sg * 34, tip[1] + 2, tip[0] + sg * 6, tip[1] + 2, { stroke: RED, strokeWidth: 2.4, head: 8 });
    const a0 = ta, a1 = ta + (upper ? 0.42 : -0.42);
    ARC_ARROW(cx, cy, 8.4 * S, a0, a1, { stroke: C.green, strokeWidth: 2.4, head: 9 });
    TXT(cx + (upper ? -86 : 30), cy + 8.9 * S + 4, upper ? 'tail → left' : 'tail → right', { size: 13, color: C.green });
  }
  TXT(1170, 400, 'b  TOOTH PUSHES THE UPPER PALLET', { font: 'PH', size: 15 });
  verge(1285, 505, -15, true);
  TXT(1420, 400, 'c  …THEN THE LOWER ONE', { font: 'PH', size: 15 });
  verge(1525, 505, 15, false);
  TXT(1170, 668, 'from above · solid: upper pallet, top teeth (→) · dashed: lower, bottom teeth (←)', { size: 11.5, color: GREY });
  L(1160, 410, 1160, 655, { stroke: GREY, strokeWidth: 0.8, strokeLineDash: [4, 4] });
}
TXT(944, 692, '①  Winding the nose key coils the spring; the click stops it running back.\n②  The spring turns the barrel, but its 21 crown teeth have to get past the two pallets.\n③  A top tooth shoves the upper pallet → the tail swings; that swings the lower pallet\n      into a bottom tooth → it shoves back → the tail swings back (b ↔ c).\n④  One tooth per wag: the spring can only let go a little at a time, so it keeps going.', { size: 12.8, lh: 15.4 });

/* ================= bottom boxes ================= */
BOX(40, 785, 330, 285, 'HOW IT PLAYS');
TXT(54, 838, '①  Push the fish onto its anemone\n      stand (D-shaped post, click).', { size: 13.5, lh: 18 });
TXT(54, 890, '②  Fin UP (locked). Turn the nose\n      key 3 turns – click-click…', { size: 13.5, lh: 18 });
TXT(54, 942, '③  Push the pectoral fin DOWN →\n      the tail wags ≈ 4× a second\n      for ≈ 15 s, nose still.', { size: 13.5, lh: 18 });
TXT(54, 1012, '④  Fin back UP stops it any time.', { size: 13.5, lh: 18 });

BOX(380, 785, 360, 285, 'WHY IT LASTS ≥ 5 s');
BULLETS(394, 838, [
  'Crown wheel 21 teeth = 21 wags\nper barrel turn',
  'Spring wound 3 turns → ≈ 63 wags',
  'Wag rate ≈ 4/s (the tail’s weight\nsets it) → swims ≈ 15 s',
  'Even twice as fast → 7.5 s ✓',
  'PETG strip 0.45 × 5 mm, 10 coils:\n≈ 4 N·mm wound, 25 MPa (safe);\n≈ 40 mJ stored, ≈ 0.6 mJ per wag',
  'Too fast? A heavier tail wags slower\nand swims longer',
], { size: 13, gap: 4 });

BOX(750, 785, 370, 285, 'PARTS (8, ALL PRINTED) + RULES');
TXT(764, 836, '1 head, left     2 head, right (snap together)\n3 nose key + arbor + ratchet\n4 spiral spring (PETG)\n5 barrel with 21 crown teeth\n6 tail section = body + tail + verge\n7 pectoral-fin trigger     8 anemone stand', { size: 12.8, lh: 16 });
BULLETS(764, 948, [
  '100 % printed; every part fits the egg',
  'Built: 110 long, 79 tall → bigger than the egg',
  'Trigger = fin lever, no removable pin',
  'Opening the head lets the spring go',
  'Snap fits: no glue, no tools',
], { size: 12.8, ticks: true, gap: 2 });

BOX(1130, 785, 540, 108, 'BIOMIMICRY');
TXT(1144, 838, 'Clownfish don’t cruise: they hover beside their anemone,\nsculling with quick tail beats. This one does the same on its\nanemone stand, and its white bands hide the moving joint.', { size: 13.2, lh: 17 });

TITLE_BLOCK(1130, 903, 540, 167, {
  course: 'ENGG*2100 F26 · Design & Build · Concept Sketch',
  title: 'Concept 3: CLOWNFISH HOVER',
  sheet: 'Concept 3 · sheet 1 of 1',
  theme: 'Biomimicry – clownfish hovering at its anemone',
  type: 'Spring toy, swims in place ≥ 5 s',
  scale: 'mm · side view 1.4 : 1 on 11×17',
});
