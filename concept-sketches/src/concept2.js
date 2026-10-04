/* Concept 2 - "Emperor Waddler": upright penguin, turn-the-head wind-up (twisted rubber motor), flipper-crank lock trigger,
   eccentric "waddle" wheels. Toy coordinates in mm: x forward, y up, z to the toy's right; motor axis at x = -2. */
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
TXT(48, 84, 'from the right · dashed = hidden · purple = mechanism', { size: 13, color: GREY });
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
// base (white chassis hides wheels + gears), feet fairing over the front rollers, tail skid
POLY([[m.X(-27), m.Y(21)], [m.X(10), m.Y(21)], [m.X(10), m.Y(3.5)], [m.X(-24), m.Y(3.5)], [m.X(-28), m.Y(12)]], { fill: '#fff', fillStyle: 'solid', strokeWidth: 1.8 });
POLY([[m.X(9), m.Y(14)], [m.X(22), m.Y(12.5)], [m.X(31), m.Y(6)], [m.X(30.5), m.Y(3.5)], [m.X(9), m.Y(3.5)]], { fill: C.orange, fillStyle: 'solid', stroke: '#9a4a06', strokeWidth: 1.4 });
for (const t of [5, 8.5]) L(m.X(24), m.Y(t + 1), m.X(30), m.Y(t - 0.6), { stroke: '#9a4a06', strokeWidth: 1.2 });
POLY([[m.X(-23), m.Y(27)], [m.X(-38), m.Y(2.5)], [m.X(-27.5), m.Y(17)]], { fill: C.black, fillStyle: 'solid', strokeWidth: 1.4 });
// wheels: rear Ø20 on eccentric hubs, front Ø12 rollers; only the tyre bottoms show
function wheel(V, cx, cy, r, ecc) {
  CIRC(V.X(cx), V.Y(cy), 2 * r * V.s, dashed({ stroke: C.orange, strokeWidth: 1.5 }));
  const pts = []; for (let i = 0; i <= 12; i++) { const a = Math.PI * (0.32 + 0.36 * i / 12); pts.push([V.X(cx) + r * V.s * Math.cos(a), V.Y(cy) + r * V.s * Math.sin(a)]); }
  CURVE(pts, { stroke: INK, strokeWidth: 3.4, roughness: 0.4 });
  CIRC(V.X(cx), V.Y(cy), 5, { fill: INK, fillStyle: 'solid', roughness: 0.2 });
  if (ecc) CIRC(V.X(cx), V.Y(cy + ecc), 2 * 2.2 * V.s, { stroke: INK, strokeWidth: 1, roughness: 0.3 });
}
wheel(m, -14, 10, 10, 1);
wheel(m, 18, 6, 6, 0);
// mechanism: crown gear on the motor, countershaft (8 T pinion + 12 T spur), 12 T spur on the rear axle
RECT(m.X(-18), m.Y(19), 32 * m.s, 4 * m.s, mo({ fill: MECH_L, fillStyle: 'hachure', hachureGap: 4 }));
for (let x = -17.5; x <= 13.5; x += 1.9) L(m.X(x), m.Y(15), m.X(x + 0.5), m.Y(14), { stroke: MECH, strokeWidth: 1, roughness: 0.3 });
L(m.X(-2), m.Y(3.8), m.X(-2), m.Y(21.5), { stroke: MECH, strokeWidth: 2.6 });
RECT(m.X(-10.5), m.Y(7), 17 * m.s, 3.2 * m.s, dashed({ stroke: '#555', fill: C.steel, fillStyle: 'cross-hatch', hachureGap: 3 }));
POLY(gearPts(m.X(-2), m.Y(11), 5.2 * m.s, 6.4 * m.s, 12, false), mo({ strokeWidth: 1.2 }));
POLY(gearPts(m.X(-2), m.Y(11), 3.2 * m.s, 4.4 * m.s, 8, false), mo({ fill: MECH_L, fillStyle: 'solid', strokeWidth: 1.2 }));
POLY(gearPts(m.X(-14), m.Y(10), 5.2 * m.s, 6.4 * m.s, 12, false), mo({ fill: MECH_L, fillStyle: 'hachure', hachureGap: 4, strokeWidth: 1.2 }));
TWIST(m.X(-2), m.Y(21.5), m.X(-2), m.Y(79), 9);
L(m.X(-2), m.Y(79), m.X(-2), m.Y(101), { stroke: MECH, strokeWidth: 3 });
RECT(m.X(-7), m.Y(87), 10 * m.s, 3 * m.s, { stroke: MECH, fill: MECH_L, fillStyle: 'cross-hatch', hachureGap: 3, strokeWidth: 1.2 });
// trigger linkage (left flipper is on the far side): pivot + crank, L-shaped lock rod down into the crown
CIRC(m.X(2), m.Y(66), 13, { stroke: MECH, fill: MECH_L, fillStyle: 'solid', strokeWidth: 1.4 });
L(m.X(2), m.Y(66), m.X(4.5), m.Y(63.5), { stroke: MECH, strokeWidth: 2.6 });
L(m.X(4.5), m.Y(63.5), m.X(7), m.Y(63.5), mo({ strokeWidth: 2.2 }));
L(m.X(7), m.Y(63.5), m.X(7), m.Y(17), mo({ strokeWidth: 2.4, strokeLineDash: [9, 4] }));
RECT(m.X(5.2), m.Y(40), 3.6 * m.s, 5 * m.s, { stroke: GREY, strokeWidth: 1, fill: '#ddd', fillStyle: 'hachure', hachureGap: 3 });
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
CALL(m.X(-8), m.Y(5.3), 48, 466, '2 M8 STEEL WASHERS\nlow on the spindle\n→ CG down', { start: true, size: 13.5 });
CALL(m.X(-37), m.Y(3), 48, 545, 'TAIL = anti-tip\nskid (2.5 mm up)', { start: true, size: 13.5 });
// right column
CALL(m.X(2.6), m.Y(66.6), 468, 300, 'TRIGGER PIVOT +\ncrank (left flipper,\nfar side)', { start: true, size: 13 });
CALL(m.X(7), m.Y(33), 468, 385, 'LOCK ROD in a\nguide (see B)', { start: true, size: 13 });
CALL(m.X(12), m.Y(17), 468, 448, 'CROWN GEAR 32 T\non the motor', { start: true, size: 13 });
CALL(m.X(9.5), m.Y(19), 468, 510, 'BASE hides the\nwheels + gears', { start: true, size: 13 });
// below the floor
CALL(m.X(-2), m.Y(11), 48, 690, 'COUNTERSHAFT: 8 T pinion + 12 T spur\n→ 12 T spur on the rear axle (A)', { start: true, size: 13 });
CALL(m.X(-14), m.Y(0.4), 48, 744, 'Ø20 REAR DRIVE WHEELS, O-ring\ntyres, 1 mm eccentric hubs (C)', { start: true, size: 13 });
CALL(m.X(18), m.Y(0.4), 360, 744, 'Ø12 front rollers\nunder the feet', { start: true, size: 13 });

