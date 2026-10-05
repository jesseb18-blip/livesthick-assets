/* Concept 2 - "Emperor Waddler": upright penguin standing on its "heels" (drive wheels) and tail (roller), like an emperor.
   Turn-the-head wind-up (twisted rubber motor), detent-held flipper-crank lock, rocking (eccentric) heel wheels.
   Toy coordinates in mm: x forward, y up, z to the toy's right. Motor/head axis at x = +4, z = 0.
   Drive: crown 24 T (m1) on the motor -> 10 T pinion on the heel axle (x +4, y 11) under the crown's LEFT rim (z -12)
   -> Ø22 heel wheels at z ±16. Tail roller Ø8 at x -30. CG at x -2.5, y 32. */
'use strict';
const MECH = '#6a3fb0', MECH_L = '#cbb8ec';
const V = (x0, y0, s) => ({ X: (x) => x0 + x * s, Y: (y) => y0 - y * s, s });
function ELL_ARROW(cx, cy, rx, ry, a0, a1, o = {}) {
  const pts = ellPts(cx, cy, rx, ry, 0, a0, a1, 24);
  CURVE(pts, o);
  const p = pts[pts.length - 1], q = pts[pts.length - 3];
  ARROW(q[0], q[1], p[0], p[1], Object.assign({}, o, { head: o.head || 10 }));
}
const mo = (o = {}) => dashed(Object.assign({ stroke: MECH, strokeWidth: 1.6 }, o));
// body outline (mm) above the base: ellipse centre (cx, 46), half-depth rx, half-height 43, cut at y = 23
function bodyArc(Vw, cx, rx, ry, t0, t1, n = 30) { const p = []; for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; p.push([Vw.X(cx + rx * Math.cos(t)), Vw.Y(46 + ry * Math.sin(t))]); } return p; }
const TC = Math.asin(-23 / 43);   // angle where the body meets the base top (y = 23)

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
POLY(ellPts(m.X(-1), m.Y(47), 5 * m.s, 21 * m.s, 12), { fill: '#111', fillStyle: 'cross-hatch', hachureGap: 4, strokeWidth: 1.5 });
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
// base: oval tray under the body; feet hover 2 mm as a front stop; tail strut + roller = 3rd wheel
POLY([[m.X(-15.5), m.Y(23)], [m.X(23.5), m.Y(23)], [m.X(25.4), m.Y(19)], [m.X(25.4), m.Y(7)], [m.X(23.5), m.Y(3)], [m.X(-15.5), m.Y(3)], [m.X(-17.4), m.Y(7)], [m.X(-17.4), m.Y(19)]], { fill: '#fff', fillStyle: 'solid', strokeWidth: 1.8 });
POLY([[m.X(17), m.Y(11)], [m.X(26), m.Y(10)], [m.X(34), m.Y(4.5)], [m.X(33.5), m.Y(2)], [m.X(17), m.Y(2)]], { fill: C.orange, fillStyle: 'solid', stroke: '#9a4a06', strokeWidth: 1.4 });
for (const t of [4, 7.2]) L(m.X(27), m.Y(t + 1), m.X(32.5), m.Y(t - 0.6), { stroke: '#9a4a06', strokeWidth: 1.2 });
POLY([[m.X(-19), m.Y(31)], [m.X(-31.5), m.Y(6)], [m.X(-28.5), m.Y(5)], [m.X(-16), m.Y(25)]], { fill: C.black, fillStyle: 'solid', strokeWidth: 1.3 });
CIRC(m.X(-30), m.Y(4), 8 * m.s, { stroke: INK, strokeWidth: 1.8, fill: '#ddd', fillStyle: 'solid' });
CIRC(m.X(-30), m.Y(4), 4, { fill: INK, fillStyle: 'solid' });
function wheel(Vw, cx, cy, r, ecc) {
  CIRC(Vw.X(cx), Vw.Y(cy), 2 * r * Vw.s, dashed({ stroke: C.orange, strokeWidth: 1.5 }));
  const pts = []; for (let i = 0; i <= 12; i++) { const a = Math.PI * (0.32 + 0.36 * i / 12); pts.push([Vw.X(cx) + r * Vw.s * Math.cos(a), Vw.Y(cy) + r * Vw.s * Math.sin(a)]); }
  CURVE(pts, { stroke: INK, strokeWidth: 3.4, roughness: 0.4 });
  CIRC(Vw.X(cx), Vw.Y(cy), 5, { fill: INK, fillStyle: 'solid', roughness: 0.2 });
  if (ecc) CIRC(Vw.X(cx), Vw.Y(cy + ecc), 2 * 2.2 * Vw.s, { stroke: INK, strokeWidth: 1, roughness: 0.3 });
}
wheel(m, 4, 11, 11, 0.5);
// mechanism: crown hangs from a thrust face under the base top; 10 T pinion on the heel axle (far side)
RECT(m.X(-8), m.Y(20.5), 24 * m.s, 3.5 * m.s, mo({ fill: MECH_L, fillStyle: 'hachure', hachureGap: 4 }));
for (let x = -7.5; x <= 15.5; x += 1.9) L(m.X(x), m.Y(17), m.X(x + 0.5), m.Y(15.2), { stroke: MECH, strokeWidth: 1, roughness: 0.3 });
L(m.X(4), m.Y(20.5), m.X(4), m.Y(25), { stroke: C.steel, strokeWidth: 3 });
POLY([[m.X(3), m.Y(21.6)], [m.X(5), m.Y(21.6)], [m.X(4), m.Y(20.5)]], { fill: C.steel, fillStyle: 'solid', strokeWidth: 0.6 });
POLY(gearPts(m.X(4), m.Y(11), 4.2 * m.s, 5.6 * m.s, 10, false), mo({ fill: MECH_L, fillStyle: 'solid', strokeWidth: 1.2 }));
RECT(m.X(-15.5), m.Y(7), 17 * m.s, 3.2 * m.s, dashed({ stroke: '#555', fill: C.steel, fillStyle: 'cross-hatch', hachureGap: 3 }));
TWIST(m.X(4), m.Y(22), m.X(4), m.Y(79), 9, { strokeLineDash: [6, 3] });
L(m.X(4), m.Y(79), m.X(4), m.Y(101), { stroke: MECH, strokeWidth: 3 });
RECT(m.X(-1), m.Y(87), 10 * m.s, 3 * m.s, { stroke: MECH, fill: MECH_L, fillStyle: 'cross-hatch', hachureGap: 3, strokeWidth: 1.2 });
// trigger linkage (left flipper, far side): pivot + crank, sprung L-arm, lock rod down into a crown hole
CIRC(m.X(4), m.Y(66), 13, { stroke: MECH, fill: MECH_L, fillStyle: 'solid', strokeWidth: 1.4 });
L(m.X(4), m.Y(66), m.X(4), m.Y(60), { stroke: MECH, strokeWidth: 2.6 });
L(m.X(4), m.Y(60), m.X(7.5), m.Y(60), mo({ strokeWidth: 2.2 }));
L(m.X(7.5), m.Y(60), m.X(7.5), m.Y(18), mo({ strokeWidth: 2.4, strokeLineDash: [9, 4] }));
RECT(m.X(5.7), m.Y(40), 3.6 * m.s, 5 * m.s, { stroke: GREY, strokeWidth: 1, fill: '#ddd', fillStyle: 'hachure', hachureGap: 3 });
// centre of mass
CIRC(m.X(-2.5), m.Y(32), 18, { strokeWidth: 1.6, stroke: RED, fill: '#fdfcf8', fillStyle: 'solid' });
L(m.X(-2.5) - 12, m.Y(32), m.X(-2.5) + 12, m.Y(32), { stroke: RED, strokeWidth: 1.2 });
L(m.X(-2.5), m.Y(32) - 12, m.X(-2.5), m.Y(32) + 12, { stroke: RED, strokeWidth: 1.2 });
TXT(m.X(-2.5) - 14, m.Y(32) - 10, 'CG', { size: 13, color: RED, anchor: 'end', halo: 4 });

