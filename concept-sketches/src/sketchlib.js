/* Hand-drawn drafting helpers on top of rough.js (SVG).
   Sheet units: 1 unit = 0.01 in on an 11 x 17 in landscape sheet (1700 x 1100). */
'use strict';
const SVGNS = 'http://www.w3.org/2000/svg';
const sheet = document.getElementById('sheet');
const rc = rough.svg(sheet);
let SEED = 7;
const INK = '#1f1f24', BLUE = '#2a4f9e', RED = '#c23b22', GREY = '#6b6b70';
const C = { black: '#2c2c31', orange: '#ec7a12', yellow: '#efb21d', tan: '#c98c42', steel: '#8a9099', white: '#ffffff', pla: '#5c6f86', green: '#2e8a4e' };

function opt(o = {}) { return Object.assign({ roughness: 0.85, bowing: 0.7, stroke: INK, strokeWidth: 1.5, seed: SEED++ }, o); }
function add(n, layer) { (layer || sheet).appendChild(n); return n; }
function L(x1, y1, x2, y2, o) { return add(rc.line(x1, y1, x2, y2, opt(o))); }
function PL(pts, o) { return add(rc.linearPath(pts, opt(o))); }
function POLY(pts, o) { return add(rc.polygon(pts, opt(o))); }
function PATH(d, o) { return add(rc.path(d, opt(o))); }
function ELL(cx, cy, w, h, o) { return add(rc.ellipse(cx, cy, w, h, opt(o))); }
function CIRC(cx, cy, d, o) { return add(rc.circle(cx, cy, d, opt(o))); }
function RECT(x, y, w, h, o) { return add(rc.rectangle(x, y, w, h, opt(o))); }
function CURVE(pts, o) { return add(rc.curve(pts, opt(o))); }
const dashed = (o = {}) => Object.assign({ strokeLineDash: [7, 5], strokeWidth: 1.2 }, o);