DIM(m.X(36), m.Y(0), m.X(36), m.Y(108.5), '109 tall', 0);
DIM(m.X(-14), m.Y(0), m.X(18), m.Y(0), '32 wheelbase', 22);
DIM(m.X(-38), m.Y(0), m.X(32), m.Y(0), '70 long', 50);

/* ================= FRONT VIEW (armed) ================= */
const f = V(775, 372, 2.5);
TXT(600, 62, 'FRONT VIEW (armed)', { font: 'PH', size: 22 });
FLOOR(f.X(-34), f.X(68), f.Y(0));
const fcx = f.X(0);
POLY(ellPts(fcx, f.Y(46), 23 * f.s, 43 * f.s), { fill: C.black, fillStyle: 'hachure', hachureGap: 3, strokeWidth: 1.9 });
POLY(ellPts(fcx, f.Y(44), 15.5 * f.s, 39 * f.s), { fill: '#fff', fillStyle: 'solid', strokeWidth: 1.1, stroke: GREY });
L(f.X(-23), f.Y(46), f.X(23), f.Y(46), { stroke: GREY, strokeWidth: 0.9, strokeLineDash: [4, 4] });
POLY(ellPts(fcx, f.Y(95), 13.5 * f.s, 13.5 * f.s), { fill: C.black, fillStyle: 'hachure', hachureGap: 3, hachureAngle: -35, strokeWidth: 1.8 });
for (const sg of [1, -1]) {
  POLY(ellPts(f.X(sg * 10.5), f.Y(85), 3.4 * f.s, 7 * f.s, sg * 14), { fill: C.yellow, fillStyle: 'solid', strokeWidth: 1 });
  CIRC(f.X(sg * 6.5), f.Y(99), 2.6 * f.s, { fill: '#000', fillStyle: 'solid' });
}
POLY([[f.X(-3), f.Y(94)], [f.X(3), f.Y(94)], [f.X(0), f.Y(87)]], { fill: C.orange, fillStyle: 'solid', strokeWidth: 1.1 });
L(f.X(-11.5), f.Y(84), f.X(11.5), f.Y(84), { stroke: '#fff', strokeWidth: 2.6, roughness: 0.4 });
L(f.X(-11.5), f.Y(84), f.X(11.5), f.Y(84), { stroke: INK, strokeWidth: 1, strokeLineDash: [5, 3] });
RECT(f.X(-24), f.Y(21), 48 * f.s, 17.5 * f.s, { fill: '#fff', fillStyle: 'solid', strokeWidth: 1.7 });
for (const sg of [1, -1]) {
  RECT(f.X(sg * 17 - 2), f.Y(20), 4 * f.s, 20 * f.s, dashed({ stroke: C.orange, strokeWidth: 1.3 }));
  L(f.X(sg * 17 - 2), f.Y(0.5), f.X(sg * 17 + 2), f.Y(0.5), { strokeWidth: 3.4, roughness: 0.3 });
  RECT(f.X(sg * 9 - 2), f.Y(12), 4 * f.s, 12 * f.s, dashed({ stroke: C.orange, strokeWidth: 1.2 }));
  POLY(ellPts(f.X(sg * 9), f.Y(6), 8.5 * f.s, 3 * f.s), { fill: C.orange, fillStyle: 'solid', stroke: '#9a4a06', strokeWidth: 1.2 });
}
L(f.X(-19), f.Y(10), f.X(19), f.Y(10), dashed({ stroke: C.steel, strokeWidth: 1.4 }));
// hidden drive: motor, crown (edge on), countershaft at the toy's left (viewer's right)
TWIST(f.X(0), f.Y(21.5), f.X(0), f.Y(79), 9);
RECT(f.X(-16), f.Y(19), 32 * f.s, 4 * f.s, mo({ fill: MECH_L, fillStyle: 'hachure', hachureGap: 4 }));
L(f.X(5), f.Y(11), f.X(21), f.Y(11), mo({ stroke: C.steel, strokeWidth: 1.6 }));
RECT(f.X(14.5), f.Y(15.4), 3 * f.s, 8.8 * f.s, mo({ fill: MECH_L, fillStyle: 'solid' }));
RECT(f.X(10), f.Y(17.4), 3 * f.s, 12.8 * f.s, mo());
// right flipper hangs; left flipper (trigger) raised = ARMED
POLY(ellPts(f.X(-25), f.Y(48), 4.5 * f.s, 22 * f.s, 8), { fill: '#111', fillStyle: 'cross-hatch', hachureGap: 4, strokeWidth: 1.4 });
POLY(ellPts(f.X(42), f.Y(67.5), 21 * f.s, 4.5 * f.s, -6), { fill: '#111', fillStyle: 'cross-hatch', hachureGap: 4, strokeWidth: 1.4 });
L(f.X(21), f.Y(65), f.X(18.5), f.Y(63), { stroke: MECH, strokeWidth: 2.4 });
L(f.X(18.5), f.Y(63), f.X(9), f.Y(63), mo({ strokeWidth: 2 }));
L(f.X(9), f.Y(63), f.X(9), f.Y(17), mo({ strokeWidth: 2.2, strokeLineDash: [9, 4] }));
CIRC(f.X(21), f.Y(65), 11, { stroke: MECH, fill: MECH_L, fillStyle: 'solid', strokeWidth: 1.3 });
ARC_ARROW(f.X(21), f.Y(65), 30 * f.s, -0.12, 1.15, { stroke: RED, strokeWidth: 2.2 });
// waddle
const wr = 118 * f.s;
ARC_ARROW(fcx, f.Y(0), wr, -Math.PI / 2 + 0.01, -Math.PI / 2 + 0.11, { stroke: C.green, strokeWidth: 2 });
ARC_ARROW(fcx, f.Y(0), wr, -Math.PI / 2 - 0.01, -Math.PI / 2 - 0.11, { stroke: C.green, strokeWidth: 2 });
TXT(fcx + 42, 86, 'rocks ±3.4° (C)', { size: 13.5, color: C.green });
// callouts
CALL(f.X(-9), f.Y(84.5), 606, 150, 'HEAD TURNS\non the neck\nring', { start: true, size: 13 });
CALL(f.X(-24), f.Y(15), 606, 300, 'BASE: white\nPLA chassis', { start: true, size: 13 });
CALL(f.X(57), f.Y(70.5), 950, 135, 'TRIGGER = LEFT\nflipper; raised\n= ARMED (locked)', { start: true, size: 13 });
TXT(f.X(34), f.Y(36), 'push it\ndown → GO', { size: 14, color: RED });
CALL(f.X(9), f.Y(40), 950, 300, 'lock rod (B)', { start: true, size: 13 });
CALL(f.X(16), f.Y(15), 950, 345, 'countershaft\n(left side)', { start: true, size: 13 });
DIM(f.X(-24), f.Y(0), f.X(24), f.Y(0), '48 base', 18);
DIM(f.X(-30), f.Y(0), f.X(63), f.Y(0), '93 with the flipper raised', 40);

