/* Concept 1 - "Tux Toboggan": belly-sliding penguin, pull-back charge, head-nod trigger.
   Toy coordinates in mm: x forward, y up (side view) / z left (top view); origin on the floor under the tail end of the rear wheel base. */
'use strict';
const MECH = '#6a3fb0';
const V = (x0, y0, s) => ({ X: (x) => x0 + x * s, Y: (y) => y0 - y * s, s });

SHEET_BORDER();

/* ---------------- SIDE VIEW ---------------- */
const m = V(250, 405, 5);
TXT(48, 62, 'SIDE VIEW', { font: 'PH', size: 22 });
TXT(160, 62, '(scale 1.27 : 1 · dashed = hidden parts inside the body · purple = mechanism)', { size: 14, color: GREY });
FLOOR(m.X(-40), m.X(150), m.Y(0));

// body: black PLA back shell over a white PLA belly keel
const bcx = m.X(42), bcy = m.Y(17.5), brx = 62 * m.s, bry = 15.5 * m.s, seamY = m.Y(16.5);
const s0 = (seamY - bcy) / bry;
POLY(ellPts(bcx, bcy, brx, bry, 0, Math.PI - Math.asin(s0), 2 * Math.PI + Math.asin(s0), 60), { fill: C.black, fillStyle: 'hachure', hachureGap: 3.2, hachureAngle: -41, fillWeight: 1.1, strokeWidth: 1.8 });
POLY(ellPts(bcx, bcy, brx, bry, 0, Math.asin(s0), Math.PI - Math.asin(s0), 60), { strokeWidth: 1.8 });
L(m.X(-19.5), seamY, m.X(103.5), seamY, { strokeWidth: 1.0, stroke: GREY });
L(m.X(42), m.Y(2), m.X(42), m.Y(33), { strokeWidth: 1.0, stroke: GREY, strokeLineDash: [3, 3] });
// flipper, tail, feet
POLY(ellPts(m.X(64), m.Y(19.5), 21 * m.s, 5.8 * m.s, -10), { fill: '#111', fillStyle: 'cross-hatch', hachureGap: 4, strokeWidth: 1.6 });
POLY(ellPts(m.X(-21), m.Y(20), 8.5 * m.s, 2 * m.s, 10), { fill: C.black, fillStyle: 'hachure', hachureGap: 3, strokeWidth: 1.4 });
L(m.X(-13.5), m.Y(12.5), m.X(-18), m.Y(4.7), { stroke: C.orange, strokeWidth: 5, roughness: 0.6 });
POLY(ellPts(m.X(-21.5), m.Y(4.2), 7.2 * m.s, 1.2 * m.s), { fill: C.orange, fillStyle: 'solid', stroke: '#9a4a06', strokeWidth: 1.2 });
L(m.X(-24), m.Y(4), m.X(-30), m.Y(3.3), { stroke: '#9a4a06', strokeWidth: 2.2 });
L(m.X(-24), m.Y(4.6), m.X(-29.3), m.Y(5.2), { stroke: '#9a4a06', strokeWidth: 2.2 });
// head on its neck ball
CIRC(m.X(99), m.Y(22.5), 19 * m.s, { fill: C.black, fillStyle: 'hachure', hachureGap: 3, hachureAngle: 30, strokeWidth: 1.6 });
POLY(ellPts(m.X(109), m.Y(30), 15 * m.s, 13.2 * m.s), { fill: C.black, fillStyle: 'hachure', hachureGap: 3, hachureAngle: -35, strokeWidth: 1.8 });
POLY(ellPts(m.X(114.5), m.Y(21.8), 7.5 * m.s, 4 * m.s, -14), { fill: '#fff', fillStyle: 'solid', strokeWidth: 1.1 });
POLY(ellPts(m.X(107.5), m.Y(27.8), 5 * m.s, 3.4 * m.s, -8), { fill: C.yellow, fillStyle: 'solid', strokeWidth: 1.1 });
POLY([[m.X(121.3), m.Y(33.2)], [m.X(134.1), m.Y(26.4)], [m.X(121.8), m.Y(24.6)]], { fill: C.orange, fillStyle: 'solid', strokeWidth: 1.4 });
CIRC(m.X(118.6), m.Y(34.6), 3.4 * m.s, { fill: '#000', fillStyle: 'solid', strokeWidth: 1 });
CIRC(m.X(119.1), m.Y(35.2), 1 * m.s, { fill: '#fff', fillStyle: 'solid', strokeWidth: 0.5, stroke: '#fff' });

