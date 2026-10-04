/* Concept 2 - "Emperor Waddler": upright penguin, turn-the-head wind-up (twisted rubber motor), over-centre flipper-crank lock,
   rocking ("waddle") rear wheels. Toy coordinates in mm: x forward, y up, z to the toy's right; motor axis at x = -2, z = 0.
   Drive: crown 32 T (m1) on the motor -> 10 T pinion on a countershaft under the crown's RIGHT rim (z +16) -> 12 T : 12 T spur pair
   outboard at z +24 -> rear axle at x -14. Rear wheels Ø20 at z ±19.5; single Ø12 front roller at x 18, z 0. */
'use strict';
const MECH = '#6a3fb0', MECH_L = '#cbb8ec';
const V = (x0, y0, s) => ({ X: (x) => x0 + x * s, Y: (y) => y0 - y * s, s });
// arrow along an ellipse arc (screen angles, y down)
function ELL_ARROW(cx, cy, rx, ry, a0, a1, o = {}) {
  const pts = ellPts(cx, cy, rx, ry, 0, a0, a1, 24);
  CURVE(pts, o);
  const p = pts[pts.length - 1], q = pts[pts.length - 3];
  ARROW(q[0], q[1], p[0], p[1], Object.assign({}, o, { head: o.head || 10 }));
}
const mo = (o = {}) => dashed(Object.assign({ stroke: MECH, strokeWidth: 1.6 }, o));

SHEET_BORDER();

/* ================= SIDE VIEW (from the toy's right) ================= */
const m = V(318, 590, 3.7);
TXT(48, 62, 'SIDE VIEW', { font: 'PH', size: 22 });
TXT(48, 84, 'from the right · scale 0.94 : 1 · dashed = hidden · purple = mechanism', { size: 13, color: GREY });
FLOOR(m.X(-44), m.X(40), m.Y(0));

// body: black back + white belly; split into 4 quarter-shells (side seam + waist)
const bcx = m.X(-2), bcy = m.Y(46), bry = 43 * m.s;
POLY(ellPts(bcx, bcy, 15.5 * m.s, bry, 0, -Math.PI / 2, Math.PI / 2, 30).concat(ellPts(bcx, bcy, 25 * m.s, bry, 0, Math.PI / 2, Math.PI * 1.5, 40)),
  { fill: C.black, fillStyle: 'hachure', hachureGap: 3.2, hachureAngle: -40, fillWeight: 1.1, stroke: 'none', strokeWidth: 0.1 });