/* ================= C: WADDLE ================= */
BOX(600, 448, 250, 317, 'C   WADDLE');
for (const [cx, sg, lab] of [[665, -1, 'LEFT wheel'], [785, 1, 'RIGHT wheel']]) {
  CIRC(cx, 530, 64, { stroke: C.orange, strokeWidth: 3 });
  CIRC(cx, 530, 54, { strokeWidth: 1.6 });
  L(cx - 5, 530, cx + 5, 530, { stroke: GREY, strokeWidth: 1 }); L(cx, 525, cx, 535, { stroke: GREY, strokeWidth: 1 });
  CIRC(cx, 530 + sg * 6, 9, { fill: INK, fillStyle: 'solid' });
  TXT(cx, 580, lab, { size: 12.5, anchor: 'middle' });
}
L(665, 524, 785, 536, { stroke: C.steel, strokeWidth: 2.4, strokeLineDash: [6, 4] });
TXT(725, 603, 'axle hole 1 mm off-centre,\nopposite sides (drawn ×2)', { size: 12.5, anchor: 'middle', color: GREY });
TXT(612, 650, 'Roll = atan(2 ÷ 34 mm track)\n≈ ±3.4° every wheel turn.\nOne side rises as the other\ndrops, so the CG height stays\nput: the waddle costs almost\nno energy. Fast shuffle at\n1 m/s, slow waddle at the end.', { size: 12.8, lh: 16 });

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
TXT(872, 645, 'Launch a = 20 mN ÷ 47 g ≈ 0.4 m/s²\nWheelie needs a = g·d/h\n= 9.81 × 12/35 ≈ 3.4 m/s² → 8× ✓\nSide tip needs 21° of lean;\nthe waddle is only ±3.4° ✓\nBackstop: the stiff tail skid lands\nafter 6° (emperors prop on\ntheir tails too).', { size: 12.8, lh: 15.6 });