// wheels: hidden in keel wells, tyres poke out 2-3 mm under the belly
function wheelSide(V, cx, cy, r, ring) {
  CIRC(V.X(cx), V.Y(cy), 2 * r * V.s, dashed({ stroke: C.orange, strokeWidth: 1.5 }));
  CIRC(V.X(cx), V.Y(cy), 2 * (r - ring) * V.s, dashed({ stroke: INK, strokeWidth: 1 }));
  const pts = []; for (let i = 0; i <= 16; i++) { const a = Math.PI * (0.22 + 0.56 * i / 16); pts.push([V.X(cx) + r * V.s * Math.cos(a), V.Y(cy) + r * V.s * Math.sin(a)]); }
  CURVE(pts, { stroke: INK, strokeWidth: 3.2, roughness: 0.4 });
  CIRC(V.X(cx), V.Y(cy), 5, { fill: INK, fillStyle: 'solid', roughness: 0.2 });
}
wheelSide(m, 24, 10, 10, 1.2);
wheelSide(m, 78, 6, 6, 0.8);

// mechanism (hidden). Ratchet teeth are handed to lock clockwise (= forward drive); the pawl is a strut.
const mo = (o = {}) => dashed(Object.assign({ stroke: MECH, strokeWidth: 1.5 }, o));
const PH1 = Math.atan2(-3.74, 1.43) - 0.06; // tooth tip just behind the pawl tip
POLY(gearPts(m.X(24), m.Y(10), 3.8 * m.s, 5.0 * m.s, 12, 'rev', PH1), mo({ fill: '#cbb8ec', fillStyle: 'hachure', hachureGap: 5 }));
CIRC(m.X(24), m.Y(10), 2.4 * m.s, mo());
PL([[m.X(31.6), m.Y(16.6)], [m.X(25.43), m.Y(13.74)]], { stroke: MECH, strokeWidth: 2.6 });
PL([[m.X(31.6), m.Y(16.6)], [m.X(32.6), m.Y(20)]], { stroke: MECH, strokeWidth: 2.2 });
CURVE([[m.X(24.5), m.Y(20.5)], [m.X(26.6), m.Y(18.2)], [m.X(28.4), m.Y(15.6)]], { stroke: MECH, strokeWidth: 1.4 });
CIRC(m.X(31.6), m.Y(16.6), 7, { stroke: MECH, fill: MECH, fillStyle: 'solid' });
L(m.X(32.6), m.Y(20), m.X(99), m.Y(28.7), mo({ strokeWidth: 1.8 }));
L(m.X(99), m.Y(22.5), m.X(99), m.Y(28.7), { stroke: MECH, strokeWidth: 2.4 });
CIRC(m.X(99), m.Y(22.5), 7, { stroke: MECH, fill: MECH, fillStyle: 'solid' });
BAND(m.X(55.8), m.Y(11.2), m.X(91), m.Y(11.2));
L(m.X(24), m.Y(11.2), m.X(55.2), m.Y(11.2), { stroke: '#555', strokeWidth: 1.1, roughness: 0.3 });
CIRC(m.X(55.6), m.Y(11.2), 5, { fill: '#555', fillStyle: 'solid', stroke: '#555' });
L(m.X(91), m.Y(9.5), m.X(91), m.Y(14), { stroke: INK, strokeWidth: 3 });
L(m.X(53.9), m.Y(8.5), m.X(53.9), m.Y(10.4), { stroke: INK, strokeWidth: 2 });
L(m.X(53.9), m.Y(12), m.X(53.9), m.Y(13.3), { stroke: INK, strokeWidth: 2 });
L(m.X(30.5), m.Y(8.2), m.X(30.5), m.Y(10.6), { stroke: INK, strokeWidth: 2.4 });
L(m.X(30.5), m.Y(11.8), m.X(30.5), m.Y(13.6), { stroke: INK, strokeWidth: 2.4 });
RECT(m.X(-8.5), m.Y(15.8), 11 * m.s, 5.6 * m.s, mo({ fill: C.steel, fillStyle: 'cross-hatch', hachureGap: 5, stroke: '#555' }));
CIRC(m.X(78), m.Y(6), 4, { fill: INK, fillStyle: 'solid' });

