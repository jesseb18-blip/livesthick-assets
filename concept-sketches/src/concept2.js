/* Concept 2 - "Emperor Waddler": upright penguin that WALKS on two flat feet plus its stiff tail, like an emperor.
   Turn-the-head wind-up (twisted rubber motor), detent-held flipper-crank lock, crank-driven shuffling feet,
   viscous grease damper to pace the walk.
   Toy coordinates in mm: x forward, y up, z to the toy's right. Motor/head axis at x = +4, z = 0.
   Drive: crown 24 T (m1) on the motor -> 12 T pinion on a transverse D-shaft (x 4, y 15) under the crown's RIGHT rim
   (z +12) -> two 2.5 mm cranks, 180° apart, each in a vertical slot of an ankle post (Scotch yoke) -> feet at z ±8
   slide 5 mm fore-aft and never lift. Grease damper on the shaft's left end (z -15..-19.5). Tail roller Ø8 at x -30.
   CG at x -2.5, y 34. */
'use strict';
const MECH = '#6a3fb0', MECH_L = '#cbb8ec', FOOT = '#9a4a06';
const V = (x0, y0, s) => ({ X: (x) => x0 + x * s, Y: (y) => y0 - y * s, s });
function ELL_ARROW(cx, cy, rx, ry, a0, a1, o = {}) {
  const pts = ellPts(cx, cy, rx, ry, 0, a0, a1, 24);
  CURVE(pts, o);
  const p = pts[pts.length - 1], q = pts[pts.length - 3];
  ARROW(q[0], q[1], p[0], p[1], Object.assign({}, o, { head: o.head || 10 }));
}
const mo = (o = {}) => dashed(Object.assign({ stroke: MECH, strokeWidth: 1.6 }, o));
// body outline (mm) above the base: ellipse centre (cx, 46), half-depth rx, half-height 43, cut at the tray top y = 28
function bodyArc(Vw, cx, rx, ry, t0, t1, n = 30) { const p = []; for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; p.push([Vw.X(cx + rx * Math.cos(t)), Vw.Y(46 + ry * Math.sin(t))]); } return p; }
const TC = Math.asin(-18 / 43);   // angle where the body meets the tray top (y = 28)
// crank phase drawn: right pin at 135° (up-back, pushing), left pin at 315° (down-front, sliding + pressing)
const TH_R = 135 * Math.PI / 180, DX_R = 2.5 * Math.cos(TH_R), DX_L = -DX_R;
// side-view foot (toy mm), shifted dx along x: slipper y 0..5, toe + claw at the front, fins under the sole
function foot(Vw, dx, hidden) {
  const P = (x, y) => [Vw.X(x + dx), Vw.Y(y)];
  const out = [P(-3, 1.2), P(15, 1.2), P(17.5, 1.6), P(19, 2.8), P(18.6, 4.2), P(17, 5), P(-2.5, 5), P(-4, 4), P(-4.3, 2.4)];
  if (hidden) { POLY(out, dashed({ stroke: FOOT, strokeWidth: 1.2 })); return; }
  POLY(out, { fill: C.orange, fillStyle: 'solid', stroke: FOOT, strokeWidth: 1.4 });
  POLY([P(18.3, 2.1), P(20.8, 0.9), P(18.9, 3.1)], { fill: INK, fillStyle: 'solid', strokeWidth: 0.8, roughness: 0.3 });
  for (let x = -2.4; x <= 16; x += 2.3) L(...P(x, 1.2), ...P(x - 1.4, 0), { strokeWidth: 1.5, roughness: 0.3 });
}
// ankle post rising from the foot, with the vertical slot for the crank pin (pin centre at px, py)
function anklePost(Vw, px, py, o = {}) {
  RECT(Vw.X(px - 2), Vw.Y(20), 4 * Vw.s, 15 * Vw.s, mo(Object.assign({ strokeWidth: 1.3 }, o)));
  RECT(Vw.X(px - 1.1), Vw.Y(18.6), 2.2 * Vw.s, 6.1 * Vw.s, mo({ strokeWidth: 1, strokeLineDash: [3, 3] }));
  CIRC(Vw.X(px), Vw.Y(py), 2 * Vw.s, { fill: MECH, fillStyle: 'solid', stroke: MECH, strokeWidth: 0.8, roughness: 0.2 });
}

SHEET_BORDER();

/* ================= SIDE VIEW (from the toy's right) ================= */
const m = V(318, 590, 3.7);
TXT(48, 62, 'BODY – SIDE VIEW', { font: 'PH', size: 22 });
TXT(48, 84, 'from the right · scale 0.94 : 1 · dashed = hidden · purple = mechanism', { size: 13, color: GREY });
FLOOR(m.X(-46), m.X(44), m.Y(0));
// body: black back shell + white belly cap (front crescent)
POLY(bodyArc(m, -2, 15.5, 43, TC, Math.PI / 2).concat(bodyArc(m, -2, 25, 43, Math.PI / 2, Math.PI - TC)),
  { fill: C.black, fillStyle: 'hachure', hachureGap: 3.2, hachureAngle: -40, fillWeight: 1.1, stroke: 'none', strokeWidth: 0.1 });