/* ================= A: ENERGY ================= */
BOX(1130, 40, 540, 395, 'A   ENERGY – TURN THE HEAD');
const ax = 1215;
POLY(ellPts(ax, 120, 30, 26), { fill: C.black, fillStyle: 'hachure', hachureGap: 3, hachureAngle: -35 });
POLY([[ax + 26, 112], [ax + 62, 124], [ax + 27, 127]], { fill: C.orange, fillStyle: 'solid', strokeWidth: 1 });
CIRC(ax + 14, 112, 7, { fill: '#000', fillStyle: 'solid' });
ELL_ARROW(ax, 86, 30, 7, 0.2, Math.PI - 0.2, { stroke: RED, strokeWidth: 2.4 });
TXT(ax + 40, 92, '① turn the\nhead 28×', { size: 13.5, color: RED });
RECT(ax - 22, 147, 44, 11, { stroke: MECH, fill: MECH_L, fillStyle: 'cross-hatch', hachureGap: 3, strokeWidth: 1.3 });
CURVE([[ax + 34, 140], [ax + 28, 150], [ax + 22, 153]], { stroke: INK, strokeWidth: 2.4 });
L(ax, 158, ax, 176, { stroke: MECH, strokeWidth: 4 });
// ratchet top view inset
POLY(gearPts(1166, 218, 13, 18, 12, true), { stroke: MECH, fill: MECH_L, fillStyle: 'hachure', hachureGap: 3, strokeWidth: 1.2 });
CURVE([[1190, 196], [1186, 206], [1182, 212]], { stroke: INK, strokeWidth: 2.2 });
TXT(1166, 251, 'top view', { size: 11.5, anchor: 'middle', color: GREY });
L(1180, 198, ax - 22, 158, { stroke: GREY, strokeWidth: 0.8, strokeLineDash: [3, 3] });
TXT(ax + 40, 150, '② neck ratchet:\n12 teeth + flexure\npawl, one way only', { size: 12.6 });
TWIST(ax, 178, ax, 300, 8);
TXT(ax + 18, 238, '③ rubber motor\n6 strands × 60 mm', { size: 12.6 });
// crown gear (side), countershaft and rear axle
RECT(ax - 52, 303, 104, 13, { stroke: MECH, fill: MECH_L, fillStyle: 'hachure', hachureGap: 4, strokeWidth: 1.3 });
for (let x = ax - 50; x <= ax + 48; x += 7) L(x, 316, x + 2, 321, { stroke: MECH, strokeWidth: 1.1 });
L(ax + 34, 268, ax + 34, 312, { stroke: MECH, strokeWidth: 3 });
TXT(ax + 40, 288, 'lock rod (B)', { size: 12, color: MECH });
POLY(gearPts(ax, 336, 16, 20, 12, false), { stroke: MECH, strokeWidth: 1.2 });
POLY(gearPts(ax, 336, 10, 14, 8, false), { stroke: MECH, fill: MECH_L, fillStyle: 'solid', strokeWidth: 1.2 });
POLY(gearPts(ax - 39, 336, 16, 20, 12, false), { stroke: MECH, fill: MECH_L, fillStyle: 'hachure', hachureGap: 4, strokeWidth: 1.2 });
CIRC(ax - 39, 336, 66, dashed({ stroke: C.orange, strokeWidth: 1.6 }));
L(ax - 80, 369, ax + 25, 369, { strokeWidth: 1.4 });
ELL_ARROW(ax, 296, 44, 6, 0.2, Math.PI - 0.2, { stroke: C.green, strokeWidth: 1.8, head: 8 });
ARC_ARROW(ax - 39, 336, 26, -2.5, -0.9, { stroke: C.green, strokeWidth: 1.8, head: 8 });
TXT(ax + 58, 314, '④ crown 32 T', { size: 12.6 });
TXT(ax + 30, 345, '⑤ 8 T + 12 T on a\n    countershaft', { size: 12.6 });
TXT(ax + 30, 382, '⑥ 12 T + Ø20 wheels\n    on the rear axle', { size: 12.6 });
BULLETS(1382, 92, [
  'Rubber: 3 loops of #16 band = 6 strands\n× 60 mm (0.51 g), hook to hook',
  '28 turns (≈ 70 % of max) → E ≈ 400 J/kg\n× 0.51 g ≈ 200 mJ (low-end figure\nfor office rubber)',
  'Drag: rolling + 3 PLA axle bores ≈ 18 mN;\nprinted gears η ≈ 0.65 → needs\n18 mN × 2.5 m ÷ 0.65 ≈ 71 mJ (2.9×)',
  '32 : 8 → 4 wheel turns per motor turn;\n28 turns = 7.0 m of unwind',
  'Start force 38 mN (2× drag); tyre\ngrip 0.23 N → no wheelspin',
  'Predicted run ≈ 6.4 m, top 1.1 m/s;\nworst case (250 J/kg) ≈ 2.8 m',
], { size: 12.6, gap: 5 });
TXT(1400, 424, 'head → ratchet → rubber → crown 32 T → pinion 8 T → 12 T : 12 T → wheels  (×4)', { size: 12.4, anchor: 'middle', color: GREY });