// callouts: left column (leaders run down-right without crossing the labels below)
CALL(m.X(28.6), m.Y(15.3), 48, 100, 'PAWL + flexure spring hold the charge', { start: true });
CALL(m.X(24), m.Y(14.6), 48, 158, 'RATCHET (12 teeth) + line on a 2 mm steel\naxle, 2× MR52 bearings in the keel walls', { start: true, size: 13 });
CALL(m.X(-3), m.Y(13), 48, 238, 'steel ballast\n5 g in the\nrear keel', { start: true, size: 13.5 });
// top row
CALL(m.X(44), m.Y(32.5), 455, 95, 'BACK SHELL – black PLA, 2 halves, snap-fit', { start: true });
CALL(m.X(60), m.Y(24.8), 520, 145, 'TRIGGER ROD (head lever pulls it)', { start: true });
CALL(m.X(75), m.Y(19.2), 590, 205, 'FLIPPER (press-fit)', { start: true });
CALL(m.X(112), m.Y(42.6), 800, 95, 'HEAD = TRIGGER (beak clips on)\nnods 15° on trunnion pins', { start: true });
// bottom row
CALL(m.X(-22), m.Y(3.8), 48, 458, 'feet\nclip', { start: true, size: 13.5 });
CALL(m.X(24), m.Y(0.6), 150, 478, 'Ø20 DRIVE WHEELS in keel wells,\nO-ring tyres, freewheel hubs', { start: true, size: 13.5 });
CALL(m.X(30), m.Y(2.3), 380, 478, 'BELLY KEEL – white PLA, 2 halves;\nlowest point 2 mm off the floor', { start: true, size: 13.5 });
CALL(m.X(78), m.Y(0.6), 620, 478, 'Ø12 front rollers on MR52\nbearings, 2 mm steel axle', { start: true, size: 13.5 });
CALL(m.X(86), m.Y(11.6), 930, 470, 'RUBBER BAND #10 on a\nchin post; 0.4 mm line\nto the axle; stop eyelet\n6.5 mm ahead of the axle', { start: true, size: 13.5 });

// dimensions
DIM(m.X(-29.5), m.Y(0), m.X(134.1), m.Y(0), '163 overall', 128);
L(m.X(110), m.Y(43.2), m.X(146.5), m.Y(43.2), { stroke: GREY, strokeWidth: 0.9, strokeLineDash: [4, 3], roughness: 0.3 });
DIM(m.X(145), m.Y(0), m.X(145), m.Y(43.2), '43', 0);
DIM(m.X(24), m.Y(0), m.X(78), m.Y(0), '54 wheelbase', 24);

/* ---------------- TOP VIEW ---------------- */
const t = V(250, 0, 4); const Zc = 668; const Z = (z) => Zc - z * t.s;
TXT(48, 586, 'TOP VIEW', { font: 'PH', size: 22 });
TXT(48, 606, 'scale 1 : 1\n(side 1.27 : 1)', { size: 13, color: GREY });
POLY(ellPts(t.X(42), Z(0), 62 * t.s, 17.5 * t.s), { fill: C.black, fillStyle: 'hachure', hachureGap: 3.2, hachureAngle: -41, strokeWidth: 1.8 });
L(t.X(42), Z(17), t.X(42), Z(-17), { stroke: '#fff', strokeWidth: 1.4, roughness: 0.4 });
for (const sgn of [1, -1]) {
  POLY(ellPts(t.X(64), Z(18.6 * sgn), 21 * t.s, 4.6 * t.s, sgn * 11), { fill: '#111', fillStyle: 'cross-hatch', hachureGap: 4, strokeWidth: 1.5 });
  POLY(ellPts(t.X(-21.5), Z(6.2 * sgn), 7.2 * t.s, 4.4 * t.s), { fill: C.orange, fillStyle: 'solid', stroke: '#9a4a06', strokeWidth: 1.1 });
  RECT(t.X(14), Z(10.6 * sgn) - (sgn > 0 ? 0 : 4.2 * t.s), 20 * t.s, 4.2 * t.s, dashed({ stroke: C.orange }));
  RECT(t.X(72), Z(6.9 * sgn) - (sgn > 0 ? 0 : 2.8 * t.s), 12 * t.s, 2.8 * t.s, dashed({ stroke: C.orange }));
  POLY(ellPts(t.X(106.5), Z(10.5 * sgn), 6 * t.s, 2.4 * t.s), { fill: C.yellow, fillStyle: 'solid', strokeWidth: 1 });
}
POLY(ellPts(t.X(-21), Z(0), 8.5 * t.s, 5.5 * t.s), { fill: C.black, fillStyle: 'hachure', hachureGap: 3, strokeWidth: 1.4 });
CIRC(t.X(99), Z(0), 19 * t.s, { fill: C.black, fillStyle: 'hachure', hachureGap: 3, hachureAngle: 30 });
POLY(ellPts(t.X(109), Z(0), 15 * t.s, 12.5 * t.s), { fill: C.black, fillStyle: 'hachure', hachureGap: 3, hachureAngle: -35, strokeWidth: 1.7 });
POLY([[t.X(121), Z(4.2)], [t.X(134.1), Z(0)], [t.X(121), Z(-4.2)]], { fill: C.orange, fillStyle: 'solid', strokeWidth: 1.3 });
L(t.X(24), Z(0), t.X(91), Z(0), dashed({ stroke: MECH }));
L(t.X(24), Z(12), t.X(24), Z(-12), dashed({ stroke: INK }));
L(t.X(78), Z(8), t.X(78), Z(-8), dashed({ stroke: INK }));
DIM(t.X(150), Z(17.5), t.X(150), Z(-17.5), '35 body', -18);
DIM(t.X(64), Z(23.4), t.X(64), Z(-23.4), '≈46 over flippers', 0, { halo: 5 });
TXT(t.X(160), Z(9), 'wheels (dashed) sit inside\nthe body: only the tyre\nbottoms touch the floor', { size: 13.5, color: GREY });