POLY(ellPts(bcx, bcy, 25 * m.s, bry), { strokeWidth: 2 });
CURVE(ellPts(bcx, bcy, 15.5 * m.s, bry, 0, -Math.PI / 2, Math.PI / 2, 20), { stroke: GREY, strokeWidth: 1 });
L(m.X(-26.5), m.Y(46), m.X(22.5), m.Y(46), { stroke: GREY, strokeWidth: 1, strokeLineDash: [4, 4] });
// near (right) flipper, hanging
POLY(ellPts(m.X(-3), m.Y(47), 5 * m.s, 21 * m.s, 12), { fill: '#111', fillStyle: 'cross-hatch', hachureGap: 4, strokeWidth: 1.5 });
// head: separate part on a turning neck joint
POLY(ellPts(m.X(0), m.Y(95), 15 * m.s, 13.5 * m.s), { fill: C.black, fillStyle: 'hachure', hachureGap: 3, hachureAngle: -35, strokeWidth: 1.9 });
POLY(ellPts(m.X(3.5), m.Y(86.5), 4.2 * m.s, 7.5 * m.s, -22), { fill: C.yellow, fillStyle: 'solid', strokeWidth: 1.1 });
POLY([[m.X(13.5), m.Y(99)], [m.X(32), m.Y(92.5)], [m.X(14.2), m.Y(94.2)]], { fill: '#2b2b2b', fillStyle: 'solid', strokeWidth: 1.2 });
POLY([[m.X(14.2), m.Y(94.2)], [m.X(30), m.Y(92.6)], [m.X(14), m.Y(92.4)]], { fill: C.orange, fillStyle: 'solid', strokeWidth: 0.9 });
CIRC(m.X(8.5), m.Y(99.5), 3 * m.s, { fill: '#000', fillStyle: 'solid', strokeWidth: 1 });
L(m.X(-13.7), m.Y(84), m.X(9.7), m.Y(84), { stroke: '#fff', strokeWidth: 3, roughness: 0.4 });
L(m.X(-13.7), m.Y(84), m.X(9.7), m.Y(84), { stroke: INK, strokeWidth: 1.1, strokeLineDash: [5, 3] });
ELL_ARROW(m.X(-2), m.Y(113), 13 * m.s, 4 * m.s, 0.2, Math.PI - 0.2, { stroke: RED, strokeWidth: 2.6 });
// base (white chassis hides wheels + gears), feet fairing over the front roller, tail skid
POLY([[m.X(-27), m.Y(21.5)], [m.X(10), m.Y(21.5)], [m.X(10), m.Y(3)], [m.X(-24), m.Y(3)], [m.X(-28), m.Y(12)]], { fill: '#fff', fillStyle: 'solid', strokeWidth: 1.8 });
POLY([[m.X(9), m.Y(14)], [m.X(22), m.Y(12.5)], [m.X(31), m.Y(6)], [m.X(30.5), m.Y(3.5)], [m.X(9), m.Y(3.5)]], { fill: C.orange, fillStyle: 'solid', stroke: '#9a4a06', strokeWidth: 1.4 });
for (const t of [5, 8.5]) L(m.X(24), m.Y(t + 1), m.X(30), m.Y(t - 0.6), { stroke: '#9a4a06', strokeWidth: 1.2 });
POLY([[m.X(-23), m.Y(27)], [m.X(-38), m.Y(2.5)], [m.X(-27.5), m.Y(17)]], { fill: C.black, fillStyle: 'solid', strokeWidth: 1.4 });
// wheels: rear Ø20 on 0.5 mm eccentric hubs, single Ø12 front roller; only the tyre bottoms show
function wheel(V, cx, cy, r, ecc) {
  CIRC(V.X(cx), V.Y(cy), 2 * r * V.s, dashed({ stroke: C.orange, strokeWidth: 1.5 }));
  const pts = []; for (let i = 0; i <= 12; i++) { const a = Math.PI * (0.32 + 0.36 * i / 12); pts.push([V.X(cx) + r * V.s * Math.cos(a), V.Y(cy) + r * V.s * Math.sin(a)]); }
  CURVE(pts, { stroke: INK, strokeWidth: 3.4, roughness: 0.4 });
  CIRC(V.X(cx), V.Y(cy), 5, { fill: INK, fillStyle: 'solid', roughness: 0.2 });
  if (ecc) CIRC(V.X(cx), V.Y(cy + ecc), 2 * 2.2 * V.s, { stroke: INK, strokeWidth: 1, roughness: 0.3 });
}
wheel(m, -14, 10, 10, 0.5);
wheel(m, 18, 6, 6, 0);
// mechanism: crown on the motor; countershaft 10 T + 12 T; 12 T on the rear axle; washers on the spindle
RECT(m.X(-18), m.Y(20.5), 32 * m.s, 3.5 * m.s, mo({ fill: MECH_L, fillStyle: 'hachure', hachureGap: 4 }));
for (let x = -17.5; x <= 13.5; x += 1.9) L(m.X(x), m.Y(17), m.X(x + 0.5), m.Y(15.2), { stroke: MECH, strokeWidth: 1, roughness: 0.3 });
L(m.X(-2), m.Y(4.2), m.X(-2), m.Y(22), { stroke: MECH, strokeWidth: 2.6 });
RECT(m.X(-10.5), m.Y(7.4), 17 * m.s, 3.2 * m.s, dashed({ stroke: '#555', fill: C.steel, fillStyle: 'cross-hatch', hachureGap: 3 }));
POLY(gearPts(m.X(-2), m.Y(11), 5.2 * m.s, 6.6 * m.s, 12, false), mo({ strokeWidth: 1.2 }));
POLY(gearPts(m.X(-2), m.Y(11), 4.2 * m.s, 5.6 * m.s, 10, false), mo({ fill: MECH_L, fillStyle: 'solid', strokeWidth: 1.2 }));
POLY(gearPts(m.X(-14), m.Y(10), 5.2 * m.s, 6.6 * m.s, 12, false), mo({ fill: MECH_L, fillStyle: 'hachure', hachureGap: 4, strokeWidth: 1.2 }));
TWIST(m.X(-2), m.Y(22), m.X(-2), m.Y(79), 9);
L(m.X(-2), m.Y(79), m.X(-2), m.Y(101), { stroke: MECH, strokeWidth: 3 });
RECT(m.X(-7), m.Y(87), 10 * m.s, 3 * m.s, { stroke: MECH, fill: MECH_L, fillStyle: 'cross-hatch', hachureGap: 3, strokeWidth: 1.2 });
// trigger linkage (left flipper, far side): pivot + over-centre crank, L-shaped lock rod down into a crown hole
CIRC(m.X(2), m.Y(66), 13, { stroke: MECH, fill: MECH_L, fillStyle: 'solid', strokeWidth: 1.4 });
L(m.X(2), m.Y(66), m.X(2), m.Y(60.6), { stroke: MECH, strokeWidth: 2.6 });
L(m.X(2), m.Y(60.6), m.X(4.5), m.Y(60.6), mo({ strokeWidth: 2.2 }));
L(m.X(4.5), m.Y(60.6), m.X(4.5), m.Y(18), mo({ strokeWidth: 2.4, strokeLineDash: [9, 4] }));
RECT(m.X(2.7), m.Y(40), 3.6 * m.s, 5 * m.s, { stroke: GREY, strokeWidth: 1, fill: '#ddd', fillStyle: 'hachure', hachureGap: 3 });
// centre of mass
CIRC(m.X(-2), m.Y(35), 18, { strokeWidth: 1.4, stroke: RED });
L(m.X(-2) - 12, m.Y(35), m.X(-2) + 12, m.Y(35), { stroke: RED, strokeWidth: 1.2 });
L(m.X(-2), m.Y(35) - 12, m.X(-2), m.Y(35) + 12, { stroke: RED, strokeWidth: 1.2 });
TXT(m.X(-2) - 16, m.Y(35) + 5, 'CG', { size: 13, color: RED, anchor: 'end' });