/* ================= B: TRIGGER ================= */
BOX(1130, 445, 540, 275, 'B   TRIGGER – FLIPPER CRANK LOCK');
function lockView(ox, fired) {
  const P = [ox + 178, 532];
  const col = fired ? C.green : RED;
  // body wall (inside on the left), flipper outside
  CURVE([[P[0] - 6, 486], [P[0] + 2, 532], [P[0] - 4, 595], [P[0] - 22, 650]], { strokeWidth: 2.4 });
  TXT(P[0] - 12, 500, 'inside', { size: 11, color: GREY, anchor: 'end' });
  const fa = fired ? 70 : -5, fr = fa * Math.PI / 180;
  POLY(ellPts(P[0] + 44 * Math.cos(fr), P[1] + 44 * Math.sin(fr), 44, 10, fa), { fill: '#111', fillStyle: 'cross-hatch', hachureGap: 4, strokeWidth: 1.3 });
  // crank + pin
  const ca = (fired ? 210 : 140) * Math.PI / 180, pin = [P[0] + 24 * Math.cos(ca), P[1] + 24 * Math.sin(ca)];
  L(P[0], P[1], pin[0], pin[1], { stroke: MECH, strokeWidth: 4 });
  CIRC(P[0], P[1], 14, { stroke: MECH, fill: MECH_L, fillStyle: 'solid' });
  POLY([[P[0] + 3, P[1] - 12], [P[0] + 8, P[1] - 8], [P[0] + 3, P[1] - 5]], { fill: INK, fillStyle: 'solid', strokeWidth: 0.8 });
  // L-shaped lock rod with a slot for the crank pin
  const xs = P[0] - 80, top = pin[1];
  RECT(pin[0] - 14, top - 6, 26, 12, { stroke: MECH, strokeWidth: 1.4, roughness: 0.4 });
  L(xs, top, pin[0] - 14, top, { stroke: MECH, strokeWidth: 3.4 });
  CIRC(pin[0], pin[1], 7, { fill: MECH, fillStyle: 'solid', stroke: MECH });
  L(xs, top, xs, top + 108, { stroke: MECH, strokeWidth: 4 });
  RECT(xs - 10, 582, 20, 22, { stroke: GREY, strokeWidth: 1, fill: '#ddd', fillStyle: 'hachure', hachureGap: 3 });
  // crown gear edge-on with a hole under the rod
  RECT(ox + 12, 640, P[0] - 40 - ox, 22, { stroke: MECH, fill: MECH_L, fillStyle: 'hachure', hachureGap: 5, strokeWidth: 1.3 });
  RECT(xs - 6, 640, 12, 17, { stroke: MECH, fill: '#fdfcf8', fillStyle: 'solid', strokeWidth: 1, roughness: 0.3 });
  L(ox + 40, 600, ox + 40, 680, { stroke: GREY, strokeWidth: 0.9, strokeLineDash: [10, 3, 2, 3] });
  TXT(ox + 44, 612, 'motor\naxis', { size: 11, color: GREY });
  if (fired) {
    ARROW(xs + 18, 628, xs + 18, 600, { stroke: C.green, strokeWidth: 2, head: 8 });
    ARROW(ox + 60, 672, ox + 120, 672, { stroke: C.green, strokeWidth: 1.8, head: 8 });
    TXT(ox + 126, 676, 'spins', { size: 12, color: C.green });
  }
  TXT(ox + 8, 505, fired ? 'FIRED' : 'ARMED', { font: 'PH', size: 19, color: col });
  TXT(P[0] + (fired ? 30 : 20), fired ? 640 : 570, fired ? 'flipper\nDOWN' : 'flipper UP', { size: 12, color: col });
  TXT(ox + 8, 694, fired ? 'push down → crank lifts the rod\n3 mm: crown free → GO' : 'raise it → crank pushes the rod\n3 mm into a hole: crown locked', { size: 12.5, color: fired ? C.green : INK });
}
lockView(1140, false);
lockView(1405, true);
L(1400, 490, 1400, 712, { stroke: GREY, strokeWidth: 0.8, strokeLineDash: [4, 4] });