/* ---------------- A: ENERGY ---------------- */
BOX(1130, 40, 540, 405, 'A   ENERGY – PULL-BACK CHARGE');
const ax = 1265, ay = 238, k = 8.6, ly = ay - 1.2 * k;
CIRC(ax, ay, 20 * k, dashed({ stroke: C.orange, strokeWidth: 1.6 }));
CIRC(ax, ay, 17.6 * k, { stroke: INK, strokeWidth: 3, roughness: 0.4 });
POLY(gearPts(ax, ay, 3.8 * k, 5.0 * k, 12, 'rev', PH1), { stroke: MECH, fill: '#cbb8ec', fillStyle: 'hachure', hachureGap: 4, strokeWidth: 1.5 });
CIRC(ax, ay, 2.4 * k, { stroke: '#555', strokeWidth: 2.2 });
CIRC(ax, ay, 2 * k, { fill: C.steel, fillStyle: 'solid' });
const pv = [ax + 7.6 * k, ay - 6.6 * k], tip = [ax + 1.43 * k, ay - 3.74 * k];
PL([pv, tip], { stroke: MECH, strokeWidth: 3.4 }); PL([pv, [ax + 8.6 * k, ay - 10 * k]], { stroke: MECH, strokeWidth: 3 });
CIRC(pv[0], pv[1], 9, { stroke: MECH, fill: MECH, fillStyle: 'solid' });
RECT(ax + 4, ay - 92, 26, 8, { stroke: GREY, strokeWidth: 1, fill: '#ccc', fillStyle: 'hachure', hachureGap: 3 });
CURVE([[ax + 18, ay - 84], [ax + 30, ay - 64], [ax + 38, ay - 46]], { stroke: INK, strokeWidth: 2.2 });
L(ax, ly, ax + 175, ly, { stroke: '#555', strokeWidth: 1.2 });
CIRC(ax + 175, ly, 8, { fill: '#555', fillStyle: 'solid', stroke: '#555' });
BAND(ax + 179, ly, ax + 330, ly);
L(ax + 336, ly - 22, ax + 336, ly + 22, { strokeWidth: 3.5 });
TXT(ax + 340, ly + 42, 'chin\npost', { size: 13, anchor: 'end' });
L(ax + 56, ly - 18, ax + 56, ly - 5, { strokeWidth: 3 }); L(ax + 56, ly + 5, ax + 56, ly + 18, { strokeWidth: 3 });
CALL(ax + 56, ly + 12, ax + 112, ay + 36, 'stop eyelet', { start: true, size: 12, lc: GREY, color: GREY });
ARC_ARROW(ax, ay, 120, -0.6, -2.4, { stroke: RED, strokeWidth: 2.2 });
CIRC(1630, 312, 40, { stroke: C.orange, strokeWidth: 1.6 });
POLY(gearPts(1630, 312, 9, 13, 8, 'rev'), { stroke: MECH, fill: '#cbb8ec', fillStyle: 'hachure', hachureGap: 3, strokeWidth: 1.1 });
CURVE([[1645, 296], [1638, 301], [1633, 300]], { stroke: INK, strokeWidth: 1.8 });
CIRC(1630, 312, 6, { fill: C.steel, fillStyle: 'solid' });
TXT(1604, 310, 'freewheel hub: ring on the\naxle + flexure pawl in the wheel', { size: 11.5, anchor: 'end', color: GREY });
TXT(1142, 92, '① pull back:\nwheel turns\nbackwards', { size: 14, color: RED });
ARROW(ax + 165, ly - 12, ax + 105, ly - 12, { stroke: RED, strokeWidth: 1.8, head: 9 });
TXT(ax + 108, ly - 20, 'line winds on', { size: 13, color: RED });
ARROW(ax + 300, ly + 18, ax + 200, ly + 18, { stroke: RED, strokeWidth: 1.8 });
TXT(ax + 250, ly + 38, '② band stretches\nλ 1.1 → 1.91', { size: 13.5, color: RED, anchor: 'middle' });
CALL(tip[0], tip[1], ax + 115, ay - 125, '③ pawl clicks over the teeth; its\nflexure spring keeps it seated', { lc: MECH, color: MECH, size: 13 });
TXT(1145, 352, 'Stored E = G·A·L₀(λ²/2 + 1/λ − 3/2) ≈ 31 mJ  (#10 band: G 0.45 MPa, A 2.56 mm², L₀ 32)', { size: 12.3 });
TXT(1145, 372, 'Band travel (1.91 − 1.1) × 32 = 26 mm of line on the bare Ø2 axle (r 1.2) = 22 cm of pull', { size: 12.3 });
TXT(1145, 392, 'Peak drive 1.89 N × 1.2/10 = 0.23 N vs rear load 0.26 + 0.06 transfer → needs μ ≥ 0.72', { size: 12.3 });
TXT(1145, 412, 'End of stroke 1.1 m/s, KE 24 mJ; coast drag 6.5 mN → run ≈ 0.2 + 3.7 = 3.9 m (1.5×)', { size: 12.3 });
TXT(1145, 432, '6 MR52: keel walls, freewheel hubs, rollers (sim with plain roller bores gave 2.8 m)', { size: 12.3 });