POLY(bodyArc(m, -2, 25, 43, TC, Math.PI - TC, 50), { strokeWidth: 2 });
CURVE(bodyArc(m, -2, 15.5, 43, TC, Math.PI / 2, 20), { stroke: GREY, strokeWidth: 1.1 });
// near (right) flipper, hanging
POLY(ellPts(m.X(-1), m.Y(50), 5 * m.s, 20 * m.s, 12), { fill: '#111', fillStyle: 'cross-hatch', hachureGap: 4, strokeWidth: 1.5 });
// head on the turning neck joint; the beak is a separate clip-on part
POLY(ellPts(m.X(5), m.Y(95), 15 * m.s, 13.5 * m.s), { fill: C.black, fillStyle: 'hachure', hachureGap: 3, hachureAngle: -35, strokeWidth: 1.9 });
POLY(ellPts(m.X(8.5), m.Y(86.5), 4.2 * m.s, 7.5 * m.s, -22), { fill: C.yellow, fillStyle: 'solid', strokeWidth: 1.1 });
POLY([[m.X(18.5), m.Y(99)], [m.X(37), m.Y(92.5)], [m.X(19.2), m.Y(94.2)]], { fill: '#2b2b2b', fillStyle: 'solid', strokeWidth: 1.2 });
POLY([[m.X(19.2), m.Y(94.2)], [m.X(35), m.Y(92.6)], [m.X(19), m.Y(92.4)]], { fill: C.orange, fillStyle: 'solid', strokeWidth: 0.9 });
L(m.X(18.6), m.Y(99.6), m.X(18.6), m.Y(91.6), { stroke: '#fff', strokeWidth: 1, strokeLineDash: [2, 2] });
CIRC(m.X(13.5), m.Y(99.5), 3 * m.s, { fill: '#000', fillStyle: 'solid', strokeWidth: 1 });
L(m.X(-13.7), m.Y(84), m.X(9.7), m.Y(84), { stroke: '#fff', strokeWidth: 3, roughness: 0.4 });
L(m.X(-13.7), m.Y(84), m.X(9.7), m.Y(84), { stroke: INK, strokeWidth: 1.1, strokeLineDash: [5, 3] });
ELL_ARROW(m.X(4), m.Y(113), 13 * m.s, 4 * m.s, 0.2, Math.PI - 0.2, { stroke: RED, strokeWidth: 2.6 });
// feet: far (left) foot hidden, 3.5 mm ahead; near (right) foot in front. Tail strut + roller = 3rd contact
foot(m, DX_L, true);
foot(m, DX_R, false);
// base: oval tray riding on the foot tops
POLY([[m.X(-15.5), m.Y(28)], [m.X(23.5), m.Y(28)], [m.X(25.4), m.Y(24)], [m.X(25.4), m.Y(9)], [m.X(23.5), m.Y(5)], [m.X(-15.5), m.Y(5)], [m.X(-17.4), m.Y(9)], [m.X(-17.4), m.Y(24)]], { fill: '#fff', fillStyle: 'solid', strokeWidth: 1.8 });
L(m.X(-15), m.Y(6.5), m.X(23), m.Y(6.5), { stroke: GREY, strokeWidth: 0.9, strokeLineDash: [4, 4] });
POLY([[m.X(-19), m.Y(33)], [m.X(-31.5), m.Y(6)], [m.X(-28.5), m.Y(5)], [m.X(-16), m.Y(27)]], { fill: C.black, fillStyle: 'solid', strokeWidth: 1.3 });
CIRC(m.X(-30), m.Y(4), 8 * m.s, { stroke: INK, strokeWidth: 1.8, fill: '#ddd', fillStyle: 'solid' });
CIRC(m.X(-30), m.Y(4), 4, { fill: INK, fillStyle: 'solid' });
// mechanism: crown hangs from the MR52 in the tray roof; 12 T pinion + right crank on the D-shaft (hidden in the tray)
RECT(m.X(-8), m.Y(25), 24 * m.s, 3 * m.s, mo({ fill: MECH_L, fillStyle: 'hachure', hachureGap: 4 }));
for (let x = -7.5; x <= 15.5; x += 1.9) L(m.X(x), m.Y(22), m.X(x + 0.5), m.Y(20.2), { stroke: MECH, strokeWidth: 1, roughness: 0.3 });
L(m.X(4), m.Y(19.5), m.X(4), m.Y(29.5), { stroke: C.steel, strokeWidth: 2.6 });
CURVE([[m.X(4), m.Y(29.5)], [m.X(5.6), m.Y(30.7)], [m.X(4.4), m.Y(31.9)]], { stroke: C.steel, strokeWidth: 2.2 });
RECT(m.X(1.5), m.Y(27.5), 5 * m.s, 2.5 * m.s, { stroke: '#555', strokeWidth: 1, fill: '#999', fillStyle: 'cross-hatch', hachureGap: 2.5 });
POLY(gearPts(m.X(4), m.Y(15), 4.9 * m.s, 7 * m.s, 12, false), mo({ strokeWidth: 1.2 }));
const pinR = [4 + DX_R, 15 + 2.5 * Math.sin(TH_R)];
L(m.X(4), m.Y(15), m.X(pinR[0]), m.Y(pinR[1]), { stroke: MECH, strokeWidth: 2.6 });
CIRC(m.X(4), m.Y(15), 2 * m.s, { fill: C.steel, fillStyle: 'solid', strokeWidth: 0.8 });
anklePost(m, pinR[0], pinR[1]);
ARC_ARROW(m.X(4), m.Y(15), 9 * m.s, 1.25, -0.7, { stroke: C.green, strokeWidth: 2, head: 9 });
// near foot moves back (grips), far foot slides forward
ARROW(m.X(14), m.Y(2.9), m.X(3), m.Y(2.9), { stroke: C.green, strokeWidth: 2.2, head: 8 });
RECT(m.X(-15.5), m.Y(9.7), 16 * m.s, 3.2 * m.s, dashed({ stroke: '#555', fill: C.steel, fillStyle: 'cross-hatch', hachureGap: 3 }));
TWIST(m.X(4), m.Y(31.5), m.X(4), m.Y(79), 8, { strokeLineDash: [6, 3] });
L(m.X(4), m.Y(79), m.X(4), m.Y(101), { stroke: MECH, strokeWidth: 3 });
RECT(m.X(-1), m.Y(87), 10 * m.s, 3 * m.s, { stroke: MECH, fill: MECH_L, fillStyle: 'cross-hatch', hachureGap: 3, strokeWidth: 1.2 });
// trigger linkage (left flipper, far side): pivot + crank, sprung L-arm, lock rod down into a crown hole
CIRC(m.X(4), m.Y(66), 13, { stroke: MECH, fill: MECH_L, fillStyle: 'solid', strokeWidth: 1.4 });
L(m.X(4), m.Y(66), m.X(4), m.Y(60), { stroke: MECH, strokeWidth: 2.6 });
L(m.X(4), m.Y(60), m.X(7.5), m.Y(60), mo({ strokeWidth: 2.2 }));
L(m.X(7.5), m.Y(60), m.X(7.5), m.Y(22.5), mo({ strokeWidth: 2.4, strokeLineDash: [9, 4] }));
RECT(m.X(5.7), m.Y(42), 3.6 * m.s, 5 * m.s, { stroke: GREY, strokeWidth: 1, fill: '#ddd', fillStyle: 'hachure', hachureGap: 3 });
// centre of mass
CIRC(m.X(-2.5), m.Y(34), 18, { strokeWidth: 1.6, stroke: RED, fill: '#fdfcf8', fillStyle: 'solid' });
L(m.X(-2.5) - 12, m.Y(34), m.X(-2.5) + 12, m.Y(34), { stroke: RED, strokeWidth: 1.2 });
L(m.X(-2.5), m.Y(34) - 12, m.X(-2.5), m.Y(34) + 12, { stroke: RED, strokeWidth: 1.2 });
TXT(m.X(-2.5) - 14, m.Y(34) - 10, 'CG', { size: 13, color: RED, anchor: 'end', halo: 4 });