// callouts - left column
CALL(m.X(-6), m.Y(115), 48, 128, 'HEAD = WINDING KEY\nturn it 28× clockwise\n(seen from above)', { start: true, size: 13.5 });
CALL(m.X(-7), m.Y(85.5), 48, 212, 'NECK RATCHET\n12 teeth + flexure\npawl: winds one way', { start: true, size: 13.5 });
CALL(m.X(-2), m.Y(60), 48, 296, 'RUBBER MOTOR\n3 loops of #16 band\n= 6 strands × 60 mm', { start: true, size: 13.5 });
CALL(m.X(-21), m.Y(55), 48, 382, 'BODY: 4 PLA quarter-\nshells, snap-fit at\nwaist + side seams', { start: true, size: 13.5 });
CALL(m.X(-8), m.Y(5.8), 48, 466, '2 M8 STEEL WASHERS\nlow on the spindle\n→ CG down', { start: true, size: 13.5 });
CALL(m.X(-37), m.Y(3), 48, 545, 'TAIL = anti-tip\nskid (2.5 mm up)', { start: true, size: 13.5 });
// right column
CALL(m.X(2.6), m.Y(66.6), 468, 300, 'TRIGGER PIVOT +\ncrank (left flipper,\nfar side)', { start: true, size: 13 });
CALL(m.X(4.5), m.Y(33), 468, 385, 'LOCK ROD in a\nguide (see B)', { start: true, size: 13 });
CALL(m.X(12), m.Y(19), 468, 448, 'CROWN GEAR 32 T\non the motor', { start: true, size: 13 });
CALL(m.X(9.5), m.Y(20), 468, 510, 'BASE hides the\nwheels + gears', { start: true, size: 13 });
// below the floor
CALL(m.X(-14), m.Y(0.4), 48, 690, 'Ø20 REAR DRIVE WHEELS, O-ring\ntyres, 0.5 mm eccentric hubs (C)', { start: true, size: 13 });
CALL(m.X(-2), m.Y(11), 48, 744, 'COUNTERSHAFT (toy’s right): 10 T pinion\n+ 12 T spur → 12 T spur on the rear axle', { start: true, size: 13 });
CALL(m.X(18), m.Y(0.4), 380, 744, 'single Ø12 front\nroller under the feet', { start: true, size: 13 });

DIM(m.X(36), m.Y(0), m.X(36), m.Y(108.5), '109 tall', 0);
DIM(m.X(-14), m.Y(0), m.X(18), m.Y(0), '32 wheelbase', 22);
DIM(m.X(-38), m.Y(0), m.X(32), m.Y(0), '70 long', 50);