/* ---------------- B: TRIGGER ---------------- */
BOX(1130, 455, 540, 265, 'B   TRIGGER – TAP THE HEAD');
function trig(ox, oy, fired) {
  const k2 = 4.2, nod = fired ? -15 * Math.PI / 180 : 0;
  const rx = ox + 32, ry = oy + 150;
  const seat = [rx + 5.3, ry - 26.5];
  POLY(gearPts(rx, ry, 3.8 * k2 * 1.6, 5.0 * k2 * 1.6, 12, 'rev', Math.atan2(seat[1] - ry, seat[0] - rx) - 0.06), { stroke: MECH, fill: '#cbb8ec', fillStyle: 'hachure', hachureGap: 4, strokeWidth: 1.3 });
  // pawl is one rigid part: tip and arm turn together (28° when fired)
  const piv = [rx + 30, ry - 26], d = fired ? 28 * Math.PI / 180 : 0;
  const rot = (v) => [piv[0] + v[0] * Math.cos(d) - v[1] * Math.sin(d), piv[1] + v[0] * Math.sin(d) + v[1] * Math.cos(d)];
  const tipP = rot([seat[0] - piv[0], seat[1] - piv[1]]), arm = rot([4, -22]);
  PL([piv, tipP], { stroke: MECH, strokeWidth: 3.2 });
  PL([piv, arm], { stroke: MECH, strokeWidth: 2.8 });
  CIRC(piv[0], piv[1], 8, { stroke: MECH, fill: MECH, fillStyle: 'solid' });
  const mid = [(piv[0] + tipP[0]) / 2, (piv[1] + tipP[1]) / 2 - 3];
  CURVE([[rx + 2, ry - 58], [rx + 10, ry - 48], mid], { stroke: INK, strokeWidth: 1.8 });
  const nx = ox + 168, ny = oy + 122;
  const lever = [nx + 26 * Math.sin(-nod), ny - 26 * Math.cos(nod)];
  L(arm[0], arm[1], lever[0], lever[1], { stroke: MECH, strokeWidth: 1.8 });
  CIRC(nx, ny, 34, { fill: C.black, fillStyle: 'hachure', hachureGap: 3 });
  // detent: fixed flexure finger + two notches on the neck ball (UP, and 15° away for NOD)
  for (const a of [135, 120]) { const aa = (a - nod * 180 / Math.PI) * Math.PI / 180; const px = nx + 17 * Math.cos(aa), py = ny + 17 * Math.sin(aa);
    POLY([[px, py], [px - 6 * Math.cos(aa) + 3 * Math.sin(aa), py - 6 * Math.sin(aa) - 3 * Math.cos(aa)], [px - 6 * Math.cos(aa) - 3 * Math.sin(aa), py - 6 * Math.sin(aa) + 3 * Math.cos(aa)]], { fill: '#fdfcf8', fillStyle: 'solid', stroke: INK, strokeWidth: 0.8 }); }
  CURVE([[nx - 34, ny + 30], [nx - 22, ny + 20], [nx - 13, ny + 13]], { stroke: INK, strokeWidth: 2 });
  RECT(nx - 30, ny - 34, 9, 12, { stroke: GREY, strokeWidth: 1, fill: '#bbb', fillStyle: 'solid' });
  const hr = 30;
  const hx = nx + (26 * Math.cos(nod) - 16 * Math.sin(nod)), hy = ny - (26 * Math.sin(nod) + 16 * Math.cos(nod));
  POLY(ellPts(hx, hy, hr, hr * 0.88, -nod * 180 / Math.PI), { fill: C.black, fillStyle: 'hachure', hachureGap: 3, hachureAngle: -35 });
  const fwd = [Math.cos(nod), -Math.sin(nod)], up = [-Math.sin(nod), -Math.cos(nod)];
  const b0 = [hx + 26 * fwd[0], hy + 26 * fwd[1]];
  POLY([[b0[0] + 7 * up[0], b0[1] + 7 * up[1]], [b0[0] + 22 * fwd[0] - 3 * up[0], b0[1] + 22 * fwd[1] - 3 * up[1]], [b0[0] - 7 * up[0], b0[1] - 7 * up[1]]], { fill: C.orange, fillStyle: 'solid', strokeWidth: 1.1 });
  L(lever[0], lever[1], nx, ny, { stroke: MECH, strokeWidth: 2.8 });
  CIRC(nx, ny, 6, { stroke: MECH, fill: MECH, fillStyle: 'solid' });
  if (fired) {
    ARC_ARROW(nx, ny, 60, -1.2, -0.68, { stroke: RED, strokeWidth: 2.2, head: 9 });
    ARROW(nx - 34, ny - 74, nx + 2, ny - 40, { stroke: RED, strokeWidth: 2.4, head: 12 });
    TXT(nx - 38, ny - 76, 'tap', { size: 15, color: RED, anchor: 'end' });
    ARROW(arm[0] + 52, arm[1] - 2, arm[0] + 82, arm[1] - 6, { stroke: RED, strokeWidth: 1.6, head: 8 });
    ARC_ARROW(rx, ry, 52, -0.55, 0.35, { stroke: C.green, strokeWidth: 2 });
    TXT(rx + 40, ry + 30, 'free → GO', { size: 13.5, color: C.green });
  } else {
    TXT(rx - 4, ry - 62, 'spring', { size: 12, color: GREY, anchor: 'middle' });
    TXT(nx - 36, ny + 40, 'detent', { size: 11.5, color: GREY, anchor: 'end' });
    TXT(nx - 33, ny - 38, 'stop', { size: 11.5, color: GREY, anchor: 'end' });
  }
  TXT(ox + 118, oy + 202, fired ? 'FIRED – head clicks into its NOD\nnotch, so the pawl stays clear' : 'ARMED – head clicked UP,\npawl seated against a tooth', { size: 13.5, anchor: 'middle' });
}
trig(1145, 455, false);
trig(1405, 455, true);
L(1400, 500, 1400, 680, { stroke: GREY, strokeWidth: 0.8, strokeLineDash: [4, 4] });
TXT(1400, 699, '6.2 mm lever × sin 15° = 1.6 mm rod pull → pawl turns 28° → tip lifts 2.3 mm (tooth 1.2) ✓', { size: 12.2, anchor: 'middle' });
TXT(1400, 714, 'Tap ≈ 0.5 N frees the loaded pawl · trunnion pins: the head can only nod · lift it to re-arm', { size: 12.2, anchor: 'middle' });