// callouts - left column
CALL(m.X(0), m.Y(115), 48, 128, 'HEAD = WINDING KEY\nturn it 28× clockwise\n(seen from above)', { start: true, size: 13.5 });
CALL(m.X(-1), m.Y(85.5), 48, 212, 'NECK RATCHET\n12 teeth + flexure\npawl: winds one way', { start: true, size: 13.5 });
CALL(m.X(4), m.Y(60), 48, 296, 'RUBBER MOTOR\n3 loops of #16 band\n= 6 strands × 60 mm', { start: true, size: 13.5 });
CALL(m.X(-21), m.Y(58), 48, 382, 'BODY: black back\nshell + white belly\ncap (2 snap-fit parts)', { start: true, size: 13.5 });
CALL(m.X(-9), m.Y(8.1), 48, 466, '2 M8 STEEL WASHERS\nlow at the back\n→ CG low + behind', { start: true, size: 13.5 });
CALL(m.X(-30), m.Y(0.5), 48, 545, 'TAIL + Ø8 ROLLER\n= 3rd contact', { start: true, size: 13.5 });
// right column
CALL(m.X(4.6), m.Y(66.6), 482, 300, 'TRIGGER PIVOT\n+ crank (left\nflipper, far side)', { start: true, size: 13 });
CALL(m.X(7.5), m.Y(35), 482, 385, 'LOCK ROD in a\nguide (see B)', { start: true, size: 13 });
CALL(m.X(15), m.Y(23.5), 482, 446, 'CROWN 24 T keyed\non the hook-shaft,\nMR52 thrust', { start: true, size: 13 });
CALL(m.X(24.5), m.Y(13), 482, 512, 'BASE: oval tray,\nrides on the feet', { start: true, size: 13 });
CALL(m.X(pinR[0] + 2), m.Y(10), 482, 575, 'ANKLE POST: pin\nin a vertical slot\n(C)', { start: true, size: 13 });
// below the floor
CALL(m.X(9), m.Y(0.6), 360, 690, 'FEET 22 × 10 (far one dashed),\nclaw fins under the sole; always on\nthe floor, cranked 5 mm fore-aft (C)', { start: true, size: 13 });
CALL(m.X(3), m.Y(8.6), 48, 744, 'PINION 12 T + 2 CRANKS (2.5 mm) on a Ø2\nD-shaft under the crown’s RIGHT rim;\ngrease damper on its far end (A ⑥)', { start: true, size: 13 });

DIM(m.X(40), m.Y(0), m.X(40), m.Y(108.5), '109 tall', 0);
DIM(m.X(-30), m.Y(0), m.X(4), m.Y(0), '34', 22);
DIM(m.X(-34), m.Y(0), m.X(37), m.Y(0), '71 long', 48);

/* ================= FRONT VIEW (armed) ================= */
const f = V(775, 372, 2.5);   // u = -z: the viewer's right is the toy's LEFT
const U = (u) => f.X(u);
TXT(600, 62, 'FRONT VIEW (armed)', { font: 'PH', size: 22 });
TXT(788, 62, 'scale 0.64 : 1', { size: 13, color: GREY });
FLOOR(U(-34), U(68), f.Y(0));
const fcx = U(0);
POLY(bodyArc(f, 0, 23, 43, TC, Math.PI - TC, 50), { fill: C.black, fillStyle: 'hachure', hachureGap: 3, strokeWidth: 1.9 });
POLY(bodyArc({ X: f.X, Y: (y) => f.Y(y - 2) }, 0, 15.5, 39, Math.asin(-16 / 39), Math.PI - Math.asin(-16 / 39), 40), { fill: '#fff', fillStyle: 'solid', strokeWidth: 1.1, stroke: GREY });
POLY(ellPts(fcx, f.Y(95), 13.5 * f.s, 13.5 * f.s), { fill: C.black, fillStyle: 'hachure', hachureGap: 3, hachureAngle: -35, strokeWidth: 1.8 });
for (const sg of [1, -1]) {
  POLY(ellPts(U(sg * 10.5), f.Y(85), 3.4 * f.s, 7 * f.s, sg * 14), { fill: C.yellow, fillStyle: 'solid', strokeWidth: 1 });
  CIRC(U(sg * 6.5), f.Y(99), 2.6 * f.s, { fill: '#000', fillStyle: 'solid' });
}
POLY([[U(-3), f.Y(94)], [U(3), f.Y(94)], [U(0), f.Y(87)]], { fill: C.orange, fillStyle: 'solid', strokeWidth: 1.1 });
L(U(-11.5), f.Y(84), U(11.5), f.Y(84), { stroke: '#fff', strokeWidth: 2.6, roughness: 0.4 });
L(U(-11.5), f.Y(84), U(11.5), f.Y(84), { stroke: INK, strokeWidth: 1, strokeLineDash: [5, 3] });
POLY([[U(-19.5), f.Y(28)], [U(19.5), f.Y(28)], [U(21), f.Y(25)], [U(21), f.Y(8)], [U(19.5), f.Y(5)], [U(-19.5), f.Y(5)], [U(-21), f.Y(8)], [U(-21), f.Y(25)]], { fill: '#fff', fillStyle: 'solid', strokeWidth: 1.7 });
// feet at z ±8 (u ∓8), 10 wide: three toes with claws, fins underneath
for (const uc of [-8, 8]) {
  const P = (u, y) => [U(uc + u), f.Y(y)];
  POLY([P(-5, 1), P(-5, 3.8), P(-4, 4.8), P(-2.4, 4.2), P(-1.4, 5.1), P(0, 5.3), P(1.4, 5.1), P(2.4, 4.2), P(4, 4.8), P(5, 3.8), P(5, 1)], { fill: C.orange, fillStyle: 'solid', stroke: FOOT, strokeWidth: 1.2 });
  for (const u of [-3.4, 0, 3.4]) CIRC(...P(u, 2.2), 4, { fill: INK, fillStyle: 'solid', strokeWidth: 0.6, roughness: 0.2 });
  const z = []; for (let i = 0; i <= 10; i++) z.push(P(-5 + i, i % 2 ? 0 : 1)); PL(z, { strokeWidth: 1.1, roughness: 0.3 });
  RECT(U(uc - 1.5), f.Y(20), 3 * f.s, 15 * f.s, mo({ strokeWidth: 1.1 }));
}
// hidden drive: motor, crown (edge on), D-shaft with pinion (toy's right = viewer's left), cranks, damper (toy's left)
TWIST(U(0), f.Y(31.5), U(0), f.Y(79), 8, { strokeLineDash: [6, 3] });
L(U(0), f.Y(19.5), U(0), f.Y(30), { stroke: C.steel, strokeWidth: 2.2 });
RECT(U(-2.5), f.Y(27.5), 5 * f.s, 2.5 * f.s, { stroke: '#555', strokeWidth: 1, fill: '#999', fillStyle: 'cross-hatch', hachureGap: 2.5 });
RECT(U(-13), f.Y(25), 26 * f.s, 5 * f.s, mo({ fill: MECH_L, fillStyle: 'hachure', hachureGap: 4 }));
L(U(-20.5), f.Y(15), U(20.5), f.Y(15), { stroke: C.steel, strokeWidth: 1.8, strokeLineDash: [6, 3] });
RECT(U(-13.5), f.Y(22), 3 * f.s, 14 * f.s, mo({ fill: MECH_L, fillStyle: 'solid' }));
for (const u of [-6.5, 5]) RECT(U(u), f.Y(19.5), 1.5 * f.s, 9 * f.s, mo({ strokeWidth: 1 }));
RECT(U(15), f.Y(21.75), 4.5 * f.s, 13.5 * f.s, mo({ fill: '#e9e2d0', fillStyle: 'solid', strokeWidth: 1.2 }));
RECT(U(16.6), f.Y(20), 1.3 * f.s, 10 * f.s, { stroke: MECH, strokeWidth: 1, roughness: 0.3 });
// right flipper hangs; left flipper (trigger) raised = ARMED; crank points down to the lock rod arm
POLY(ellPts(U(-25), f.Y(50), 4.5 * f.s, 20 * f.s, 8), { fill: '#111', fillStyle: 'cross-hatch', hachureGap: 4, strokeWidth: 1.4 });
POLY(ellPts(U(42), f.Y(67.5), 21 * f.s, 4.5 * f.s, -6), { fill: '#111', fillStyle: 'cross-hatch', hachureGap: 4, strokeWidth: 1.4 });
L(U(21), f.Y(66), U(21.5), f.Y(60), { stroke: MECH, strokeWidth: 2.4 });
L(U(22.5), f.Y(60), U(8.5), f.Y(60), mo({ strokeWidth: 2 }));
L(U(8.5), f.Y(60), U(8.5), f.Y(22.5), mo({ strokeWidth: 2.2, strokeLineDash: [9, 4] }));
CIRC(U(21), f.Y(66), 11, { stroke: MECH, fill: MECH_L, fillStyle: 'solid', strokeWidth: 1.3 });
ARC_ARROW(U(21), f.Y(66), 30 * f.s, -0.12, 1.15, { stroke: RED, strokeWidth: 2.2 });
// waddle
const wr = 118 * f.s;
ARC_ARROW(fcx, f.Y(0), wr, -Math.PI / 2 + 0.01, -Math.PI / 2 + 0.13, { stroke: C.green, strokeWidth: 2 });
ARC_ARROW(fcx, f.Y(0), wr, -Math.PI / 2 - 0.01, -Math.PI / 2 - 0.13, { stroke: C.green, strokeWidth: 2 });
TXT(fcx + 46, 86, 'rocks ±3.6° (C)', { size: 13.5, color: C.green });
// callouts
CALL(U(-9), f.Y(84.5), 606, 150, 'HEAD TURNS\non the neck\nring', { start: true, size: 13 });
CALL(U(-12), f.Y(13), 606, 236, 'pinion 12 T\n(toy’s right)', { start: true, size: 13 });
CALL(U(-21), f.Y(18), 606, 296, 'BASE: oval\ntray, 42 wide', { start: true, size: 13 });
CALL(U(-10), f.Y(0.5), 606, 350, 'feet 10 wide\n(track 16)', { start: true, size: 13 });
CALL(U(57), f.Y(70.5), 950, 135, 'TRIGGER = LEFT\nflipper; raised\n= ARMED (locked)', { start: true, size: 13 });
TXT(U(34), f.Y(36), 'push it\ndown → GO', { size: 14, color: RED });
CALL(U(8.5), f.Y(50), 950, 240, 'lock rod (B)', { start: true, size: 13 });
CALL(U(19.5), f.Y(12), 950, 320, 'grease damper\n(toy’s left)', { start: true, size: 13 });
DIM(U(-21), f.Y(0), U(21), f.Y(0), '42 base', 18);
DIM(U(-30), f.Y(0), U(63), f.Y(0), '≈ 93 with the flipper raised', 40);