// callouts - left column
CALL(m.X(0), m.Y(115), 48, 128, 'HEAD = WINDING KEY\nturn it 28× clockwise\n(seen from above)', { start: true, size: 13.5 });
CALL(m.X(-1), m.Y(85.5), 48, 212, 'NECK RATCHET\n12 teeth + flexure\npawl: winds one way', { start: true, size: 13.5 });
CALL(m.X(4), m.Y(60), 48, 296, 'RUBBER MOTOR\n2 loops of #16 band\n= 4 strands × 60 mm', { start: true, size: 13.5 });
CALL(m.X(-21), m.Y(55), 48, 382, 'BODY: black back\nshell + white belly\ncap (2 snap-fit parts)', { start: true, size: 13.5 });
CALL(m.X(-9), m.Y(5.4), 48, 466, '2 M8 STEEL WASHERS\nlow at the back\n→ CG low + behind', { start: true, size: 13.5 });
CALL(m.X(-30), m.Y(0.5), 48, 545, 'TAIL + Ø8 ROLLER\n= 3rd wheel', { start: true, size: 13.5 });
// right column
CALL(m.X(4.6), m.Y(66.6), 482, 300, 'TRIGGER PIVOT\n+ crank (left\nflipper, far side)', { start: true, size: 13 });
CALL(m.X(7.5), m.Y(33), 482, 385, 'LOCK ROD in a\nguide (see B)', { start: true, size: 13 });
CALL(m.X(15), m.Y(18.5), 482, 448, 'CROWN 24 T hangs\non a pointed pin', { start: true, size: 13 });
CALL(m.X(24.5), m.Y(15), 482, 512, 'BASE: oval tray,\nwheel slots on top', { start: true, size: 13 });
// below the floor
CALL(m.X(4), m.Y(0.4), 48, 690, 'HEEL WHEELS: Ø22, O-ring tyres,\n0.5 mm eccentric hubs (C)', { start: true, size: 13 });
CALL(m.X(4), m.Y(11), 300, 744, 'PINION 10 T on the heel axle\n(left side, under the crown)', { start: true, size: 13 });
CALL(m.X(28), m.Y(2.4), 390, 690, 'FEET hover 2 mm\n(front stop)', { start: true, size: 13 });