/* ================= E: EGG ================= */
BOX(1130, 728, 540, 165, 'E   PACKS INTO THE EGG');
const ex = 1205, ey = 822, es = 1.2;
POLY(ellPts(ex, ey - 5, 37.5 * es, 50 * es), { stroke: C.orange, strokeWidth: 2.2 });
L(ex - 40 * es, ey - 2, ex + 40 * es, ey - 2, { stroke: C.orange, strokeWidth: 1.2, strokeLineDash: [5, 4] });
for (let i = 0; i < 4; i++) CURVE(ellPts(ex - 14 + i * 4, ey - 28, 16, 26 - i * 1.5, 0, Math.PI * 0.5, Math.PI * 1.5, 14), { strokeWidth: 1.4, stroke: i < 2 ? INK : GREY });
CIRC(ex + 16, ey - 34, 30, { fill: C.black, fillStyle: 'hachure', hachureGap: 3 });
POLY(ellPts(ex, ey + 12, 20, 5), { stroke: MECH, strokeWidth: 1.3 });
RECT(ex - 22, ey + 22, 44, 14, { strokeWidth: 1.2 });
for (let i = 0; i < 4; i++) CIRC(ex - 14 + i * 9, ey + 46, i < 2 ? 16 : 11, { stroke: C.orange, strokeWidth: 1.2 });
TXT(1285, 790, 'All 32 parts fit the course Kinder Maxi egg', { size: 14 });
TXT(1285, 810, '(75 × 100 mm CAD). The body is 4 quarter-', { size: 14 });
TXT(1285, 830, 'shells that nest like bowls; Ø34 crown gear.', { size: 14 });
TXT(1285, 857, 'Assembled 109 mm tall → bigger than the egg ✓', { size: 14, color: C.green });

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
TXT(dx + 34, dy + 30, 'wide flat\nfeet', { size: 12.5, color: GREY });
TXT(52, 953, 'Emperor penguins waddle (short legs →\nside-to-side rock), stand on wide flat\nfeet with a low CG, and prop on stiff\ntail feathers. Copied: eccentric wheels,\nwide low base + steel ballast, tail\nskid. Bonus: the head swivels.', { size: 13.2, lh: 17 });