/* ================= C: FEET - SHUFFLE + WADDLE ================= */
BOX(600, 448, 250, 317, 'C   FEET – SHUFFLE + WADDLE');
{
  const c = V(634, 622, 4.6), px = 4, py = 17.5;     // right foot drawn with its pin at the top (moving back)
  L(c.X(-6), c.Y(0), c.X(22), c.Y(0), { strokeWidth: 1.4 });
  for (let x = c.X(-5); x < c.X(21.5); x += 12) L(x, c.Y(0) + 2, x - 6, c.Y(0) + 8, { stroke: GREY, strokeWidth: 0.8, roughness: 0.4 });
  foot(c, 0, false);
  // tray floor in section, sliding on the foot top; slot for the post
  for (const [a, b] of [[-5.5, 0.8], [7.2, 21.5]]) RECT(c.X(a), c.Y(6.5), (b - a) * c.s, 1.5 * c.s, { stroke: INK, strokeWidth: 1.2, fill: GREY, fillStyle: 'hachure', hachureGap: 3, hachureAngle: 45 });
  // guide peg under the tray floor in a groove on the foot top
  RECT(c.X(-3), c.Y(5), 1.6 * c.s, 2.2 * c.s, { stroke: INK, strokeWidth: 1, fill: '#bbb', fillStyle: 'solid' });
  // post + slot + crank (pin path dashed)
  RECT(c.X(px - 2), c.Y(20), 4 * c.s, 15 * c.s, { stroke: MECH, strokeWidth: 1.6, fill: MECH_L, fillStyle: 'hachure', hachureGap: 4 });
  RECT(c.X(px - 1.1), c.Y(18.6), 2.2 * c.s, 6.1 * c.s, { stroke: MECH, strokeWidth: 1.2, fill: '#fdfcf8', fillStyle: 'solid' });
  CIRC(c.X(4), c.Y(15), 5 * c.s, dashed({ stroke: C.green, strokeWidth: 1.1, strokeLineDash: [3, 3] }));
  L(c.X(4), c.Y(15), c.X(px), c.Y(py), { stroke: MECH, strokeWidth: 3 });
  CIRC(c.X(4), c.Y(15), 6, { fill: C.steel, fillStyle: 'solid', strokeWidth: 0.8 });
  CIRC(c.X(px), c.Y(py), 2 * c.s, { fill: MECH, fillStyle: 'solid', stroke: MECH, roughness: 0.2 });
  ARC_ARROW(c.X(4), c.Y(15), 4.6 * c.s, 1.3, -0.6, { stroke: C.green, strokeWidth: 1.8, head: 7 });
  ARROW(c.X(13), c.Y(2.9), c.X(3), c.Y(2.9), { stroke: C.green, strokeWidth: 2, head: 7 });
  TXT(c.X(px) - 12, c.Y(12.5) + 4, 'press', { size: 10.5, color: MECH, anchor: 'end' });
  L(c.X(px) - 10, c.Y(12.5), c.X(px - 1.1), c.Y(12.5), { stroke: MECH, strokeWidth: 0.8 });
  // labels
  TXT(744, 498, 'crank 2.5 mm ↺', { size: 11.5, color: C.green });
  TXT(744, 520, 'pin Ø2 in a\nvertical slot:\npushes the foot\nfore-aft, not up', { size: 11.5, lh: 13.5, color: MECH });
  TXT(744, 584, 'tray floor rides\non the foot top\n(greased); peg\nin a groove', { size: 11.5, lh: 13.5 });
  TXT(744, 640, 'fins: grip ←', { size: 11.5 });
  TXT(744, 653, 'slide →', { size: 11.5 });
}
TXT(610, 676, 'Feet 180° apart: the back-going foot\ngrips (μ ≈ 0.8) and pushes the body\n5 mm; the other skids on (μ ≈ 0.15):\n10 mm per crank turn (≈ 9 with slip).\nWaddle: at the bottom the pin presses\nthe sliding foot 1 mm down → body\nrolls 3.6° onto the pusher (64 % load).', { size: 11.8, lh: 13 });