/* ================= FRONT VIEW (armed) ================= */
const f = V(775, 372, 2.5);   // u = -z: the viewer's right is the toy's LEFT
const U = (u) => f.X(u);
TXT(600, 62, 'FRONT VIEW (armed)', { font: 'PH', size: 22 });
TXT(788, 62, 'scale 0.64 : 1', { size: 13, color: GREY });
FLOOR(U(-34), U(68), f.Y(0));
const fcx = U(0);
POLY(ellPts(fcx, f.Y(46), 23 * f.s, 43 * f.s), { fill: C.black, fillStyle: 'hachure', hachureGap: 3, strokeWidth: 1.9 });
POLY(ellPts(fcx, f.Y(44), 15.5 * f.s, 39 * f.s), { fill: '#fff', fillStyle: 'solid', strokeWidth: 1.1, stroke: GREY });
L(U(-23), f.Y(46), U(23), f.Y(46), { stroke: GREY, strokeWidth: 0.9, strokeLineDash: [4, 4] });
POLY(ellPts(fcx, f.Y(95), 13.5 * f.s, 13.5 * f.s), { fill: C.black, fillStyle: 'hachure', hachureGap: 3, hachureAngle: -35, strokeWidth: 1.8 });
for (const sg of [1, -1]) {
  POLY(ellPts(U(sg * 10.5), f.Y(85), 3.4 * f.s, 7 * f.s, sg * 14), { fill: C.yellow, fillStyle: 'solid', strokeWidth: 1 });
  CIRC(U(sg * 6.5), f.Y(99), 2.6 * f.s, { fill: '#000', fillStyle: 'solid' });
}
POLY([[U(-3), f.Y(94)], [U(3), f.Y(94)], [U(0), f.Y(87)]], { fill: C.orange, fillStyle: 'solid', strokeWidth: 1.1 });
L(U(-11.5), f.Y(84), U(11.5), f.Y(84), { stroke: '#fff', strokeWidth: 2.6, roughness: 0.4 });
L(U(-11.5), f.Y(84), U(11.5), f.Y(84), { stroke: INK, strokeWidth: 1, strokeLineDash: [5, 3] });
RECT(U(-27), f.Y(21.5), 54 * f.s, 18.5 * f.s, { fill: '#fff', fillStyle: 'solid', strokeWidth: 1.7 });
for (const sg of [1, -1]) {
  RECT(U(sg * 19.5 - 2), f.Y(20), 4 * f.s, 20 * f.s, dashed({ stroke: C.orange, strokeWidth: 1.3 }));
  L(U(sg * 19.5 - 2), f.Y(0.5), U(sg * 19.5 + 2), f.Y(0.5), { strokeWidth: 3.4, roughness: 0.3 });
  POLY(ellPts(U(sg * 9), f.Y(6), 8.5 * f.s, 3 * f.s), { fill: C.orange, fillStyle: 'solid', stroke: '#9a4a06', strokeWidth: 1.2 });
}
RECT(U(-2), f.Y(12), 4 * f.s, 12 * f.s, dashed({ stroke: C.orange, strokeWidth: 1.2 }));
L(U(-1), f.Y(0.5), U(1), f.Y(0.5), { strokeWidth: 3.4, roughness: 0.3 });
L(U(-25.5), f.Y(10), U(23), f.Y(10), dashed({ stroke: C.steel, strokeWidth: 1.4 }));
// hidden drive: motor, crown (edge on), countershaft on the toy's right (viewer's left)
TWIST(U(0), f.Y(22), U(0), f.Y(79), 9);
RECT(U(-17), f.Y(20.5), 34 * f.s, 3.5 * f.s, mo({ fill: MECH_L, fillStyle: 'hachure', hachureGap: 4 }));
L(U(-27), f.Y(11), U(-12), f.Y(11), mo({ stroke: C.steel, strokeWidth: 1.6 }));
RECT(U(-17.5), f.Y(16.6), 3 * f.s, 11.2 * f.s, mo({ fill: MECH_L, fillStyle: 'solid' }));
RECT(U(-25.5), f.Y(18), 3 * f.s, 14 * f.s, mo());
// right flipper hangs; left flipper (trigger) raised = ARMED; crank points down 5° short of dead centre
POLY(ellPts(U(-25), f.Y(48), 4.5 * f.s, 22 * f.s, 8), { fill: '#111', fillStyle: 'cross-hatch', hachureGap: 4, strokeWidth: 1.4 });
POLY(ellPts(U(42), f.Y(67.5), 21 * f.s, 4.5 * f.s, -6), { fill: '#111', fillStyle: 'cross-hatch', hachureGap: 4, strokeWidth: 1.4 });
L(U(21), f.Y(66), U(21.5), f.Y(60.6), { stroke: MECH, strokeWidth: 2.4 });
L(U(22.5), f.Y(60.6), U(11), f.Y(60.6), mo({ strokeWidth: 2 }));
L(U(11), f.Y(60.6), U(11), f.Y(18), mo({ strokeWidth: 2.2, strokeLineDash: [9, 4] }));
CIRC(U(21), f.Y(66), 11, { stroke: MECH, fill: MECH_L, fillStyle: 'solid', strokeWidth: 1.3 });
ARC_ARROW(U(21), f.Y(66), 30 * f.s, -0.12, 1.15, { stroke: RED, strokeWidth: 2.2 });
// waddle
const wr = 118 * f.s;
ARC_ARROW(fcx, f.Y(0), wr, -Math.PI / 2 + 0.01, -Math.PI / 2 + 0.11, { stroke: C.green, strokeWidth: 2 });
ARC_ARROW(fcx, f.Y(0), wr, -Math.PI / 2 - 0.01, -Math.PI / 2 - 0.11, { stroke: C.green, strokeWidth: 2 });
TXT(fcx + 42, 86, 'rocks ±1.5° (C)', { size: 13.5, color: C.green });
// callouts
CALL(U(-9), f.Y(84.5), 606, 150, 'HEAD TURNS\non the neck\nring', { start: true, size: 13 });
CALL(U(-27), f.Y(16), 606, 290, 'BASE: white\nPLA, 54 wide', { start: true, size: 13 });
CALL(U(-24), f.Y(11), 606, 345, 'countershaft\n(toy’s right)', { start: true, size: 13 });
CALL(U(57), f.Y(70.5), 950, 135, 'TRIGGER = LEFT\nflipper; raised\n= ARMED (locked)', { start: true, size: 13 });
TXT(U(34), f.Y(36), 'push it\ndown → GO', { size: 14, color: RED });
CALL(U(11), f.Y(50), 950, 240, 'lock rod (B)', { start: true, size: 13 });
CALL(U(19.5), f.Y(1), 950, 335, 'rear wheels on\n0.5 mm eccentric\nhubs (C)', { start: true, size: 13 });
DIM(U(-27), f.Y(0), U(27), f.Y(0), '54 base', 18);
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
TXT(610, 640, 'Roll = atan(1 ÷ 39 mm track) ≈ ±1.5°\nper wheel turn; the single front\nroller lets the body rock. It follows\nwhile I·θ·ω² < m·g·track/2, i.e.\nbelow ≈ 0.6 m/s; faster, the rear\nwheels take turns to hop 0.5 mm\n(≈ 2 mJ/m). The slow waddle shows\nin the last metres of the run.', { size: 12.6, lh: 15.4 });