/* ---------------- C: EGG (true scale, side + end views) ---------------- */
BOX(1130, 728, 540, 165, 'C   PACKS INTO THE EGG');
{
  const sx = 1178, sy = 821, rxv = 1268;
  for (const cx of [sx, rxv]) {
    if (cx === sx) { POLY(ellPts(cx, sy, 37.5, 50), { stroke: C.orange, strokeWidth: 2 }); POLY(ellPts(cx, sy, 36, 48.5), { stroke: C.orange, strokeWidth: 0.7, roughness: 0.3 }); }
    else { CIRC(cx, sy, 75, { stroke: C.orange, strokeWidth: 2 }); CIRC(cx, sy, 72, { stroke: C.orange, strokeWidth: 0.7, roughness: 0.3 }); }
  }
  // side view: hulls A (wide end down) and B (wide end up); y across, z up
  const hull = (yc0, yc1, flip, o) => { const up = [], dn = [];
    for (let i = 0; i <= 20; i++) { const dd = 62 * i / 20, sc = Math.sqrt(Math.max(0, 1 - (dd / 62) ** 2)), yc = yc0 + (yc1 - yc0) * dd / 62, z = flip ? 31 - dd : -31 + dd;
      up.push([sx + yc + 15.5 * sc, sy - z]); dn.push([sx + yc - 15.5 * sc, sy - z]); }
    POLY(up.concat(dn.reverse()), o); };
  hull(12, 15, false, { stroke: INK, strokeWidth: 1.3, fill: '#2c2c31', fillStyle: 'hachure', hachureGap: 5, fillWeight: 0.6 });
  hull(-12, -15, true, { stroke: INK, strokeWidth: 1.3 });
  POLY(ellPts(sx + 12.5, sy + 16, 13, 15), { fill: '#fdfcf8', fillStyle: 'solid', stroke: INK, strokeWidth: 1.2 });
  TXT(sx + 12.5, sy + 20, 'head', { size: 10, anchor: 'middle' });
  POLY([[sx - 2, sy + 37], [sx + 4, sy + 37], [sx + 1, sy + 45]], { fill: C.orange, fillStyle: 'solid', strokeWidth: 0.8 });
  for (const z of [25, 17]) RECT(sx - 23, sy - z - 3, 20, 6, { stroke: C.orange, strokeWidth: 1.1 });
  for (const z of [9, 3]) RECT(sx - 19, sy - z - 2.5, 12, 5, { stroke: C.orange, strokeWidth: 1 });
  L(sx, sy - 33, sx, sy + 33, { stroke: MECH, strokeWidth: 1.2, strokeLineDash: [4, 3] });
  TXT(sx + 27, sy - 30, 'A', { font: 'PH', size: 13 }); TXT(sx - 33, sy + 34, 'B', { font: 'PH', size: 13 });
  // end view at the equator
  POLY(ellPts(rxv, sy - 13.5, 15.2, 13.4), { stroke: INK, strokeWidth: 1.3, fill: '#2c2c31', fillStyle: 'hachure', hachureGap: 5, fillWeight: 0.6 });
  POLY(ellPts(rxv, sy + 13.5, 15.2, 13.4), { stroke: INK, strokeWidth: 1.3 });
  CIRC(rxv + 24, sy - 3, 3.5, { fill: MECH, fillStyle: 'solid', stroke: MECH });
  for (const [x, y] of [[24, 4], [-24, 4]]) CIRC(rxv + x, sy - y, 2.4, { fill: C.steel, fillStyle: 'solid' });
  for (const y of [8, -10]) RECT(rxv - 26.5, sy - y - 5.5, 3, 11, { fill: '#111', fillStyle: 'solid', strokeWidth: 0.6 });
  RECT(rxv + 22, sy + 10, 8, 5, { fill: C.orange, fillStyle: 'solid', strokeWidth: 0.6 });
  TXT(sx, 886, 'side', { size: 10.5, anchor: 'middle', color: GREY }); TXT(rxv, 886, 'end (1 : 1)', { size: 10.5, anchor: 'middle', color: GREY });
}
TXT(1318, 784, 'True scale. The 4 shell quarters pair into two closed', { size: 12 });
TXT(1318, 799, 'hulls (62 × 35 × 31), wide ends at opposite poles:', { size: 12 });
TXT(1318, 814, 'A = back-shell R + keel F, holding the head; B = back-', { size: 12 });
TXT(1318, 829, 'shell F + keel R, holding wheels, rollers, ratchet, pawl.', { size: 12 });
TXT(1318, 844, 'Rod (66 mm), axles, flippers, tail, feet, beak: side gaps.', { size: 12 });
TXT(1318, 859, 'Tightest: A’s wide end, 27.5 of 27.7 mm → confirm in CAD.', { size: 12 });
TXT(1318, 882, 'Assembled 163 × 46 × 43 mm → bigger than the egg ✓', { size: 13, color: C.green });