/* ================= D: STANCE ================= */
BOX(860, 448, 260, 317, 'D   STANCE: 2 FEET + TAIL');
{
  const dg = 596, hx0 = 1012, ds = 2.3;   // hx0 = crank axis (x 4)
  const DX = (x) => hx0 + (x - 4) * ds;
  L(875, dg, 1105, dg, { strokeWidth: 1.4 });
  POLY([[DX(-4), dg], [DX(17), dg], [DX(19), dg - 2.8 * ds], [DX(17), dg - 5 * ds], [DX(-4), dg - 5 * ds]], { fill: C.orange, fillStyle: 'solid', stroke: FOOT, strokeWidth: 1.3 });
  RECT(DX(-17.4), dg - 28 * ds, 42.8 * ds, 23 * ds, { strokeWidth: 1.3 });
  CIRC(hx0, dg - 15 * ds, 6, { fill: INK, fillStyle: 'solid' });
  CIRC(DX(-30), dg - 4 * ds, 8 * ds, { stroke: INK, strokeWidth: 1.6 });
  PL([[DX(-30), dg - 4 * ds], [DX(-19), dg - 30 * ds]], { strokeWidth: 3 });
  TXT(DX(-30) - 4, dg - 10 * ds, 'tail', { size: 11.5, color: GREY, anchor: 'end' });
  TXT(DX(-4) - 4, dg - 3, 'feet', { size: 11.5, color: GREY, anchor: 'end' });
  TXT(hx0 + 6, dg - 15 * ds + 4, 'crank', { size: 11, color: GREY });
  const cgx = DX(-2.5), cgy = dg - 34 * ds;
  CIRC(cgx, cgy, 16, { stroke: RED, strokeWidth: 1.4, fill: '#fdfcf8', fillStyle: 'solid' });
  L(cgx - 10, cgy, cgx + 10, cgy, { stroke: RED }); L(cgx, cgy - 10, cgx, cgy + 10, { stroke: RED });
  L(cgx, cgy + 8, cgx, dg, { stroke: RED, strokeWidth: 1, strokeLineDash: [4, 3] });
  TXT(cgx - 12, cgy - 8, 'CG', { size: 13, color: RED, anchor: 'end' });
  DIM(cgx, dg, hx0, dg, 'd 6.5', 12);
  L(cgx + 8, cgy, DX(36), cgy, { stroke: GREY, strokeWidth: 0.8, strokeLineDash: [3, 3] });
  DIM(DX(34), dg, DX(34), cgy, 'h 34', 0);
  ARROW(DX(11), dg + 34, DX(11), dg + 6, { stroke: C.green, strokeWidth: 1.8, head: 7 });
  ARROW(DX(-30), dg + 22, DX(-30), dg + 6, { stroke: C.green, strokeWidth: 1.8, head: 7 });
  TXT(DX(11) + 6, dg + 32, '74 %', { size: 11.5, color: C.green });
  TXT(DX(-30) + 6, dg + 22, '26 %', { size: 11.5, color: C.green });
}
TXT(872, 660, 'Stands on both feet + its stiff tail\n(Ø8 roller), always on 3 contacts.\nPushing-foot grip 0.8 × 0.21 N = 0.17 N\nvs ≈ 0.02 N needed → 8× margin.\nSide tip needs 21° (feet span 26, CG\n34 high); waddle only ±3.6° ✓\nSoft start (damper): no lurch, no nose-\ndive. Steady the head when firing.', { size: 12.4, lh: 14.2 });