/* ================= D: STABILITY ================= */
BOX(860, 448, 260, 317, 'D   WON’T TIP OVER');
const dg = 600, rx0 = 915, ds = 2.3;
L(875, dg, 1105, dg, { strokeWidth: 1.4 });
CIRC(rx0, dg - 10 * ds, 20 * ds, { stroke: C.orange, strokeWidth: 1.6 });
CIRC(rx0 + 32 * ds, dg - 6 * ds, 12 * ds, { stroke: C.orange, strokeWidth: 1.6 });
PL([[rx0 - 21 * ds, dg - 6], [rx0 - 9 * ds, dg - 22 * ds]], { strokeWidth: 3 });
TXT(rx0 - 21 * ds + 4, dg - 26 * ds, 'tail', { size: 11, color: GREY });
const cgx = rx0 + 12 * ds, cgy = dg - 35 * ds;
CIRC(cgx, cgy, 16, { stroke: RED, strokeWidth: 1.4 });
L(cgx - 10, cgy, cgx + 10, cgy, { stroke: RED }); L(cgx, cgy - 10, cgx, cgy + 10, { stroke: RED });
L(cgx, cgy + 8, cgx, dg, { stroke: RED, strokeWidth: 1, strokeLineDash: [4, 3] });
TXT(cgx + 12, cgy - 8, 'CG', { size: 13, color: RED });
L(cgx + 8, cgy, cgx + 104, cgy, { stroke: GREY, strokeWidth: 0.8, strokeLineDash: [3, 3] });
DIM(cgx + 100, dg, cgx + 100, cgy, 'h 35', 0);
DIM(rx0, dg, cgx, dg, 'd 12', 12);
TXT(872, 645, 'Launch a = 29 mN ÷ 47 g ≈ 0.6 m/s²\nWheelie needs a = g·d/h\n= 9.81 × 12/35 ≈ 3.4 m/s² → 5.6× ✓\nSide tip (3-wheel base) needs 16°\nof lean; the waddle is ±1.5° ✓\nBackstop: the stiff tail skid lands\nafter 6° (emperors prop on\ntheir tails too).', { size: 12.6, lh: 15.4 });

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
// ratchet top view inset
POLY(gearPts(1166, 218, 13, 18, 12, true), { stroke: MECH, fill: MECH_L, fillStyle: 'hachure', hachureGap: 3, strokeWidth: 1.2 });
CURVE([[1190, 196], [1186, 206], [1182, 212]], { stroke: INK, strokeWidth: 2.2 });
TXT(1166, 251, 'top view', { size: 11.5, anchor: 'middle', color: GREY });
L(1180, 198, ax - 22, 158, { stroke: GREY, strokeWidth: 0.8, strokeLineDash: [3, 3] });
TXT(ax + 40, 150, '② neck ratchet:\n12 teeth + flexure\npawl, one way only', { size: 12.6 });
TWIST(ax, 178, ax, 296, 8);
TXT(ax + 18, 232, '③ rubber motor\n6 strands × 60 mm', { size: 12.6 });
// crown gear (side), countershaft cluster (10 T + 12 T) and the rear axle (12 T + wheel)
RECT(ax - 52, 299, 104, 12, { stroke: MECH, fill: MECH_L, fillStyle: 'hachure', hachureGap: 4, strokeWidth: 1.3 });
for (let x = ax - 50; x <= ax + 48; x += 7) L(x, 311, x + 2, 316, { stroke: MECH, strokeWidth: 1.1 });
L(ax + 34, 266, ax + 34, 306, { stroke: MECH, strokeWidth: 3 });
TXT(ax + 40, 282, 'lock rod (B)', { size: 12, color: MECH });
POLY(gearPts(ax, 333, 17, 21, 12, false), { stroke: MECH, strokeWidth: 1.2 });
POLY(gearPts(ax, 333, 13, 17, 10, false), { stroke: MECH, fill: MECH_L, fillStyle: 'solid', strokeWidth: 1.2 });
POLY(gearPts(ax - 40, 336, 17, 21, 12, false), { stroke: MECH, fill: MECH_L, fillStyle: 'hachure', hachureGap: 4, strokeWidth: 1.2 });
CIRC(ax - 40, 336, 66, dashed({ stroke: C.orange, strokeWidth: 1.6 }));
L(ax - 80, 369, ax + 25, 369, { strokeWidth: 1.4 });
ARC_ARROW(ax, 333, 27, -0.6, -2.3, { stroke: C.green, strokeWidth: 1.6, head: 7 });
ARC_ARROW(ax - 40, 336, 27, -2.3, -0.75, { stroke: C.green, strokeWidth: 1.8, head: 8 });
TXT(ax + 58, 312, '④ crown 32 T (turns ↻)', { size: 12.6 });
TXT(ax + 30, 342, '⑤ 10 T + 12 T on the\n    countershaft (reverses)', { size: 12.6 });
TXT(ax + 30, 382, '⑥ 12 T + Ø20 wheels:\n    rear axle rolls forward', { size: 12.6 });
BULLETS(1394, 92, [
  'Rubber: 3 loops of #16 band = 6 strands\n× 60 mm (0.51 g), hook to hook',
  '28 turns (≈ 1/3 of the ~90-turn break\npoint) → E ≈ 400 J/kg × 0.51 g ≈ 200 mJ',
  'Drag: rolling + 3 PLA bores ≈ 18 mN;\ngears η ≈ 0.65 → 2.5 m needs 71 mJ (2.9×)',
  '32 : 10 then 12 : 12 → 3.2 wheel turns\nper motor turn; 28 turns = 5.6 m',
  'Start force 47 mN = 2.5× drag; tyre\ngrip 0.23 N → no wheelspin',
  'Time-step model (torque falls linearly\nwith turns): run ≈ 6.2 m, top 1.3 m/s;\nworst case 250 J/kg → 3.9 m',
], { size: 12.4, gap: 4 });
TXT(1400, 424, 'head → ratchet → rubber → crown 32T → pinion 10T → 12T : 12T → wheels (×3.2)', { size: 12, anchor: 'middle', color: GREY });

