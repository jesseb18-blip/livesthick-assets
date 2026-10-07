/* Concept 4 - "Clownfish Wind-Up": the Concept 3 clownfish driven by a classic wind-up motor (key, spiral spring with
   its outer end on a stop, main gear, small gear) as in a wind-up car, plus a captive stop pin as the trigger.
   Vertical arbor at x 18: dorsal-fin key on top, ratchet + click, main gear 36 T m0.6 (y 1.5..4.5), PETG spiral spring
   below (y -5..-0.5, outer end hooked on a stop post). Compound 8 T m0.6 + 24 T m0.5 at x 4.8, crank pinion 8 T m0.5
   at x -3.2 (x13.5 overall) with a crank pin in the slotted lever of the tail section (pivot x -9.2), grease damper
   under the crank pinion. Toy coordinates in mm: x forward (nose), y up, z to the fish's right. */
'use strict';
const MECH = '#6a3fb0', MECH_L = '#cbb8ec', PINK = '#c2457e', PINK_L = '#f3c6dc', GREASE = '#e9e2d0';
const V = (x0, y0, s) => ({ X: (x) => x0 + x * s, Y: (y) => y0 - y * s, s });
const mo = (o = {}) => dashed(Object.assign({ stroke: MECH, strokeWidth: 1.5 }, o));
const deg = Math.PI / 180;
const FISH = { fill: C.orange, fillStyle: 'hachure', hachureGap: 3.2, hachureAngle: -35, fillWeight: 1.2, stroke: INK, strokeWidth: 2 };
const STRIPE = { fill: '#ffffff', fillStyle: 'solid', stroke: INK, strokeWidth: 2.2 };
const GEAR = { stroke: MECH, strokeWidth: 1.4, fill: '#efe8fb', fillStyle: 'solid', roughness: 0.4 };
// red numbered badge, as in the wind-up car picture
function NUM(x, y, n, d = 20) {
  CIRC(x, y, d, { fill: RED, fillStyle: 'solid', stroke: '#8c1d0f', strokeWidth: 1, roughness: 0.3 });
  TXT(x, y + d * 0.24, n, { size: d * 0.68, color: '#fff', anchor: 'middle' });
}
const SHAFT = (x1, y1, x2, y2) => L(x1, y1, x2, y2, { stroke: MECH, strokeWidth: 2.4 });

SHEET_BORDER();
TXT(48, 62, 'CLOWNFISH WIND-UP – HOW IT WORKS', { font: 'PH', size: 26 });
TXT(48, 86, 'key → spring → main gear → small gears → crank → the tail wags in place · purple = mechanism', { size: 13, color: GREY });