/* ================= A: ENERGY ================= */
BOX(1130, 40, 540, 395, 'A   ENERGY – TURN THE HEAD');
const ax = 1215;
POLY(ellPts(ax, 120, 30, 26), { fill: C.black, fillStyle: 'hachure', hachureGap: 3, hachureAngle: -35 });
POLY([[ax + 26, 112], [ax + 62, 124], [ax + 27, 127]], { fill: C.orange, fillStyle: 'solid', strokeWidth: 1 });
CIRC(ax + 14, 112, 7, { fill: '#000', fillStyle: 'solid' });
ELL_ARROW(ax, 86, 30, 7, 0.2, Math.PI - 0.2, { stroke: RED, strokeWidth: 2.4 });
TXT(ax + 40, 92, '① turn the\nhead 28× ↻', { size: 13.5, color: RED });
RECT(ax - 22, 147, 44, 11, { stroke: MECH, fill: MECH_L, fillStyle: 'cross-hatch', hachureGap: 3, strokeWidth: 1.3 });
CURVE([[ax + 34, 140], [ax + 28, 150], [ax + 22, 153]], { stroke: INK, strokeWidth: 2.4 });
L(ax, 158, ax, 176, { stroke: MECH, strokeWidth: 4 });
POLY(gearPts(1166, 218, 13, 18, 12, true), { stroke: MECH, fill: MECH_L, fillStyle: 'hachure', hachureGap: 3, strokeWidth: 1.2 });
CURVE([[1190, 196], [1186, 206], [1182, 212]], { stroke: INK, strokeWidth: 2.2 });
TXT(1166, 251, 'top view', { size: 11.5, anchor: 'middle', color: GREY });
L(1180, 198, ax - 22, 158, { stroke: GREY, strokeWidth: 0.8, strokeLineDash: [3, 3] });
TXT(ax + 40, 150, '② neck ratchet:\n12 teeth + flexure\npawl, one way only', { size: 12.6 });
TWIST(ax, 178, ax, 274, 7);
CURVE([[ax, 274], [ax + 6, 278], [ax + 1, 282]], { stroke: C.steel, strokeWidth: 2.4 });
L(ax, 280, ax, 312, { stroke: C.steel, strokeWidth: 3 });
TXT(ax + 18, 232, '③ rubber motor\n6 strands × 60 mm', { size: 12.6 });
// crown (side), hanging from the MR52 in the tray roof; pinion + crank + foot below
RECT(ax - 30, 284, 60, 6, { stroke: GREY, strokeWidth: 1, fill: '#bbb', fillStyle: 'cross-hatch', hachureGap: 3 });
RECT(ax - 7, 282, 14, 10, { stroke: '#555', strokeWidth: 1, fill: '#999', fillStyle: 'cross-hatch', hachureGap: 2.5 });
RECT(ax - 39, 299, 78, 12, { stroke: MECH, fill: MECH_L, fillStyle: 'hachure', hachureGap: 4, strokeWidth: 1.3 });
for (let x = ax - 37; x <= ax + 35; x += 7) L(x, 311, x + 2, 316, { stroke: MECH, strokeWidth: 1.1 });
L(ax + 24, 262, ax + 24, 306, { stroke: MECH, strokeWidth: 3 });
TXT(ax + 30, 274, 'lock rod (B)', { size: 12, color: MECH });
{
  const py = 332, fl = py + 45, k = 3;         // pinion centre, floor (15 mm below), 3 units per mm
  const pin = [ax - 2.5 * k * Math.SQRT1_2, py - 2.5 * k * Math.SQRT1_2];
  POLY([[ax - 8 * k + (pin[0] - ax), fl], [ax + 13 * k + (pin[0] - ax), fl], [ax + 15 * k + (pin[0] - ax), fl - 2.8 * k], [ax + 13 * k + (pin[0] - ax), fl - 5 * k], [ax - 8 * k + (pin[0] - ax), fl - 5 * k]], { fill: C.orange, fillStyle: 'solid', stroke: FOOT, strokeWidth: 1.2 });
  POLY(gearPts(ax, py, 14.5, 21, 12, false), { stroke: MECH, fill: MECH_L, fillStyle: 'solid', strokeWidth: 1.2 });
  CIRC(ax, py, 2 * 2.5 * k, dashed({ stroke: MECH, strokeWidth: 1 }));
  RECT(pin[0] - 6, fl - 20 * k, 12, 15 * k, mo({ strokeWidth: 1.2 }));
  L(ax, py, pin[0], pin[1], { stroke: MECH, strokeWidth: 2.6 });
  CIRC(pin[0], pin[1], 6, { fill: MECH, fillStyle: 'solid', stroke: MECH });
  CIRC(ax, py, 6, { fill: C.steel, fillStyle: 'solid' });
  L(ax - 70, fl, ax + 48, fl, { strokeWidth: 1.4 });
  ARC_ARROW(ax, py, 27, 2.7, 0.7, { stroke: C.green, strokeWidth: 1.8, head: 8 });
  ARROW(ax + 26, fl - 7.5, ax - 4, fl - 7.5, { stroke: C.green, strokeWidth: 1.8, head: 7 });
  // ⑥ damper in section: Ø10 rotor on the D-shaft in a grease-filled cup moulded in the tray wall
  const dx = 1156, dy = 347;
  RECT(dx - 13, dy - 22, 26, 44, { stroke: INK, strokeWidth: 1.3, fill: '#e9e2d0', fillStyle: 'solid' });
  for (let i = 0; i < 26; i++) CIRC(dx - 10 + (i * 7.3) % 20, dy - 18 + ((i * 11) % 36), 1.6, { fill: '#a89a70', fillStyle: 'solid', stroke: 'none', roughness: 0.1 });
  RECT(dx - 3, dy - 15, 6, 30, { stroke: MECH, strokeWidth: 1.3, fill: MECH_L, fillStyle: 'solid' });
  L(dx - 24, dy, dx + 24, dy, { stroke: C.steel, strokeWidth: 3 });
  TXT(dx - 18, dy + 40, '⑥ grease\n    damper', { size: 12, color: INK });
}
TXT(ax + 46, 300, '④ crown 24 T (↻) keyed\n    on the hook-shaft;\n    MR52 in the roof', { size: 12.4 });
TXT(ax + 53, 344, '⑤ 12 T pinion +\n    2 cranks on the\n    D-shaft → feet (C)', { size: 12.4 });
BULLETS(1406, 92, [
  'Rubber: 3 loops of #16 band = 6 strands\n× 60 mm (0.51 g), hook to hook',
  '28 turns (≈ 40 % of the ≈ 70-turn break\npoint) → 400 J/kg × 0.51 g ≈ 200 mJ;\ntorque 2.3 N·mm, falls with turns left',
  'Crown 24 : pinion 12 → 2 crank turns per\nmotor turn. Crank torque 0.7 × 2.3 ÷ 2\n= 0.81 N·mm; walking needs ≈ 0.22\n(fins, tray rub, waddle lift), peak 0.35',
  'Undamped, the crank would race and\nempty the motor in ≈ 1 s. ⑥ Damper: Ø10\nrotor in 30 Pa·s silicone grease, 1.1 mm\ngap each face → c ≈ 0.054 N·mm·s',
  'Cadence = (τ − load) ÷ 2πc: 1.7 strides/s\nat the start, 1.4 at 5 s, ≥ 1/s for 13 s,\n≥ 0.5/s for 29 s (≈ 40 strides, 0.36 m)',
  'Worst cases (250 J/kg, load ×2, damper\n×2 or ÷2) each still walk ≥ 18 s. Weak\nrubber AND rough floor: wind 40 turns',
], { size: 12.2, gap: 3 });
TXT(1400, 424, 'head → ratchet → rubber → crown → pinion (×2) → cranks → feet;  ⑥ damper paces it', { size: 12, anchor: 'middle', color: GREY });