/* ================= B: TRIGGER (over-centre flipper crank) ================= */
BOX(1130, 445, 540, 275, 'B   TRIGGER – FLIPPER CRANK LOCK');
function lockView(ox, fired) {
  const P = [ox + 160, 528], c = 30;
  const col = fired ? C.green : RED;
  // body wall (inside on the left), flipper outside
  const wx = P[0] + 14;
  CURVE([[wx - 6, 484], [wx + 1, 528], [wx - 4, 595], [wx - 22, 650]], { strokeWidth: 2.4 });
  TXT(wx - 10, 498, 'inside', { size: 11, color: GREY, anchor: 'end' });
  const fa = fired ? 75 : -5, fr = fa * Math.PI / 180;
  POLY(ellPts(P[0] + 48 * Math.cos(fr), P[1] + 48 * Math.sin(fr), 44, 10, fa), { fill: '#111', fillStyle: 'cross-hatch', hachureGap: 4, strokeWidth: 1.3 });
  // crank: 85° (5° short of straight down) when armed, 165° when fired
  const ca = (fired ? 165 : 85) * Math.PI / 180, pin = [P[0] + c * Math.cos(ca), P[1] + c * Math.sin(ca)];
  L(P[0], P[1], pin[0], pin[1], { stroke: MECH, strokeWidth: 4 });
  CIRC(P[0], P[1], 16, { stroke: MECH, fill: MECH_L, fillStyle: 'solid' });
  RECT(P[0] + 6, P[1] + 12, 7, 16, { stroke: GREY, strokeWidth: 1, fill: '#bbb', fillStyle: 'solid' });
  CURVE([[P[0] - 30, P[1] - 24], [P[0] - 18, P[1] - 14], [P[0] - 9, P[1] - 7]], { stroke: INK, strokeWidth: 1.6 });
  // L-shaped lock rod: horizontal slot for the crank pin, stem down to the crown
  const xs = P[0] - 80, top = pin[1];
  RECT(P[0] - 38, top - 6, 48, 12, { stroke: MECH, strokeWidth: 1.4, roughness: 0.4 });
  L(xs, top, P[0] - 38, top, { stroke: MECH, strokeWidth: 3.4 });
  CIRC(pin[0], pin[1], 7, { fill: MECH, fillStyle: 'solid', stroke: MECH });
  L(xs, top, xs, top + 94, { stroke: MECH, strokeWidth: 4 });
  RECT(xs - 10, 588, 20, 20, { stroke: GREY, strokeWidth: 1, fill: '#ddd', fillStyle: 'hachure', hachureGap: 3 });
  // crown gear edge-on with a chamfered hole under the rod
  RECT(ox + 12, 640, P[0] - 30 - ox, 22, { stroke: MECH, fill: MECH_L, fillStyle: 'hachure', hachureGap: 5, strokeWidth: 1.3 });
  POLY([[xs - 10, 640], [xs + 10, 640], [xs + 6, 645], [xs + 6, 655], [xs - 6, 655], [xs - 6, 645]], { stroke: MECH, fill: '#fdfcf8', fillStyle: 'solid', strokeWidth: 1, roughness: 0.3 });
  L(ox + 30, 600, ox + 30, 676, { stroke: GREY, strokeWidth: 0.9, strokeLineDash: [10, 3, 2, 3] });
  TXT(ox + 34, 612, 'motor\naxis', { size: 11, color: GREY });
  if (fired) {
    ARROW(xs + 18, 628, xs + 18, 602, { stroke: C.green, strokeWidth: 2, head: 8 });
    ARROW(ox + 60, 674, ox + 118, 674, { stroke: C.green, strokeWidth: 1.8, head: 8 });
    TXT(ox + 124, 678, 'spins', { size: 12, color: C.green });
  } else {
    TXT(P[0] + 16, P[1] + 26, 'stop', { size: 11, color: GREY });
    TXT(P[0] - 34, P[1] - 28, 'detent', { size: 11, color: GREY, anchor: 'end' });
  }
  TXT(ox + 8, 503, fired ? 'FIRED' : 'ARMED', { font: 'PH', size: 19, color: col });
  TXT(fired ? P[0] + 40 : P[0] + 34, fired ? 640 : 566, fired ? 'flipper\nDOWN' : 'flipper UP', { size: 12, color: col });
  TXT(ox + 8, 694, fired ? 'push DOWN: the crank lifts the rod 4 mm\n(1.5 mm clear) → crown free → GO' : 'UP: crank 5° short of dead centre, so\nthe rod’s push holds it on the stop', { size: 12.2, color: fired ? C.green : INK });
}
lockView(1140, false);
lockView(1405, true);
L(1400, 490, 1400, 712, { stroke: GREY, strokeWidth: 0.8, strokeLineDash: [4, 4] });