/* ================= SIDE VIEW (cut-away, from the fish's right) ================= */
const s = V(440, 340, 5.5);
const P = (x, y) => [s.X(x), s.Y(y)];
TXT(48, 112, 'SIDE VIEW – cut away · from the fish’s right · scale 1.4 : 1', { size: 13, color: GREY });
// anemone stand: base, tentacles, keyed post
FLOOR(s.X(-40), s.X(46), s.Y(-50));
for (const x0 of [-19, -14, -9, -4, 1, 6, 18, 23, 28, 33]) {
  const h = 13 + ((x0 * 7) % 5 + 5) % 5;
  const pts = []; for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push(P(x0 + 1.6 * Math.sin(t * 5 + x0), -45 + h * t)); }
  CURVE(pts, { stroke: PINK, strokeWidth: 3.2, roughness: 0.6 });
  CIRC(...pts[8], 2.8 * s.s, { fill: PINK_L, fillStyle: 'solid', stroke: PINK, strokeWidth: 1.2 });
}
POLY([P(-22, -50), P(36, -50), P(36, -46.5), P(33, -45), P(-19, -45), P(-22, -46.5)], { fill: PINK_L, fillStyle: 'solid', stroke: PINK, strokeWidth: 1.8 });
RECT(s.X(9.6), s.Y(-18.6), 4.8 * s.s, 26.6 * s.s, { fill: PINK_L, fillStyle: 'solid', stroke: PINK, strokeWidth: 1.6 });
L(s.X(13.3), s.Y(-19), s.X(13.3), s.Y(-44), { stroke: PINK, strokeWidth: 1, strokeLineDash: [4, 3] });
// fins behind the body: dorsal (spiny + soft, starting behind the key), anal, pelvic, tail
POLY([P(13, 18.6), P(11, 24), P(8, 21), P(5, 25), P(2, 22), P(-1, 25.5), P(-4, 22.5), P(-6, 24.5), P(-8, 19.2), P(-11, 26), P(-18, 28.5), P(-25, 25), P(-31, 14), P(-31, 11), P(-20, 16.5), P(-8, 19), P(6, 19.5)], FISH);
POLY([P(-14, -16.5), P(-18, -25), P(-26, -24), P(-32, -12), P(-31, -10.5), P(-20, -15)], FISH);
POLY([P(16, -16), P(12, -25), P(8, -25.5), P(9, -17.5)], FISH);
POLY([P(-37, 7.5), P(-46, 14), P(-56, 19), P(-63, 16), P(-66, 8), P(-66.5, 0), P(-66, -8), P(-63, -16), P(-56, -19), P(-46, -14), P(-37, -7.5)], FISH);
for (const a of [-14, -6, 2, 10]) L(...P(-40, a * 0.4), ...P(-63, a * 1.15), { stroke: '#9a4a06', strokeWidth: 1, roughness: 0.4 });
// body
POLY([P(38, -1), P(36, 5), P(30, 12), P(20, 17.5), P(6, 19.5), P(-8, 19), P(-20, 16.5), P(-31, 11), P(-38, 7), P(-38, -7), P(-31, -10.5), P(-20, -15), P(-6, -18), P(8, -18), P(20, -15), P(30, -10), P(36, -5), P(38, -2.5)], FISH);
// white bands, black edges (the middle band hides the joint at x -9.2)
POLY([P(23.5, 16), P(21.5, 6), P(21.3, -4), P(23, -13.4), P(27.5, -11.8), P(26, -3), P(26.2, 6), P(28.3, 13.1)], STRIPE);
POLY([P(-12.2, 18.1), P(-10.7, 8), P(-10.7, -6), P(-12.5, -16.6), P(-6.5, -17.7), P(-5.5, -6), P(-5.5, 8), P(-7, 18.8)], STRIPE);
POLY([P(-33, 10), P(-34, 0), P(-33.5, -9.6), P(-37.4, -7.3), P(-37.8, 0), P(-37.4, 7.3)], STRIPE);
// cut-away: ghost the head so the mechanism shows through
const win = POLY([P(-12, 16.4), P(6, 17.4), P(20, 15.2), P(29, 10), P(33, 4), P(33, -5), P(28, -9.3), P(20, -12.8), P(8, -15.8), P(-6, -16.2), P(-12, -15)], { fill: '#fdfcf8', fillStyle: 'solid', stroke: GREY, strokeWidth: 1, strokeLineDash: [5, 4] });
win.setAttribute('opacity', '0.86');
// ① key on the arbor (front dorsal fin), ratchet + click, ④ main gear, ② spring with ③ its stop
SHAFT(...P(18, -8), ...P(18, 21.8));
POLY([P(18, 21.4), P(14.5, 22), P(12.5, 24.5), P(12.8, 28), P(15.5, 29.6), P(18, 27.6), P(20.5, 29.6), P(23.2, 28), P(23.5, 24.5), P(21.5, 22)], { stroke: MECH, strokeWidth: 1.6, fill: MECH_L, fillStyle: 'solid' });
for (const x of [15.4, 20.6]) CIRC(...P(x, 26), 2.4 * s.s, { fill: '#fdfcf8', fillStyle: 'solid', stroke: MECH, strokeWidth: 1 });
ARC_ARROW(s.X(18), s.Y(31), 7.5 * s.s, 2.6, 0.55, { stroke: RED, strokeWidth: 2.4, head: 10 });
for (let i = 0; i <= 10; i++) for (const sg of [-1, 1]) { const x = 18 + sg * (2 + 0.85 * i); L(...P(x, -5), ...P(x, -0.6), { stroke: MECH, strokeWidth: 1, roughness: 0.3 }); }
RECT(s.X(6.2), s.Y(0.4), 1.3 * s.s, 6.6 * s.s, { stroke: INK, strokeWidth: 1.2, fill: '#999', fillStyle: 'solid' });
RECT(s.X(6.6), s.Y(4.5), 22.8 * s.s, 3 * s.s, { stroke: MECH, strokeWidth: 1.6, fill: MECH_L, fillStyle: 'hachure', hachureGap: 3.5 });
RECT(s.X(15.5), s.Y(6.3), 5 * s.s, 1.8 * s.s, { stroke: MECH, strokeWidth: 1.3, fill: '#efe8fb', fillStyle: 'solid' });
CURVE([P(24.5, 4.6), P(23, 5.5), P(20.6, 5.7)], { stroke: INK, strokeWidth: 1.6 });
// ⑤ small gears: 8 T (meshes with ④) + 24 T on one shaft, then the crank pinion 8 T
SHAFT(...P(4.8, -3), ...P(4.8, 8));
RECT(s.X(1.8), s.Y(4.5), 6 * s.s, 3 * s.s, { stroke: MECH, strokeWidth: 1.4, fill: MECH_L, fillStyle: 'solid' });
RECT(s.X(-1.7), s.Y(7), 13 * s.s, 2 * s.s, { stroke: MECH, strokeWidth: 1.4, fill: MECH_L, fillStyle: 'hachure', hachureGap: 3 });
SHAFT(...P(-3.2, -15.5), ...P(-3.2, 9));
RECT(s.X(-5.7), s.Y(7), 5 * s.s, 2 * s.s, { stroke: MECH, strokeWidth: 1.4, fill: MECH_L, fillStyle: 'solid' });
// ⑥ crank pin in the slotted lever of the tail section; joint pins at x -9.2
RECT(s.X(-6.4), s.Y(8.6), 6.4 * s.s, 1 * s.s, { stroke: MECH, strokeWidth: 1.2, fill: MECH_L, fillStyle: 'solid' });
L(...P(-1, 8.6), ...P(-1, 11.8), { stroke: MECH, strokeWidth: 3.4 });
RECT(s.X(-10.5), s.Y(12.2), 11.3 * s.s, 2 * s.s, { stroke: MECH, strokeWidth: 1.5, fill: '#f6d2ae', fillStyle: 'solid' });
RECT(s.X(-6), s.Y(11.8), 5.6 * s.s, 1.2 * s.s, mo({ strokeWidth: 1, strokeLineDash: [3, 3] }));
L(...P(-9.2, -16), ...P(-9.2, 16), { stroke: MECH, strokeWidth: 1.2, strokeLineDash: [8, 3, 2, 3] });
for (const y of [-16, 16]) CIRC(...P(-9.2, y), 2.2 * s.s, { fill: MECH, fillStyle: 'solid', stroke: MECH, strokeWidth: 0.8 });
// ⑦ grease damper under the crank pinion
RECT(s.X(-9), s.Y(-9.6), 11.6 * s.s, 6.2 * s.s, { stroke: INK, strokeWidth: 1.3, fill: GREASE, fillStyle: 'solid' });
for (let i = 0; i < 18; i++) CIRC(s.X(-8.4 + (i * 2.9) % 10.8), s.Y(-10.2 - ((i * 7) % 5)), 2.4, { fill: '#a89a70', fillStyle: 'solid', stroke: 'none', roughness: 0.1 });
RECT(s.X(-7.2), s.Y(-12), 8 * s.s, 1.4 * s.s, { stroke: MECH, strokeWidth: 1.4, fill: MECH, fillStyle: 'solid' });
// stop pin knob on this flank (pin runs into the side of the main gear's teeth); stand socket; pectoral fin; eye
RECT(s.X(9.5), s.Y(-12.5), 5 * s.s, 6.3 * s.s, dashed({ stroke: PINK, strokeWidth: 1.2 }));
POLY(ellPts(s.X(24 + 4.7 * Math.cos(200 * deg)), s.Y(-7.5 + 4.7 * Math.sin(200 * deg)), 5 * s.s, 2.2 * s.s, -200), { fill: C.orange, fillStyle: 'solid', stroke: INK, strokeWidth: 1.4 });
CIRC(...P(18, 3), 5.4 * s.s, { fill: '#f4f4f4', fillStyle: 'solid', stroke: RED, strokeWidth: 2.4 });
CIRC(...P(18, 3), 1.8 * s.s, { fill: RED, fillStyle: 'solid', stroke: RED, strokeWidth: 0.8 });
CIRC(...P(32, 6), 5.6 * s.s, { fill: '#111', fillStyle: 'solid', stroke: INK, strokeWidth: 1.2 });
CIRC(...P(32.9, 7), 1.4 * s.s, { fill: '#fff', fillStyle: 'solid', stroke: 'none' });
CURVE([P(36.2, -3.6), P(37.4, -2.8), P(38, -1.6)], { strokeWidth: 1.4 });
// numbered badges
NUM(...P(26, 27.5), '1'); NUM(...P(30.2, -2.6), '2'); NUM(...P(3.8, -5.6), '3'); NUM(...P(26.8, 8.2), '4');
NUM(...P(1.6, 0.4), '5'); NUM(...P(-3.6, 15), '6'); NUM(...P(-12, -12.6), '7');

