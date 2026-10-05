// Concept 2 (Emperor Waddler) walking-pace model: rubber motor -> crown 24 T : pinion 12 T (2 crank turns per motor
// turn) -> crankshaft driving the feet, with a viscous grease damper. Cadence = (crank torque - walking load) / (2 pi c).
// Motor torque falls in proportion to the turns left; energy scales with turns wound squared. Units: N, mm, s, mJ.
// Usage: node tools/walker-model.mjs
function run({ strands = 6, wound = 28, ed = 400, eta = 0.7, G = 2, b = 0.22, peak = 0.35, c = 0.054, step = 9 }) {
  const mr = 1.6 * 0.8 * strands * 60 * 1.1e-6, E28 = ed * mr, T28 = 2 * E28 / (28 * 2 * Math.PI) * 1e3; // N·mm at 28 turns
  const T0 = T28 * wound / 28;
  let n = wound, t = 0, strides = 0, f5 = 0, s5 = 0, tHz1 = null, tHalf = null, Ewalk = 0, Edamp = 0, Ew5 = 0, Ed5 = 0; const dt = 1e-3;
  const tau0 = eta * T0 / G;
  while (t < 200) {
    const tau = eta * (T0 * n / wound) / G, w = Math.max(0, (tau - b) / c), f = w / (2 * Math.PI);
    if (f < 0.5 && tHalf === null) tHalf = t; if (f < 1 && tHz1 === null) tHz1 = t;
    if (f < 0.05) break;
    Ewalk += b * w * dt; Edamp += c * w * w * dt;   // N·mm·rad = mJ
    n -= f / G * dt; strides += f * dt; t += dt;
    if (Math.abs(t - 5) < dt / 2) { f5 = f; s5 = strides; Ew5 = Ewalk; Ed5 = Edamp; }
  }
  return { E: +(E28 * (wound / 28) ** 2 * 1e3).toFixed(0), T0: +T0.toFixed(2), crank0: +tau0.toFixed(2), starts: tau0 > peak, f0: +((tau0 - b) / c / 2 / Math.PI).toFixed(2), f5: +f5.toFixed(2), s5: +s5.toFixed(1), cm5: +(s5 * step / 10).toFixed(1), t1Hz: tHz1 && +tHz1.toFixed(1), tHalf: tHalf && +tHalf.toFixed(1), tEnd: +t.toFixed(1), strides: +strides.toFixed(0), m_total: +(strides * step / 1000).toFixed(2), motor5_mJ: +((Ew5 + Ed5) / eta).toFixed(0), walk5: +Ew5.toFixed(1), damp5: +Ed5.toFixed(1) };
}
for (const [k, o] of Object.entries({ base: {}, ed250: { ed: 250 }, load2: { b: 0.44, peak: 0.7 }, damp2: { c: 0.108 }, damphalf: { c: 0.027 }, worst28: { ed: 250, b: 0.44, peak: 0.7 }, worst40: { ed: 250, b: 0.44, peak: 0.7, wound: 40 } })) console.log(k.padEnd(9), JSON.stringify(run(o)));