DIM(m.X(40), m.Y(0), m.X(40), m.Y(108.5), '109 tall', 0);
DIM(m.X(-30), m.Y(0), m.X(4), m.Y(0), 'tail ↔ heel 34', 22);
DIM(m.X(-34), m.Y(0), m.X(37), m.Y(0), '71 long', 48);

/* ================= FRONT VIEW (armed) ================= */
const f = V(775, 372, 2.5);   // u = -z: the viewer's right is the toy's LEFT
const U = (u) => f.X(u);
TXT(600, 62, 'FRONT VIEW (armed)', { font: 'PH', size: 22 });
TXT(788, 62, 'scale 0.64 : 1', { size: 13, color: GREY });
FLOOR(U(-34), U(68), f.Y(0));
const fcx = U(0);
POLY(bodyArc(f, 0, 23, 43, TC, Math.PI - TC, 50), { fill: C.black, fillStyle: 'hachure', hachureGap: 3, strokeWidth: 1.9 });
POLY(bodyArc({ X: f.X, Y: (y) => f.Y(y - 2) }, 0, 15.5, 39, Math.asin(-21 / 39), Math.PI - Math.asin(-21 / 39), 40), { fill: '#fff', fillStyle: 'solid', strokeWidth: 1.1, stroke: GREY });
POLY(ellPts(fcx, f.Y(95), 13.5 * f.s, 13.5 * f.s), { fill: C.black, fillStyle: 'hachure', hachureGap: 3, hachureAngle: -35, strokeWidth: 1.8 });
for (const sg of [1, -1]) {
  POLY(ellPts(U(sg * 10.5), f.Y(85), 3.4 * f.s, 7 * f.s, sg * 14), { fill: C.yellow, fillStyle: 'solid', strokeWidth: 1 });
  CIRC(U(sg * 6.5), f.Y(99), 2.6 * f.s, { fill: '#000', fillStyle: 'solid' });
}
POLY([[U(-3), f.Y(94)], [U(3), f.Y(94)], [U(0), f.Y(87)]], { fill: C.orange, fillStyle: 'solid', strokeWidth: 1.1 });
L(U(-11.5), f.Y(84), U(11.5), f.Y(84), { stroke: '#fff', strokeWidth: 2.6, roughness: 0.4 });
L(U(-11.5), f.Y(84), U(11.5), f.Y(84), { stroke: INK, strokeWidth: 1, strokeLineDash: [5, 3] });
POLY([[U(-19.5), f.Y(23)], [U(19.5), f.Y(23)], [U(21), f.Y(20)], [U(21), f.Y(6)], [U(19.5), f.Y(3)], [U(-19.5), f.Y(3)], [U(-21), f.Y(6)], [U(-21), f.Y(20)]], { fill: '#fff', fillStyle: 'solid', strokeWidth: 1.7 });
for (const sg of [1, -1]) {
  RECT(U(sg * 16 - 2), f.Y(22), 4 * f.s, 22 * f.s, dashed({ stroke: C.orange, strokeWidth: 1.3 }));
  L(U(sg * 16 - 2), f.Y(0.5), U(sg * 16 + 2), f.Y(0.5), { strokeWidth: 3.4, roughness: 0.3 });
  POLY(ellPts(U(sg * 9), f.Y(4.6), 8.5 * f.s, 2.6 * f.s), { fill: C.orange, fillStyle: 'solid', stroke: '#9a4a06', strokeWidth: 1.2 });
}
L(U(-19), f.Y(11), U(19), f.Y(11), dashed({ stroke: C.steel, strokeWidth: 1.4 }));
// hidden drive: motor, crown (edge on), pinion under the crown's left rim (viewer's right)
TWIST(U(0), f.Y(22), U(0), f.Y(79), 9, { strokeLineDash: [6, 3] });
RECT(U(-12.5), f.Y(20.5), 25 * f.s, 5.5 * f.s, mo({ fill: MECH_L, fillStyle: 'hachure', hachureGap: 4 }));
RECT(U(10.5), f.Y(17), 2.5 * f.s, 12 * f.s, mo({ fill: MECH_L, fillStyle: 'solid' }));
// right flipper hangs; left flipper (trigger) raised = ARMED; crank points down to the lock rod arm
POLY(ellPts(U(-25), f.Y(48), 4.5 * f.s, 22 * f.s, 8), { fill: '#111', fillStyle: 'cross-hatch', hachureGap: 4, strokeWidth: 1.4 });
POLY(ellPts(U(42), f.Y(67.5), 21 * f.s, 4.5 * f.s, -6), { fill: '#111', fillStyle: 'cross-hatch', hachureGap: 4, strokeWidth: 1.4 });
L(U(21), f.Y(66), U(21.5), f.Y(60), { stroke: MECH, strokeWidth: 2.4 });
L(U(22.5), f.Y(60), U(8.5), f.Y(60), mo({ strokeWidth: 2 }));
L(U(8.5), f.Y(60), U(8.5), f.Y(18), mo({ strokeWidth: 2.2, strokeLineDash: [9, 4] }));
CIRC(U(21), f.Y(66), 11, { stroke: MECH, fill: MECH_L, fillStyle: 'solid', strokeWidth: 1.3 });
ARC_ARROW(U(21), f.Y(66), 30 * f.s, -0.12, 1.15, { stroke: RED, strokeWidth: 2.2 });
// waddle
const wr = 118 * f.s;
ARC_ARROW(fcx, f.Y(0), wr, -Math.PI / 2 + 0.01, -Math.PI / 2 + 0.11, { stroke: C.green, strokeWidth: 2 });
ARC_ARROW(fcx, f.Y(0), wr, -Math.PI / 2 - 0.01, -Math.PI / 2 - 0.11, { stroke: C.green, strokeWidth: 2 });
TXT(fcx + 42, 86, 'rocks ±1.8° (C)', { size: 13.5, color: C.green });
// callouts
CALL(U(-9), f.Y(84.5), 606, 150, 'HEAD TURNS\non the neck\nring', { start: true, size: 13 });
CALL(U(-21), f.Y(15), 606, 296, 'BASE: oval\ntray, 42 wide', { start: true, size: 13 });
CALL(U(-16), f.Y(1), 606, 350, 'heel wheels\n(track 32)', { start: true, size: 13 });
CALL(U(57), f.Y(70.5), 950, 135, 'TRIGGER = LEFT\nflipper; raised\n= ARMED (locked)', { start: true, size: 13 });
TXT(U(34), f.Y(36), 'push it\ndown → GO', { size: 14, color: RED });
CALL(U(8.5), f.Y(50), 950, 240, 'lock rod (B)', { start: true, size: 13 });
CALL(U(12), f.Y(11), 950, 330, 'pinion 10 T\n(toy’s left)', { start: true, size: 13 });
DIM(U(-21), f.Y(0), U(21), f.Y(0), '42 base', 18);
DIM(U(-30), f.Y(0), U(63), f.Y(0), '≈ 93 with the flipper raised', 40);

