// Wraps the artifact-style page (no <html>/<head>/<body>) into a standalone document
// so it can be opened straight from disk or driven by the capture script.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = join(dirname(fileURLToPath(import.meta.url)), '..');
const body = readFileSync(join(dir, 'index.html'), 'utf8');
const out = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
</head>
<body>
${body}
</body>
</html>
`;
writeFileSync(join(dir, 'standalone.html'), out);
console.log('wrote standalone.html', out.length, 'bytes');