/* ================= B: TRIGGER (detent-held flipper crank) ================= */
BOX(1130, 445, 540, 275, 'B   TRIGGER – FLIPPER CRANK LOCK');
function lockView(ox, fired) {
  const P = [ox + 168, 528], c = 30;
  const col = fired ? C.green : RED;
  // body wall through the pivot, bulging out below the shoulder; flipper outside
  CURVE([[P[0] - 4, 484], [P[0], 528], [P[0] + 5, 585], [P[0] + 1, 650]], { strokeWidth: 2.4 });
  const fa = fired ? 70 : -5, fr = fa * Math.PI / 180;
  POLY(ellPts(P[0] + 50 * Math.cos(fr), P[1] + 50 * Math.sin(fr), 44, 10, fa), { fill: '#111', fillStyle: 'cross-hatch', hachureGap: 4, strokeWidth: 1.3 });
  // crank 6 mm: 85° when armed (against the stop), 160° when fired
  const ca = (fired ? 160 : 85) * Math.PI / 180, pin = [P[0] + c * Math.cos(ca), P[1] + c * Math.sin(ca)];
  L(P[0], P[1], pin[0], pin[1], { stroke: MECH, strokeWidth: 4 });
  CIRC(P[0], P[1], 16, { stroke: MECH, fill: MECH_L, fillStyle: 'solid' });
  // detent: fixed flexure finger + two notches on the hub, 75° apart
  const rotd = fired ? 75 : 0;
  for (const a of [220, 145]) { const aa = (a + rotd) * Math.PI / 180; CIRC(P[0] + 8 * Math.cos(aa), P[1] + 8 * Math.sin(aa), 4, { fill: '#fdfcf8', fillStyle: 'solid', stroke: INK, strokeWidth: 0.8 }); }
  CURVE([[P[0] - 30, P[1] - 24], [P[0] - 16, P[1] - 12], [P[0] - 7, P[1] - 5.5]], { stroke: INK, strokeWidth: 1.8 });
  RECT(P[0] - 34, P[1] - 30, 8, 8, { stroke: GREY, strokeWidth: 1, fill: '#bbb', fillStyle: 'solid' });
  RECT(P[0] + 4, P[1] + 14, 7, 14, { stroke: GREY, strokeWidth: 1, fill: '#bbb', fillStyle: 'solid' });
  // lock rod: stem + sprung L-arm with a slot for the crank pin
  const xs = P[0] - 80, top = pin[1];
  RECT(P[0] - 36, top - 6, 44, 12, { stroke: MECH, strokeWidth: 1.4, roughness: 0.4 });
  const wav = []; for (let i = 0; i <= 12; i++) wav.push([xs + (P[0] - 36 - xs) * i / 12, top + (i % 2 ? -3 : 3) * (i > 1 && i < 11 ? 1 : 0)]);
  PL(wav, { stroke: MECH, strokeWidth: 2.2, roughness: 0.3 });
  CIRC(pin[0], pin[1], 7, { fill: MECH, fillStyle: 'solid', stroke: MECH });
  L(xs, top, xs, top + 94.6, { stroke: MECH, strokeWidth: 4 });
  RECT(xs - 10, 588, 20, 20, { stroke: GREY, strokeWidth: 1, fill: '#ddd', fillStyle: 'hachure', hachureGap: 3 });
  // crown gear edge-on; hole = small mouth chamfer + straight bore
  RECT(ox + 12, 640, P[0] - 30 - ox, 22, { stroke: MECH, fill: MECH_L, fillStyle: 'hachure', hachureGap: 5, strokeWidth: 1.3 });
  POLY([[xs - 9, 640], [xs + 9, 640], [xs + 6, 643], [xs + 6, 655], [xs - 6, 655], [xs - 6, 643]], { stroke: MECH, fill: '#fdfcf8', fillStyle: 'solid', strokeWidth: 1, roughness: 0.3 });
  L(ox + 30, 600, ox + 30, 676, { stroke: GREY, strokeWidth: 0.9, strokeLineDash: [10, 3, 2, 3] });
  TXT(ox + 34, 612, 'motor\naxis', { size: 11, color: GREY });
  if (fired) {
    ARROW(xs + 18, 628, xs + 18, 602, { stroke: C.green, strokeWidth: 2, head: 8 });
    ARROW(ox + 60, 674, ox + 118, 674, { stroke: C.green, strokeWidth: 1.8, head: 8 });
    TXT(ox + 124, 678, 'spins', { size: 12, color: C.green });
  } else {
    TXT(P[0] + 14, P[1] + 40, 'stop', { size: 11, color: GREY });
    TXT(P[0] - 38, P[1] - 30, 'detent', { size: 11, color: GREY, anchor: 'end' });
    TXT(xs + 14, top + 26, 'spring arm', { size: 11, color: MECH });
  }
  TXT(ox + 8, 503, fired ? 'FIRED' : 'ARMED', { font: 'PH', size: 19, color: col });
  TXT(fired ? P[0] + 40 : P[0] + 30, fired ? 640 : 510, fired ? 'flipper\nDOWN' : 'flipper UP', { size: 12, color: col });
  TXT(ox + 8, 694, fired ? 'steady the head, press ≈ 0.5 N: crank lifts\nthe rod 4 mm → GO; 2nd notch holds it' : 'UP: detent 20 N·mm (bump-proof); rod\n2.5 mm into a 3 mm straight bore', { size: 12, color: fired ? C.green : INK });
}
lockView(1140, false);
lockView(1405, true);
L(1400, 490, 1400, 712, { stroke: GREY, strokeWidth: 0.8, strokeLineDash: [4, 4] });

/* ================= E: EGG (scale 1:4) ================= */
BOX(1130, 728, 540, 165, 'E   PACKS INTO THE EGG');
{
  const sx = 1178, sy = 821, ev = 1268;
  POLY(ellPts(sx, sy, 37.5, 50), { stroke: C.orange, strokeWidth: 2 });
  POLY(ellPts(sx, sy, 36, 48.5), { stroke: C.orange, strokeWidth: 0.7, roughness: 0.3 });
  // closed body hull: body y 28..84 (open neck at the top) placed at egg z = y - 42; tray at z -37..-14
  const hp = [], hn = [];
  for (let i = 0; i <= 24; i++) { const y = 28 + 56 * i / 24, hw = 25 * Math.sqrt(1 - ((y - 46) / 43) ** 2); hp.push([sx + hw, sy - (y - 42)]); hn.push([sx - hw, sy - (y - 42)]); }
  POLY(hp.concat(hn.reverse()), { stroke: INK, strokeWidth: 1.3, fill: '#2c2c31', fillStyle: 'hachure', hachureGap: 5, fillWeight: 0.6 });
  POLY([[sx - 19.5, sy + 15], [sx + 19.5, sy + 15], [sx + 21.4, sy + 18], [sx + 21.4, sy + 34], [sx + 19.5, sy + 37], [sx - 19.5, sy + 37], [sx - 21.4, sy + 34], [sx - 21.4, sy + 18]], { stroke: INK, strokeWidth: 1.3, fill: '#fff', fillStyle: 'solid' });
  L(sx - 12, sy + 21, sx + 12, sy + 21, { stroke: MECH, strokeWidth: 2 });
  CIRC(sx + 4, sy + 27, 14, { stroke: MECH, strokeWidth: 1 });
  RECT(sx - 8.5, sy + 32, 17, 3, { fill: C.steel, fillStyle: 'solid', strokeWidth: 0.5 });
  CIRC(sx - 5, sy - 28, 29, { fill: '#fdfcf8', fillStyle: 'solid', stroke: INK, strokeWidth: 1.2 });
  TXT(sx - 5, sy - 25, 'head', { size: 9.5, anchor: 'middle' });
  POLY([[sx + 12, sy - 12], [sx + 18, sy - 12], [sx + 15, sy - 30]], { fill: C.orange, fillStyle: 'solid', strokeWidth: 0.6 });
  RECT(sx - 11, sy - 12, 22, 5, { fill: C.orange, fillStyle: 'solid', strokeWidth: 0.6 });
  RECT(sx - 20, sy - 5, 28, 4, { fill: '#111', fillStyle: 'solid', strokeWidth: 0.5 }); CIRC(sx + 12, sy - 3, 8, { strokeWidth: 0.9, fill: '#ddd', fillStyle: 'solid' });
  L(sx - 19, sy + 2.5, sx + 19, sy + 2.5, { stroke: MECH, strokeWidth: 1.6 });
  RECT(sx - 20.5, sy + 4.5, 41, 3, { fill: '#111', fillStyle: 'solid', strokeWidth: 0.5 });
  RECT(sx - 20.5, sy + 8, 41, 3, { fill: '#111', fillStyle: 'solid', strokeWidth: 0.5 });
  L(sx - 20, sy + 12.5, sx + 20, sy + 12.5, { stroke: C.steel, strokeWidth: 1.6 });
  TXT(sx, 886, 'side', { size: 10.5, anchor: 'middle', color: GREY });
  // end view at the tray's lower edge (egg z = -37): inner radius 23.3 vs tray 21.4 × 21
  CIRC(ev, sy, 46.6, { stroke: C.orange, strokeWidth: 2 });
  POLY(ellPts(ev, sy, 21.4, 21), { stroke: INK, strokeWidth: 1.3, fill: '#fff', fillStyle: 'solid' });
  CIRC(ev, sy, 24, { stroke: MECH, strokeWidth: 1.2 });
  TXT(ev, sy + 38, 'tray end', { size: 10.5, anchor: 'middle', color: GREY });
}
TXT(1318, 784, 'Scale 1 : 4. The 2 body parts close into a hull', { size: 12 });
TXT(1318, 799, '(56 tall with the open neck, 46 × 50) holding the', { size: 12 });
TXT(1318, 814, 'head, beak, feet, tail + roller, lock rod, flippers,', { size: 12 });
TXT(1318, 829, 'D-shaft and bands; the tray (crown + hook-shaft,', { size: 12 });
TXT(1318, 844, 'pinion, cranks, damper, MR52, washers) at the bottom.', { size: 12 });
TXT(1318, 859, 'Tightest: tray 21.4 of 23.3 mm; hull top 3.5 mm clear.', { size: 12 });
TXT(1318, 882, 'Assembled 109 mm tall → bigger than the egg ✓', { size: 13, color: C.green });