/* ---------------- bottom boxes ---------------- */
BOX(40, 775, 268, 295, 'BIOMIMICRY');
// doodle: real penguin tobogganing on snow
const dx = 70, dy = 880;
POLY(ellPts(dx + 95, dy, 70, 18, -4), { fill: C.black, fillStyle: 'hachure', hachureGap: 3 });
POLY(ellPts(dx + 95, dy + 8, 62, 9, -4, 0.15, Math.PI - 0.15, 12).concat([[dx + 40, dy + 4]]), { fill: '#fff', fillStyle: 'solid', strokeWidth: 1 });
CIRC(dx + 172, dy - 18, 30, { fill: C.black, fillStyle: 'hachure', hachureGap: 3 });
POLY([[dx + 185, dy - 20], [dx + 203, dy - 16], [dx + 185, dy - 13]], { fill: C.orange, fillStyle: 'solid', strokeWidth: 1 });
POLY(ellPts(dx + 112, dy - 6, 26, 5, 12), { fill: '#111', fillStyle: 'solid', strokeWidth: 1 });
L(dx + 28, dy + 2, dx + 8, dy + 12, { stroke: C.orange, strokeWidth: 4 });
for (let i = 0; i < 5; i++) L(dx - 10 + i * 12, dy + 30, dx - 2 + i * 12, dy + 22, { stroke: '#8fb5d6', strokeWidth: 1.2 });
CURVE([[dx - 20, dy + 24], [dx + 80, dy + 21], [dx + 210, dy + 26]], { stroke: '#8fb5d6', strokeWidth: 1.6 });
TXT(dx - 8, dy - 34, 'kick…', { size: 13, color: RED });
TXT(dx + 110, dy - 34, '…long glide →', { size: 13, color: C.green });
TXT(52, 945, 'Tobogganing penguins (emperor,\nAdélie) give a few kicks, then\nglide far on their bellies. Copied:\na 22 cm power stroke (the band),\nthen a long freewheel belly-glide\non a keel; low, long body.', { size: 14 });