// callouts
CALL(...P(-36, 13), 60, 150, 'TAIL SECTION = rear body +\ntail + slotted lever: ONE part', { start: true, size: 13.5 });
CALL(...P(-1, 11.6), 300, 150, '⑥ CRANK pin in the\nlever’s slot; joint pins\nunder the white band', { start: true, size: 13.5 });
CALL(...P(18, 22.2), 500, 150, '① KEY = front dorsal\nfin: wind 4 turns ↻', { start: true, size: 13.5 });
CALL(...P(28.6, 4.4), 712, 236, '④ MAIN GEAR 36 T,\nratchet + click on top', { start: true, size: 13.5 });
CALL(...P(20.7, 3), 712, 304, 'STOP PIN (captive):\npull it out → swims', { start: true, size: 13.5, color: RED, lc: RED });
CALL(...P(25, -2.8), 712, 372, '② SPRING – its outer\nend hooks on ③ a stop', { start: true, size: 13.5 });
CALL(...P(10.8, 6.2), 712, 444, '⑤ SMALL GEARS: 8 + 24 T,\nthen 8 T → ×13.5', { start: true, size: 13.5 });
CALL(...P(2.6, -11), 712, 516, '⑦ GREASE DAMPER\non the crank shaft', { start: true, size: 13.5 });
CALL(...P(14.4, -32), 712, 590, 'ANEMONE STAND:\nD-shaped post', { start: true, size: 13.5, lc: PINK });
TXT(60, 506, '(the tail wags in and\nout of the page –\nsee the top view)', { size: 13, color: GREY });
DIM(s.X(-66.5), s.Y(-50), s.X(38), s.Y(-50), '105 long', 34);
DIM(s.X(46), s.Y(-50), s.X(46), s.Y(29.6), '80 tall', 0);