/* ================= C: WADDLE ================= */
BOX(600, 448, 250, 317, 'C   WADDLE');
for (const [cx, sg, lab] of [[665, -1, 'LEFT wheel'], [785, 1, 'RIGHT wheel']]) {
  CIRC(cx, 528, 64, { stroke: C.orange, strokeWidth: 3 });
  CIRC(cx, 528, 54, { strokeWidth: 1.6 });
  L(cx - 5, 528, cx + 5, 528, { stroke: GREY, strokeWidth: 1 }); L(cx, 523, cx, 533, { stroke: GREY, strokeWidth: 1 });
  CIRC(cx, 528 + sg * 6, 9, { fill: INK, fillStyle: 'solid' });
  TXT(cx, 578, lab, { size: 12.5, anchor: 'middle' });
}
L(665, 522, 785, 534, { stroke: C.steel, strokeWidth: 2.4, strokeLineDash: [6, 4] });
TXT(725, 600, 'axle hole 0.5 mm off-centre,\nopposite sides (drawn ×4)', { size: 12.5, anchor: 'middle', color: GREY });
TXT(610, 640, 'Roll = atan(1 ÷ 32 mm track) ≈ ±1.8°\nper wheel turn; the single tail roller\nlets the body rock. It follows while\nI·θ·ω² < m·g·track/2 (I ≈ 8.5×10⁻⁵\nkg·m²): below 0.55 m/s, i.e. at the\nstart and the last ≈ 1 m. Faster, the\nheels hop 0.5 mm in turn (2.6 mJ/m,\ncounted in the run model).', { size: 12.6, lh: 15.4 });