function TXT(x, y, str, o = {}) {
  const t = document.createElementNS(SVGNS, 'text');
  t.setAttribute('x', x); t.setAttribute('y', y);
  t.setAttribute('font-family', o.font || 'AD');
  t.setAttribute('font-size', o.size || 14.5);
  t.setAttribute('fill', o.color || INK);
  if (o.anchor) t.setAttribute('text-anchor', o.anchor);
  if (o.weight) t.setAttribute('font-weight', o.weight);
  if (o.rot) t.setAttribute('transform', `rotate(${o.rot} ${x} ${y})`);
  if (o.ls) t.setAttribute('letter-spacing', o.ls);
  if (o.halo) { t.setAttribute('stroke', '#fdfcf8'); t.setAttribute('stroke-width', o.halo === true ? 4 : o.halo); t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke-linejoin', 'round'); }
  const lines = String(str).split('\n');
  const lh = o.lh || (o.size || 14.5) * 1.22;
  lines.forEach((ln, i) => {
    const ts = document.createElementNS(SVGNS, 'tspan');
    ts.setAttribute('x', x); ts.setAttribute('dy', i ? lh : 0);
    ts.textContent = ln; t.appendChild(ts);
  });
  return add(t);
}
function ARROW(x1, y1, x2, y2, o = {}) {
  L(x1, y1, x2, y2, o);
  const a = Math.atan2(y2 - y1, x2 - x1), s = o.head || 10;
  POLY([[x2, y2], [x2 - s * Math.cos(a - 0.38), y2 - s * Math.sin(a - 0.38)], [x2 - s * Math.cos(a + 0.38), y2 - s * Math.sin(a + 0.38)]],
    { stroke: o.stroke || INK, fill: o.stroke || INK, fillStyle: 'solid', strokeWidth: 1, roughness: 0.3 });
}
// curved arrow along an arc (centre cx,cy, radius r, from a0 to a1 radians, y down)
function ARC_ARROW(cx, cy, r, a0, a1, o = {}) {
  const n = 18, pts = [];
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  CURVE(pts, o);
  const p = pts[n], q = pts[n - 2];
  ARROW(q[0], q[1], p[0], p[1], Object.assign({}, o, { head: o.head || 11 }));
}
// leader line from a label to a point on the drawing.
// default: text sits beside the leader start (left or right of it); o.start=true: text starts at tx and the leader leaves from its end
function CALL(px, py, tx, ty, str, o = {}) {
  const lines = String(str).split('\n'), size = o.size || 14.5, lh = o.lh || size * 1.22;
  const yTop = ty + 5 - (lines.length - 1) * size * 0.61;
  const w = Math.max(...lines.map((l) => l.length)) * size * 0.47;
  let x0, x1;
  if (o.start) { TXT(tx, yTop, str, Object.assign({ anchor: 'start' }, o)); x0 = tx; x1 = tx + w; }
  else { const left = tx < px; TXT(tx + (left ? -5 : 5), yTop, str, Object.assign({ anchor: left ? 'end' : 'start' }, o)); x0 = left ? tx - 5 - w : tx + 5; x1 = left ? tx - 5 : tx + 5 + w; }
  const y0 = yTop - size * 0.9, y1 = yTop + (lines.length - 1) * lh + size * 0.3;
  // leader leaves from the edge of the label nearest the target
  let lx, ly;
  if (py < y0) { lx = clampN(px, x0 + 8, x1 - 8); ly = y0 - 3; }
  else if (py > y1) { lx = clampN(px, x0 + 8, x1 - 8); ly = y1 + 3; }
  else { lx = px < x0 ? x0 - 4 : x1 + 4; ly = (y0 + y1) / 2; }
  ARROW(lx, ly, px, py, { stroke: o.lc || BLUE, strokeWidth: 1.1, head: 8, roughness: 0.6 });
  CIRC(px, py, 4, { stroke: o.lc || BLUE, fill: o.lc || BLUE, fillStyle: 'solid', roughness: 0.2, strokeWidth: 0.8 });
}
function clampN(v, a, b) { return Math.max(a, Math.min(b, v)); }
// linear dimension between two points, offset perpendicular by `off` (sheet units)
function DIM(x1, y1, x2, y2, label, off, o = {}) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len, sg = Math.sign(off) || 1;
  const ax = x1 + nx * off, ay = y1 + ny * off, bx = x2 + nx * off, by = y2 + ny * off;
  const st = { stroke: GREY, strokeWidth: 1, roughness: 0.35 };
  L(x1 + nx * 4 * sg, y1 + ny * 4 * sg, ax + nx * 7 * sg, ay + ny * 7 * sg, st);
  L(x2 + nx * 4 * sg, y2 + ny * 4 * sg, bx + nx * 7 * sg, by + ny * 7 * sg, st);
  ARROW((ax + bx) / 2, (ay + by) / 2, ax, ay, Object.assign({}, st, { head: 8, stroke: GREY }));
  ARROW((ax + bx) / 2, (ay + by) / 2, bx, by, Object.assign({}, st, { head: 8, stroke: GREY }));
  const ang = Math.atan2(dy, dx) * 180 / Math.PI; const up = (ang > 90 || ang < -90) ? ang + 180 : ang;
  const tx = (ax + bx) / 2 + nx * 6 * sg, ty = (ay + by) / 2 + ny * 6 * sg;
  TXT(tx, ty + (Math.abs(up) > 45 ? 4 : (sg > 0 ? 12 : -2)), label, Object.assign({ anchor: 'middle', size: 14, color: GREY, rot: Math.abs(up) > 45 ? up : 0 }, o));
}
function BOX(x, y, w, h, title, o = {}) {
  RECT(x, y, w, h, { stroke: o.stroke || INK, strokeWidth: o.sw || 1.4, roughness: 0.7 });
  if (title) {
    TXT(x + 10, y + 24, title, { font: 'PH', size: o.tsize || 20, color: o.tcolor || RED });
    L(x + 8, y + 31, x + 8 + Math.min(w - 16, title.length * (o.tsize || 20) * 0.5 + 10), y + 32, { stroke: o.tcolor || RED, strokeWidth: 1, roughness: 1.2 });
  }
}
// sampled ellipse outline (optionally rotated) in sheet units
function ellPts(cx, cy, rx, ry, rotDeg = 0, a0 = 0, a1 = Math.PI * 2, n = 48) {
  const r = rotDeg * Math.PI / 180, pts = [];
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; const x = rx * Math.cos(a), y = ry * Math.sin(a); pts.push([cx + x * Math.cos(r) - y * Math.sin(r), cy + x * Math.sin(r) + y * Math.cos(r)]); }
  return pts;
}
// gear / ratchet outline. saw=true: steep face trails the tip (locks anticlockwise on screen);
// saw='rev': steep face leads the tip (locks clockwise on screen)
function gearPts(cx, cy, r0, r1, n, saw, ph = 0) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = ph + i / n * Math.PI * 2, b = ph + (i + 0.5) / n * Math.PI * 2, c = ph + (i + 1) / n * Math.PI * 2;
    if (saw === 'rev') { pts.push([cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)]); pts.push([cx + r0 * Math.cos(a + 0.02), cy + r0 * Math.sin(a + 0.02)]); }
    else if (saw) { pts.push([cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)]); pts.push([cx + r0 * Math.cos(c - 0.02), cy + r0 * Math.sin(c - 0.02)]); }
    else { pts.push([cx + r0 * Math.cos(a), cy + r0 * Math.sin(a)]); pts.push([cx + r1 * Math.cos(a + 0.12), cy + r1 * Math.sin(a + 0.12)]); pts.push([cx + r1 * Math.cos(b - 0.12), cy + r1 * Math.sin(b - 0.12)]); pts.push([cx + r0 * Math.cos(b), cy + r0 * Math.sin(b)]); }
  }
  return pts;
}
// elastic band drawn as a stretched double strand with a little wobble
function BAND(x1, y1, x2, y2, o = {}) {
  const n = 14, a = [], b = [];
  for (let i = 0; i <= n; i++) { const t = i / n, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t; const w = Math.sin(t * Math.PI * 7) * 1.2; a.push([x, y - 3 + w]); b.push([x, y + 3 - w]); }
  CURVE(a, Object.assign({ stroke: C.tan, strokeWidth: 2.2 }, o)); CURVE(b, Object.assign({ stroke: C.tan, strokeWidth: 2.2 }, o));
}
// twisted rubber motor between two points (vertical-ish)
function TWIST(x1, y1, x2, y2, turns, o = {}) {
  const n = turns * 8, s1 = [], s2 = [];
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
  for (let i = 0; i <= n; i++) { const t = i / n, w = 5 * Math.sin(t * turns * Math.PI * 2); s1.push([x1 + dx * t + nx * w, y1 + dy * t + ny * w]); s2.push([x1 + dx * t - nx * w, y1 + dy * t - ny * w]); }
  CURVE(s1, Object.assign({ stroke: C.tan, strokeWidth: 2 }, o)); CURVE(s2, Object.assign({ stroke: '#a86b2a', strokeWidth: 2 }, o));
}
function TICK(x, y, s = 1) { PL([[x, y], [x + 5 * s, y + 6 * s], [x + 15 * s, y - 8 * s]], { stroke: C.green, strokeWidth: 2.4, roughness: 0.6 }); }
function BULLETS(x, y, items, o = {}) {
  let yy = y;
  for (const it of items) {
    const lines = it.split('\n');
    if (o.ticks) TICK(x, yy - 6, 0.8); else TXT(x, yy, '•', { size: o.size || 14.5 });
    TXT(x + (o.ticks ? 18 : 12), yy, it, { size: o.size || 14.5, lh: o.lh });
    yy += lines.length * (o.lh || (o.size || 14.5) * 1.22) + (o.gap || 4);
  }
  return yy;
}
function FLOOR(x1, x2, y) {
  L(x1, y, x2, y, { strokeWidth: 1.6 });
  for (let x = x1 + 6; x < x2; x += 16) L(x, y + 2, x - 8, y + 11, { stroke: GREY, strokeWidth: 0.9, roughness: 0.4 });
}
function SHEET_BORDER() {
  RECT(22, 22, 1656, 1056, { strokeWidth: 2.2, roughness: 0.5 });
}
function TITLE_BLOCK(x, y, w, h, f) {
  RECT(x, y, w, h, { strokeWidth: 1.8, roughness: 0.5 });
  L(x, y + 64, x + w, y + 64, { strokeWidth: 1.2, roughness: 0.4 });
  TXT(x + 12, y + 26, f.course, { font: 'PH', size: 16, color: GREY });
  TXT(x + 12, y + 54, f.title, { font: 'PH', size: 27 });
  TXT(x + w - 12, y + 26, f.sheet, { font: 'PH', size: 16, color: GREY, anchor: 'end' });
  const rows = [['Theme', f.theme], ['Toy type', f.type], ['Scale / units', f.scale]];
  rows.forEach(([k, v], i) => { TXT(x + 12, y + 82 + i * 19, k + ':', { size: 13.5, color: GREY }); TXT(x + 120, y + 82 + i * 19, v, { size: 14.5 }); });
  L(x, y + h - 42, x + w, y + h - 42, { strokeWidth: 1, roughness: 0.4 });
  const sy = y + h - 15;
  TXT(x + 12, sy, 'Drawn by: ________', { size: 14.5 });
  TXT(x + 200, sy, 'Signature: __________', { size: 14.5 });
  TXT(x + w - 12, sy, 'Date: ________', { size: 14.5, anchor: 'end' });
}