/* ================= TOP VIEW: section through the gears ================= */
BOX(930, 40, 730, 410, 'TOP VIEW – CUT THROUGH THE GEARS');
{
  const t = V(1290, 250, 9), T = (x, z) => [t.X(x), t.Y(-z)];   // page down = fish's right
  TXT(1290, 64, 'seen from above · scale 2.3 : 1', { size: 12, color: GREY });
  const w = (x) => 15 * Math.sqrt(Math.max(0, 1 - ((x + 1) / 39) ** 2));
  const piv = [-9.2, 0], crank = [-3.2, 0], phi = 0;   // drawn mid-swing: pin straight ahead, tail straight
  const pin = [crank[0] + 2.2 * Math.cos(phi), 2.2 * Math.sin(phi)];
  const al = Math.atan2(pin[1] - piv[1], pin[0] - piv[0]);
  const rot = (p, a) => { const dx = p[0] - piv[0], dz = p[1] - piv[1]; return [piv[0] + dx * Math.cos(a) - dz * Math.sin(a), piv[1] + dx * Math.sin(a) + dz * Math.cos(a)]; };
  // rounded joint: the head ends in a half-disc round the pivot; the tail section's concave front turns round it
  const RJ = w(piv[0]), arc = (a0, a1, n = 14) => { const p = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; p.push([piv[0] + RJ * Math.cos(a), RJ * Math.sin(a)]); } return p; };
  const stub = [[piv[0], RJ]]; for (let x = -11; x >= -30; x -= 1.5) stub.push([x, w(x)]);
  stub.push([-31, 5], [-29.8, 1.5], [-31.2, -2], [-30.4, -6]); for (let x = -30; x <= -11; x += 1.5) stub.push([x, -w(x)]);
  stub.push([piv[0], -RJ], ...arc(-Math.PI / 2, -Math.PI * 1.5));
  for (const a of [20, -20]) POLY(stub.map((p) => T(...rot(p, a * deg))), { stroke: GREY, strokeWidth: 1.1, strokeLineDash: [6, 4] });
  POLY(stub.map((p) => T(...rot(p, al))), { stroke: C.orange, strokeWidth: 2.4, fill: '#fff4e8', fillStyle: 'solid' });
  // head section (cut at gear level), ending in the half-disc
  const head = arc(Math.PI / 2, Math.PI * 1.5).map((p) => T(...p)); for (let x = -9.2; x <= 38; x += 1.5) head.push(T(x, -w(x))); head.push(T(38.4, 0)); for (let x = 38; x >= -9.2; x -= 1.5) head.push(T(x, w(x)));
  POLY(head, { stroke: C.orange, strokeWidth: 2.4, fill: '#fff4e8', fillStyle: 'solid' });
  // ⑦ damper and stand post (below), ④ main gear with the ratchet + click, ⑤ gears, ⑥ crank pinion
  CIRC(...T(...crank), 12 * t.s, dashed({ stroke: INK, strokeWidth: 1.2 }));
  CIRC(...T(12, 0), 4.8 * t.s, dashed({ stroke: PINK, strokeWidth: 1.2 }));
  POLY(gearPts(...T(18, 0), 10.05 * t.s, 11.4 * t.s, 36, false), GEAR);
  CIRC(...T(18, 0), 15 * t.s, { stroke: MECH, strokeWidth: 0.8, roughness: 0.3 });
  POLY(gearPts(...T(18, 0), 2.7 * t.s, 3.5 * t.s, 12, true), { stroke: MECH, strokeWidth: 1.2, fill: MECH_L, fillStyle: 'solid' });
  PL([T(22.6, -4.2), T(21.4, -2.6), T(20.3, -2.4)], { stroke: INK, strokeWidth: 2.2, roughness: 0.3 });
  CIRC(...T(22.6, -4.2), 1.2 * t.s, { fill: INK, fillStyle: 'solid' });
  CIRC(...T(18, 0), 2.4 * t.s, { fill: MECH, fillStyle: 'solid', stroke: MECH });
  POLY(gearPts(...T(4.8, 0), 1.65 * t.s, 3.0 * t.s, 8, false), mo({ strokeWidth: 1.2 }));
  POLY(gearPts(...T(4.8, 0), 5.4 * t.s, 6.5 * t.s, 24, false, 0.13), GEAR);
  CIRC(...T(4.8, 0), 1.6 * t.s, { fill: MECH, fillStyle: 'solid', stroke: MECH });
  POLY(gearPts(...T(...crank), 1.4 * t.s, 2.5 * t.s, 8, false, 0.2), GEAR);
  // tail lever with its slot (part of the tail section), crank arm + pin on top
  const lev = [[-10.6, 1.9], [0.9, 1.9], [0.9, -1.9], [-10.6, -1.9]].map((p) => T(...rot([p[0], p[1]], al)));
  POLY(lev, { stroke: MECH, strokeWidth: 1.6, fill: '#f6d2ae', fillStyle: 'solid' });
  POLY([[-6.3, 0.95], [-0.4, 0.95], [-0.4, -0.95], [-6.3, -0.95]].map((p) => T(...rot(p, al))), { stroke: MECH, strokeWidth: 1.2, fill: '#fdfcf8', fillStyle: 'solid' });
  L(...T(...crank), ...T(...pin), { stroke: MECH, strokeWidth: 3.2 });
  CIRC(...T(...crank), 1.6 * t.s, { fill: MECH, fillStyle: 'solid', stroke: MECH });
  CIRC(...T(...pin), 1.7 * t.s, { fill: MECH, fillStyle: 'solid', stroke: MECH });
  CIRC(...T(...piv), 2.2 * t.s, { fill: '#fdfcf8', fillStyle: 'solid', stroke: MECH, strokeWidth: 1.8 });
  CIRC(...T(...piv), 0.8 * t.s, { fill: MECH, fillStyle: 'solid', stroke: MECH });
  // captive stop pin through the right flank into the main gear's teeth
  RECT(t.X(17.3), t.Y(-10.2), 1.4 * t.s, 3.4 * t.s, { stroke: RED, strokeWidth: 1.6, fill: '#f4f4f4', fillStyle: 'solid' });
  RECT(t.X(16.6), t.Y(-12.1), 2.8 * t.s, 0.9 * t.s, { stroke: RED, strokeWidth: 1.4, fill: '#f4f4f4', fillStyle: 'solid' });
  RECT(t.X(15.6), t.Y(-13.6), 4.8 * t.s, 2.6 * t.s, { stroke: RED, strokeWidth: 2, fill: '#f4f4f4', fillStyle: 'solid' });
  ARROW(t.X(21.6), t.Y(-13.4), t.X(21.6), t.Y(-17), { stroke: RED, strokeWidth: 2.2, head: 9 });
  TXT(t.X(23.6), t.Y(-15.2), 'pull out 3 mm → it swims', { size: 12.5, color: RED });
  TXT(t.X(23.6), t.Y(-12.4) + 2, 'shoulder: can’t come out', { size: 11.5, color: RED });
  L(t.X(23.3), t.Y(-12.4) - 2, t.X(19.6), t.Y(-11.7), { stroke: RED, strokeWidth: 0.9, strokeLineDash: [3, 3] });
  // motion arrows
  ARC_ARROW(...T(18, 0), 13.4 * t.s, -2.2, -1.2, { stroke: C.green, strokeWidth: 2.2, head: 9 });
  ARC_ARROW(...T(...crank), 7.6 * t.s, 1.3, 2.6, { stroke: C.green, strokeWidth: 2, head: 8 });
  ARC_ARROW(...T(...piv), 22.5 * t.s, Math.PI + 0.08, Math.PI + 0.36, { stroke: C.green, strokeWidth: 2.2, head: 9 });
  ARC_ARROW(...T(...piv), 22.5 * t.s, Math.PI - 0.08, Math.PI - 0.36, { stroke: C.green, strokeWidth: 2.2, head: 9 });
  TXT(t.X(-31) - 8, t.Y(0) + 5, '±20°', { size: 14, color: C.green, anchor: 'end' });
  TXT(t.X(-31) - 8, t.Y(0) + 32, 'to the\ntail', { size: 11.5, color: GREY, anchor: 'end' });
  TXT(t.X(18) - 52, t.Y(15.6), 'slow', { size: 12, color: C.green });
  // badges
  NUM(...T(18, 4.6), '1', 18); NUM(...T(27.5, -10), '4'); NUM(...T(4.8, 8.8), '5'); NUM(...T(-3.2, -4.8), '6'); NUM(...T(-1.8, 7.4), '7');
  CALL(...T(21.4, -2.9), 1500, 106, 'click on the gear:\nwinding slips past,\nrunning drives it', { start: true, size: 12 });
  TXT(950, 436, 'dashed: ⑤ the 8 T under the 24 T · ⑦ damper below · pink = stand post', { size: 11.5, color: GREY });
}