/* ================= D: STANCE ================= */
BOX(860, 448, 260, 317, 'D   HEELS + TAIL STANCE');
const dg = 600, hx0 = 1012, ds = 2.3;
L(875, dg, 1105, dg, { strokeWidth: 1.4 });
CIRC(hx0, dg - 11 * ds, 22 * ds, { stroke: C.orange, strokeWidth: 1.6 });
CIRC(hx0, dg - 11 * ds, 5, { fill: INK, fillStyle: 'solid' });
CIRC(hx0 - 34 * ds, dg - 4 * ds, 8 * ds, { stroke: INK, strokeWidth: 1.6 });
PL([[hx0 - 34 * ds, dg - 4 * ds], [hx0 - 26 * ds, dg - 26 * ds]], { strokeWidth: 3 });
TXT(hx0 - 34 * ds - 4, dg - 28 * ds, 'tail', { size: 11.5, color: GREY, anchor: 'middle' });
PL([[hx0 + 14 * ds, dg - 2 * ds], [hx0 + 30 * ds, dg - 2 * ds]], { stroke: C.orange, strokeWidth: 4 });
TXT(hx0 + 22 * ds, dg - 2 * ds - 8, 'feet', { size: 11.5, color: GREY, anchor: 'middle' });
const cgx = hx0 - 6.5 * ds, cgy = dg - 32 * ds;
CIRC(cgx, cgy, 16, { stroke: RED, strokeWidth: 1.4 });
L(cgx - 10, cgy, cgx + 10, cgy, { stroke: RED }); L(cgx, cgy - 10, cgx, cgy + 10, { stroke: RED });
L(cgx, cgy + 8, cgx, dg, { stroke: RED, strokeWidth: 1, strokeLineDash: [4, 3] });
TXT(cgx - 12, cgy - 8, 'CG', { size: 13, color: RED, anchor: 'end' });
DIM(cgx, dg, hx0, dg, 'd 6.5', 12);
L(cgx + 8, cgy, hx0 + 84, cgy, { stroke: GREY, strokeWidth: 0.8, strokeLineDash: [3, 3] });
DIM(hx0 + 80, dg, hx0 + 80, cgy, 'h 32', 0);
TXT(872, 645, 'Stands like an emperor: on its heels\n(drive wheels) and stiff tail (roller);\nthe feet hover 2 mm as a front stop.\nLaunch a = 25 mN ÷ 44 g ≈ 0.6 m/s²\njust loads the tail – no wheelie.\nNose-dive needs a = g·d/h ≈ 2.0 m/s²;\ncoasting slows at < 0.5 m/s² ✓\nSide tip needs 20°; waddle ±1.8° ✓', { size: 12.6, lh: 15.4 });

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
TWIST(ax, 178, ax, 296, 8);
TXT(ax + 18, 232, '③ rubber motor\n4 strands × 60 mm', { size: 12.6 });
// crown (side), hanging from a thrust face; pinion on the heel axle; heel wheel
RECT(ax - 30, 284, 60, 6, { stroke: GREY, strokeWidth: 1, fill: '#bbb', fillStyle: 'cross-hatch', hachureGap: 3 });
L(ax - 8, 290, ax - 8, 299, { stroke: C.steel, strokeWidth: 3 });
RECT(ax - 39, 299, 78, 12, { stroke: MECH, fill: MECH_L, fillStyle: 'hachure', hachureGap: 4, strokeWidth: 1.3 });
for (let x = ax - 37; x <= ax + 35; x += 7) L(x, 311, x + 2, 316, { stroke: MECH, strokeWidth: 1.1 });
L(ax + 24, 262, ax + 24, 306, { stroke: MECH, strokeWidth: 3 });
TXT(ax + 30, 274, 'lock rod (B)', { size: 12, color: MECH });
CIRC(ax, 333, 72, dashed({ stroke: C.orange, strokeWidth: 1.6 }));
POLY(gearPts(ax, 333, 13, 17, 10, false), { stroke: MECH, fill: MECH_L, fillStyle: 'solid', strokeWidth: 1.2 });
CIRC(ax, 333, 6, { fill: C.steel, fillStyle: 'solid' });
L(ax - 60, 369, ax + 45, 369, { strokeWidth: 1.4 });
ARC_ARROW(ax, 333, 46, -2.6, -1.4, { stroke: C.green, strokeWidth: 1.8, head: 8 });
TXT(ax + 46, 300, '④ crown 24 T (↻)\n    hangs on a steel pin', { size: 12.4 });
TXT(ax + 44, 338, '⑤ 10 T pinion on the heel\n    axle, under the crown’s\n    left rim → rolls forward', { size: 12.4 });
BULLETS(1406, 92, [
  'Rubber: 2 loops of #16 band = 4 strands\n× 60 mm (0.34 g), hook to hook',
  '28 turns (≈ 1/3 of the ~90-turn break\npoint) → 400 J/kg × 0.34 g ≈ 135 mJ',
  '400 J/kg is our low assumption; we will\nmeasure torque vs turns (a 3rd loop\nadds 50 % if needed)',
  'Drag (Crr 0.015): rolling 6.5 + heel bores\n6.2 + tail roller 4.5 = 17 mN; η 0.72 incl.\nthe pin → 2.5 m needs ≈ 62 mJ (2.2×)',
  'Crown 24 : pinion 10 → 2.4 wheel turns\nper motor turn; 28 turns = 4.6 m',
  'Time-step model (torque ∝ turns left,\nwaddle hops): run ≈ 4.6 m, top 1.0 m/s;\nworst case (250 J/kg) 3.1 m. Unwound, the\nhead free-spins on its ratchet as it coasts.',
], { size: 12.2, gap: 3 });
TXT(1400, 424, 'head → ratchet → rubber → crown 24T → pinion 10T on the heel axle → wheels (×2.4)', { size: 12, anchor: 'middle', color: GREY });

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
  TXT(ox + 8, 694, fired ? 'light press 0.07 N (tipping needs 5 N·mm);\n2nd notch holds it, rod 4 mm up → GO' : 'UP: detent 3 N·mm (15× flipper weight);\nrod 2.5 mm into a 3 mm straight bore', { size: 12, color: fired ? C.green : INK });
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
  // closed body hull: body y 23..84 (open neck at the top) placed at egg z = y - 40; tray at z -37..-17
  const hp = [], hn = [];
  for (let i = 0; i <= 24; i++) { const y = 23 + 61 * i / 24, hw = 25 * Math.sqrt(1 - ((y - 46) / 43) ** 2); hp.push([sx + hw, sy - (y - 40)]); hn.push([sx - hw, sy - (y - 40)]); }
  POLY(hp.concat(hn.reverse()), { stroke: INK, strokeWidth: 1.3, fill: '#2c2c31', fillStyle: 'hachure', hachureGap: 5, fillWeight: 0.6 });
  POLY([[sx - 19.5, sy + 17], [sx + 19.5, sy + 17], [sx + 21.4, sy + 20], [sx + 21.4, sy + 34], [sx + 19.5, sy + 37], [sx - 19.5, sy + 37], [sx - 21.4, sy + 34], [sx - 21.4, sy + 20]], { stroke: INK, strokeWidth: 1.3, fill: '#fff', fillStyle: 'solid' });
  L(sx - 12, sy + 27, sx + 12, sy + 27, { stroke: MECH, strokeWidth: 2 });
  RECT(sx - 8.5, sy + 31, 17, 2.5, { fill: C.steel, fillStyle: 'solid', strokeWidth: 0.5 });
  CIRC(sx - 2, sy - 25, 29, { fill: '#fdfcf8', fillStyle: 'solid', stroke: INK, strokeWidth: 1.2 });
  TXT(sx - 2, sy - 22, 'head', { size: 9.5, anchor: 'middle' });
  POLY([[sx + 13, sy - 30], [sx + 17, sy - 30], [sx + 15, sy - 38]], { fill: C.orange, fillStyle: 'solid', strokeWidth: 0.6 });
  for (const z of [4, 9]) RECT(sx - 11, sy - z - 2, 22, 4, { stroke: C.orange, strokeWidth: 1.1, fill: '#fdfcf8', fillStyle: 'solid' });
  for (const x of [-18.5, 16]) RECT(sx + x, sy - 30, 2.5, 42, { fill: '#111', fillStyle: 'solid', strokeWidth: 0.5 });
  L(sx + 8, sy + 14, sx + 8, sy - 22, { stroke: MECH, strokeWidth: 1.4 });
  RECT(sx - 13, sy + 6, 9, 5, { fill: C.orange, fillStyle: 'solid', strokeWidth: 0.5 });
  PL([[sx - 3, sy + 12], [sx - 9, sy + 2]], { strokeWidth: 2 }); CIRC(sx - 3, sy + 13, 4, { strokeWidth: 0.8 });
  TXT(sx, 886, 'side', { size: 10.5, anchor: 'middle', color: GREY });
  // end view at the tray's lower edge (egg z = -37): inner radius 23.3 vs tray 21.4 × 21
  CIRC(ev, sy, 46.6, { stroke: C.orange, strokeWidth: 2 });
  POLY(ellPts(ev, sy, 21.4, 21), { stroke: INK, strokeWidth: 1.3, fill: '#fff', fillStyle: 'solid' });
  CIRC(ev, sy, 24, { stroke: MECH, strokeWidth: 1.2 });
  TXT(ev, sy + 38, 'tray end', { size: 10.5, anchor: 'middle', color: GREY });
}
TXT(1318, 784, 'Scale 1 : 4. The 2 body parts close into a hull', { size: 12 });
TXT(1318, 799, '(61 tall with the open neck, 46 × 50) holding the', { size: 12 });
TXT(1318, 814, 'head, beak, wheels, flippers, tail + roller, feet,', { size: 12 });
TXT(1318, 829, 'rod, pinion, axles and bands; the oval tray (crown,', { size: 12 });
TXT(1318, 844, 'washers, pin inside) sits in the bottom of the egg.', { size: 12 });
TXT(1318, 859, 'Tightest: tray 21.4 of 23.3 mm; body top 4.5 mm clear.', { size: 12 });
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
POLY([[dx - 4, dy + 40], [dx + 26, dy + 34], [dx + 24, dy + 39], [dx - 2, dy + 44]], { fill: C.orange, fillStyle: 'solid', strokeWidth: 1 });
L(dx - 60, dy + 44, dx + 70, dy + 44, { stroke: GREY, strokeWidth: 1 });
ARC_ARROW(dx, dy + 44, 105, -Math.PI / 2 - 0.02, -Math.PI / 2 - 0.2, { stroke: C.green, strokeWidth: 1.8, head: 8 });
ARC_ARROW(dx, dy + 44, 105, -Math.PI / 2 + 0.02, -Math.PI / 2 + 0.2, { stroke: C.green, strokeWidth: 1.8, head: 8 });
TXT(dx + 42, dy - 50, 'waddle', { size: 13, color: C.green });
TXT(dx - 72, dy + 18, 'tail\nprop', { size: 12.5, color: GREY });
TXT(dx + 32, dy + 14, 'heels,\ntoes up', { size: 12.5, color: GREY });
TXT(52, 953, 'Emperor penguins rest on their heels\nand stiff tail with toes lifted, and\nwaddle side to side. Copied: heel drive\nwheels + tail roller (3-point stance),\nlow CG, rocking wheels. Bonus: the\nhead swivels (it is the winding key).', { size: 13.2, lh: 17 });