/* ================= bottom boxes ================= */
BOX(40, 775, 268, 295, 'BIOMIMICRY');
const dx = 120, dy = 880;
POLY(ellPts(dx, dy, 22, 40), { fill: C.black, fillStyle: 'hachure', hachureGap: 3 });
POLY(ellPts(dx + 7, dy + 4, 13, 33), { fill: '#fff', fillStyle: 'solid', strokeWidth: 1 });
CIRC(dx + 2, dy - 47, 26, { fill: C.black, fillStyle: 'hachure', hachureGap: 3 });
POLY([[dx + 14, dy - 48], [dx + 28, dy - 44], [dx + 14, dy - 42]], { fill: C.orange, fillStyle: 'solid', strokeWidth: 1 });
POLY(ellPts(dx + 7, dy - 38, 3, 6, -20), { fill: C.yellow, fillStyle: 'solid', strokeWidth: 0.8 });
POLY(ellPts(dx - 16, dy - 2, 4, 22, 18), { fill: '#111', fillStyle: 'solid', strokeWidth: 1 });
POLY([[dx - 16, dy + 26], [dx - 34, dy + 44], [dx - 10, dy + 36]], { fill: C.black, fillStyle: 'solid', strokeWidth: 1 });
POLY([[dx - 6, dy + 39], [dx + 24, dy + 39], [dx + 27, dy + 42], [dx + 24, dy + 44], [dx - 6, dy + 44]], { fill: C.orange, fillStyle: 'solid', strokeWidth: 1 });
L(dx - 60, dy + 44, dx + 70, dy + 44, { stroke: GREY, strokeWidth: 1 });
ARC_ARROW(dx, dy + 44, 105, -Math.PI / 2 - 0.02, -Math.PI / 2 - 0.2, { stroke: C.green, strokeWidth: 1.8, head: 8 });
ARC_ARROW(dx, dy + 44, 105, -Math.PI / 2 + 0.02, -Math.PI / 2 + 0.2, { stroke: C.green, strokeWidth: 1.8, head: 8 });
TXT(dx + 42, dy - 50, 'waddle', { size: 13, color: C.green });
TXT(dx - 72, dy + 18, 'tail\nprop', { size: 12.5, color: GREY });
TXT(dx + 32, dy + 14, 'flat feet,\nshort steps', { size: 12.5, color: GREY });
TXT(52, 953, 'Emperors shuffle: short, low steps,\nclaws gripping the ice, body rocking\nonto the stance foot, tail as a prop.\nCopied: flat feet that never lift, claw\nfins, lean onto the pushing foot, tail\nroller. Bonus: the head swivels (it is\nthe winding key).', { size: 13.2, lh: 17 });

BOX(318, 775, 265, 295, 'HOW IT PLAYS');
TXT(332, 828, '① Raise the LEFT flipper – click: the\n     lock rod springs onto the crown.', { size: 13.2, lh: 18 });
TXT(332, 878, '② Turn the head 28× clockwise\n     (click-click…), stop beak-forward.', { size: 13.2, lh: 18 });
TXT(332, 928, '③ Set it down on its feet and tail,\n     fully wound.', { size: 13.2, lh: 18 });
TXT(332, 972, '④ Steady its head with a finger, press\n     the flipper down, let go → it shuffles\n     and waddles for ≈ 30 s.', { size: 13.2, lh: 18 });
TXT(332, 1036, 'vs Concept 1: upright WALKER; TWISTED\nrubber + crown lock pin; flipper trigger.', { size: 12.6, color: GREY });

BOX(593, 775, 262, 295, 'NUMBERS');
BULLETS(607, 830, [
  'Mass ≈ 45 g, ≈ 86 % printed PLA',
  'CG 34 mm high, 6.5 mm behind the\ncrankshaft (74 % on the feet)',
  'Motor ≈ 200 mJ; 5 s uses ≈ 52 mJ',
  'Gears m1, printed: crown 24 T →\npinion 12 T (×2), 2.5 mm cranks',
  'First 5 s: ≈ 8 strides ≈ 7 cm; walks\n≈ 30 s in all (≈ 40 strides, 0.36 m)',
  'Lock-rod side load ≤ 0.25 N\n(2.3 N·mm ÷ 9.2 mm)',
  'Bought (10): D-shaft, tail axle,\nhook-shaft, MR52, 3 bands, 2\nwashers, damping grease',
], { size: 13.2, gap: 3 });

BOX(865, 775, 255, 295, 'RULES CHECK');
BULLETS(879, 830, [
  '≥ 75 % printed PLA (≈ 86 %)',
  'All parts fit the egg (box E);\nthe built toy is bigger',
  'Holds its energy until the\nflipper is pushed down',
  'Trigger is a flipper crank – no\nremovable pin, stays together',
  'No energy stored when apart\n(rubber untwisted)',
  'Snap / press fits, printed gears:\nno glue, tools or toy parts',
  'Walks non-stop > 5 s (≥ 1\nstride/s for 13 s, then slows)',
], { size: 13.2, ticks: true, gap: 3 });

TITLE_BLOCK(1130, 903, 540, 167, {
  course: 'ENGG*2100 F26 · Design & Build · Concept Sketch',
  title: 'Concept 2: EMPEROR WADDLER',
  sheet: 'Concept 2 · sheet 1 of 1',
  theme: 'Biomimicry – emperor shuffle + waddle',
  type: 'Walking toy (walks ≥ 5 s non-stop)',
  scale: 'mm · side view 0.94 : 1 on 11×17',
});