/* ================= SAME MOTOR AS THE WIND-UP CAR ================= */
BOX(930, 460, 730, 315, 'SAME MOTOR AS THE WIND-UP CAR – PLUS 3 EXTRAS');
{
  const bx = [945, 1087, 1229, 1371, 1513], lab = [['1', 'key'], ['2', 'spring, outer\nend on ③ stop'], ['4', 'main gear\n36 T'], ['5', 'small gears\n8+24, 8 T ×13.5'], ['6', 'crank → the\ntail wags']];
  bx.forEach((x, i) => {
    RECT(x, 506, 122, 58, { stroke: i === 4 ? C.green : MECH, strokeWidth: 1.6, fill: i === 4 ? '#e6f3ea' : '#f3eefc', fillStyle: 'solid' });
    NUM(x + 15, 522, lab[i][0], 20);
    TXT(x + 30, 527, lab[i][1], { size: 12.2, lh: 15 });
    if (i < 4) ARROW(x + 124, 535, x + 140, 535, { stroke: INK, strokeWidth: 1.8, head: 8 });
  });
  RECT(1513, 586, 122, 34, { stroke: INK, strokeWidth: 1.3, fill: GREASE, fillStyle: 'solid' });
  NUM(1528, 603, '7', 18); TXT(1542, 608, 'grease damper', { size: 12 });
  L(1574, 566, 1574, 584, { stroke: INK, strokeWidth: 1.6 });
  RECT(1229, 586, 122, 34, { stroke: RED, strokeWidth: 1.6, fill: '#fdecea', fillStyle: 'solid' });
  TXT(1238, 608, 'stop pin (captive)', { size: 12, color: RED });
  ARROW(1290, 584, 1290, 568, { stroke: RED, strokeWidth: 1.6, head: 7 });
  TXT(945, 650, 'From your picture: the key ① winds the\nspring ②; a stop ③ holds its outer end.\nThe spring turns the main gear ④, which\nspins the small gear ⑤ fast. In the car ⑤\nturns the wheels; here it turns a crank ⑥.', { size: 12.6, lh: 16 });
  TXT(1290, 650, 'What the fish adds:\n• a click, so winding doesn’t drive the gears\n• a 2nd small-gear stage → 3× more wags\n• ⑦ a grease damper: the car spends its energy\n   rolling; a fish standing still would spin out\n   in under ½ s', { size: 12.6, lh: 16 });
}