BOX(318, 775, 265, 295, 'HOW IT PLAYS');
TXT(332, 828, '① Raise the LEFT flipper – click: the\n     lock rod springs onto the crown.', { size: 13.2, lh: 18 });
TXT(332, 878, '② Turn the head 28× clockwise\n     (click-click…), stop beak-forward.', { size: 13.2, lh: 18 });
TXT(332, 928, '③ Set it down – it stands on its\n     heels and tail, fully wound.', { size: 13.2, lh: 18 });
TXT(332, 978, '④ Press the flipper down lightly →\n     it waddles off, ≈ 4.6 m.', { size: 13.2, lh: 18 });
TXT(332, 1030, 'vs Concept 1: upright body, twisted\nrubber motor (turn key), flipper trigger.', { size: 12.6, color: GREY });

BOX(593, 775, 262, 295, 'NUMBERS');
BULLETS(607, 830, [
  'Mass ≈ 44 g, ≈ 86 % printed PLA',
  'CG 32 mm high, 6.5 mm behind the\nheel axle (81 % on the heels)',
  'Motor ≈ 135 mJ; 2.5 m needs ≈ 62 mJ',
  'Gears m1, printed: crown 24 T →\npinion 10 T (×2.4)',
  'Run ≈ 4.6 m (worst case 3.1 m),\ntop speed ≈ 1.0 m/s',
  'Lock-rod side load ≤ 0.17 N\n(1.54 N·mm ÷ 9.2 mm)',
  'Bought (9): 2 axles + 1 pivot pin\n(steel), 2 O-rings, 2 bands, 2 washers',
], { size: 13.2, gap: 3 });

BOX(865, 775, 255, 295, 'RULES CHECK');
BULLETS(879, 830, [
  '≥ 75 % printed PLA (≈ 86 %)',
  'All parts fit the egg (box E);\nthe built toy is bigger',
  'Holds its energy until the\nflipper is pushed down',
  'Trigger is a flipper crank – no\nremovable pin, stays together',
  'No energy stored when apart\n(rubber untwisted)',
  'Snap / press fits: no glue, no tools',
  'Gears are our printed parts,\nnot commercial toy parts',
], { size: 13.2, ticks: true, gap: 3 });

TITLE_BLOCK(1130, 903, 540, 167, {
  course: 'ENGG*2100 F26 · Design & Build · Concept Sketch',
  title: 'Concept 2: EMPEROR WADDLER',
  sheet: 'Concept 2 · sheet 1 of 1',
  theme: 'Biomimicry – emperor stance + waddle',
  type: 'Running toy (≥ 2.5 m)',
  scale: 'mm · side view 0.94 : 1 on 11×17',
});
