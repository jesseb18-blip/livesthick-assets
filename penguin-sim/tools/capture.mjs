// Headless screenshot tool for the simulation.
// Usage: node tools/capture.mjs shots.json outDir
// shots.json: [{ "name": "run_side", "t": 21.3, "cam": { "target": "toy", "az": 70, "el": 8, "dist": 40, "fov": 38 },
//               "spp": 48, "w": 1280, "h": 720, "mode": "pt" | "rt", "params": { "cut": 0.6 } }]
// "t" may also be a phase key: "asm0", "pull0", "pull1", "tap0", "rel", "runEnd" with optional "dt" offset.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = join(dirname(fileURLToPath(import.meta.url)), '..');
const shots = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const out = resolve(process.argv[3] || 'shots'); mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, ignoreHTTPSErrors: true });
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') console.log('[console]', m.text()); });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.goto('file://' + join(dir, 'standalone.html') + '?capture=1');
await page.waitForFunction(() => window.SIM_API && (window.SIM_API.ready || window.SIM_API.error), null, { timeout: 600000 });
const err0 = await page.evaluate(() => window.SIM_API.error);
if (err0) { console.log('SHADER ERROR', err0); process.exit(1); }
await page.waitForFunction(() => window.SIM_API.ptReady() || window.SIM_API.error, null, { timeout: 900000 }).catch(() => console.log('path tracer not ready; realtime only'));
const err1 = await page.evaluate(() => window.SIM_API.error);
if (err1) { console.log('SHADER ERROR', err1); process.exit(1); }
const info = await page.evaluate(() => { const i = window.SIM_API.info(); return { end: i.end, TL: i.TL, dist: i.dist, runTime: i.runTime }; });
console.log('timeline end', info.end.toFixed(2), 'run dist', info.dist.toFixed(3), 'm');
for (const s of shots) {
  const t0 = Date.now();
  let t = s.t; if (typeof t === 'string') t = info.TL[t] + (s.dt || 0);
  const url = await page.evaluate(async ({ s, t }) => {
    const A = window.SIM_API;
    window.__saved = {}; const cur = A.info().P;
    if (s.params) for (const [k, v] of Object.entries(s.params)) { window.__saved[k] = cur[k]; A.setParam(k, v); }
    A.setTime(t);
    if (s.cam) A.setCamera(s.cam); else A.director();
    return await A.still({ w: s.w || 1280, h: s.h || 720, spp: s.spp || 48, mode: s.mode || 'pt' });
  }, { s, t });
  const file = join(out, (s.name || 'shot') + '.png');
  writeFileSync(file, Buffer.from(url.split(',')[1], 'base64'));
  console.log('saved', file, 't=' + t.toFixed(2), ((Date.now() - t0) / 1000).toFixed(1) + 's');
  await page.evaluate(() => { for (const [k, v] of Object.entries(window.__saved || {})) window.SIM_API.setParam(k, v); });
}
await browser.close();