/* ================= bottom boxes ================= */
BOX(40, 785, 330, 285, 'HOW IT PLAYS');
TXT(54, 836, '1  Push the stop pin IN – it drops\n     between the main-gear teeth.', { size: 13.4, lh: 17 });
TXT(54, 878, '2  Wind the dorsal-fin key 4 turns.', { size: 13.4, lh: 17 });
TXT(54, 903, '3  Set the fish on its anemone stand.', { size: 13.4, lh: 17 });
TXT(54, 928, '4  Pull the stop pin OUT → the tail\n     wags 2–3× a second, still ≥ 1×\n     a second after 15 s.', { size: 13.4, lh: 17 });
TXT(54, 987, '5  Push the pin back in to stop.', { size: 13.4, lh: 17 });
TXT(54, 1022, 'The key turns slowly backwards while\nit swims – don’t hold it.', { size: 12.4, color: GREY, lh: 15 });

BOX(380, 785, 360, 285, 'WHY IT LASTS ≥ 5 s');
BULLETS(394, 836, [
  'Spring: PETG strip 0.45 × 5, ≈ 400 mm\n(11 coils), wound 4 turns → ≈ 5 N·mm,\n≈ 60 mJ, 30 MPa (stop at 4 turns)',
  'Gears ×13.5 (36:8 then 24:8): up to\n54 crank turns = 54 wags (≈ 45 used)',
  'No damper → it races, empty in < ½ s',
  '⑦ Ø8 rotor, 2 mm gaps of 30 Pa·s\nsilicone grease → c ≈ 0.012 N·mm·s',
  'Wag rate = (crank torque − friction) ÷ 2πc:\n2.6/s at the start, 2.0/s at 5 s, ≥ 1/s\nfor 16 s',
  'Damper ×2 or ÷2, double friction or a\nweaker spring: still ≥ 1/s for ≥ 9 s',
], { size: 12.4, lh: 14.6, gap: 3 });