/* ================= E: EGG (to scale) ================= */
BOX(1130, 728, 540, 165, 'E   PACKS INTO THE EGG');
const es = 1.1, ex = 1190, ey = 825, E = (x, y) => [ex + x * es, ey - y * es];
POLY(ellPts(ex, ey, 37.5 * es, 50 * es), { stroke: C.orange, strokeWidth: 2.2 });
POLY(ellPts(ex, ey, 36 * es, 48.5 * es), { stroke: C.orange, strokeWidth: 0.8, roughness: 0.3 });
for (let i = 0; i < 4; i++) CURVE(ellPts(ex, E(0, 3 + 2 * i)[1], (23 - i) * es, (25 - 1.5 * i) * es, 0, Math.PI, 2 * Math.PI, 18), { strokeWidth: 1.3, stroke: i < 2 ? INK : GREY });
L(E(-23, 3)[0], E(0, 3)[1], E(23, 3)[0], E(0, 3)[1], { stroke: GREY, strokeWidth: 0.8 });
CIRC(E(-3, 14)[0], E(0, 14)[1], 26 * es, { fill: C.black, fillStyle: 'hachure', hachureGap: 3 });
RECT(E(-27, 0)[0], E(0, 1)[1], 54 * es, 18 * es, { strokeWidth: 1.3 });
L(E(-17, -8)[0], E(0, -8)[1], E(17, -8)[0], E(0, -8)[1], { stroke: MECH, strokeWidth: 2 });
for (const x of [-11, 11]) CIRC(E(x, -30)[0], E(0, -30)[1], 20 * es, { stroke: C.orange, strokeWidth: 1.4 });
CIRC(E(0, -43)[0], E(0, -43)[1], 12 * es, { stroke: C.orange, strokeWidth: 1.2 });
TXT(E(0, 22)[0] + 22, E(0, 22)[1], '1–4', { size: 11, color: GREY });
TXT(1236, 864, 'to\nscale', { size: 11, color: GREY });
TXT(1250, 790, 'PRINTED (18): 1–4 body quarter-shells, 5 head + key', { size: 12.4 });
TXT(1250, 806, 'shaft, 6 neck ring + pawl, 7 base, 8 crown, 9 pinion +', { size: 12.4 });
TXT(1250, 822, 'spur, 10 rear spur, 11–12 wheels, 13 roller, 14 feet,', { size: 12.4 });
TXT(1250, 838, '15 tail, 16–17 flippers (left has the crank), 18 lock rod', { size: 12.4 });
TXT(1250, 856, 'BOUGHT (11): 3 steel axles, 3 O-rings, 3 bands, 2 washers', { size: 12.4 });
TXT(1272, 882, 'Assembled 109 mm tall → bigger than the egg ✓', { size: 13.5, color: C.green });