BOX(318, 775, 265, 295, 'HOW IT PLAYS');
TXT(332, 826, '① Click the head UP, press on its\n    back and pull back ~22 cm.', { size: 14 });
ARROW(500, 870, 420, 870, { stroke: RED, strokeWidth: 2 });
POLY(ellPts(530, 872, 26, 8), { fill: C.black, fillStyle: 'hachure', hachureGap: 3 });
TXT(332, 908, '② Let go – the ratchet holds it.', { size: 14 });
TXT(332, 942, '③ Tap the head – it toboggans\n    ≈ 3.9 m across the floor.', { size: 14 });
TXT(332, 994, '④ Lift the head to re-arm.', { size: 14 });
TXT(332, 1032, 'vs Concept 2: lying body, band in\ntension (pull-back), head-nod trigger.', { size: 12.6, color: GREY });

BOX(593, 775, 262, 295, 'NUMBERS');
BULLETS(607, 830, [
  'Mass ≈ 39 g, 78 % printed PLA',
  'CG 17 mm ahead of rear axle,\n15 mm up (68 % on drive wheels)',
  'Band stores 31 mJ; KE at end of\nstroke 24 mJ; 2.5 m needs 16 mJ',
  'Predicted run ≈ 3.9 m,\ntop speed ≈ 1.1 m/s',
  'Grip needed μ ≥ 0.72\n(nitrile O-ring ≈ 0.9)',
  'Bought (15): 2 mm steel rod, 6×\nMR52, 4 O-rings, #10 band, line,\n5 g ballast. Printed: 17 parts',
], { size: 13.4, gap: 3 });

BOX(865, 775, 255, 295, 'RULES CHECK');
BULLETS(879, 830, [
  '≥ 75 % printed PLA (78 %)',
  'Parts fit the egg (box C); built\ntoy is bigger than the egg',
  'Stores energy and waits\nuntil the head is tapped',
  'Trigger is not a removable\npin – nothing comes off',
  'No energy stored when apart\n(band relaxed)',
  'Snap / press fits – no glue,\nno tools needed',
  'No bought toy parts or\ndownloaded CAD',
], { size: 13.4, ticks: true, gap: 3 });

TITLE_BLOCK(1130, 903, 540, 167, {
  course: 'ENGG*2100 F26 · Design & Build · Concept Sketch',
  title: 'Concept 1: TUX TOBOGGAN',
  sheet: 'Concept 1 · sheet 1 of 1',
  theme: 'Biomimicry – tobogganing penguin',
  type: 'Running toy (≥ 2.5 m)',
  scale: 'mm · side view 1.27 : 1 on 11×17',
});
