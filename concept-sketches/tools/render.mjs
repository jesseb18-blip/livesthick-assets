// Renders the concept sketch sheets to PNG (3400 x 2200) and vector PDF (11 x 17 in landscape).
// Usage: node tools/render.mjs [1|2|3 ...]   (default: all)
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = (f) => readFileSync(join(dir, 'src', f));
const font = (f) => src(f).toString('base64');
const SHEETS = { 1: ['concept1.js', 'Concept1_TuxToboggan'], 2: ['concept2.js', 'Concept2_EmperorWaddler'], 3: ['concept3.js', 'Concept3_ClownfishHover'] };
const which = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SHEETS);
const browser = await chromium.launch();
for (const n of which) {
  const [script, name] = SHEETS[n];
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${name}</title><style>
@font-face{font-family:'AD';src:url(data:font/woff2;base64,${font('ArchitectsDaughter_400.woff2')}) format('woff2')}
@font-face{font-family:'PH';src:url(data:font/woff2;base64,${font('PatrickHand_400.woff2')}) format('woff2')}
@font-face{font-family:'CV';src:url(data:font/woff2;base64,${font('Caveat_400.woff2')}) format('woff2')}
@page{size:17in 11in;margin:0}
html,body{margin:0;background:#fdfcf8}
svg{display:block;width:1700px;height:1100px}
@media print{svg{width:17in;height:11in}}
</style></head><body>
<svg id="sheet" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1700 1100"><rect width="1700" height="1100" fill="#fdfcf8"/></svg>
<script>${src('rough.js')}</script><script>${src('sketchlib.js')}</script><script>${src(script)}</script>
</body></html>`;
  writeFileSync(join(dir, 'src', name + '.html'), html);
  const page = await browser.newPage({ viewport: { width: 1700, height: 1100 }, deviceScaleFactor: 2 });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  if (errs.length) console.log(name, 'ERRORS:', errs.join(' | '));
  await page.screenshot({ path: join(dir, name + '.png'), clip: { x: 0, y: 0, width: 1700, height: 1100 } });
  await page.pdf({ path: join(dir, name + '.pdf'), width: '17in', height: '11in', printBackground: true, pageRanges: '1' });
  console.log('rendered', name);
  await page.close();
}
await browser.close();