/* ================= bottom boxes ================= */
BOX(40, 775, 268, 295, 'BIOMIMICRY');
const dx = 120, dy = 880;
POLY(ellPts(dx, dy, 22, 40), { fill: C.black, fillStyle: 'hachure', hachureGap: 3 });
POLY(ellPts(dx + 7, dy + 4, 13, 33), { fill: '#fff', fillStyle: 'solid', strokeWidth: 1 });
CIRC(dx + 2, dy - 47, 26, { fill: C.black, fillStyle: 'hachure', hachureGap: 3 });
POLY([[dx + 14, dy - 48], [dx + 28, dy - 44], [dx + 14, dy - 42]], { fill: C.orange, fillStyle: 'solid', strokeWidth: 1 });
POLY(ellPts(dx + 7, dy - 38, 3, 6, -20), { fill: C.yellow, fillStyle: 'solid', strokeWidth: 0.8 });
POLY(ellPts(dx - 16, dy - 2, 4, 22, 18), { fill: '#111', fillStyle: 'solid', strokeWidth: 1 });
POLY([[dx - 16, dy + 26], [dx - 34, dy + 42], [dx - 10, dy + 36]], { fill: C.black, fillStyle: 'solid', strokeWidth: 1 });
L(dx - 6, dy + 41, dx + 24, dy + 42, { stroke: C.orange, strokeWidth: 4 });
L(dx - 60, dy + 44, dx + 70, dy + 44, { stroke: GREY, strokeWidth: 1 });
ARC_ARROW(dx, dy + 44, 105, -Math.PI / 2 - 0.02, -Math.PI / 2 - 0.2, { stroke: C.green, strokeWidth: 1.8, head: 8 });
ARC_ARROW(dx, dy + 44, 105, -Math.PI / 2 + 0.02, -Math.PI / 2 + 0.2, { stroke: C.green, strokeWidth: 1.8, head: 8 });
TXT(dx + 42, dy - 50, 'waddle', { size: 13, color: C.green });
TXT(dx - 70, dy + 18, 'tail\nprop', { size: 12.5, color: GREY });
TXT(dx + 36, dy + 14, 'wide flat\nfeet', { size: 12.5, color: GREY });
TXT(52, 953, 'Emperor penguins waddle (short legs →\nside-to-side rock), stand on wide flat\nfeet with a low CG, and prop on stiff\ntail feathers. Copied: rocking wheels,\nwide low base + steel ballast, tail\nskid. Bonus: the head swivels.', { size: 13.2, lh: 17 });

BOX(318, 775, 265, 295, 'HOW IT PLAYS');
TXT(332, 828, '① Raise the LEFT flipper – click:\n     the wheels are locked.', { size: 14, lh: 18 });
TXT(332, 878, '② Turn the head 28× clockwise,\n     click-click… stop beak-forward.', { size: 14, lh: 18 });
TXT(332, 928, '③ Set it down – it stands and\n     waits, fully wound.', { size: 14, lh: 18 });
TXT(332, 978, '④ Push the flipper down → it\n     waddles off, ≈ 6 m.', { size: 14, lh: 18 });
TXT(332, 1030, 'vs Concept 1: upright body, wound\nrubber motor, flipper trigger.', { size: 13, color: GREY });

BOX(593, 775, 262, 295, 'NUMBERS');
BULLETS(607, 830, [
  'Mass ≈ 47 g, ≈ 84 % printed PLA',
  'CG 35 mm high, 12 mm ahead of\nthe rear axle (62 % on drive)',
  'Motor ≈ 200 mJ; 2.5 m needs 71 mJ',
  'Gears m1: 32 : 10 crown + 12 : 12\nspur, all printed → ×3.2',
  'Run ≈ 6.2 m (worst case 3.9 m),\ntop speed ≈ 1.3 m/s',
  'Lock-rod side load ≤ 0.18 N\n(2.3 mN·m ÷ 12.7 mm)',
  'Bought: 3 steel axles Ø2, 3 O-rings,\n3 #16 bands, 2 M8 washers',
], { size: 13.2, gap: 3 });

BOX(865, 775, 255, 295, 'RULES CHECK');
BULLETS(879, 830, [
  '≥ 75 % printed PLA (≈ 84 %)',
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
  theme: 'Biomimicry – waddling emperor penguin',
  type: 'Running toy (≥ 2.5 m)',
  scale: 'mm · side view 0.94 : 1 on 11×17',
});
