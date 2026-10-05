"""Converts the sheet fonts (woff2) to installable TTFs in editable/fonts, with their licence notices, adds
DejaVu Sans for the symbols the handwriting fonts lack, and writes src/font-coverage.json for export-svg.mjs.
Needs: pip install fonttools brotli; DejaVu Sans from the system (fonts-dejavu-core)."""
import json, shutil
from pathlib import Path
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent
out = root / 'editable' / 'fonts'
out.mkdir(parents=True, exist_ok=True)
notes = []
coverage = {}
families = {'ArchitectsDaughter_400.woff2': 'Architects Daughter', 'PatrickHand_400.woff2': 'Patrick Hand', 'Caveat_400.woff2': 'Caveat'}
for woff, ttf in [('ArchitectsDaughter_400.woff2', 'ArchitectsDaughter-Regular.ttf'),
                  ('PatrickHand_400.woff2', 'PatrickHand-Regular.ttf'),
                  ('Caveat_400.woff2', 'Caveat-Regular.ttf')]:
    f = TTFont(root / 'src' / woff)
    coverage[families[woff]] = sorted(f.getBestCmap())
    f.flavor = None
    f.save(out / ttf)
    name = f['name']
    get = lambda i: (name.getDebugName(i) or '').strip()
    notes.append(f"{ttf}\n  Family: {get(1)}\n  {get(0)}\n  Licence: {get(13) or 'SIL Open Font License 1.1'}\n  {get(14) or 'https://openfontlicense.org'}\n")
    print('wrote', ttf, '-', get(1), get(2))
dejavu = Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')
shutil.copy(dejavu, out / 'DejaVuSans.ttf')
(root / 'src' / 'font-coverage.json').write_text(json.dumps(coverage))
(out / 'FONTS-LICENSE.txt').write_text(
    'Architects Daughter, Patrick Hand and Caveat come from Google Fonts and are licensed under the\n'
    'SIL Open Font License 1.1 (https://openfontlicense.org). They are included unmodified apart from\n'
    'the woff2 -> ttf container change.\n\n' + '\n'.join(notes) +
    '\nDejaVuSans.ttf (used only for symbols such as ① → ≈ ✓ λ that the handwriting fonts lack) is\n'
    'distributed under the DejaVu / Bitstream Vera font licence, reproduced below.\n\n'
    + Path('/usr/share/doc/fonts-dejavu-core/copyright').read_text())
