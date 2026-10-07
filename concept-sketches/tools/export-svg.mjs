// Exports each sheet as an editable SVG for vector apps (Affinity Designer, Illustrator, Linearity Curve, Inkscape).
// Text stays live text with the real font names; white text halos are split into their own layer, because
// many apps ignore paint-order; symbols missing from the handwriting fonts are set in DejaVu Sans; every label is
// start-anchored at its measured position.
// Run tools/make-fonts.py first: it writes installable TTFs to editable/fonts and src/font-coverage.json.
// Usage: node tools/export-svg.mjs [1|2|3|4 ...]   (default: all)
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = (f) => readFileSync(join(dir, 'src', f));
const SHEETS = { 1: 'Concept1_TuxToboggan', 2: 'Concept2_EmperorWaddler', 3: 'Concept3_ClownfishHover', 4: 'Concept4_ClownfishWindUp' };
const FONTS = [['AD', 'Architects Daughter', 'ArchitectsDaughter_400.woff2'], ['PH', 'Patrick Hand', 'PatrickHand_400.woff2'], ['CV', 'Caveat', 'Caveat_400.woff2']];
const COVER = Object.fromEntries(Object.entries(JSON.parse(readFileSync(join(dir, 'src', 'font-coverage.json')))).map(([k, v]) => [k, v]));
const which = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SHEETS);
mkdirSync(join(dir, 'editable'), { recursive: true });
const browser = await chromium.launch();
for (const n of which) {
  const name = SHEETS[n];
  const page = await browser.newPage({ viewport: { width: 1700, height: 1100 } });
  await page.setContent(src(name + '.html').toString(), { waitUntil: 'load' });   // written by render.mjs
  await page.evaluate(() => document.fonts.ready);
  const svg = await page.evaluate(([fonts, cover]) => {
    const s = document.getElementById('sheet');   // edited in place (needs layout for the measurements below)
    s.removeAttribute('id');
    // centre/end-anchored labels -> start-anchored at their measured left edge, so mixed-font lines stay put in any app
    for (const t of s.querySelectorAll('text')) {
      const an = t.getAttribute('text-anchor'); if (!an || an === 'start') continue;
      for (const line of t.querySelectorAll('tspan')) if (line.textContent.length) line.setAttribute('x', line.getStartPositionOfChar(0).x.toFixed(2));
      t.setAttribute('text-anchor', 'start');
    }
    s.setAttribute('width', '17in'); s.setAttribute('height', '11in');
    const map = Object.fromEntries(fonts.map(([a, real]) => [a, real]));
    for (const t of s.querySelectorAll('text')) {
      const f = t.getAttribute('font-family'); if (map[f]) t.setAttribute('font-family', map[f]);
      // characters the handwriting font lacks (① → ≈ ✓ λ ...) go in a DejaVu Sans run, since apps may not fall back per glyph
      const has = new Set(cover[t.getAttribute('font-family')] || []);
      for (const line of [...t.querySelectorAll('tspan')]) {
        const txt = line.textContent; if ([...txt].every((ch) => has.has(ch.codePointAt(0)) || ch === ' ')) continue;
        line.textContent = '';
        let run = '', fb = false;
        const flush = () => { if (!run) return; if (fb) { const sp = document.createElementNS('http://www.w3.org/2000/svg', 'tspan'); sp.setAttribute('font-family', 'DejaVu Sans'); sp.textContent = run; line.appendChild(sp); } else line.appendChild(document.createTextNode(run)); run = ''; };
        for (const ch of txt) { const miss = ch !== ' ' && !has.has(ch.codePointAt(0)); if (miss !== fb) { flush(); fb = miss; } run += ch; }
        flush();
      }
      if (t.getAttribute('paint-order')) {          // halo -> separate stroked copy underneath
        const halo = t.cloneNode(true);
        halo.removeAttribute('paint-order'); halo.setAttribute('fill', halo.getAttribute('stroke'));
        t.parentNode.insertBefore(halo, t);
        for (const a of ['stroke', 'stroke-width', 'paint-order', 'stroke-linejoin']) t.removeAttribute(a);
      }
    }
    return new XMLSerializer().serializeToString(s);
  }, [FONTS, COVER]);
  const faces = FONTS.map(([, real, file]) => `@font-face{font-family:'${real}';src:url(data:font/woff2;base64,${src(file).toString('base64')}) format('woff2')}`).join('\n');
  const out = '<?xml version="1.0" encoding="UTF-8"?>\n' + svg.replace(/^<svg([^>]*)>/, (m, a) => `<svg${a}><title>${name}</title><style>\n${faces}\n</style>`);
  writeFileSync(join(dir, 'editable', name + '.svg'), out);
  console.log('exported', name + '.svg', (out.length / 1e6).toFixed(1) + ' MB');
  await page.close();
}
await browser.close();