BOX(318, 775, 265, 295, 'HOW IT PLAYS');
TXT(332, 828, '① Raise the LEFT flipper – click:\n     the wheels are locked.', { size: 14, lh: 18 });
TXT(332, 878, '② Turn the head 28× clockwise,\n     click-click… stop beak-forward.', { size: 14, lh: 18 });
TXT(332, 928, '③ Set it down – it stands and\n     waits, fully wound.', { size: 14, lh: 18 });
TXT(332, 978, '④ Push the flipper down → it\n     waddles off, ≈ 6 m.', { size: 14, lh: 18 });
TXT(332, 1032, 'Stop it any time: raise the flipper.', { size: 13, color: GREY });
ARROW(380, 1052, 560, 1052, { stroke: C.green, strokeWidth: 2.2 });

BOX(593, 775, 262, 295, 'NUMBERS');
BULLETS(607, 830, [
  'Mass ≈ 47 g, ≈ 83 % printed PLA',
  'CG 35 mm high, 12 mm ahead of\nthe rear axle (62 % on drive)',
  'Motor ≈ 200 mJ; needs ≈ 71 mJ',
  'Gears 32 : 8 + 12 : 12, module 1,\nprinted → ×4 speed-up',
  'Run ≈ 6.4 m (worst case 2.8 m),\ntop speed ≈ 1.1 m/s',
  'Lock-rod side load ≤ 0.19 N\n→ 0.06 N friction to lift',
  'Bought: 2 mm steel rod, 4 O-rings,\n3 #16 bands, 2 M8 washers',
], { size: 13.2, gap: 3 });

BOX(865, 775, 255, 295, 'RULES CHECK');
BULLETS(879, 830, [
  '≥ 75 % printed PLA (≈ 83 %)',
  'All parts fit the egg; the built\ntoy (109 mm) is bigger',
  'Holds its energy until the\nflipper is pushed down',
  'Trigger is a flipper crank – no\nremovable pin, stays together',
  'No energy stored when apart\n(rubber untwisted)',
  'Snap / press fits: no glue, no tools',
  'Gears are our printed parts,\nnot commercial toy parts',
], { size: 13.2, ticks: true, gap: 3 });

TITLE_BLOCK(1130, 903, 540, 167, {
  course: 'ENGG*2100 F26 · Design & Build · Concept Sketch',
  title: 'Concept 2: EMPEROR WADDLER',
  sheet: 'Sheet 2 of 2',
  theme: 'Biomimicry – waddling emperor penguin',
  type: 'Running toy (≥ 2.5 m)',
  scale: 'mm · side view ≈ 1:1 on 11×17',
});