BOX(750, 785, 370, 285, 'PARTS (10) + RULES');
TXT(764, 834, '1–2 head halves (snap together)\n3 key + arbor + ratchet    4 spiral spring\n5 main gear 36 T + click    6 gear 8 + 24 T\n7 crank pinion 8 T + crank + damper rotor\n8 tail section (body, tail, slotted lever)\n9 stop pin (captive)    10 anemone stand', { size: 12.4, lh: 15.5 });
BULLETS(764, 942, [
  'All printed + a dab of damping grease',
  'Fits the egg; built 105 × 80 → bigger',
  'Stop pin is captive: it pulls out but\ncan’t come off (no removable pin)',
  'Opening the head lets the spring go',
  'Snap fits: no glue, no tools',
], { size: 12.4, ticks: true, gap: 2 });

BOX(1130, 785, 540, 108, 'BIOMIMICRY');
TXT(1144, 838, 'Clownfish don’t cruise: they hover beside their anemone,\nsculling with quick tail beats. This one does the same on its\nanemone stand; its middle white band hides the tail joint.', { size: 13.2, lh: 17 });

TITLE_BLOCK(1130, 903, 540, 167, {
  course: 'ENGG*2100 F26 · Design & Build · Concept Sketch',
  title: 'Concept 4: CLOWNFISH WIND-UP',
  sheet: 'Concept 4 · sheet 1 of 1',
  theme: 'Biomimicry – clownfish hovering at its anemone',
  type: 'Spring wind-up, swims in place ≥ 5 s',
  scale: 'mm · side view 1.4 : 1 on 11×17',
});
